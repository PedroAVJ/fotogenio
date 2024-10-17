import { test, devices } from '@playwright/test';

test.use({
  ...devices['iPhone 15'],
});

test('test', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Comenzar' }).click();
  await page.getByLabel('Toggle female').click();
  await page.getByRole('button', { name: 'Siguiente' }).click();
});
