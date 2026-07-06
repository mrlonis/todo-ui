const API = 'http://localhost:6958/api';

describe('Archived Items Page', () => {
  beforeEach(() => {
    cy.intercept('GET', `${API}/metadata/pis`, { body: [] });
    cy.intercept('GET', `${API}/metadata/sprints`, { body: [] });
  });

  describe('with archived items', () => {
    beforeEach(() => {
      cy.intercept('GET', `${API}/todo/itemsByPiAndBySprint?archived=true`, {
        fixture: 'archived-items',
      }).as('getArchivedItems');
      cy.visit('/archive');
      cy.wait('@getArchivedItems');
    });

    it('shows the "Archive" heading', () => {
      cy.get('h2').should('contain.text', 'Archive');
    });

    it('renders the archived item title in the table', () => {
      cy.contains('Archived Task').should('be.visible');
    });

    it('does NOT show a "Hide completed tasks" toggle', () => {
      cy.get('#hideCompletedTasks').should('not.exist');
    });

    it('does NOT show an "Archive" column header in the table', () => {
      cy.contains('th', 'Archive').should('not.exist');
    });

    it('shows the correct table column headers (no archive column)', () => {
      cy.contains('th', 'Completed').should('be.visible');
      cy.contains('th', 'title').should('be.visible');
      cy.contains('th', 'jiraUrl').should('be.visible');
    });

    it('calls the ?archived=true endpoint (not hideCompleted)', () => {
      cy.get('@getArchivedItems').should('not.be.null');
    });
  });

  describe('with no archived items', () => {
    beforeEach(() => {
      cy.intercept('GET', `${API}/todo/itemsByPiAndBySprint?archived=true`, {
        body: {},
      }).as('getArchivedItems');
      cy.visit('/archive');
      cy.wait('@getArchivedItems');
    });

    it('shows "No items found"', () => {
      cy.contains('No items found').should('be.visible');
    });
  });
});
