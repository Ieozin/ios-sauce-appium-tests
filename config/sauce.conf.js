import { generalConf } from "./general.conf.js";
export let sauceConf = {
  user: process.env.SAUCE_USERNAME,
  key: process.env.SAUCE_ACCESS_KEY,
  hostname: "ondemand.us-west-1.saucelabs.com",
  port: 443,
  baseUrl: "wd/hub",
  capabilities:
    process.env.PLATFORM === "android"
      ? [
          {
            platformName: "Android",
            "appium:app": "storage:filename=ebacshop (1).aab",
            "appium:deviceName": "Samsung.*",
            "appium:platformVersion": "10",
            "appium:automationName": "UiAutomator2",
            "appium:disableIdLocatorAutocompletion": true,
            "sauce:options": {
              build: "appium-build-teste-ebacshop-android",
              name: "Ebac Shop Teste",
              deviceOrientation: "PORTRAIT",
              appiumVersion: "2.0.0",
            },
          },
        ]
      : [
          {
            platformName: "iOS",
            "appium:app": "storage:filename=LojaEBAC.ipa",
            "appium:deviceName": "iPhone XR",
            "appium:automationName": "XCUITest",
            "sauce:options": {
              build: "appium-build-teste-ebacshop-ios",
              name: "Ebac Shop Teste",
              deviceOrientation: "PORTRAIT",
              appiumVersion: "2.0.0",
            },
          },
        ],
  ...generalConf,
};
