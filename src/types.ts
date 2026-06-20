export type BgType = 'image' | 'solid' | 'gradient' | 'dark';

export interface Shortcut {
  id: string;
  url: string;
  label: string;
  iconType?: 'favicon' | 'lucide' | 'custom';
  iconValue?: string; // lucide icon name or base64 image data
}

export interface Settings {
  name: string;
  
  // Background
  bgType: BgType;
  bgImage: string | null;
  bgSolidColor: string;
  bgGradientStart: string;
  bgGradientEnd: string;
  bgGradientDir: string;
  bgBlur: number;
  bgOverlay: number;
  
  // Clock
  clockFont: string;
  clockFontSize: number; // vw
  clockColor: string; // hex
  clockOpacity: number; // 0-100
  clock12h: boolean;
  clockSeconds: boolean;
  
  // Quotes & Greeting
  showGreeting: boolean;
  showQuote: boolean;
  customQuotes: string; // newline separated
  
  // Timer
  focusDuration: number;
  breakDuration: number;
  
  // Layout
  showShortcuts: boolean;
  showTasksBtn: boolean;
  showNotepadBtn: boolean;
  showTimerBtn: boolean;
  ambientIdleTimeout: number; // seconds
}

export const defaultSettings: Settings = {
  name: 'Stranger',
  bgType: 'dark',
  bgImage: null,
  bgSolidColor: '#0a0a0a',
  bgGradientStart: '#7432FF',
  bgGradientEnd: '#000000',
  bgGradientDir: 'to right',
  bgBlur: 0,
  bgOverlay: 50,
  clockFont: 'JetBrains Mono',
  clockFontSize: 12,
  clockColor: '#ffffff',
  clockOpacity: 90,
  clock12h: false,
  clockSeconds: false,
  showGreeting: true,
  showQuote: true,
  customQuotes: '',
  focusDuration: 25,
  breakDuration: 5,
  showShortcuts: true,
  showTasksBtn: true,
  showNotepadBtn: true,
  showTimerBtn: true,
  ambientIdleTimeout: 300, // 5 min
};

export type Mode = 'home' | 'focus' | 'ambient';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}
