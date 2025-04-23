import { expect, $, $$ } from "@wdio/globals";
import homePage from "../pageobjects/home.page.js";
import browsePage from "../pageobjects/browse.page.js";
import productPage from "../pageobjects/product.page.js";

async function findProductByLabelText(searchText) {
  const productList = await $$(`~productDetails`);
  for (const product of productList) {
    const label = await product.getAttribute("label");
    if (label && label.includes(searchText)) {
      return product;
    }
  }
  return null;
}

describe("Product Details", () => {
  it("should view 'Teste Exercicio R$ 100' info", async () => {
    await homePage.search();
    await browsePage.searchInput.waitForDisplayed({ timeout: 10000 });
    await browsePage.searchInput.clearValue();
    await browsePage.searchInput.setValue("Teste Exercicio");
    await browser.pause(2000);

    await $(`~productDetails`).waitForExist({ timeout: 35000 });

    const targetProductText = "Teste Exercicio R$ 100";
    const productElement = await findProductByLabelText(targetProductText);

    if (productElement) {
      try {
        await driver.execute("mobile: scroll", {
          direction: "down",
          elementId: productElement.elementId,
        });

        await browser.pause(500);
      } catch (scrollError) {
        console.warn(
          `WARN: mobile:scroll/swipe falhou, tentando continuar. Erro: ${scrollError.message}`
        );
      }

      await productElement.waitForDisplayed({ timeout: 20000 });
      await productElement.click();
    } else {
      throw new Error(
        `Produto com texto "${targetProductText}" não encontrado na lista após a busca.`
      );
    }

    const productTitleElement = await $("~Teste Exercicio");
    await productTitleElement.waitForDisplayed({ timeout: 20000 });
    expect(await productTitleElement.isDisplayed()).toBeTruthy();

    const addToCartBtn = await $("~addToCart");
    await expect(addToCartBtn).toBeDisplayed();
  });
});
