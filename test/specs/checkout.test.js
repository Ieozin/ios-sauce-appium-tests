import { expect, $, $$ } from "@wdio/globals";
import homePage from "../pageobjects/home.page.js";
import loginPage from "../pageobjects/login.page.js";
import browsePage from "../pageobjects/browse.page.js";
import cartPage from "../pageobjects/cart.page.js";
import checkoutPage from "../pageobjects/checkout.page.js";

async function findProductByLabelAndClick(searchText, maxSwipes = 5) {
  console.log(`[findProductByLabelAndClick] Procurando por "${searchText}"...`);
  for (let i = 0; i < maxSwipes; i++) {
    const productList = await $$(`~productDetails`);
    console.log(
      `[findProductByLabelAndClick] Tentativa ${i + 1}: ${
        productList.length
      } produtos na tela.`
    );

    for (const product of productList) {
      let label = null;
      try {
        label = await product.getAttribute("label");
      } catch (e) {
        console.warn(
          `[findProductByLabelAndClick] Aviso: Falha ao obter label: ${e.message}`
        );
        continue;
      }

      if (label && label.includes(searchText)) {
        console.log(
          `[findProductByLabelAndClick] Label "${searchText}" encontrado. Verificando visibilidade...`
        );
        if (await product.isDisplayed()) {
          console.log(
            `[findProductByLabelAndClick] Elemento "${searchText}" está visível. Tentando clicar...`
          );
          try {
            await product.click();
            console.log(
              `[findProductByLabelAndClick] CLICOU COM SUCESSO em "${searchText}"`
            );
            return true;
          } catch (clickError) {
            console.error(
              `[findProductByLabelAndClick] ERRO AO CLICAR no elemento visível: ${clickError.message}`
            );
            return false;
          }
        } else {
          console.log(
            `[findProductByLabelAndClick] Elemento "${searchText}" encontrado no DOM, mas NÃO VISÍVEL.`
          );
        }
      }
    }

    if (i < maxSwipes - 1) {
      console.log(
        `[findProductByLabelAndClick] Elemento "${searchText}" não encontrado visível. Tentando swipe ${
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
        `[findProductByLabelAndClick] Limite de swipes (${maxSwipes}) atingido sem encontrar "${searchText}" visível.`
      );
    }
  }

  console.error(
    `[findProductByLabelAndClick] FALHA: Não foi possível encontrar e clicar em "${searchText}" após ${maxSwipes} swipes.`
  );
  return false;
}

describe("Checkout Flow", () => {
  it("should complete purchase with 'Teste Exercicio R$ 100'", async () => {
    await homePage.openMenu("Account");
    await loginPage.login("cliente@ebac.art.br", "GD*peToHNJ1#c$sgk08EaYJQ");

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
    const clicked = await findProductByLabelAndClick(targetProductText);
    if (!clicked) {
      throw new Error(
        `FALHA CRÍTICA: Não foi possível encontrar e clicar no produto "${targetProductText}" após tentativas de scroll.`
      );
    }
    console.log(`Produto "${targetProductText}" clicado com sucesso.`);

    console.log("Procurando botão Add to Cart na tela de detalhes...");

    const addToCartBtn = await $("~addToCart");
    await addToCartBtn.waitForDisplayed({ timeout: 15000 });
    await addToCartBtn.click();
    console.log("Clicou em Add to Cart.");

    await cartPage.proceedToCheckout();

    await checkoutPage.fillNewAddressForm({
      name: "leonardo Martins",
      mobile: "24993117595",
      street: "Estrada união Industria 20301",
      city: "Petropolis",
      state: "Rio de Janeiro",
      zip: "25750222",
    });
    console.log("Endereço preenchido e salvo.");

    await checkoutPage.proceedWithPayment();
    console.log("Prosseguiu para pagamento.");
    await expect(await checkoutPage.verifySuccess()).toBe(true);
    console.log("Compra verificada com sucesso.");
  });
});
