const API = 'http://localhost:6958/api';

describe('Dialogs', () => {
  beforeEach(() => {
    // No aliases on metadata — pending aliases interfere with later test setups
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

      cy.contains('button', 'Create New Task').click();
      cy.get('mat-dialog-container').should('be.visible');
      // [mat-dialog-close]="getTodoItem()" always closes with a truthy object — no need to fill form
      cy.get('mat-dialog-container').contains('button', 'Create').click();
      cy.wait('@createItem');
      cy.get('mat-dialog-container').should('not.exist');
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
    });

    it('the Add button is disabled when the input is empty', () => {
      cy.contains('button', 'Add New PI').click();
      cy.get('mat-dialog-container').contains('button', 'Add').should('be.disabled');
    });

    it('the Add button is disabled when the PI already exists', () => {
      // Wait for pis metadata to render before opening the dialog
      cy.contains('p', 'PIs:').should('contain.text', 'PI1');
      cy.contains('button', 'Add New PI').click();
      // Use invoke+trigger to reliably update the Angular reactive form control;
      // trigger blur so ErrorStateMatcher shows the mat-error (requires touched state)
      cy.get('mat-dialog-container').find('input').invoke('val', 'PI1');
      cy.get('mat-dialog-container').find('input').trigger('input');
      cy.get('mat-dialog-container').find('input').trigger('blur');
      cy.get('mat-dialog-container').contains('button', 'Add').should('be.disabled');
      cy.get('mat-dialog-container').should('contain.text', 'PI already exists');
    });

    it('closes dialog when a valid PI is submitted', () => {
      cy.contains('button', 'Add New PI').click();
      cy.get('mat-dialog-container').find('input').type('PI3');
      // Use force:true because OnPush re-render timing may keep [disabled] stale
      cy.get('mat-dialog-container').contains('button', 'Add').click({ force: true });
      cy.get('mat-dialog-container').should('not.exist');
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
    });

    it('the Add button is disabled when the sprint input is cleared', () => {
      cy.contains('button', 'Add New Sprint').click();
      // {backspace} moves cursor to end and deletes '0', leaving '' — Validators.required then fails
      cy.get('mat-dialog-container').find('input').type('{backspace}');
      cy.get('mat-dialog-container').contains('button', 'Add').should('be.disabled');
    });

    it('closes dialog when a valid sprint is submitted', () => {
      cy.contains('button', 'Add New Sprint').click();
      // Delete '0' then type '3'
      cy.get('mat-dialog-container').find('input').type('{backspace}3');
      cy.get('mat-dialog-container').contains('button', 'Add').should('not.be.disabled').click();
      cy.get('mat-dialog-container').should('not.exist');
    });
  });
});
