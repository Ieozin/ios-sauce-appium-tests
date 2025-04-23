import { $$, driver } from "@wdio/globals";

/**
 * @param {string} searchText
 * @param {number} maxSwipes
 * @returns {Promise<boolean>}
 */

export async function findAndClickProductByLabel(searchText, maxSwipes = 5) {
  console.log(`[findAndClickProductByLabel] Procurando por "${searchText}"...`);
  for (let i = 0; i < maxSwipes; i++) {
    const productList = await $$(`~productDetails`);
    console.log(
      `[findAndClickProductByLabel] Tentativa ${i + 1}: ${
        productList.length
      } produtos na tela.`
    );

    for (const product of productList) {
      let label = null;
      try {
        label = await product.getAttribute("label");
      } catch (e) {
        console.warn(
          `[findAndClickProductByLabel] Aviso: Falha ao obter label: ${e.message}`
        );
        continue;
      }

      if (label && label.includes(searchText)) {
        console.log(
          `[findAndClickProductByLabel] Label "${searchText}" encontrado. Verificando visibilidade...`
        );
        if (await product.isDisplayed()) {
          console.log(
            `[findAndClickProductByLabel] Elemento "${searchText}" está visível. Tentando clicar...`
          );
          try {
            await product.click();
            console.log(
              `[findAndClickProductByLabel] CLICOU COM SUCESSO em "${searchText}"`
            );
            return true; // Sucesso!
          } catch (clickError) {
            console.error(
              `[findAndClickProductByLabel] ERRO AO CLICAR no elemento visível: ${clickError.message}`
            );
            return false;
          }
        } else {
          console.log(
            `[findAndClickProductByLabel] Elemento "${searchText}" encontrado no DOM, mas NÃO VISÍVEL.`
          );
        }
      }
    }

    if (i < maxSwipes - 1) {
      console.log(
        `[findAndClickProductByLabel] Elemento "${searchText}" não encontrado visível. Tentando swipe ${
          i + 1
        }/${maxSwipes}...`
      );
      try {
        await driver.execute("mobile: swipe", { direction: "up" });
        await browser.pause(1500);
      } catch (swipeError) {
        console.warn("WARN: mobile:swipe falhou.", swipeError.message);
        return false;
      }
    } else {
      console.log(
        `[findAndClickProductByLabel] Limite de swipes (${maxSwipes}) atingido sem encontrar "${searchText}" visível.`
      );
    }
  }

  console.error(
    `[findAndClickProductByLabel] FALHA: Não foi possível encontrar e clicar em "${searchText}" após ${maxSwipes} swipes.`
  );
  return false;
}
