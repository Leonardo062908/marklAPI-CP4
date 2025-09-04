const { defineConfig } = require("cypress");
module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3333",
    video: true,
    defaultCommandTimeout: 8000,
    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: false,
  },
});
