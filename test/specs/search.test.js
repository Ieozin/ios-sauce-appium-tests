import { expect, driver, $ } from "@wdio/globals";
import homePage from "../pageobjects/home.page.js";
import browsePage from "../pageobjects/browse.page.js";

describe("Search", () => {
  beforeEach(async () => {
    let state = await driver.queryAppState("br.com.lojaebac");
    if (state !== 4) {
      await driver.launchApp();
    }

    await homePage.search();
    await browsePage.searchInput.waitForDisplayed({ timeout: 10000 });
  });

  afterEach(async () => {
    await driver.terminateApp("br.com.lojaebac");
  });

  it("should search products", async () => {
    await browsePage.searchInput.setValue("Camiseta");
    await browser.pause(1000);

    await $(`~productDetails`).waitForExist({ timeout: 15000 });

    const productsList = await browsePage.products;
    await expect(productsList.length).toBeGreaterThan(0);
  });
});
