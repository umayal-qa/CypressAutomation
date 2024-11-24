const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'zn2qwz',
  chromeWebSecurity: false,
  
  env: {
    "url": process.env.MYNTRA_URL || "https://www.myntra.com",  // Use environment variable for URL
  },

  retries: {
    runMode: 2, // Set retries for stability
    openMode: 0, // No retries in open mode (GUI)
  },

  e2e: {
    defaultCommandTimeout: 30000, // Reduced timeout for quicker feedback
    pageLoadTimeout: 120000, // Reduced page load timeout for quicker feedback
    specPattern: 'cypress/integration/**/*.spec.js', // Use glob pattern for flexibility
    setupNodeEvents(on, config) {
      // Add event listeners for plugins or custom actions if needed
      // Example: sqlServer.addCypressSQLPlugin(on, config);
    },
  },

  headers: { 
    "Accept-Encoding": "gzip, deflate" 
  },
});
