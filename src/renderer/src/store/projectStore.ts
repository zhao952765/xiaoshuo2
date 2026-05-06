import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from 'react';
import type { Project, EmotionArc, LustArc, Character, Chapter, LogEntry } from '../types';
import { saveProjectToDisk } from '../lib/projectFS';

interface ProjectState {
  currentProject: Project | null;
  projects: Project[];
  characters: Character[];
  chapters: Chapter[];
  emotionArc: EmotionArc | null;
  lustArc: LustArc | null;
  overview: string;
  logs: LogEntry[];

  createNewProject: (params: any) => void;
  updateOverview: (text: string) => void;
  setEmotionArc: (arc: EmotionArc) => void;
  setLustArc: (arc: LustArc) => void;
  addCharacter: (char: Character) => void;
  updateChapter: (chapter: Chapter) => void;
  saveProject: () => Promise<void>;
  addLog: (action: string, module: string, details?: string) => void;
  loadProjects: () => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  currentProject: null,
  projects: [],
  characters: [],
  chapters: [],
  emotionArc: null,
  lustArc: null,
  overview: '',
  logs: [],

  createNewProject: (params) => {
    const newProject: Project = {
      id: uuidv4(),
      title: params.title || "新欲望项目",
      type: params.type || "都市",
      scale: params.scale || "重度",
      targetWords: params.targetWords || 300000,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      completion: 0,
      totalWords: 0,
    };

    set({
      currentProject: newProject,
      projects: [newProject, ...get().projects],
      overview: "【故事梗概】\n一位年轻女孩在都市中邂逅神秘男子，情感与欲望交织的故事...",
    });
    get().addLog("创建新项目", "一键推导");
  },

  updateOverview: (text) => set({ overview: text }),
  setEmotionArc: (arc) => set({ emotionArc: arc }),
  setLustArc: (arc) => set({ lustArc: arc }),
  addCharacter: (char) => set((state) => ({ characters: [...state.characters, char] })),
  updateChapter: (chapter) => set((state) => ({
    chapters: state.chapters.map(c => c.id === chapter.id ? chapter : c)
  })),

  saveProject: async () => {
    const state = get();
    if (state.currentProject) {
      await saveProjectToDisk(state.currentProject);
      get().addLog("项目已保存", "系统");
    }
  },

  addLog: (action, module, details) => {
    set((state) => ({
      logs: [{
        time: new Date().toISOString(),
        action,
        module,
        details
      }, ...state.logs].slice(0, 200)
    }));
  },

  loadProjects: () => {
    console.log("加载历史项目...");
  }
}));

// 自动保存 Hook
export const useAutoSave = () => {
  const saveProject = useProjectStore((state) => state.saveProject);
  useEffect(() => {
    const interval = setInterval(() => {
      saveProject();
    }, 45000);
    return () => clearInterval(interval);
  }, [saveProject]);
};
