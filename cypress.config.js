const { defineConfig } = require("cypress");
const sqlServer = require('cypress-sql-server');
module.exports = defineConfig({
  projectId: 'zn2qwz',
  chromeWebSecurity: false,
  env:
  {
    "url":"https://www.myntra.com"
  },
  headers: { "Accept-Encoding": "gzip, deflate" } ,
  retries:
  {
    runMode: 1
  },
  e2e: {
    defaultCommandTimeout:60000,
    pageLoadTimeout:600000,
    specPattern: 'cypress/integration/examples/MyntraTest.js',
    setupNodeEvents(on, config) {
      // implement node event listeners here
  
    },
   
  },
  
});
