import { expect, test } from '@playwright/test';
import {
  URLS,
  pisFixture,
  sprintsFixture,
  todoItemsActiveFixture,
  todoItemsAllFixture,
} from './fixtures';

test.describe('Todo Items Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(URLS.pis, (route) => route.fulfill({ json: pisFixture }));
    await page.route(URLS.sprints, (route) => route.fulfill({ json: sprintsFixture }));
  });

  test.describe('with items', () => {
    test.beforeEach(async ({ page }) => {
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

    test('shows the "TODO Items" heading', async ({ page }) => {
      await expect(page.locator('h2')).toContainText('TODO Items');
    });

    test('shows a PI expansion panel with the correct PI name', async ({ page }) => {
      await expect(page.locator('mat-expansion-panel mat-panel-title').first()).toContainText(
        'PI PI1',
      );
    });

    test('shows a Sprint expansion panel nested within the PI panel', async ({ page }) => {
      await expect(page.locator('mat-panel-title').filter({ hasText: 'Sprint 1' })).toBeVisible();
    });

    test('renders the item title in the table row', async ({ page }) => {
      await expect(page.getByText('Incomplete Task')).toBeVisible();
    });

    test('shows the "Hide completed tasks" toggle checked by default', async ({ page }) => {
      await expect(page.locator('#hideCompletedTasks')).toBeAttached();
      await expect(page.locator('#hideCompletedTasks button[role="switch"]')).toHaveAttribute(
        'aria-checked',
        'true',
      );
    });

    test('shows the correct table column headers', async ({ page }) => {
      await expect(page.locator('th', { hasText: 'Completed' })).toBeVisible();
      await expect(page.locator('th', { hasText: 'title' })).toBeVisible();
      await expect(page.locator('th', { hasText: 'jiraUrl' })).toBeVisible();
      await expect(page.locator('th', { hasText: 'Archive' })).toBeVisible();
    });

    test('shows "Add New PI", "Add New Sprint", and "Create New Task" buttons', async ({
      page,
    }) => {
      await expect(page.getByRole('button', { name: 'Add New PI' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Add New Sprint' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Create New Task' })).toBeVisible();
    });

    test('displays PI names received from the metadata API', async ({ page }) => {
      const pisText = page.locator('p', { hasText: 'PIs:' });
      await expect(pisText).toContainText('PI1');
      await expect(pisText).toContainText('PI2');
    });

    test('displays sprint numbers received from the metadata API', async ({ page }) => {
      const sprintsText = page.locator('p', { hasText: 'Sprints:' });
      await expect(sprintsText).toContainText('1');
      await expect(sprintsText).toContainText('2');
    });

    test('does not show a progress bar after items have loaded', async ({ page }) => {
      await expect(page.locator('mat-progress-bar')).not.toBeAttached();
    });

    test.describe('row expansion', () => {
      test('clicking the expand button makes the detail panel visible', async ({ page }) => {
        await expect(page.locator('.example-element-detail-content')).not.toBeVisible();
        await page.locator('button[aria-label="expand row"]').first().click();
        await expect(page.locator('.example-element-detail-content')).toBeVisible();
      });

      test('the detail panel shows item fields including jiraUrl and PR URLs', async ({ page }) => {
        await page.locator('button[aria-label="expand row"]').first().click();
        await expect(page.locator('app-todo-item')).toContainText('https://jira.com/TASK-1');
        await expect(page.locator('app-todo-item')).toContainText('https://github.com/pr/1');
      });

      test('clicking the expand button a second time collapses the detail panel', async ({
        page,
      }) => {
        await page.locator('button[aria-label="expand row"]').first().click();
        await expect(page.locator('.example-element-detail-content')).toBeVisible();
        await page.locator('button[aria-label="expand row"]').first().click();
        await expect(page.locator('.example-element-detail-content')).not.toBeVisible();
      });
    });

    test.describe('hide completed toggle', () => {
      test('toggling off calls the hideCompleted=false endpoint', async ({ page }) => {
        await page.route(
          (url) => url.href === URLS.todoItemsAll,
          (route) => route.fulfill({ json: todoItemsAllFixture }),
        );

        const responsePromise = page.waitForResponse((resp) => resp.url() === URLS.todoItemsAll);
        await page.locator('#hideCompletedTasks').click();
        await responsePromise;
      });

      test('toggling off then back on calls the hideCompleted=true endpoint again', async ({
        page,
      }) => {
        await page.route(
          (url) => url.href === URLS.todoItemsAll,
          (route) => route.fulfill({ json: {} }),
        );

        const offPromise = page.waitForResponse((resp) => resp.url() === URLS.todoItemsAll);
        await page.locator('#hideCompletedTasks').click();
        await offPromise;

        const onPromise = page.waitForResponse((resp) => resp.url() === URLS.todoItemsActive);
        await page.locator('#hideCompletedTasks').click();
        await onPromise;
      });

      test('toggling off shows completed items in the table', async ({ page }) => {
        await page.route(
          (url) => url.href === URLS.todoItemsAll,
          (route) => route.fulfill({ json: todoItemsAllFixture }),
        );

        const responsePromise = page.waitForResponse((resp) => resp.url() === URLS.todoItemsAll);
        await page.locator('#hideCompletedTasks').click();
        await responsePromise;

        await expect(page.getByRole('cell', { name: 'Completed Task', exact: true })).toBeVisible();
      });
    });

    test.describe('archive action', () => {
      test('clicking the archive button sends a POST request to update the item', async ({
        page,
      }) => {
        await page.route(URLS.todoItem, (route, request) => {
          if (request.method() === 'POST') {
            void route.fulfill({ json: { id: 1 } });
          } else {
            void route.continue();
          }
        });
        await page.route(
          (url) => url.href === URLS.todoItemsActive,
          (route) => route.fulfill({ json: {} }),
        );

        const updatePromise = page.waitForResponse(
          (resp) => resp.url() === URLS.todoItem && resp.request().method() === 'POST',
        );
        await page.locator('button[aria-label="archive"]').first().click();
        await updatePromise;
      });
    });

    test.describe('completed checkbox', () => {
      test('clicking the checkbox for an item sends a POST update request', async ({ page }) => {
        await page.route(URLS.todoItem, (route, request) => {
          if (request.method() === 'POST') {
            void route.fulfill({ json: { id: 1 } });
          } else {
            void route.continue();
          }
        });
        await page.route(
          (url) => url.href === URLS.todoItemsActive,
          (route) => route.fulfill({ json: {} }),
        );

        const updatePromise = page.waitForResponse(
          (resp) => resp.url() === URLS.todoItem && resp.request().method() === 'POST',
        );
        await page.locator('mat-checkbox#completed-checkbox-1').click();
        await updatePromise;
      });
    });
  });

  test.describe('with no items', () => {
    test.beforeEach(async ({ page }) => {
      await page.route(
        (url) => url.href === URLS.todoItemsActive,
        (route) => route.fulfill({ json: {} }),
      );

      await Promise.all([
        page.waitForResponse((resp) => resp.url() === URLS.todoItemsActive),
        page.waitForResponse((resp) => resp.url() === URLS.pis),
        page.waitForResponse((resp) => resp.url() === URLS.sprints),
        page.goto('/todo'),
      ]);
    });

    test('shows "No items found"', async ({ page }) => {
      await expect(page.getByText('No items found')).toBeVisible();
    });

    test('shows the "Hide completed tasks" toggle even when empty', async ({ page }) => {
      await expect(page.locator('#hideCompletedTasks')).toBeAttached();
    });
  });
});
