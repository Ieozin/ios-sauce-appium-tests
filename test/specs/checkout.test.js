import { expect, $, $$ } from "@wdio/globals";
import homePage from "../pageobjects/home.page.js";
import loginPage from "../pageobjects/login.page.js";
import browsePage from "../pageobjects/browse.page.js";
import productPage from "../pageobjects/product.page.js";
import cartPage from "../pageobjects/cart.page.js";
import checkoutPage from "../pageobjects/checkout.page.js";

async function findProductByLabelText(searchText) {
  let productList = await $$(`~productDetails`);
  console.log(
    `[findProductByLabelText] Tentativa 1: ${productList.length} elementos encontrados.`
  );
  for (const product of productList) {
    const label = await product.getAttribute("label");

    if (label && label.includes(searchText)) {
      console.log(
        `[findProductByLabelText] Produto encontrado na primeira busca: ${label}`
      );

      if (await product.isDisplayed()) return product;
    }
  }

  console.log(
    `[findProductByLabelText] Produto "${searchText}" não encontrado inicialmente, tentando rolar...`
  );
  try {
    await driver.execute("mobile: swipe", { direction: "up" });
    await browser.pause(500);
    await driver.execute("mobile: swipe", { direction: "up" });
    await browser.pause(500);
  } catch (swipeError) {
    console.warn("WARN: mobile:swipe falhou.", swipeError.message);
  }

  productList = await $$(`~productDetails`);
  console.log(
    `[findProductByLabelText] Tentativa 2 (pós-scroll): ${productList.length} elementos encontrados.`
  );
  for (const product of productList) {
    const label = await product.getAttribute("label");

    if (label && label.includes(searchText)) {
      console.log(
        `[findProductByLabelText] Produto encontrado pós-scroll: ${label}`
      );

      if (await product.isDisplayed()) return product;
    }
  }

  console.log(
    `[findProductByLabelText] Produto "${searchText}" não encontrado mesmo após rolar.`
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

    await browser.waitUntil(
      async () => (await $$("~productDetails")).length > 0,
      { timeout: 35000, timeoutMsg: "Lista (~productDetails) não apareceu." }
    );
    console.log("Lista de produtos (~productDetails) inicial encontrada.");

    const targetProductText = "Teste Exercicio R$ 100";
    const productElement = await findProductByLabelText(targetProductText);

    if (productElement) {
      console.log(
        `Produto "${targetProductText}" localizado, tentando clicar.`
      );

      await productElement.waitForDisplayed({ timeout: 5000 });
      await productElement.click();
      console.log(`Clicou no produto "${targetProductText}".`);
    } else {
      throw new Error(
        `Produto com texto "${targetProductText}" não encontrado na lista, mesmo após rolar.`
      );
    }

    console.log("Procurando botão Add to Cart...");
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
