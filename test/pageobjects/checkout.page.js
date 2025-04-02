import { $ } from "@wdio/globals";

class CheckoutPage {
  get addAddressButton() {
    return $('-ios predicate string:name == "addAddressButton"');
  }

  get addressForm() {
    return $('-ios predicate string:name == "addressForm"');
  }

  get paymentButton() {
    return $('-ios predicate string:name == "completeCheckoutButton"');
  }

  async addNewAddress(addressData) {
    if (await this.addAddressButton.isDisplayed()) {
      await this.addAddressButton.click();
      await this.addressForm.setValue(
        `${addressData.street}\n${addressData.city}\n${addressData.zip}`
      );
    }
  }

  async completePayment() {
    await this.paymentButton.click();
  }
}

export default new CheckoutPage();
