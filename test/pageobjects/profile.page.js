import { $ } from "@wdio/globals";

class ProfilePage {
  get customerNameElement() {
    return $(`~CustomerName`);
  }
}

export default new ProfilePage();
