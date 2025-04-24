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
      `Elemento "${targetProductText}" visível encontrado. Clicando...`
    );
    await visibleProductElement.click();
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
