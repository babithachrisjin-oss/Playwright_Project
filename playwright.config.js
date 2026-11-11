// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,

  expect: {
    timeout: 5 * 1000,
  },

  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],

  fullyParallel: true,

  use: {
    actionTimeout: 10000,
    navigationTimeout: 30000,

    headless: false,

    // Evidence collection
    screenshot: 'on',
    video: 'on',
    trace: 'retain-on-failure',

    // For Automation Capabilities Generator / TestMu execution
    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: 'Windows10-Chromium',
      use: {
        ...devices['Desktop Chrome'],
        browserName: 'chromium',
      },
    },
    {
      name: 'macOS-Firefox',
      use: {
        ...devices['Desktop Firefox'],
        browserName: 'firefox',
      },
    },
  ],
});