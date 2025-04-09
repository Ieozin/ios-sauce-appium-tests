import { localConf } from "./local.conf.cjs";
import { sauceConf } from "./sauce.conf.cjs";

import("dotenv").config();

function getConfig() {
  switch (process.env.ENVIRONMENT) {
    case "local":
      return localConf;

    case "saucelabs":
      return sauceConf;
  }
}

export const config = getConfig();
