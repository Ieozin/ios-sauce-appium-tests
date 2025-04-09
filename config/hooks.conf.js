export let hooksConf = {
  beforeTest: async function () {
    let state = await driver.queryAppState("br.com.lojaebac");
    if (state !== 4) {
      await driver.execute("mobile: launchApp", {
        bundleId: "br.com.lojaebac",
      });
    }
  },

  afterTest: async function () {
    await driver.execute("mobile: terminateApp", {
      bundleId: "br.com.lojaebac",
    });
    await driver.takeScreenshot();
  },
};
