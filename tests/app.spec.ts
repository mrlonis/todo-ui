import { expect, test } from '@playwright/test';
import { URLS } from './fixtures';

test.describe('App', () => {
  test('shows the application title in the document title', async ({ page }) => {
    await page.goto('');

    await expect(page).toHaveTitle(/TodoUi/);
  });

  test.describe('Routing', () => {
    test('redirects the root path to /todo', async ({ page }) => {
      await page.route(
        (url) => url.href === URLS.todoItemsActive,
        (route) => route.fulfill({ json: {} }),
      );
      await page.route(URLS.pis, (route) => route.fulfill({ json: [] }));
      await page.route(URLS.sprints, (route) => route.fulfill({ json: [] }));

      await Promise.all([
        page.waitForResponse((resp) => resp.url() === URLS.todoItemsActive),
        page.goto('/'),
      ]);

      await expect(page).toHaveURL(/\/todo/);
    });

    test('shows page-not-found for unknown routes', async ({ page }) => {
      await page.goto('/unknown-route');

      await expect(page.getByText('page-not-found works!')).toBeVisible();
    });
  });

  test.describe('Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await page.route(
        (url) => url.href === URLS.todoItemsActive,
        (route) => route.fulfill({ json: {} }),
      );
      await page.route(URLS.pis, (route) => route.fulfill({ json: [] }));
      await page.route(URLS.sprints, (route) => route.fulfill({ json: [] }));

      await Promise.all([
        page.waitForResponse((resp) => resp.url() === URLS.todoItemsActive),
        page.goto('/todo'),
      ]);

      // The sidenav starts closed — open it via the toolbar menu button
      await page.locator('mat-toolbar button').first().click();
    });

    test('shows the app title in the toolbar', async ({ page }) => {
      await expect(page.locator('h1.example-app-name')).toContainText('TODO Items');
    });

    test('shows Home and Archive navigation links in the sidenav', async ({ page }) => {
      await expect(page.locator('mat-nav-list a', { hasText: 'Home' })).toBeVisible();
      await expect(page.locator('mat-nav-list a', { hasText: 'Archive' })).toBeVisible();
    });

    test('navigates to /archive when the Archive link is clicked', async ({ page }) => {
      await page.route(
        (url) => url.href === URLS.archivedItems,
        (route) => route.fulfill({ json: {} }),
      );

      const archivePromise = page.waitForResponse((resp) => resp.url() === URLS.archivedItems);
      await page.locator('mat-nav-list a', { hasText: 'Archive' }).click();
      await archivePromise;

      await expect(page).toHaveURL(/\/archive/);
    });

    test('navigates back to /todo when the Home link is clicked from /archive', async ({
      page,
    }) => {
      await page.route(
        (url) => url.href === URLS.archivedItems,
        (route) => route.fulfill({ json: {} }),
      );

      const archivePromise = page.waitForResponse((resp) => resp.url() === URLS.archivedItems);
      await page.locator('mat-nav-list a', { hasText: 'Archive' }).click();
      await archivePromise;

      const todoPromise = page.waitForResponse((resp) => resp.url() === URLS.todoItemsActive);
      await page.locator('mat-nav-list a', { hasText: 'Home' }).click();
      await todoPromise;

      await expect(page).toHaveURL(/\/todo/);
    });
  });
});
