import { $ } from "@wdio/globals";

class HomePage {
  async openMenu(menu) {
    await $(`id:tab-${menu}`).click();
  }

  async search() {
    (await $(`-ios predicate string:name ENDSWITH "Search Products"`)).click();
  }
}

export default new HomePage();
