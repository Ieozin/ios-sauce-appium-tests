// L:\Repositorio\EBAC\12-_Testando_Aplicações_iOS\Aula-2_Primeiro_teste_iOS\test\specs\product.test.js
import { expect } from "@wdio/globals";
import homePage from "../pageobjects/home.page.js";
import browsePage from "../pageobjects/browse.page.js";
import productPage from "../pageobjects/product.page.js";

describe("Product Details", () => {
  it("should view product info", async () => {
    await homePage.search();
    await browsePage.searchInput.setValue("In");

    await browsePage.products.waitForExist({ timeout: 20000 });

    const productList = await browsePage.products;
    if (productList.length > 0) {
      await productList[0].click();
    } else {
      throw new Error(
        "Nenhum produto encontrado após a busca 'In' no teste de produto."
      );
    }

    const productTitleElement = await productPage.getProductTitle(
      "Ingrid Running Jacket"
    );
    await productTitleElement.waitForDisplayed({ timeout: 15000 });
    expect(await productTitleElement.isDisplayed()).toBeTruthy();
  });
});
