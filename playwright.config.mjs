import { devices } from '@playwright/test';

const config = {
  testDir: './tests/e2e',
  reporter: 'html',
  use: {
    baseURL: 'http://127.0.0.1:4183',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'python3 server.py --port 4183',
    port: 4183,
    reuseExistingServer: true,
  },
};

export default config;
