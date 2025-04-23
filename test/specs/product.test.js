import { expect, $, $$ } from "@wdio/globals";
import homePage from "../pageobjects/home.page.js";
import browsePage from "../pageobjects/browse.page.js";
import productPage from "../pageobjects/product.page.js";

async function findProductByLabelText(searchText) {
  let productList = await $$(`~productDetails`);
  console.log(
    `[findProductByLabelText] Tentativa 1: ${productList.length} elementos encontrados.`
  );
  for (const product of productList) {
    const label = await product.getAttribute("label");

    if (label && label.includes(searchText)) {
      console.log(
        `[findProductByLabelText] Produto encontrado na primeira busca: ${label}`
      );
      if (await product.isDisplayed()) return product;
    }
  }

  console.log(
    `[findProductByLabelText] Produto "${searchText}" não encontrado inicialmente, tentando rolar...`
  );
  try {
    await driver.execute("mobile: swipe", { direction: "up" });
    await browser.pause(500);
    await driver.execute("mobile: swipe", { direction: "up" });
    await browser.pause(500);
  } catch (swipeError) {
    console.warn("WARN: mobile:swipe falhou.", swipeError.message);
  }

  productList = await $$(`~productDetails`);
  console.log(
    `[findProductByLabelText] Tentativa 2 (pós-scroll): ${productList.length} elementos encontrados.`
  );
  for (const product of productList) {
    const label = await product.getAttribute("label");

    if (label && label.includes(searchText)) {
      console.log(
        `[findProductByLabelText] Produto encontrado pós-scroll: ${label}`
      );
      if (await product.isDisplayed()) return product;
    }
  }

  console.log(
    `[findProductByLabelText] Produto "${searchText}" não encontrado mesmo após rolar.`
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

    const targetProductText = "Teste Exercicio R$ 100";
    const productElement = await findProductByLabelText(targetProductText);

    if (productElement) {
      console.log(
        `Produto "${targetProductText}" localizado, tentando clicar.`
      );

      await productElement.waitForDisplayed({ timeout: 5000 });
      await productElement.click();
      console.log(`Clicou no produto "${targetProductText}".`);
    } else {
      throw new Error(
        `Produto com texto "${targetProductText}" não encontrado pela função findProductByLabelText.`
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
