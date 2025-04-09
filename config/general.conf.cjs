import { specsConf } from "./specs.conf.cjs";
import { suitesConf } from "./suites.conf.cjs";
import { reportersConf } from "./reports.conf.cjs";
import { hooksConf } from "./hooks.conf.cjs";
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
