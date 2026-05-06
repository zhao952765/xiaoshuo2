export interface ElectronAPI {
  saveFile: (content: string, filePath: string) => Promise<{ success: boolean; path?: string; error?: string }>;
  readFile: (filePath: string) => Promise<string | null>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
