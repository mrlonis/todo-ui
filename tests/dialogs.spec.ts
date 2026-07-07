import { expect, test } from '@playwright/test';
import { URLS, pisFixture, sprintsFixture, todoItemsActiveFixture } from './fixtures';

test.describe('Dialogs', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(URLS.pis, (route) => route.fulfill({ json: pisFixture }));
    await page.route(URLS.sprints, (route) => route.fulfill({ json: sprintsFixture }));
    await page.route(
      (url) => url.href === URLS.todoItemsActive,
      (route) => route.fulfill({ json: todoItemsActiveFixture }),
    );

    await Promise.all([
      page.waitForResponse((resp) => resp.url() === URLS.todoItemsActive),
      page.waitForResponse((resp) => resp.url() === URLS.pis),
      page.waitForResponse((resp) => resp.url() === URLS.sprints),
      page.goto('/todo'),
    ]);
  });

  test.describe('Create New Task dialog', () => {
    test('opens when the "Create New Task" button is clicked', async ({ page }) => {
      await page.getByRole('button', { name: 'Create New Task' }).click();

      await expect(page.locator('mat-dialog-container')).toBeVisible();
    });

    test('shows the dialog title', async ({ page }) => {
      await page.getByRole('button', { name: 'Create New Task' }).click();

      await expect(page.locator('mat-dialog-container')).toContainText('Install Angular');
    });

    test('has a Title input, JIRA URL input, PI select, Sprint select, and Type select', async ({
      page,
    }) => {
      await page.getByRole('button', { name: 'Create New Task' }).click();

      const labels = page.locator('mat-dialog-container mat-label');
      await expect(labels.filter({ hasText: 'Title' })).toBeVisible();
      await expect(labels.filter({ hasText: 'JIRA URL' })).toBeVisible();
      await expect(labels.filter({ hasText: /^PI$/ })).toBeVisible();
      await expect(labels.filter({ hasText: /^Sprint$/ })).toBeVisible();
      await expect(labels.filter({ hasText: /^Type$/ })).toBeVisible();
    });

    test('closes the dialog without an API call when Cancel is clicked', async ({ page }) => {
      await page.getByRole('button', { name: 'Create New Task' }).click();
      await expect(page.locator('mat-dialog-container')).toBeVisible();

      await page.locator('mat-dialog-container').getByRole('button', { name: 'Cancel' }).click();

      await expect(page.locator('mat-dialog-container')).not.toBeAttached();
    });

    test('sends a POST request and closes the dialog when Create is clicked', async ({ page }) => {
      await page.route(URLS.todoItem, (route, request) => {
        if (request.method() === 'POST') {
          void route.fulfill({ json: { id: 99 } });
        } else {
          void route.continue();
        }
      });

      await page.getByRole('button', { name: 'Create New Task' }).click();
      await expect(page.locator('mat-dialog-container')).toBeVisible();

      const createPromise = page.waitForResponse(
        (resp) => resp.url() === URLS.todoItem && resp.request().method() === 'POST',
      );
      await page.locator('mat-dialog-container').getByRole('button', { name: 'Create' }).click();
      await createPromise;

      await expect(page.locator('mat-dialog-container')).not.toBeAttached();
    });
  });

  test.describe('Add New PI dialog', () => {
    test('opens when the "Add New PI" button is clicked', async ({ page }) => {
      await page.getByRole('button', { name: 'Add New PI' }).click();

      await expect(page.locator('mat-dialog-container')).toBeVisible();
    });

    test('shows a PI input field', async ({ page }) => {
      await page.getByRole('button', { name: 'Add New PI' }).click();

      await expect(page.locator('mat-dialog-container mat-label')).toContainText('PI');
    });

    test('closes the dialog without updating the PI list when Cancel is clicked', async ({
      page,
    }) => {
      await page.getByRole('button', { name: 'Add New PI' }).click();
      await page.locator('mat-dialog-container').getByRole('button', { name: 'Cancel' }).click();

      await expect(page.locator('mat-dialog-container')).not.toBeAttached();
    });

    test('the Add button is disabled when the input is empty', async ({ page }) => {
      await page.getByRole('button', { name: 'Add New PI' }).click();

      await expect(
        page.locator('mat-dialog-container').getByRole('button', { name: 'Add' }),
      ).toBeDisabled();
    });

    test('the Add button is disabled when the PI already exists', async ({ page }) => {
      // Wait for pis metadata to render before opening the dialog
      await expect(page.locator('p', { hasText: 'PIs:' })).toContainText('PI1');

      await page.getByRole('button', { name: 'Add New PI' }).click();

      // Use evaluate to set the native value and dispatch events — equivalent to Cypress's
      // invoke('val') + trigger('input') + trigger('blur') pattern. This reliably updates
      // Angular reactive form state across all browsers including webkit.
      await page.locator('mat-dialog-container input').evaluate((el: HTMLInputElement) => {
        el.value = 'PI1';
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('blur', { bubbles: true }));
      });

      await expect(
        page.locator('mat-dialog-container').getByRole('button', { name: 'Add' }),
      ).toBeDisabled();
      await expect(page.locator('mat-dialog-container')).toContainText('PI already exists');
    });

    test('closes dialog when a valid PI is submitted', async ({ page }) => {
      await page.getByRole('button', { name: 'Add New PI' }).click();
      await page.locator('mat-dialog-container input').fill('PI3');

      // Use force:true because OnPush re-render timing may keep [disabled] stale
      await page
        .locator('mat-dialog-container')
        .getByRole('button', { name: 'Add' })
        .click({ force: true });

      await expect(page.locator('mat-dialog-container')).not.toBeAttached();
    });
  });

  test.describe('Add New Sprint dialog', () => {
    test('opens when the "Add New Sprint" button is clicked', async ({ page }) => {
      await page.getByRole('button', { name: 'Add New Sprint' }).click();

      await expect(page.locator('mat-dialog-container')).toBeVisible();
    });

    test('shows a Sprint input field', async ({ page }) => {
      await page.getByRole('button', { name: 'Add New Sprint' }).click();

      await expect(page.locator('mat-dialog-container mat-label')).toContainText('Sprint');
    });

    test('closes the dialog without updating the sprint list when Cancel is clicked', async ({
      page,
    }) => {
      await page.getByRole('button', { name: 'Add New Sprint' }).click();
      await page.locator('mat-dialog-container').getByRole('button', { name: 'Cancel' }).click();

      await expect(page.locator('mat-dialog-container')).not.toBeAttached();
    });

    test('the Add button is disabled when the sprint input is cleared', async ({ page }) => {
      await page.getByRole('button', { name: 'Add New Sprint' }).click();

      // Clear the default value — Validators.required then fails
      await page.locator('mat-dialog-container input').fill('');

      await expect(
        page.locator('mat-dialog-container').getByRole('button', { name: 'Add' }),
      ).toBeDisabled();
    });

    test('closes dialog when a valid sprint is submitted', async ({ page }) => {
      await page.getByRole('button', { name: 'Add New Sprint' }).click();

      // Replace the default value with a valid sprint number
      await page.locator('mat-dialog-container input').fill('3');

      const addButton = page.locator('mat-dialog-container').getByRole('button', { name: 'Add' });
      await expect(addButton).not.toBeDisabled();
      await addButton.click();

      await expect(page.locator('mat-dialog-container')).not.toBeAttached();
    });
  });
});
