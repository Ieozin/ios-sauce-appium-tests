import { expect, $, $$ } from "@wdio/globals";
import homePage from "../pageobjects/home.page.js";
import browsePage from "../pageobjects/browse.page.js";

describe("Product Details", () => {
  it("should view 'Teste Exercicio R$ 100' info", async () => {
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

    console.log("Verificando tela de detalhes (título)...");
    const productTitleElement = await $("~Teste Exercicio");
    await productTitleElement.waitForDisplayed({ timeout: 20000 });
    await expect(productTitleElement).toBeDisplayed();
    console.log("Título verificado.");

    console.log("Verificando tela de detalhes (botão Add to Cart)...");
    const addToCartBtn = await $("~addToCart");
    await expect(addToCartBtn).toBeDisplayed();
    console.log("Botão Add to Cart verificado.");
  });
});
