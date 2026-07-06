const API = 'http://localhost:6958/api';

function interceptTodoInit(): void {
  cy.intercept('GET', `${API}/todo/itemsByPiAndBySprint?hideCompleted=true`, {
    body: {},
  }).as('getTodoItems');
  cy.intercept('GET', `${API}/metadata/pis`, { body: [] });
  cy.intercept('GET', `${API}/metadata/sprints`, { body: [] });
}

function interceptArchiveInit(): void {
  cy.intercept('GET', `${API}/todo/itemsByPiAndBySprint?archived=true`, {
    body: {},
  }).as('getArchivedItems');
  cy.intercept('GET', `${API}/metadata/pis`, { body: [] });
  cy.intercept('GET', `${API}/metadata/sprints`, { body: [] });
}

describe('Application', () => {
  describe('Routing', () => {
    it('redirects the root path to /todo', () => {
      interceptTodoInit();
      cy.visit('/');
      cy.wait('@getTodoItems');
      cy.url().should('include', '/todo');
    });

    it('shows page-not-found for unknown routes', () => {
      cy.visit('/unknown-route', { failOnStatusCode: false });
      cy.contains('page-not-found works!').should('be.visible');
    });
  });

  describe('Navigation', () => {
    beforeEach(() => {
      interceptTodoInit();
      cy.visit('/todo');
      cy.wait('@getTodoItems');
    });

    it('shows the app title in the toolbar', () => {
      cy.get('h1.example-app-name').should('contain.text', 'TODO Items');
    });

    it('shows Home and Archive navigation links in the sidenav', () => {
      cy.get('mat-nav-list a').contains('Home').should('be.visible');
      cy.get('mat-nav-list a').contains('Archive').should('be.visible');
    });

    it('navigates to /archive when the Archive link is clicked', () => {
      interceptArchiveInit();
      cy.get('mat-nav-list a').contains('Archive').click();
      cy.wait('@getArchivedItems');
      cy.url().should('include', '/archive');
    });

    it('navigates back to /todo when the Home link is clicked from /archive', () => {
      interceptArchiveInit();
      cy.get('mat-nav-list a').contains('Archive').click();
      cy.wait('@getArchivedItems');

      interceptTodoInit();
      cy.get('mat-nav-list a').contains('Home').click();
      cy.wait('@getTodoItems');
      cy.url().should('include', '/todo');
    });
  });
});
