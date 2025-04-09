import { localConf } from "./local.conf.js";
import { sauceConf } from "./sauce.conf.js";

import "dotenv/config";

function getConfig() {
  switch (process.env.ENVIRONMENT) {
    case "local":
      return localConf;
    case "saucelabs":
      return sauceConf;
    case "browserstack":
      return bsConf;
  }
}

export const config = getConfig();
