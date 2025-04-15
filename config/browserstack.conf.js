import { generalConf } from "./general.conf.js";

export let bsConf = {
  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,
  hostname: "hub.browserstack.com",
  capabilities: [
    {
      "bstack:options": {
        deviceName: "iPhone 15",
        platformVersion: "17",
        platformName: "iOS",
        projectName: "EBAC iOS Tests",
        buildName: "Build 1.0",
        app: "bs://f7b8a9b19318cae3a4d230bd8c254ca8878f396a",
      },
    },
  ],
  ...generalConf,
};
