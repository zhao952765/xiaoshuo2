import { create } from 'zustand';

type Theme = 'dark' | 'pink-desire';

export const useThemeStore = create<{
  theme: Theme;
  toggleTheme: () => void;
}>((set) => ({
  theme: 'dark',
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'dark' ? 'pink-desire' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      return { theme: newTheme };
    });
  }
}));
