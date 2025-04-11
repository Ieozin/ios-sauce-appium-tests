import { localConf } from "./local.conf.js";
import { sauceConf } from "./sauce.conf.js";
import { bsConf } from "./browserstack.conf.js";

import "dotenv/config";

function getConfig() {
  switch (process.env.ENVIRONMENT) {
    case "local":
      return localConf;
    case "saucelabs":
      return sauceConf;
    case "browserstack":
      return bsConf;
    default:
      throw new Error("Environment not configured");
  }
}

export const config = getConfig();
