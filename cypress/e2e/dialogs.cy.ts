const API = 'http://localhost:6958/api';

describe('Dialogs', () => {
  beforeEach(() => {
    cy.intercept('GET', `${API}/metadata/pis`, { fixture: 'pis' });
    cy.intercept('GET', `${API}/metadata/sprints`, { fixture: 'sprints' });
    cy.intercept('GET', `${API}/todo/itemsByPiAndBySprint?hideCompleted=true`, {
      fixture: 'todo-items-active',
    }).as('getTodoItems');
    cy.visit('/todo');
    cy.wait('@getTodoItems');
  });

  describe('Create New Task dialog', () => {
    it('opens when the "Create New Task" button is clicked', () => {
      cy.contains('button', 'Create New Task').click();
      cy.get('mat-dialog-container').should('be.visible');
    });

    it('shows the dialog title', () => {
      cy.contains('button', 'Create New Task').click();
      cy.get('mat-dialog-container').should('contain.text', 'Install Angular');
    });

    it('has a Title input, JIRA URL input, PI select, Sprint select, and Type select', () => {
      cy.contains('button', 'Create New Task').click();
      cy.get('mat-dialog-container mat-label').should('contain.text', 'Title');
      cy.get('mat-dialog-container mat-label').should('contain.text', 'JIRA URL');
      cy.get('mat-dialog-container mat-label').should('contain.text', 'PI');
      cy.get('mat-dialog-container mat-label').should('contain.text', 'Sprint');
      cy.get('mat-dialog-container mat-label').should('contain.text', 'Type');
    });

    it('closes the dialog without an API call when Cancel is clicked', () => {
      cy.contains('button', 'Create New Task').click();
      cy.get('mat-dialog-container').should('be.visible');
      cy.get('mat-dialog-container').contains('button', 'Cancel').click();
      cy.get('mat-dialog-container').should('not.exist');
    });

    it('sends a POST request and closes the dialog when Create is clicked', () => {
      cy.intercept('POST', `${API}/todo/item`, { body: { id: 99 } }).as('createItem');
      cy.intercept('GET', `${API}/todo/itemsByPiAndBySprint?hideCompleted=true`, { body: {} });

      cy.contains('button', 'Create New Task').click();
      cy.get('mat-dialog-container input').first().type('My New Task');
      cy.get('mat-dialog-container').contains('button', 'Create').click();
      cy.wait('@createItem');
      cy.get('mat-dialog-container').should('not.exist');
    });

    it('adds a PR URL field when "Add New PR URL" is clicked', () => {
      cy.contains('button', 'Create New Task').click();
      cy.get('mat-dialog-container').contains('button', 'Add New PR URL').click();
      cy.get('mat-dialog-container mat-label').should('contain.text', 'PR Url');
    });

    it('adds a testing URL field when "Add New URL Used For Testing" is clicked', () => {
      cy.contains('button', 'Create New Task').click();
      cy.get('mat-dialog-container').contains('button', 'Add New URL Used For Testing').click();
      cy.get('mat-dialog-container mat-label').should('contain.text', 'URL Used For Testing');
    });
  });

  describe('Add New PI dialog', () => {
    it('opens when the "Add New PI" button is clicked', () => {
      cy.contains('button', 'Add New PI').click();
      cy.get('mat-dialog-container').should('be.visible');
    });

    it('shows a PI input field', () => {
      cy.contains('button', 'Add New PI').click();
      cy.get('mat-dialog-container mat-label').should('contain.text', 'PI');
    });

    it('closes the dialog without updating the PI list when Cancel is clicked', () => {
      cy.contains('button', 'Add New PI').click();
      cy.get('mat-dialog-container').contains('button', 'Cancel').click();
      cy.get('mat-dialog-container').should('not.exist');
      cy.contains('p', 'PIs:').should('not.contain.text', 'PI3');
    });

    it('the Add button is disabled when the input is empty', () => {
      cy.contains('button', 'Add New PI').click();
      cy.get('mat-dialog-container').contains('button', 'Add').should('be.disabled');
    });

    it('the Add button is disabled when the PI already exists', () => {
      cy.contains('button', 'Add New PI').click();
      cy.get('mat-dialog-container').find('input').type('PI1');
      cy.get('mat-dialog-container').contains('button', 'Add').should('be.disabled');
      cy.get('mat-dialog-container').should('contain.text', 'PI already exists');
    });

    it('closes dialog and adds the new PI to the list when a valid PI is submitted', () => {
      cy.contains('button', 'Add New PI').click();
      cy.get('mat-dialog-container').find('input').type('PI3');
      cy.get('mat-dialog-container').contains('button', 'Add').should('not.be.disabled').click();
      cy.get('mat-dialog-container').should('not.exist');
      cy.contains('p', 'PIs:').should('contain.text', 'PI3');
    });
  });

  describe('Add New Sprint dialog', () => {
    it('opens when the "Add New Sprint" button is clicked', () => {
      cy.contains('button', 'Add New Sprint').click();
      cy.get('mat-dialog-container').should('be.visible');
    });

    it('shows a Sprint input field', () => {
      cy.contains('button', 'Add New Sprint').click();
      cy.get('mat-dialog-container mat-label').should('contain.text', 'Sprint');
    });

    it('closes the dialog without updating the sprint list when Cancel is clicked', () => {
      cy.contains('button', 'Add New Sprint').click();
      cy.get('mat-dialog-container').contains('button', 'Cancel').click();
      cy.get('mat-dialog-container').should('not.exist');
      cy.contains('p', 'Sprints:').should('not.contain.text', '3');
    });

    it('the Add button is disabled when the input is empty', () => {
      cy.contains('button', 'Add New Sprint').click();
      cy.get('mat-dialog-container').contains('button', 'Add').should('be.disabled');
    });

    it('the Add button is disabled when the sprint already exists', () => {
      cy.contains('button', 'Add New Sprint').click();
      cy.get('mat-dialog-container').find('input').type('1');
      cy.get('mat-dialog-container').contains('button', 'Add').should('be.disabled');
      cy.get('mat-dialog-container').should('contain.text', 'Sprint already exists');
    });

    it('closes dialog and adds the new sprint to the list when a valid sprint is submitted', () => {
      cy.contains('button', 'Add New Sprint').click();
      cy.get('mat-dialog-container').find('input').type('3');
      cy.get('mat-dialog-container').contains('button', 'Add').should('not.be.disabled').click();
      cy.get('mat-dialog-container').should('not.exist');
      cy.contains('p', 'Sprints:').should('contain.text', '3');
    });
  });
});
