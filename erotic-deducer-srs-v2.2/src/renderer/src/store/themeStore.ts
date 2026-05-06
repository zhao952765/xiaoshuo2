import { create } from 'zustand';

type Theme = 'dark' | 'pink-desire';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'dark',
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'dark' ? 'pink-desire' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('srs-theme', newTheme);
    return { theme: newTheme };
  }),
  setTheme: (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('srs-theme', theme);
    set({ theme });
  }
}));

// 初始化主题
const savedTheme = localStorage.getItem('srs-theme') as Theme;
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
  useThemeStore.setState({ theme: savedTheme });
}
