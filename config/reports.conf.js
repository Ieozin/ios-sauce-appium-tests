export let reportersConf =
  process.env.REPORT == "true"
    ? {
        reporters: [
          "spec",
          [
            "allure",
            {
              outputDir: "allure-results",
              disableWebdriverStepsReporting: true,
              disableWebdriverScreenshotsReporting: false,
            },
          ],
        ],
      }
    : {};
