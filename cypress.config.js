const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
    baseUrl: 'https://math-practice-griffin.vercel.app',
    viewportWidth: 1280,
    viewportHeight: 720,
    supportFile: false,
  },
})
