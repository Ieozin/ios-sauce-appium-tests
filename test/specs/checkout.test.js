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

    console.log(
      "Aguardando UI estabilizar após login (verificando aba Account novamente)..."
    );
    await homePage.tabMenu("Account").waitForClickable({ timeout: 25000 });
    console.log("Login provavelmente bem-sucedido (UI respondeu).");

    await homePage.search();
    await browsePage.searchInput.waitForDisplayed({ timeout: 15000 });
    await browsePage.searchInput.clearValue();
    await browsePage.searchInput.setValue("Teste Exercicio");
    console.log("Busca por 'Teste Exercicio' realizada.");
    await browser.pause(2500);

    const targetProductText = "Teste Exercicio R$ 100";

    const productTextSelector = `**/XCUIElementTypeOther[\`name == "productDetails"\`]/**/XCUIElementTypeStaticText[\`label CONTAINS "${targetProductText}"\`]`;
    console.log(
      `[CHAIN] Iniciando busca por texto visível: ${productTextSelector}`
    );

    let visibleProductElement = null;
    const maxAttempts = 6;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(`[CHAIN] Tentativa ${attempt}/${maxAttempts}`);
      try {
        visibleProductElement = await $(productTextSelector);
        if (
          (await visibleProductElement.isExisting()) &&
          (await visibleProductElement.isDisplayed())
        ) {
          console.log(`[CHAIN] Texto visível encontrado!`);
          break;
        } else {
          console.log(
            `[CHAIN] Texto encontrado, mas não visível ou não existe.`
          );
          visibleProductElement = null;
        }
      } catch (e) {
        console.log(`[CHAIN] Texto não encontrado na tentativa ${attempt}.`);
        visibleProductElement = null;
      }

      if (!visibleProductElement && attempt < maxAttempts) {
        console.log(`[CHAIN] Fazendo SWIPE para baixo...`);
        try {
          await driver.execute("mobile: swipe", { direction: "up" });
          await browser.pause(2500);
        } catch (swipeError) {
          console.error(
            `[SWIPE] Erro durante o swipe: ${swipeError.message}. Interrompendo.`
          );
          break;
        }
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
        `Elemento de TEXTO visível "${targetProductText}" não encontrado após ${
          maxAttempts - 1
        } swipes.`
      );
    }

    console.log(`Texto encontrado. Tentando clicar no container pai...`);
    let productContainer = null;
    try {
      const containerSelector = `//XCUIElementTypeStaticText[contains(@label, "${targetProductText}")]/ancestor::XCUIElementTypeOther[@name="productDetails"]`;
      productContainer = await $(containerSelector);
      await productContainer.waitForExist({ timeout: 5000 });
      await productContainer.click();
      console.log(`Clicou no container do produto "${targetProductText}".`);
    } catch (clickError) {
      console.error(
        `Falha ao clicar no container do produto: ${clickError.message}`
      );

      throw new Error(
        `Não foi possível clicar no container do produto "${targetProductText}".`
      );
    }

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
