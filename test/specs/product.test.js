import { expect } from "@wdio/globals";
import homePage from "../pageobjects/home.page.js";
import browsePage from "../pageobjects/browse.page.js";
import productPage from "../pageobjects/product.page.js";

describe("Product Details", () => {
  it("should view product info", async () => {
    await homePage.search();
    await browsePage.searchInput.setValue("In");
    await (await browsePage.products)[0].waitForExist({ timeout: 15000 });

    await (
      await productPage.getProductTitle("Ingrid Running Jacket")
    ).waitForDisplayed({ timeout: 10000 });
    expect(
      productPage.getProductTitle("Ingrid Running Jacket")
    ).toBeDisplayed();
  });
});
