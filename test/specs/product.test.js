import { expect, $, $$, driver } from "@wdio/globals";
import homePage from "../pageobjects/home.page.js";
import browsePage from "../pageobjects/browse.page.js";

describe("Product Details", () => {
  it("should view 'Teste Exercicio R$ 100' info", async () => {
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
