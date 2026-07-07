export const API = 'http://localhost:6958/api';

export const URLS = {
  todoItemsActive: `${API}/todo/itemsByPiAndBySprint?hideCompleted=true`,
  todoItemsAll: `${API}/todo/itemsByPiAndBySprint?hideCompleted=false`,
  archivedItems: `${API}/todo/itemsByPiAndBySprint?archived=true`,
  pis: `${API}/metadata/pis`,
  sprints: `${API}/metadata/sprints`,
  todoItem: `${API}/todo/item`,
};

export const pisFixture = ['PI1', 'PI2'];
export const sprintsFixture = [1, 2];

export const todoItemsActiveFixture = {
  PI1: {
    '1': [
      {
        id: 1,
        title: 'Incomplete Task',
        jiraUrl: 'https://jira.com/TASK-1',
        prUrls: ['https://github.com/pr/1'],
        cloudForgeConsoleUrl: 'https://cloudforge.com/1',
        releaseRequestUrl: 'https://release.com/1',
        urlsUsedForTesting: ['https://testing.com/1'],
        completed: false,
        oneNoteUrl: 'https://onenote.com/1',
        createdOn: '2024-01-01',
        completedOn: null,
        pi: 'PI1',
        sprint: 1,
        type: 'ASSIGNED',
        archived: false,
      },
    ],
  },
};

export const todoItemsAllFixture = {
  PI1: {
    '1': [
      {
        id: 1,
        title: 'Incomplete Task',
        jiraUrl: 'https://jira.com/TASK-1',
        prUrls: [],
        cloudForgeConsoleUrl: null,
        releaseRequestUrl: null,
        urlsUsedForTesting: [],
        completed: false,
        oneNoteUrl: null,
        createdOn: '2024-01-01',
        completedOn: null,
        pi: 'PI1',
        sprint: 1,
        type: 'ASSIGNED',
        archived: false,
      },
      {
        id: 2,
        title: 'Completed Task',
        jiraUrl: 'https://jira.com/TASK-2',
        prUrls: [],
        cloudForgeConsoleUrl: null,
        releaseRequestUrl: null,
        urlsUsedForTesting: [],
        completed: true,
        oneNoteUrl: null,
        createdOn: '2024-01-02',
        completedOn: '2024-01-03',
        pi: 'PI1',
        sprint: 1,
        type: 'ASSIGNED',
        archived: false,
      },
    ],
  },
};

export const archivedItemsFixture = {
  PI1: {
    '1': [
      {
        id: 3,
        title: 'Archived Task',
        jiraUrl: 'https://jira.com/TASK-3',
        prUrls: [],
        cloudForgeConsoleUrl: null,
        releaseRequestUrl: null,
        urlsUsedForTesting: [],
        completed: true,
        oneNoteUrl: null,
        createdOn: '2024-01-01',
        completedOn: '2024-01-02',
        pi: 'PI1',
        sprint: 1,
        type: 'ASSIGNED',
        archived: true,
      },
    ],
  },
};
