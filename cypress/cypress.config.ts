import { defineConfig } from 'cypress';

export default defineConfig({
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'test-reports/cypress-junit-[hash].xml',
    toConsole: true,
  },
  viewportHeight: 1080,
  viewportWidth: 1920,

  e2e: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: '**/*.cy.ts',
  },
});
