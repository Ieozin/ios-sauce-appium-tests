import { expect, $, $$, driver } from "@wdio/globals";
import homePage from "../pageobjects/home.page.js";
import loginPage from "../pageobjects/login.page.js";
import browsePage from "../pageobjects/browse.page.js";
import cartPage from "../pageobjects/cart.page.js";
import checkoutPage from "../pageobjects/checkout.page.js";
import profilePage from "../pageobjects/profile.page.js";

describe("Checkout Flow", () => {
  it("should complete purchase with 'Teste Exercicio R$ 100'", async () => {
    await homePage.openMenu("Account");
    await loginPage.login("cliente@ebac.art.br", "GD*peToHNJ1#c$sgk08EaYJQ");
    console.log("Aguardando UI estabilizar após login...");
    await homePage.tabMenu("Account").waitForClickable({ timeout: 25000 });
    console.log("Login confirmado.");

    await homePage.search();
    await browsePage.searchInput.waitForDisplayed({ timeout: 15000 });
    await browsePage.searchInput.clearValue();
    await browsePage.searchInput.setValue("Teste Exercicio");
    console.log("Busca por 'Teste Exercicio' realizada.");
    await browser.pause(3000);

    const targetProductText = "Teste Exercicio R$ 100";
    const productContainerSelector = "~productDetails";
    console.log(
      `[CORRETO] Iniciando busca por container '${productContainerSelector}' com label contendo "${targetProductText}"`
    );

    let targetProductContainer = null;
    const maxAttempts = 7;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(`[CORRETO] Tentativa ${attempt}/${maxAttempts}`);
      const productContainers = await $$(productContainerSelector);
      console.log(
        `[CORRETO] Containers '${productContainerSelector}' encontrados: ${productContainers.length}`
      );

      for (const container of productContainers) {
        try {
          const currentLabel = await container.getAttribute("label");
          console.log(
            `[CORRETO] Verificando container ID: ${container.elementId}, Label: "${currentLabel}"`
          );

          if (
            currentLabel &&
            currentLabel.includes(targetProductText) &&
            (await container.isDisplayed())
          ) {
            console.log(`[CORRETO] Container correto e visível encontrado!`);
            targetProductContainer = container;
            break;
          }
        } catch (e) {
          if (!e.message.includes("stale element reference")) {
            console.warn(
              `[CORRETO] Erro ao processar container ${container.elementId}: ${e.message}`
            );
          }
        }
      }

      if (targetProductContainer) {
        break;
      }

      if (attempt < maxAttempts) {
        console.log(
          `[CORRETO] Container alvo não visível. Fazendo SWIPE para baixo...`
        );
        try {
          await driver.execute("mobile: swipe", { direction: "up" });
          await browser.pause(2500);
        } catch (swipeError) {
          console.error(
            `[SWIPE] Erro durante o swipe: ${swipeError.message}. Interrompendo.`
          );
          break;
        }
      } else {
        console.log(`[CORRETO] Número máximo de tentativas atingido.`);
      }
    }

    if (!targetProductContainer) {
      console.error(
        `--- DEBUG FINAL: Labels de todos os '${productContainerSelector}' encontrados ---`
      );
      const allContainersFinal = await $$(productContainerSelector);
      for (const pd of allContainersFinal) {
        try {
          console.error(
            ` - ID=${pd.elementId}, Label=${await pd.getAttribute(
              "label"
            )}, Displayed=${await pd.isDisplayed()}`
          );
        } catch (e) {}
      }
      console.error(
        `-------------------------------------------------------------`
      );
      throw new Error(
        `Container do produto com texto "${targetProductText}" não foi encontrado ou não estava visível após ${
          maxAttempts - 1
        } swipes.`
      );
    }

    console.log(
      `Clicando no container visível encontrado (ID: ${targetProductContainer.elementId}).`
    );
    await targetProductContainer.click();
    console.log(`Clicou no container do produto "${targetProductText}".`);

    console.log("Esperando tela de detalhes carregar (botão Add to Cart)...");
    const addToCartBtn = await $("~addToCart");
    await addToCartBtn.waitForClickable({ timeout: 20000 });
    console.log("Botão Add to Cart encontrado e clicável. Clicando...");
    await addToCartBtn.click();
    console.log("Clicou em Add to Cart.");

    await homePage.openMenu("Cart");
    await cartPage.checkoutButton.waitForClickable({ timeout: 15000 });
    await cartPage.proceedToCheckout();

    await checkoutPage.addAddressButton.waitForDisplayed({ timeout: 15000 });
    await checkoutPage.fillNewAddressForm({
      name: "leonardo Martins",
      mobile: "24993117595",
      street: "Estrada união Industria 20301",
      city: "Petropolis",
      state: "Rio de Janeiro",
      zip: "25750222",
    });
    console.log("Endereço preenchido e salvo.");

    await checkoutPage.selectAddressOrContinueButton.waitForClickable({
      timeout: 15000,
    });
    await checkoutPage.proceedWithPayment();
    console.log("Prosseguiu para pagamento.");

    await checkoutPage.successImage.waitForDisplayed({ timeout: 25000 });
    await expect(await checkoutPage.verifySuccess()).toBe(true);
    console.log("Compra verificada com sucesso.");
  });
});
