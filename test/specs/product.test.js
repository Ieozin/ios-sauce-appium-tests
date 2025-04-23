import { expect, $, $$ } from "@wdio/globals";
import homePage from "../pageobjects/home.page.js";
import browsePage from "../pageobjects/browse.page.js";
import productPage from "../pageobjects/product.page.js";

import { findAndClickProductByLabel } from "../helpers/actionUtils.js";

describe("Product Details", () => {
  it("should view 'Teste Exercicio R$ 100' info", async () => {
    await homePage.search();
    await browsePage.searchInput.waitForDisplayed({ timeout: 10000 });
    await browsePage.searchInput.clearValue();
    await browsePage.searchInput.setValue("Teste Exercicio");
    await browser.pause(2000);

    await browser.waitUntil(
      async () => (await $$("~productDetails")).length > 0,
      {
        timeout: 35000,
        timeoutMsg: "Lista de produtos (~productDetails) não apareceu após 35s",
      }
    );
    console.log("Lista de produtos (~productDetails) inicial encontrada.");

    const targetProductText = "Teste Exercicio R$ 100";

    const clicked = await findAndClickProductByLabel(targetProductText);

    if (!clicked) {
      throw new Error(
        `FALHA: Não foi possível encontrar e clicar no produto "${targetProductText}" após tentativas de scroll.`
      );
    }
    console.log(`Produto "${targetProductText}" clicado com sucesso.`);

    console.log("Verificando tela de detalhes...");

    const productTitleElement = await $("~Teste Exercicio");
    await productTitleElement.waitForDisplayed({ timeout: 20000 });
    expect(await productTitleElement.isDisplayed()).toBeTruthy();

    const addToCartBtn = await $("~addToCart");
    await expect(addToCartBtn).toBeDisplayed();
    console.log("Tela de detalhes verificada.");
  });
});
