import { $ } from "@wdio/globals";
class ProductPage {
  get addToCartButton() {
    return $('-ios predicate string:name == "addToCartButton"');
  }

  async getProductTitle(name) {
    return $(`~${name}`);
  }
}

export default new ProductPage();
