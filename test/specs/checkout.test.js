import { expect, $, $$ } from "@wdio/globals";
import homePage from "../pageobjects/home.page.js";
import loginPage from "../pageobjects/login.page.js";
import browsePage from "../pageobjects/browse.page.js";
import productPage from "../pageobjects/product.page.js";
import cartPage from "../pageobjects/cart.page.js";
import checkoutPage from "../pageobjects/checkout.page.js";

async function findAndScrollToProduct(searchText) {
  const MAX_SWIPES = 5;
  let productElement = null;

  for (let i = 0; i < MAX_SWIPES; i++) {
    const productList = await $$(`~productDetails`);
    console.log(
      `[findAndScrollToProduct] Tentativa ${i + 1}: ${
        productList.length
      } produtos na tela.`
    );

    for (const product of productList) {
      const label = await product.getAttribute("label");
      if (label && label.includes(searchText)) {
        if (await product.isDisplayed()) {
          console.log(
            `[findAndScrollToProduct] Produto "${searchText}" encontrado e visível.`
          );
          return product;
        } else {
          console.log(
            `[findAndScrollToProduct] Produto "${searchText}" encontrado no DOM, mas não visível ainda. Tentando rolar.`
          );
          productElement = product;
        }
      }
    }

    if (i < MAX_SWIPES - 1) {
      console.log(
        `[findAndScrollToProduct] Produto "${searchText}" não visível, tentando swipe para cima...`
      );
      try {
        await driver.execute("mobile: swipe", { direction: "up" });
        await browser.pause(1000);
      } catch (swipeError) {
        console.warn(
          `WARN: mobile:swipe falhou. Tentando continuar.`,
          swipeError.message
        );

        break;
      }
    }
  }

  if (productElement) {
    console.log(
      `[findAndScrollToProduct] Tentando usar a referência encontrada após swipes.`
    );

    if (await productElement.isDisplayed()) {
      return productElement;
    } else {
      console.warn(
        `[findProductByLabelText] Elemento encontrado mas não ficou visível mesmo após swipes.`
      );
    }
  }

  console.log(
    `[findProductByLabelText] Produto "${searchText}" não encontrado ou não ficou visível após ${MAX_SWIPES} swipes.`
  );
  return null;
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

    const targetProductText = "Teste Exercicio R$ 100";

    await browser.waitUntil(
      async () => (await $$("~productDetails")).length > 0,
      { timeout: 35000, timeoutMsg: "Lista (~productDetails) não apareceu." }
    );
    const productElement = await findAndScrollToProduct(targetProductText);

    if (productElement) {
      console.log(
        `Produto "${targetProductText}" encontrado e visível, clicando...`
      );

      await productElement.click();
      console.log(`Clicou no produto "${targetProductText}".`);
    } else {
      throw new Error(
        `Produto com texto "${targetProductText}" não encontrado ou não visível após scroll.`
      );
    }

    console.log("Procurando botão Add to Cart...");
    const addToCartBtn = await $("~addToCart");
    await addToCartBtn.waitForDisplayed({ timeout: 15000 });
    await addToCartBtn.click();
    console.log("Clicou em Add to Cart.");

    await cartPage.proceedToCheckout();
    await checkoutPage.fillNewAddressForm({});
    console.log("Endereço preenchido e salvo.");

    await checkoutPage.proceedWithPayment();
    console.log("Prosseguiu para pagamento.");
    await expect(await checkoutPage.verifySuccess()).toBe(true);
    console.log("Compra verificada com sucesso.");
  });
});
