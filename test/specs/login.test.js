import { expect, driver } from "@wdio/globals";
import homePage from "../pageobjects/home.page.js";
import loginPage from "../pageobjects/login.page.js";
import profilePage from "../pageobjects/profile.page.js";

describe("My Login application", () => {
  it("should login with valid credentials", async () => {
    let profileTab = driver.isAndroid ? "profile" : "Account";
    await homePage.openMenu(profileTab);
    await loginPage.login("cliente@ebac.art.br", "GD*peToHNJ1#c$sgk08EaYJQ");
    await homePage.openMenu(profileTab);
    expect(
      (await profilePage.profileName("EBAC Cliente")).isDisplayed()
    ).toBeTruthy();
  });
});
