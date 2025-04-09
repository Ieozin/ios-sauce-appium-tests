import { specsConf } from "./specs.conf.js";
import { suitesConf } from "./suites.conf.js";
import { reportersConf } from "./reports.conf.js";
import { hooksConf } from "./hooks.conf.js";
export let generalConf = {
  maxInstances: 1,
  logLevel: "info",
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  framework: "mocha",
  mochaOpts: {
    ui: "bdd",
    timeout: 60000,
  },
  ...specsConf,
  ...suitesConf,
  ...reportersConf,
  ...hooksConf,
};
