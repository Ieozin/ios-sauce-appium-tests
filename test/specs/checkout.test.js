import { expect, $, $$ } from "@wdio/globals";
import homePage from "../pageobjects/home.page.js";
import loginPage from "../pageobjects/login.page.js";
import browsePage from "../pageobjects/browse.page.js";
import productPage from "../pageobjects/product.page.js";
import cartPage from "../pageobjects/cart.page.js";
import checkoutPage from "../pageobjects/checkout.page.js";

async function findProductByLabelText(searchText) {
  const productList = await $$(`~productDetails`);
  for (const product of productList) {
    const label = await product.getAttribute("label");
    if (label && label.includes(searchText)) {
      return product;
    }
  }
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
    await $(`~productDetails`).waitForExist({ timeout: 20000 });
    const targetProductText = "Teste Exercicio R$ 100";
    const productElement = await findProductByLabelText(targetProductText);
    if (productElement) {
      await productElement.waitForDisplayed({ timeout: 10000 });
      await productElement.click();
    } else {
      throw new Error(`Produto "${targetProductText}" não encontrado.`);
    }
    const addToCartBtn = await $("~addToCart");
    await addToCartBtn.waitForDisplayed({ timeout: 20000 });
    await addToCartBtn.click();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillNewAddressForm({
      name: "leonardo Martins",
      mobile: "24993117595",
      street: "Estrada união Industria 20301",
      city: "Petropolis",
      state: "Rio de Janeiro",
      zip: "25750222",
    });

    await checkoutPage.proceedWithPayment();

    await expect(await checkoutPage.verifySuccess()).toBe(true);
  });
});
