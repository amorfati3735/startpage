export interface Settings {
  name: string;
  bgImage: string | null;
  bgBlur: number;
  bgOverlay: number;
  clockFont: 'Inter' | 'Serif' | 'Monospace';
  clock12h: boolean;
  clockSeconds: boolean;
  quoteCategory: 'All' | 'Motivational' | 'Self Care';
  focusDuration: number;
  breakDuration: number;
}

export const defaultSettings: Settings = {
  name: 'Stranger',
  bgImage: null,
  bgBlur: 0,
  bgOverlay: 50,
  clockFont: 'Monospace',
  clock12h: false,
  clockSeconds: false,
  quoteCategory: 'All',
  focusDuration: 25,
  breakDuration: 5,
};

export type Mode = 'home' | 'focus' | 'ambient';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}
