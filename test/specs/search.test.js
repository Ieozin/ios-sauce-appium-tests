import { expect, driver } from "@wdio/globals";
import homePage from "../pageobjects/home.page.js";
import browsePage from "../pageobjects/browse.page.js";

describe("Search", () => {
  beforeEach(async () => {
    let state = await driver.queryAppState("br.com.lojaebac");
    if (state !== 4) {
      await driver.execute("mobile: launchApp", {
        bundleId: "br.com.lojaebac",
      });
    }
  });

  afterEach(async () => {
    await driver.execute("mobile: terminateApp", {
      bundleId: "br.com.lojaebac",
    });
  });

  it("should search products", async () => {
    await homePage.search();
    await browsePage.searchInput.setValue("In");
    await browsePage.products.map(async (product) => {
      expect(await product.getText()).toContain("R$");
    });
  });
});
