import { expect, $, $$, driver } from "@wdio/globals";
import homePage from "../pageobjects/home.page.js";
import browsePage from "../pageobjects/browse.page.js";

describe("Product Details", () => {
  it("should view 'Teste Exercicio R$ 100' info", async () => {
    await homePage.search();
    await browsePage.searchInput.waitForDisplayed({ timeout: 15000 });
    await browsePage.searchInput.clearValue();
    await browsePage.searchInput.setValue("Teste Exercicio");
    console.log("Busca por 'Teste Exercicio' realizada.");
    await browser.pause(3000);

    const targetProductText = "Teste Exercicio R$ 100";
    const productContainerSelector = "~productDetails";
    console.log(
      `[FINAL] Iniciando busca por container '${productContainerSelector}' com label contendo "${targetProductText}"`
    );

    let targetProductContainer = null;
    const maxAttempts = 7;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(`[FINAL] Tentativa ${attempt}/${maxAttempts}`);
      const productContainers = await $$(productContainerSelector);
      console.log(
        `[FINAL] Containers '${productContainerSelector}' encontrados nesta view: ${productContainers.length}`
      );

      for (const container of productContainers) {
        try {
          const currentLabel = await container.getAttribute("label");
          console.log(
            `[FINAL] Verificando container ID: ${container.elementId}, Label: "${currentLabel}"`
          );
          if (
            currentLabel &&
            currentLabel.includes(targetProductText) &&
            (await container.isDisplayed())
          ) {
            console.log(`[FINAL] Container correto e visível encontrado!`);
            targetProductContainer = container;
            break;
          }
        } catch (e) {
          console.warn(
            `[FINAL] Erro ao processar container ${container.elementId}: ${e.message}`
          );
        }
      }

      if (targetProductContainer) {
        break;
      }

      if (attempt < maxAttempts) {
        console.log(
          `[FINAL] Container alvo não visível. Fazendo SWIPE para baixo...`
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
        console.log(`[FINAL] Número máximo de tentativas atingido.`);
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
      `Clicando no container encontrado (ID: ${targetProductContainer.elementId}).`
    );
    await targetProductContainer.click();
    console.log(`Clicou no container do produto "${targetProductText}".`);

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
