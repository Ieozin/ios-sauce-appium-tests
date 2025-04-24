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

  /**
   *
   * @param {object} addressData - Dados: { name, mobile, street, city, state, zip }
   */
  async fillNewAddressForm(addressData) {
    console.log("[CheckoutPage] Clicando para adicionar novo endereço...");
    await this.addAddressButton.waitForDisplayed({ timeout: 15000 });
    await this.addAddressButton.click();

    console.log("[CheckoutPage] Preenchendo formulário de endereço...");
    await this.nameField.waitForDisplayed({ timeout: 10000 });
    await this.nameField.setValue(addressData.name);
    await this.mobileField.setValue(addressData.mobile);
    await this.addressField.setValue(addressData.street);
    await this.cityField.setValue(addressData.city);
    await this.stateField.setValue(addressData.state);
    await this.zipField.setValue(addressData.zip);

    console.log("[CheckoutPage] Clicando para salvar endereço...");
    await this.saveAddressButton.waitForDisplayed({ timeout: 5000 });
    await this.saveAddressButton.click();
    console.log("[CheckoutPage] Endereço salvo.");

    await this.continueToPaymentButton.waitForDisplayed({ timeout: 15000 });
    console.log("[CheckoutPage] Botão 'Continue to Payment' visível.");
  }

  async proceedWithPayment() {
    console.log("[CheckoutPage] Clicando em 'Continue to Payment'...");
    await this.continueToPaymentButton.waitForClickable({ timeout: 10000 });
    await this.continueToPaymentButton.click();

    console.log("[CheckoutPage] Selecionando 'Cash on Delivery'...");
    await this.cashOnDeliveryOption.waitForDisplayed({ timeout: 10000 });
    await this.cashOnDeliveryOption.click();

    console.log("[CheckoutPage] Clicando no botão final 'Checkout'...");
    await this.finalCheckoutButton.waitForDisplayed({ timeout: 10000 });
    await this.finalCheckoutButton.click();
    console.log("[CheckoutPage] Botão final 'Checkout' clicado.");
  }

  /**
   *
   * @returns {Promise<boolean>}
   */

  async verifySuccess() {
    console.log("[CheckoutPage] Verificando tela de sucesso...");
    await this.successImage.waitForDisplayed({ timeout: 25000 });
    return await this.successImage.isDisplayed();
  }

  async returnHome() {
    await this.goBackHomeButton.waitForDisplayed({ timeout: 5000 });
    await this.goBackHomeButton.click();
  }
}

export default new CheckoutPage();
