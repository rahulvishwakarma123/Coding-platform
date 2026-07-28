// types/editor.ts
import { Language } from './submission';
import type { ID } from './common';

export interface EditorState {
  code: string;
  language: Language;
  theme: EditorTheme;
  fontSize: number;
  cursorPosition: CursorPosition;
  selectedText: string;
  isDirty: boolean;
  lastSaved: Date | null;
  tabs: EditorTab[];
  activeTabId: ID;
}

export enum EditorTheme {
  VS_DARK = 'vs-dark',
  VS_LIGHT = 'vs-light',
  HC_BLACK = 'hc-black',
}

export interface CursorPosition {
  line: number;
  column: number;
}

export interface EditorTab {
  id: ID;
  title: string;
  code: string;
  language: Language;
  isDirty: boolean;
}

export interface EditorConfig {
  fontSize: number;
  tabSize: number;
  wordWrap: 'on' | 'off';
  minimap: boolean;
  lineNumbers: 'on' | 'off';
  bracketPairColorization: boolean;
  automaticLayout: boolean;
  scrollBeyondLastLine: boolean;
  renderWhitespace: 'none' | 'boundary' | 'selection' | 'trailing' | 'all';
}
