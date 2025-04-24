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
