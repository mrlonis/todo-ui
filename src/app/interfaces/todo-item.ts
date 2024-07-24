export type TodoItemType = 'ASSIGNED' | 'INNOVATION' | 'TECH_DEBT' | 'BUG' | 'OTHER';

export const TODO_ITEM_TYPES: TodoItemType[] = ['ASSIGNED', 'INNOVATION', 'TECH_DEBT', 'BUG', 'OTHER'];

export interface TodoItem {
  [key: string]: number | string | string[] | boolean | undefined;
  id?: number;
  title: string;
  jiraUrl?: string;
  prUrls: string[];
  cloudForgeConsoleUrl?: string;
  releaseRequestUrl?: string;
  urlsUsedForTesting: string[];
  completed: boolean;
  oneNoteUrl?: string;
  createdOn: string;
  pi: string;
  sprint: number;
  type: TodoItemType;
}
