import { expect } from "@wdio/globals";
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
    await (await browsePage.products)[0].click();

    await productPage.addToCartButton.click();

    await cartPage.proceedToCheckout();
    await checkoutPage.addNewAddress({
      street: "Rua EBAC 123",
      city: "São Paulo",
      zip: "00000-000",
    });

    await checkoutPage.completePayment();
    await expect(
      $('-ios predicate string:name == "orderConfirmation"')
    ).toBeDisplayed();
  });
});
