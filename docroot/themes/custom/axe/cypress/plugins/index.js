const { lighthouse, pa11y, prepareAudit } = require('cypress-audit');
const fs = require('fs');
const ReportGenerator = require("lighthouse/report/report-generator");
module.exports = (on, config) => {

  //For Filtering the tests
  require("cypress-grep/src/plugin")(config);
  on("before:browser:launch", (browser, launchOptions) => {
    // added this to handle Performance testing with Google Lighthouse
    prepareAudit(launchOptions);
    if (browser.name === 'chrome' && browser.isHeadless) {
      launchOptions.args.push('--disable-gpu');
      return launchOptions;
    }
  });

  // registering task for accessibility testing with Pa11y & logs using cypress-axe
  on("task", {
    log(message) {
      console.log(message);
      return null;
    },
    table(message) {
      console.table(message);
      return null;
    },

    // logic to generate lighthouse report
    lighthouse: lighthouse((lighthouseReport) => {
      const dirPath = './perf-reports'
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath)
      }
      const name = (lighthouseReport.lhr.configSettings.formFactor)+"-"+(lighthouseReport.lhr.requestedUrl).replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, function (x) { return '' }) + "-" + (lighthouseReport.lhr.fetchTime).split('T')[0];
      fs.writeFileSync(`${dirPath}/lh-${name}.html`, ReportGenerator.generateReport(lighthouseReport.lhr, 'html'));
    }),
    pa11y: pa11y(),
  });

  //Logic to handle Applitools-Visual Testing without APPLITOOLS_API_KEY
  if (process.env.APPLITOOLS_API_KEY) {
    config.env.APPLITOOLS_SETUP = '1';
  }
  return config;
};
require("@applitools/eyes-cypress")(module);
