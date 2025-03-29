import { $ } from "@wdio/globals";

class ProductPage {
  async getProductTitle(name) {
    return $(`~${name}`);
  }
}

export default new ProductPage();
