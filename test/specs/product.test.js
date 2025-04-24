import { expect, $, $$ } from "@wdio/globals";
import homePage from "../pageobjects/home.page.js";
import browsePage from "../pageobjects/browse.page.js";

async function findAndClickProductByLabel(searchText, maxSwipes = 5) {
  console.log(`[findAndClickProductByLabel] Procurando por "${searchText}"...`);
  for (let i = 0; i < maxSwipes; i++) {
    const productList = await $$(`~productDetails`);
    console.log(
      `[findAndClickProductByLabel] Tentativa ${i + 1}: ${
        productList.length
      } produtos na tela.`
    );

    for (const product of productList) {
      let label = null;
      try {
        label = await product.getAttribute("label");
      } catch (e) {
        console.warn(
          `[findAndClickProductByLabel] Aviso: Falha ao obter label: ${e.message}`
        );
        continue;
      }

      if (label && label.includes(searchText)) {
        console.log(
          `[findAndClickProductByLabel] Label "${searchText}" encontrado. Verificando visibilidade...`
        );
        if (await product.isDisplayed()) {
          console.log(
            `[findAndClickProductByLabel] Elemento "${searchText}" está visível. Tentando clicar...`
          );
          try {
            await product.click();
            console.log(
              `[findAndClickProductByLabel] CLICOU COM SUCESSO em "${searchText}"`
            );
            return true;
          } catch (clickError) {
            console.error(
              `[findAndClickProductByLabel] ERRO AO CLICAR no elemento visível: ${clickError.message}`
            );
            return false;
          }
        } else {
          console.log(
            `[findAndClickProductByLabel] Elemento "${searchText}" encontrado no DOM, mas NÃO VISÍVEL.`
          );
        }
      }
    }

    if (i < maxSwipes - 1) {
      console.log(
        `[findAndClickProductByLabel] Elemento "${searchText}" não encontrado visível. Tentando swipe ${
          i + 1
        }/${maxSwipes}...`
      );
      try {
        await driver.execute("mobile: swipe", { direction: "up" });
        await browser.pause(1500);
      } catch (swipeError) {
        console.warn("WARN: mobile:swipe falhou.", swipeError.message);
        return false;
      }
    } else {
      console.log(
        `[findAndClickProductByLabel] Limite de swipes (${maxSwipes}) atingido sem encontrar "${searchText}" visível.`
      );
    }
  }

  console.error(
    `[findAndClickProductByLabel] FALHA: Não foi possível encontrar e clicar em "${searchText}" após ${maxSwipes} swipes.`
  );
  return false;
}

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
        `FALHA CRÍTICA: Não foi possível encontrar e clicar no produto "${targetProductText}" após tentativas de scroll.`
      );
    }
    console.log(`Produto "${targetProductText}" clicado com sucesso.`);

    console.log("Verificando tela de detalhes...");

    const productTitleElement = await $("~Teste Exercicio");
    await productTitleElement.waitForDisplayed({ timeout: 20000 });
    await expect(productTitleElement).toBeDisplayed();

    const addToCartBtn = await $("~addToCart");
    await expect(addToCartBtn).toBeDisplayed();
    console.log("Tela de detalhes verificada.");
  });
});
