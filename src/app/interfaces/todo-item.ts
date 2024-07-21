export interface TodoItem {
  id?: number;
  title: string;
  jiraUrl?: string;
  prUrls: string[];
  cloudForgeConsoleUrl?: string;
  releaseRequestUrl?: string;
  urlsUsedForTesting: string[];
  completed: boolean;
  oneNoteUrl?: string;
}
