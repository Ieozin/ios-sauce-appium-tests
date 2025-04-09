import { generalConf } from "./general.conf.js";
export let localConf = {
  runner: "local",
  port: 4723,
  capabilities:
    process.env.PLATFORM === "android"
      ? [
          {
            platformName: "Android",
            "appium:deviceName": "ebac-qe",
            "appium:platformVersion": "11.0",
            "appium:automationName": "UiAutomator2",
            "appium:app": `${process.cwd()}/app/ebacshop.apks`,
            "appium:appWaitActivity": ".MainActivity",
            "appium:disableIdLocatorAutocompletion": true,
          },
        ]
      : [
          {
            platformName: "iOS",
            "appium:deviceName": "iPhone 15",
            "appium:platformVersion": "17.2",
            "appium:automationName": "XCUITest",
            "appium:app": `${process.cwd()}/app/LojaEBAC-sim.app`,
          },
        ],
  ...generalConf,
};
