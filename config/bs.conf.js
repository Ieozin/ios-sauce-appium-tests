import { generalConf } from "./general.conf.js";
export let bsConf = {
  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,
  hostname: "hub-cloud.browserstack.com",
  capabilities:
    process.env.PLATFORM === "android"
      ? [
          {
            platformName: "Android",
            "appium:deviceName": "Samsung Galaxy S22 Ultra",
            "appium:platformVersion": "12.0",
            "appium:automationName": "UIAutomator2",
            "appium:app": "bs://9bdb3f74ee696c3b33033b5f7ceedfc2ce8d7256",
          },
        ]
      : [
          {
            platformName: "iOS",
            "appium:deviceName": "iPhone 15",
            "appium:platformVersion": "17",
            "appium:automationName": "XCUITest",
            "appium:app": "bs://ea0c67060899e253a543f209581cc2d3ab59f162",
          },
        ],
  commonCapabilities: {
    "bstack:options": {
      projectName: "BrowserStack EBAC",
      buildName: "browserstack build",
      sessionName: `Test ${process.env.PLATFORM}`,
    },
  },
  ...generalConf,
};
