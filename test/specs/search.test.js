import { expect, driver } from "@wdio/globals";
import homePage from "../pageobjects/home.page.js";
import browsePage from "../pageobjects/browse.page.js";

describe("Search", () => {
  it("should search products", async () => {
    await homePage.search();
    await browsePage.searchInput.setValue("In");
    await browsePage.products.map(async (product) => {
      expect(await product.getText()).toContain("R$");
    });
  });
});
