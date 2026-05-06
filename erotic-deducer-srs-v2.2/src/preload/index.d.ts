export interface ElectronAPI {
  store: {
    get: (key: string) => Promise<any>
    set: (key: string, data: any) => Promise<void>
    delete: (key: string) => Promise<void>
  }
  file: {
    save: (content: string, path: string) => Promise<{ success: boolean; path?: string }>
    read: (path: string) => Promise<string | null>
  }
  window: {
    minimize: () => void
    maximize: () => void
    close: () => void
    isMaximized: () => Promise<boolean>
  }
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
