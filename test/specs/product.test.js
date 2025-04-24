import { expect, $, $$ } from "@wdio/globals";
import homePage from "../pageobjects/home.page.js";
import browsePage from "../pageobjects/browse.page.js";

describe("Product Details", () => {
  it("should view 'Teste Exercicio R$ 100' info", async () => {
    // --- Busca ---
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

    console.log("Verificando tela de detalhes...");
    const productTitleElement = await $("~Teste Exercicio");
    await productTitleElement.waitForDisplayed({ timeout: 20000 });
    await expect(productTitleElement).toBeDisplayed();

    const addToCartBtn = await $("~addToCart");
    await expect(addToCartBtn).toBeDisplayed();
    console.log("Tela de detalhes verificada.");
  });
});
