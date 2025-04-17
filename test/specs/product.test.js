import { expect, $ } from "@wdio/globals";
import homePage from "../pageobjects/home.page.js";
import browsePage from "../pageobjects/browse.page.js";
import productPage from "../pageobjects/product.page.js";

describe("Product Details", () => {
  it("should view product info", async () => {
    await homePage.search();
    await browsePage.searchInput.setValue("In");

    await $(
      '-ios class chain:**/XCUIElementTypeOther[`name CONTAINS "teste"`]'
    ).waitForExist({ timeout: 20000 });

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
