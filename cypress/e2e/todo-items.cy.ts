const API = 'http://localhost:6958/api';

describe('Todo Items Page', () => {
  beforeEach(() => {
    cy.intercept('GET', `${API}/metadata/pis`, { fixture: 'pis' });
    cy.intercept('GET', `${API}/metadata/sprints`, { fixture: 'sprints' });
  });

  describe('with items', () => {
    beforeEach(() => {
      cy.intercept('GET', `${API}/todo/itemsByPiAndBySprint?hideCompleted=true`, {
        fixture: 'todo-items-active',
      }).as('getTodoItems');
      cy.visit('/todo');
      cy.wait('@getTodoItems');
    });

    it('shows the "TODO Items" heading', () => {
      cy.get('h2').should('contain.text', 'TODO Items');
    });

    it('shows a PI expansion panel with the correct PI name', () => {
      cy.get('mat-expansion-panel mat-panel-title').first().should('contain.text', 'PI PI1');
    });

    it('shows a Sprint expansion panel nested within the PI panel', () => {
      cy.get('mat-panel-title').should('contain.text', 'Sprint 1');
    });

    it('renders the item title in the table row', () => {
      cy.contains('Incomplete Task').should('be.visible');
    });

    it('shows the "Hide completed tasks" toggle checked by default', () => {
      cy.get('#hideCompletedTasks').should('exist');
      cy.get('#hideCompletedTasks input[type="checkbox"]').should('be.checked');
    });

    it('shows the correct table column headers', () => {
      cy.contains('th', 'Completed').should('be.visible');
      cy.contains('th', 'title').should('be.visible');
      cy.contains('th', 'jiraUrl').should('be.visible');
      cy.contains('th', 'Archive').should('be.visible');
    });

    it('shows "Add New PI", "Add New Sprint", and "Create New Task" buttons', () => {
      cy.contains('button', 'Add New PI').should('be.visible');
      cy.contains('button', 'Add New Sprint').should('be.visible');
      cy.contains('button', 'Create New Task').should('be.visible');
    });

    it('displays PI names received from the metadata API', () => {
      cy.contains('p', 'PIs:').should('contain.text', 'PI1').and('contain.text', 'PI2');
    });

    it('displays sprint numbers received from the metadata API', () => {
      cy.contains('p', 'Sprints:').should('contain.text', '1').and('contain.text', '2');
    });

    it('does not show a progress bar after items have loaded', () => {
      cy.get('mat-progress-bar').should('not.exist');
    });

    describe('row expansion', () => {
      it('clicking the expand button makes the detail panel visible', () => {
        cy.get('.example-element-detail-content').should('not.be.visible');
        cy.get('button[aria-label="expand row"]').first().click();
        cy.get('.example-element-detail-content').should('be.visible');
      });

      it('the detail panel shows item fields including jiraUrl and PR URLs', () => {
        cy.get('button[aria-label="expand row"]').first().click();
        cy.get('app-todo-item').should('contain.text', 'https://jira.com/TASK-1');
        cy.get('app-todo-item').should('contain.text', 'https://github.com/pr/1');
      });

      it('clicking the expand button a second time collapses the detail panel', () => {
        cy.get('button[aria-label="expand row"]').first().click();
        cy.get('.example-element-detail-content').should('be.visible');
        cy.get('button[aria-label="expand row"]').first().click();
        cy.get('.example-element-detail-content').should('not.be.visible');
      });
    });

    describe('hide completed toggle', () => {
      it('toggling off calls the hideCompleted=false endpoint', () => {
        cy.intercept('GET', `${API}/todo/itemsByPiAndBySprint?hideCompleted=false`, {
          fixture: 'todo-items-all',
        }).as('getTodoItemsAll');
        cy.get('#hideCompletedTasks').click();
        cy.wait('@getTodoItemsAll');
      });

      it('toggling off then back on calls the hideCompleted=true endpoint again', () => {
        cy.intercept('GET', `${API}/todo/itemsByPiAndBySprint?hideCompleted=false`, {
          body: {},
        }).as('getTodoItemsOff');
        cy.intercept('GET', `${API}/todo/itemsByPiAndBySprint?hideCompleted=true`, {
          fixture: 'todo-items-active',
        }).as('getTodoItemsOn');

        cy.get('#hideCompletedTasks').click();
        cy.wait('@getTodoItemsOff');
        cy.get('#hideCompletedTasks').click();
        cy.wait('@getTodoItemsOn');
      });

      it('toggling off shows completed items in the table', () => {
        cy.intercept('GET', `${API}/todo/itemsByPiAndBySprint?hideCompleted=false`, {
          fixture: 'todo-items-all',
        }).as('getTodoItemsAll');
        cy.get('#hideCompletedTasks').click();
        cy.wait('@getTodoItemsAll');
        cy.contains('Completed Task').should('be.visible');
      });
    });

    describe('archive action', () => {
      it('clicking the archive button sends a POST request to update the item', () => {
        cy.intercept('POST', `${API}/todo/item`, { body: { id: 1 } }).as('updateItem');
        cy.intercept('GET', `${API}/todo/itemsByPiAndBySprint?hideCompleted=true`, {
          body: {},
        });
        cy.get('button[aria-label="archive"]').first().click();
        cy.wait('@updateItem');
      });
    });

    describe('completed checkbox', () => {
      it('clicking the checkbox for an item sends a POST update request', () => {
        cy.intercept('POST', `${API}/todo/item`, { body: { id: 1 } }).as('updateItem');
        cy.intercept('GET', `${API}/todo/itemsByPiAndBySprint?hideCompleted=true`, {
          body: {},
        });
        cy.get('mat-checkbox#completed-checkbox-1').click();
        cy.wait('@updateItem');
      });
    });
  });

  describe('with no items', () => {
    beforeEach(() => {
      cy.intercept('GET', `${API}/todo/itemsByPiAndBySprint?hideCompleted=true`, {
        body: {},
      }).as('getTodoItems');
      cy.visit('/todo');
      cy.wait('@getTodoItems');
    });

    it('shows "No items found"', () => {
      cy.contains('No items found').should('be.visible');
    });

    it('shows the "Hide completed tasks" toggle even when empty', () => {
      cy.get('#hideCompletedTasks').should('exist');
    });
  });
});
