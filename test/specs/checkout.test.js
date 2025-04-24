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
    let productElement = $(productSelector);
    let foundAndClicked = false;
    const maxAttempts = 5;

    console.log(`Tentando encontrar e clicar em: ${productSelector}`);

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(`Tentativa ${attempt}/${maxAttempts}...`);
      try {
        await productElement.waitForExist({ timeout: 10000 });
        console.log(
          `Elemento encontrado na árvore (tentativa ${attempt}). Verificando visibilidade...`
        );

        await productElement.waitForDisplayed({ timeout: 10000 });
        console.log(
          `Elemento visível (tentativa ${attempt}). Tentando clicar...`
        );

        await productElement.click();
        console.log(`CLICOU com sucesso (tentativa ${attempt}).`);
        foundAndClicked = true;
        break;
      } catch (error) {
        console.warn(`WARN: Tentativa ${attempt} falhou - ${error.message}`);
        if (attempt < maxAttempts) {
          console.log(`Tentando swipe para cima (scroll down)...`);
          try {
            await driver.execute("mobile: swipe", { direction: "up" });
            await browser.pause(1500);

            productElement = $(productSelector);
          } catch (swipeError) {
            console.warn("WARN: mobile:swipe falhou.", swipeError.message);
            break;
          }
        }
      }
    }

    if (!foundAndClicked) {
      throw new Error(
        `FALHA CRÍTICA: Não foi possível encontrar e clicar no produto "${targetProductText}" após ${maxAttempts} tentativas.`
      );
    }

    console.log("Procurando botão Add to Cart na tela de detalhes...");
    const addToCartBtn = await $("~addToCart");
    await addToCartBtn.waitForDisplayed({ timeout: 15000 });
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
