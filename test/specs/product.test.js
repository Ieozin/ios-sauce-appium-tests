import { expect, $, $$ } from "@wdio/globals";
import homePage from "../pageobjects/home.page.js";
import browsePage from "../pageobjects/browse.page.js";
import productPage from "../pageobjects/product.page.js";

async function findAndScrollToProduct(searchText) {
  const MAX_SWIPES = 5;
  let productElement = null;

  for (let i = 0; i < MAX_SWIPES; i++) {
    const productList = await $$(`~productDetails`);
    console.log(
      `[findAndScrollToProduct] Tentativa ${i + 1}: ${
        productList.length
      } produtos na tela.`
    );

    for (const product of productList) {
      const label = await product.getAttribute("label");
      if (label && label.includes(searchText)) {
        if (await product.isDisplayed()) {
          console.log(
            `[findAndScrollToProduct] Produto "${searchText}" encontrado e visível.`
          );
          return product;
        } else {
          console.log(
            `[findAndScrollToProduct] Produto "${searchText}" encontrado no DOM, mas não visível ainda. Tentando rolar.`
          );
          productElement = product;
        }
      }
    }

    if (i < MAX_SWIPES - 1) {
      console.log(
        `[findAndScrollToProduct] Produto "${searchText}" não visível, tentando swipe para cima...`
      );
      try {
        await driver.execute("mobile: swipe", { direction: "up" });
        await browser.pause(1000);
      } catch (swipeError) {
        console.warn("WARN: mobile:swipe falhou.", swipeError.message);
        break;
      }
    }
  }
  if (productElement) {
    console.log(
      `[findAndScrollToProduct] Tentando usar a referência encontrada após swipes.`
    );
    if (await productElement.isDisplayed()) {
      return productElement;
    } else {
      console.warn(
        `[findProductByLabelText] Elemento encontrado mas não ficou visível mesmo após swipes.`
      );
    }
  }
  console.log(
    `[findProductByLabelText] Produto "${searchText}" não encontrado ou não ficou visível após ${MAX_SWIPES} swipes.`
  );
  return null;
}

describe("Product Details", () => {
  it("should view 'Teste Exercicio R$ 100' info", async () => {
    await homePage.search();
    await browsePage.searchInput.waitForDisplayed({ timeout: 10000 });
    await browsePage.searchInput.clearValue();
    await browsePage.searchInput.setValue("Teste Exercicio");
    await browser.pause(2000);

    await browser.waitUntil(
      async () => (await $$("~productDetails")).length > 0,
      { timeout: 35000, timeoutMsg: "Lista (~productDetails) não apareceu." }
    );
    console.log("Lista de produtos (~productDetails) inicial encontrada.");

    const targetProductText = "Teste Exercicio R$ 100";
    const productElement = await findAndScrollToProduct(targetProductText);

    if (productElement) {
      console.log(
        `Produto "${targetProductText}" localizado e visível, clicando...`
      );

      await productElement.click();
      console.log(`Clicou no produto "${targetProductText}".`);
    } else {
      throw new Error(
        `Produto com texto "${targetProductText}" não encontrado ou não visível após scroll.`
      );
    }

    console.log("Verificando tela de detalhes...");
    const productTitleElement = await $("~Teste Exercicio");
    await productTitleElement.waitForDisplayed({ timeout: 20000 });
    expect(await productTitleElement.isDisplayed()).toBeTruthy();

    const addToCartBtn = await $("~addToCart");
    await expect(addToCartBtn).toBeDisplayed();
    console.log("Tela de detalhes verificada.");
  });
});
