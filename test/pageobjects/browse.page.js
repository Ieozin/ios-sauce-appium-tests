import { $, $$ } from "@wdio/globals";

class BrowsePage {
  get searchInput() {
    return $('-ios predicate string:name == "searchInput"');
  }

  get products() {
    return $$(
      '-ios class chain:**/XCUIElementTypeOther[`name CONTAINS "teste"`]'
    );
  }
}

export default new BrowsePage();
