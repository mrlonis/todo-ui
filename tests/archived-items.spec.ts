import { expect, test, type Response } from '@playwright/test';
import { URLS, archivedItemsFixture } from './fixtures';

test.describe('Archived Items Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(URLS.pis, (route) => route.fulfill({ json: [] }));
    await page.route(URLS.sprints, (route) => route.fulfill({ json: [] }));
  });

  test.describe('with archived items', () => {
    let archivedItemsResponse: Response;

    test.beforeEach(async ({ page }) => {
      await page.route(
        (url) => url.href === URLS.archivedItems,
        (route) => route.fulfill({ json: archivedItemsFixture }),
      );

      [archivedItemsResponse] = await Promise.all([
        page.waitForResponse((resp) => resp.url() === URLS.archivedItems),
        page.goto('/archive'),
      ]);
    });

    test('shows the "Archive" heading', async ({ page }) => {
      await expect(page.locator('h2')).toContainText('Archive');
    });

    test('renders the archived item title in the table', async ({ page }) => {
      await expect(page.getByText('Archived Task')).toBeVisible();
    });

    test('does NOT show a "Hide completed tasks" toggle', async ({ page }) => {
      await expect(page.locator('#hideCompletedTasks')).not.toBeAttached();
    });

    test('does NOT show an "Archive" column header in the table', async ({ page }) => {
      await expect(page.locator('th', { hasText: 'Archive' })).not.toBeAttached();
    });

    test('shows the correct table column headers (no archive column)', async ({ page }) => {
      await expect(page.locator('th', { hasText: 'Completed' })).toBeVisible();
      await expect(page.locator('th', { hasText: 'title' })).toBeVisible();
      await expect(page.locator('th', { hasText: 'jiraUrl' })).toBeVisible();
    });

    test('calls the ?archived=true endpoint (not hideCompleted)', () => {
      expect(archivedItemsResponse).toBeTruthy();
    });
  });

  test.describe('with no archived items', () => {
    test.beforeEach(async ({ page }) => {
      await page.route(
        (url) => url.href === URLS.archivedItems,
        (route) => route.fulfill({ json: {} }),
      );

      await Promise.all([
        page.waitForResponse((resp) => resp.url() === URLS.archivedItems),
        page.goto('/archive'),
      ]);
    });

    test('shows "No items found"', async ({ page }) => {
      await expect(page.getByText('No items found')).toBeVisible();
    });
  });
});
