import { expect, $ } from "@wdio/globals";
import homePage from "../pageobjects/home.page.js";
import loginPage from "../pageobjects/login.page.js";
import browsePage from "../pageobjects/browse.page.js";
import productPage from "../pageobjects/product.page.js";
import cartPage from "../pageobjects/cart.page.js";
import checkoutPage from "../pageobjects/checkout.page.js";

describe("Checkout Flow", () => {
  it("should complete purchase", async () => {
    await homePage.openMenu("Account");
    await loginPage.login("cliente@ebac.art.br", "GD*peToHNJ1#c$sgk08EaYJQ");

    await homePage.search();
    await browsePage.searchInput.setValue("In");

    await $('-ios predicate string:name == "productDetails"').waitForExist({ timeout: 20000 });

    const productList = await browsePage.products;
    if (productList.length > 0) {
      await productList[0].click();
    } else {
      throw new Error(
        "Nenhum produto encontrado após a busca 'In' no teste de checkout."
      );
    }

    await productPage.addToCartButton.waitForDisplayed({ timeout: 15000 });
    await productPage.addToCartButton.click();

    await cartPage.proceedToCheckout();
    await checkoutPage.addNewAddress({
      street: "Rua EBAC 123",
      city: "São Paulo",
      zip: "00000-000",
    });

    await checkoutPage.completePayment();

    const orderConfirmationElement = $(
      '-ios predicate string:name == "orderConfirmation"'
    );
    await orderConfirmationElement.waitForDisplayed({ timeout: 20000 });
    await expect(orderConfirmationElement).toBeDisplayed();
  });
});
