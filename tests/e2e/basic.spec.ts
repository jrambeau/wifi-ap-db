import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  
  // Check title
  await expect(page).toHaveTitle(/Wi-Fi Access Point Database/);
  
  // Check main heading
  await expect(page.locator('h1')).toContainText('Wi-Fi Access Point Database');
  
  // Check author link
  await expect(page.locator('text=by Jonathan Rambeau')).toBeVisible();
});

test('search functionality', async ({ page }) => {
  await page.goto('/');
  
  // Wait for data to load
  await page.waitForSelector('table', { timeout: 10000 });
  
  // Enter search query in the input field
  const searchInput = page.locator('.search-input__field');
  await searchInput.fill('Aruba');
  
  // Wait a bit for filtering
  await page.waitForTimeout(500);
  
  // Check that table still has rows (filtered results)
  const rows = page.locator('tbody tr');
  await expect(rows).not.toHaveCount(0);
});

test('comparison workflow', async ({ page }) => {
  await page.goto('/');
  
  // Wait for table to load
  await page.waitForSelector('table', { timeout: 10000 });
  
  // First, enable selection mode by clicking the "Select" button
  const selectModeButton = page.locator('button:has-text("Select")').first();
  await selectModeButton.click();
  
  // Now click on a table row to select an AP (table should be in selectable mode)
  const firstRow = page.locator('tbody tr').first();
  await firstRow.click();
  
  // Click on the Compare button that appears after selection
  const compareButton = page.locator('button:has-text("Compare")');
  await compareButton.click();
  
  // Check compare view is visible
  await expect(page.locator('.compare-view')).toBeVisible();
  
  // Check that we have the comparison title
  await expect(page.locator('text=Compare Access Points')).toBeVisible();
});
