import { expect, $, $$ } from "@wdio/globals";
import homePage from "../pageobjects/home.page.js";
import loginPage from "../pageobjects/login.page.js";
import browsePage from "../pageobjects/browse.page.js";
import cartPage from "../pageobjects/cart.page.js";
import checkoutPage from "../pageobjects/checkout.page.js";

describe("Checkout Flow", () => {
  it("should complete purchase with 'Teste Exercicio R$ 100'", async () => {
    await homePage.openMenu("Account");
    await loginPage.login("cliente@ebac.art.br", "GD*peToHNJ1#c$sgk08EaYJQ");

    await homePage.search();
    await browsePage.searchInput.waitForDisplayed({ timeout: 10000 });
    await browsePage.searchInput.clearValue();
    await browsePage.searchInput.setValue("Teste Exercicio");
    await browsePage.searchInput.click();
    await browser.pause(2500);

    const targetProductText = "Teste Exercicio R$ 100";
    const productSelector = `-ios predicate string:type == "XCUIElementTypeOther" AND name == "productDetails" AND label CONTAINS "${targetProductText}"`;
    console.log(`Procurando elemento: ${productSelector}`);
    const productElement = await $(productSelector);

    await productElement.waitForExist({ timeout: 30000 });
    await productElement.waitForDisplayed({ timeout: 20000 });

    console.log(
      `Elemento "${targetProductText}" encontrado e visível. Clicando...`
    );
    await productElement.click();
    console.log(`Clicou no produto "${targetProductText}".`);

    console.log("Esperando tela de detalhes carregar (botão Add to Cart)...");
    const addToCartBtn = await $("~addToCart");
    await addToCartBtn.waitForDisplayed({ timeout: 20000 });
    console.log("Botão Add to Cart encontrado. Clicando...");
    await addToCartBtn.click();
    console.log("Clicou em Add to Cart.");

    await cartPage.proceedToCheckout();
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
