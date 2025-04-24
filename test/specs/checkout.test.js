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
    console.log("Aguardando confirmação de login (CustomerName)...");
    await profilePage.customerNameElement.waitForDisplayed({ timeout: 20000 });
    console.log("Login confirmado.");

    await homePage.search();
    await browsePage.searchInput.waitForDisplayed({ timeout: 10000 });
    await browsePage.searchInput.clearValue();
    await browsePage.searchInput.setValue("Teste Exercicio");
    console.log("Busca por 'Teste Exercicio' realizada.");

    await browser.pause(2000);

    const targetProductText = "Teste Exercicio R$ 100";
    const productSelector = `-ios predicate string:type == "XCUIElementTypeOther" AND name == "productDetails" AND label CONTAINS "${targetProductText}"`;
    console.log(
      `[SCROLL] Iniciando busca por elemento visível: ${productSelector}`
    );

    let visibleProductElement = null;
    const maxScrolls = 5;

    for (let i = 0; i <= maxScrolls; i++) {
      console.log(`[SCROLL] Tentativa ${i + 1}/${maxScrolls + 1}`);
      const potentialElements = await $$(productSelector);
      console.log(
        `[SCROLL] Elementos encontrados nesta view: ${potentialElements.length}`
      );

      for (const element of potentialElements) {
        try {
          if (await element.isDisplayed()) {
            console.log(
              `[SCROLL] Elemento visível encontrado! ID: ${element.elementId}`
            );
            visibleProductElement = element;
            break;
          } else {
          }
        } catch (e) {
          console.warn(
            `[SCROLL] Erro ao verificar visibilidade do elemento ${element.elementId}: ${e.message}`
          );
        }
      }

      if (visibleProductElement) {
        break;
      }

      if (i < maxScrolls) {
        console.log(
          `[SCROLL] Nenhum elemento visível encontrado. Rolando para baixo...`
        );
        try {
          await driver.execute("mobile: scroll", { direction: "down" });
          await browser.pause(1500);
        } catch (scrollError) {
          console.error(
            `[SCROLL] Erro durante o scroll: ${scrollError.message}. Interrompendo scroll.`
          );
          break;
        }
      } else {
        console.log(
          `[SCROLL] Número máximo de scrolls atingido (${maxScrolls}).`
        );
      }
    }

    if (!visibleProductElement) {
      const allProductDetails = await $$("~productDetails");
      console.error(
        `--- DEBUG: Elementos ~productDetails visíveis na tela final ---`
      );
      for (const pd of allProductDetails) {
        try {
          if (await pd.isDisplayed()) {
            console.error(
              ` - Visível: ID=${pd.elementId}, Label=${await pd.getAttribute(
                "label"
              )}`
            );
          }
        } catch (e) {}
      }
      console.error(
        `-------------------------------------------------------------`
      );
      throw new Error(
        `Elemento visível "${targetProductText}" não encontrado após ${maxScrolls} tentativas de scroll.`
      );
    }

    console.log(
      `Clicando no elemento visível "${targetProductText}" (ID: ${visibleProductElement.elementId}).`
    );
    await visibleProductElement.click();
    console.log(`Clicou no produto "${targetProductText}".`);

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
