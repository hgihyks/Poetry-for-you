export interface Poem {
  title: string;
  author: string;
  lines: string[];
  linecount: string;
}

export interface PoemAnalysis {
  mood: string;
  summary: string;
  themes: string[];
}

export enum AppState {
  IDLE = 'IDLE',
  LOADING_POEM = 'LOADING_POEM',
  ANALYZING = 'ANALYZING',
  GENERATING_IMAGE = 'GENERATING_IMAGE',
  ERROR = 'ERROR'
}
