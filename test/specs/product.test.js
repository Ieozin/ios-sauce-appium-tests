import { expect, $ } from "@wdio/globals";
import homePage from "../pageobjects/home.page.js";
import browsePage from "../pageobjects/browse.page.js";
import productPage from "../pageobjects/product.page.js";

describe("Product Details", () => {
  it("should view Camiseta EBAC info", async () => {
    await homePage.search();
    await browsePage.searchInput.waitForDisplayed({ timeout: 10000 });
    await browsePage.searchInput.setValue("Camiseta");

    await $(`~productDetails`).waitForExist({ timeout: 20000 });

    const productList = await browsePage.products;
    if (productList.length > 0) {
      await productList[0].waitForDisplayed({ timeout: 10000 });
      await productList[0].click();
    } else {
      throw new Error(
        "Nenhum produto encontrado com ID 'productDetails' após a busca 'Camiseta'."
      );
    }

    const productTitleElement = await $("~Camiseta EBAC");

    await productTitleElement.waitForDisplayed({ timeout: 15000 });
    expect(await productTitleElement.isDisplayed()).toBeTruthy();
  });
});
