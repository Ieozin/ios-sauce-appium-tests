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
    await profilePage.customerNameElement.waitForDisplayed({
      timeout: 20000,
      timeoutMsg: "Falha no login: CustomerName não apareceu.",
    });
    console.log("Login confirmado.");

    await homePage.search();
    await browsePage.searchInput.waitForDisplayed({ timeout: 10000 });
    await browsePage.searchInput.clearValue();
    await browsePage.searchInput.setValue("Teste Exercicio");

    console.log("Busca por 'Teste Exercicio' realizada.");
    await browser.pause(2000);

    const targetProductText = "Teste Exercicio R$ 100";
    const productSelector = `-ios predicate string:type == "XCUIElementTypeOther" AND name == "productDetails" AND label CONTAINS "${targetProductText}"`;
    console.log(`Procurando elemento visível: ${productSelector}`);

    let productElement = null;
    const maxScrolls = 5;
    let foundVisible = false;

    for (let i = 0; i <= maxScrolls; i++) {
      const potentialElements = await $$(productSelector);
      console.log(
        `Tentativa ${i + 1}: Encontrados ${potentialElements.length} elementos.`
      );

      for (const elem of potentialElements) {
        try {
          if (await elem.isDisplayed()) {
            productElement = elem;
            foundVisible = true;
            console.log(`Elemento visível encontrado na tentativa ${i + 1}!`);
            break;
          }
        } catch (e) {
          console.warn(`Erro ao verificar visibilidade: ${e.message}`);
        }
      }

      if (foundVisible) {
        break;
      }

      if (i < maxScrolls) {
        console.log(
          `Nenhum visível, rolando para baixo (Tentativa ${
            i + 1
          }/${maxScrolls})...`
        );
        await driver.execute("mobile: scroll", { direction: "down" });
        await browser.pause(1500);
      }
    }

    if (!productElement || !foundVisible) {
      throw new Error(
        `Elemento "${targetProductText}" não encontrado ou não visível após ${maxScrolls} tentativas de scroll.`
      );
    }

    console.log(
      `Elemento "${targetProductText}" visível encontrado. Clicando...`
    );
    await productElement.click();
    console.log(`Clicou no produto "${targetProductText}".`);

    console.log("Esperando tela de detalhes carregar (botão Add to Cart)...");
    const addToCartBtn = await $("~addToCart");
    await addToCartBtn.waitForDisplayed({ timeout: 20000 });
    console.log("Botão Add to Cart encontrado. Clicando...");
    await addToCartBtn.click();
    console.log("Clicou em Add to Cart.");

    await homePage.openMenu("Cart");
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

    await checkoutPage.proceedWithPayment();
    console.log("Prosseguiu para pagamento.");
    await expect(await checkoutPage.verifySuccess()).toBe(true);
    console.log("Compra verificada com sucesso.");
  });
});
