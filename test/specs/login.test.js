import { expect, driver } from "@wdio/globals";
import homePage from "../pageobjects/home.page.js";
import loginPage from "../pageobjects/login.page.js";
import profilePage from "../pageobjects/profile.page.js";

describe("My Login application", () => {
  it("should login with valid credentials", async () => {
    let profileTabName = "Account";
    await homePage.openMenu(profileTabName);

    await loginPage.login("cliente@ebac.art.br", "GD*peToHNJ1#c$sgk08EaYJQ");

    console.log(
      "Aguardando carregamento da tela de perfil após login (CustomerName)..."
    );
    await profilePage.customerNameElement.waitForDisplayed({
      timeout: 20000,
      timeoutMsg:
        "Login falhou ou página de perfil não carregou a tempo (CustomerName não encontrado).",
    });
    console.log("Tela de perfil carregada (CustomerName visível).");

    await expect(profilePage.customerNameElement).toBeDisplayed();
    console.log("Login verificado com sucesso.");
  });
});
