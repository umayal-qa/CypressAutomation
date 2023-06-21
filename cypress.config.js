const { defineConfig } = require("cypress");
const sqlServer = require('cypress-sql-server');
module.exports = defineConfig({
  projectId: 'zn2qwz',
  env:
  {
    "url":"https://www.flipkart.com/search"
  },
  retries:
  {
    runMode: 1
  },
  e2e: {
    defaultCommandTimeout:6000,
    specPattern: 'cypress/integration/examples/*.js',
    setupNodeEvents(on, config) {
      // implement node event listeners here
  
    },
   
  },
  
});
