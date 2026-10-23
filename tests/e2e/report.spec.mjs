import { test, expect } from '@playwright/test';

test('submit new task through UI', async ({ page }) => {
  await page.goto('/');

  await page.fill('#title-input', 'Service the Yamaha R15');
  await page.click('#submit-btn');

  const task = page.locator('.task-card').last();
  await expect(task).toContainText('Service the Yamaha R15');
  await expect(task).toContainText('[pending]');
});
