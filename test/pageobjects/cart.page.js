import { $ } from "@wdio/globals";

class CartPage {
  get checkoutButton() {
    return $('-ios predicate string:label == "Checkout"');
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}

export default new CartPage();
