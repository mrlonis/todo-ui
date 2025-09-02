// @ts-check
describe('template spec', () => {
  it('passes', () => {
    cy.intercept('GET', 'http://localhost:8080/api/todo/itemsByPiAndBySprint?hideCompleted=true', {
      body: {
        '2': {
          '2': [
            {
              id: 2,
              title: 'fake 2',
              jiraUrl: '',
              prUrls: [],
              cloudForgeConsoleUrl: null,
              releaseRequestUrl: null,
              urlsUsedForTesting: [],
              completed: false,
              oneNoteUrl: null,
              createdOn: null,
              completedOn: null,
              pi: '2',
              sprint: 2,
              type: 'ASSIGNED',
              archived: false,
            },
          ],
        },
        '3': {
          '1': [
            {
              id: 3,
              title: 'fake 3',
              jiraUrl: null,
              prUrls: [],
              cloudForgeConsoleUrl: null,
              releaseRequestUrl: null,
              urlsUsedForTesting: [],
              completed: false,
              oneNoteUrl: null,
              createdOn: null,
              completedOn: null,
              pi: '3',
              sprint: 1,
              type: 'ASSIGNED',
              archived: false,
            },
          ],
        },
      },
    }).as('getItemsHideCompleted');
    cy.intercept('GET', 'http://localhost:8080/api/metadata/pis', {
      body: ['1', '3', '2'],
    }).as('getPis');
    cy.intercept('GET', 'http://localhost:8080/api/metadata/sprints', {
      body: [1, 2],
    }).as('getSprints');

    cy.visit('http://localhost:4200');

    cy.wait('@getItemsHideCompleted');
    cy.wait('@getPis');
    cy.wait('@getSprints');

    cy.intercept('GET', 'http://localhost:8080/api/todo/itemsByPiAndBySprint?hideCompleted=false', {
      body: {
        '1': {
          '1': [
            {
              id: 1,
              title: 'fake',
              jiraUrl: 'http://jira.com/fake',
              prUrls: ['http://github.com/pr/fake'],
              cloudForgeConsoleUrl: 'http://cloudforge.com/fake',
              releaseRequestUrl: 'http://release.com/fake',
              urlsUsedForTesting: ['http://testing.com/fake'],
              completed: true,
              oneNoteUrl: 'http://onenote.com/fake',
              createdOn: null,
              completedOn: null,
              pi: '1',
              sprint: 1,
              type: 'ASSIGNED',
              archived: false,
            },
          ],
        },
        '2': {
          '2': [
            {
              id: 2,
              title: 'fake 2',
              jiraUrl: '',
              prUrls: [],
              cloudForgeConsoleUrl: null,
              releaseRequestUrl: null,
              urlsUsedForTesting: [],
              completed: false,
              oneNoteUrl: null,
              createdOn: null,
              completedOn: null,
              pi: '2',
              sprint: 2,
              type: 'ASSIGNED',
              archived: false,
            },
          ],
        },
        '3': {
          '1': [
            {
              id: 3,
              title: 'fake 3',
              jiraUrl: null,
              prUrls: [],
              cloudForgeConsoleUrl: null,
              releaseRequestUrl: null,
              urlsUsedForTesting: [],
              completed: false,
              oneNoteUrl: null,
              createdOn: null,
              completedOn: null,
              pi: '3',
              sprint: 1,
              type: 'ASSIGNED',
              archived: false,
            },
          ],
        },
      },
    }).as('getItemsShowCompleted');

    cy.get('#hideCompletedTasks').click();
  });
});
