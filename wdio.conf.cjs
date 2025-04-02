exports.config = {
  runner: "local",

  user: process.env.SAUCE_USERNAME,
  key: process.env.SAUCE_ACCESS_KEY,
  region: "us",

  services: [["sauce", { sauceConnect: false }]],

  specs: ["./test/specs/**/*.js"],
  suites: {
    login: ["./test/specs/login.test.js", "./test/specs/search.test.js"],
    product: ["./test/specs/product.test.js"],
  },

  maxInstances: 1,
  capabilities: [
    {
      platformName: "iOS",
      "appium:deviceName": "iPhone 15 Pro Simulator",
      "appium:platformVersion": "17.2",
      "appium:automationName": "XCUITest",
      "appium:app": "storage:filename=LojaEBAC-sim.zip",
      "sauce:options": {
        appiumVersion: "2.1.3",
        build: `EBAC Build ${new Date().toISOString()}`,
        name: "Teste iOS Checkout Flow",
        deviceOrientation: "PORTRAIT",
        //tunnelIdentifier: "EBAC_TUNNEL",
      },
    },
  ],

  logLevel: "info",
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  framework: "mocha",
  reporters: ["spec"],

  mochaOpts: {
    ui: "bdd",
    timeout: 60000,
  },

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
