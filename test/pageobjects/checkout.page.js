import { $ } from "@wdio/globals";

class CheckoutPage {
  get addAddressButton() {
    return $("~addNewAddress");
  }

  get nameField() {
    return $('-ios predicate string:value == "Enter your name"');
  }
  get mobileField() {
    return $('-ios predicate string:value == "Enter your mobile number"');
  }
  get addressField() {
    return $('-ios predicate string:value == "Enter your address"');
  }
  get cityField() {
    return $('-ios predicate string:value == "City"');
  }
  get stateField() {
    return $('-ios predicate string:value == "State"');
  }
  get zipField() {
    return $('-ios predicate string:value == "ZipCode"');
  }
  get saveAddressButton() {
    return $("~save");
  }

  get continueToPaymentButton() {
    return $("~selectAddressOrContinueToPayment");
  }

  get cashOnDeliveryOption() {
    return $("~option-1");
  }

  get finalCheckoutButton() {
    return $("~completeCheckout");
  }

  get successImage() {
    return $("~transactionSuccessfulImage");
  }

  get goBackHomeButton() {
    return $("~goBackHome");
  }

  async fillNewAddressForm(addressData) {
    await this.addAddressButton.waitForDisplayed({ timeout: 15000 });
    await this.addAddressButton.click();
    await this.nameField.waitForDisplayed({ timeout: 10000 });
    await this.nameField.setValue(addressData.name);
    await this.mobileField.setValue(addressData.mobile);
    await this.addressField.setValue(addressData.street);
    await this.cityField.setValue(addressData.city);
    await this.stateField.setValue(addressData.state);
    await this.zipField.setValue(addressData.zip);
    await this.saveAddressButton.waitForDisplayed({ timeout: 5000 });
    await this.saveAddressButton.click();
    await browser.pause(2000);
  }

  async proceedWithPayment() {
    await this.continueToPaymentButton.waitForDisplayed({ timeout: 15000 });
    await this.continueToPaymentButton.click();

    await this.cashOnDeliveryOption.waitForDisplayed({ timeout: 10000 });
    await this.cashOnDeliveryOption.click();

    await this.finalCheckoutButton.waitForDisplayed({ timeout: 10000 });
    await this.finalCheckoutButton.click();
  }

  async verifySuccess() {
    await this.successImage.waitForDisplayed({ timeout: 20000 });
    return await this.successImage.isDisplayed(); // Retorna true se visível
  }

  async returnHome() {
    await this.goBackHomeButton.waitForDisplayed({ timeout: 5000 });
    await this.goBackHomeButton.click();
  }
}

export default new CheckoutPage();
