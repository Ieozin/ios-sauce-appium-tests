import { $, $$ } from "@wdio/globals";

class BrowsePage {
  get searchInput() {
    return $(`-ios predicate string:name == "searchInput"`);
  }

  get products() {
    return $$(`-ios predicate string:name == "productDetails"`);
  }
}

export default new BrowsePage();
