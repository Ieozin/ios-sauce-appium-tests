import { expect, driver, $, $$ } from "@wdio/globals";
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
    await browsePage.searchInput.clearValue();
  });

  afterEach(async () => {
    await driver.terminateApp("br.com.lojaebac");
  });

  it("should search products with 'Teste Exercicio'", async () => {
    await browsePage.searchInput.setValue("Teste Exercicio");

    await browser.waitUntil(
      async () => (await $$("~productDetails")).length > 0,
      {
        timeout: 20000,
        timeoutMsg:
          'Nenhum produto (~productDetails) encontrado após busca por "Teste Exercicio"',
      }
    );

    const productsList = await browsePage.products;
    await expect(productsList.length).toBeGreaterThan(0);
    console.log(
      `Busca por "Teste Exercicio" retornou ${productsList.length} produtos.`
    );
  });
});
