import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from 'react';
import type { Project, EmotionArc, LustArc, Character, Chapter, LogEntry } from '../types';
import { saveProjectToDisk, generateSampleData } from '../lib/projectFS';

interface ProjectState {
  // 数据状态
  currentProject: Project | null;
  projects: Project[];
  characters: Character[];
  chapters: Chapter[];
  emotionArc: EmotionArc | null;
  lustArc: LustArc | null;
  overview: string;
  logs: LogEntry[];

  // 操作方法
  createNewProject: (params: any) => void;
  setCurrentProject: (project: Project) => void;
  addLog: (action: string, module: string, details?: string) => void;
  updateOverview: (text: string) => void;
  setEmotionArc: (arc: EmotionArc) => void;
  setLustArc: (arc: LustArc) => void;
  addCharacter: (char: Character) => void;
  updateCharacter: (char: Character) => void;
  deleteCharacter: (id: string) => void;
  updateChapter: (chapter: Chapter) => void;
  deleteChapter: (id: string) => void;
  addChapter: (chapter: Chapter) => void;

  loadProjects: () => Promise<void>;
  saveProject: () => Promise<void>;
}

const api = () => (window as any).electronAPI

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
      title: params.title || "新情色项目",
      type: params.type || "都市",
      scale: params.scale || "重度",
      targetWords: params.targetWords || 300000,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      completion: 0,
      totalWords: 0,
    };

    // 生成示例情感弧和肉欲弧数据
    const { emotionArc, lustArc } = generateSampleData(newProject.id);

    // 生成初始章节骨架
    const chapterCount = params.chapterCount || 15;
    const chapters: Chapter[] = Array.from({ length: chapterCount }, (_, i) => ({
      id: uuidv4(),
      number: i + 1,
      title: `第${i + 1}章 欲望序章`,
      content: "",
      emotionProgress: Math.min(100, (i + 1) * Math.floor(100 / chapterCount)),
      lustIntensity: 5 + Math.floor(Math.random() * 6),
      lastModified: new Date().toISOString(),
    }));

    set({
      currentProject: newProject,
      projects: [newProject, ...get().projects],
      emotionArc,
      lustArc,
      overview: "故事梗概待生成，请使用一键推导或手动编辑...",
      characters: [],
      chapters,
    });

    get().addLog("新项目创建完成", "一键推导", JSON.stringify(params));
    get().saveProject();
  },

  setCurrentProject: (project) => set({ currentProject: project }),

  addLog: (action, module, details) => {
    const logEntry: LogEntry = {
      time: new Date().toISOString(),
      action,
      module,
      details
    };
    set((state) => ({
      logs: [logEntry, ...state.logs].slice(0, 200)
    }));
  },

  updateOverview: (text) => {
    set({ overview: text });
    get().addLog("更新故事梗概", "编辑中心");
  },

  setEmotionArc: (arc) => {
    set({ emotionArc: arc });
    get().addLog("更新情感弧线", "弧线编辑");
  },

  setLustArc: (arc) => {
    set({ lustArc: arc });
    get().addLog("更新肉欲弧线", "弧线编辑");
  },

  addCharacter: (char) => {
    set((state) => ({ characters: [...state.characters, char] }));
    get().addLog(`新增角色: ${char.name}`, "角色管理");
    get().saveProject();
  },

  updateCharacter: (char) => {
    set((state) => ({
      characters: state.characters.map(c => c.id === char.id ? char : c)
    }));
    get().addLog(`更新角色: ${char.name}`, "角色管理");
    get().saveProject();
  },

  deleteCharacter: (id) => {
    const char = get().characters.find(c => c.id === id);
    set((state) => ({
      characters: state.characters.filter(c => c.id !== id)
    }));
    get().addLog(`删除角色: ${char?.name || id}`, "角色管理");
    get().saveProject();
  },

  updateChapter: (chapter) => {
    set((state) => ({
      chapters: state.chapters.map(c => c.id === chapter.id ? chapter : c)
    }));
    get().addLog("保存章节", "写作区", `第${chapter.number}章`);
    get().saveProject();
  },

  deleteChapter: (id) => {
    const chapter = get().chapters.find(c => c.id === id);
    set((state) => ({
      chapters: state.chapters.filter(c => c.id !== id)
    }));
    get().addLog(`删除章节: ${chapter?.title || id}`, "写作区");
    get().saveProject();
  },

  addChapter: (chapter) => {
    set((state) => ({ chapters: [...state.chapters, chapter] }));
    get().addLog(`新增章节: ${chapter.title}`, "写作区");
    get().saveProject();
  },

  loadProjects: async () => {
    try {
      const e = api()
      if (e?.store) {
        const saved = await e.store.get('projects')
        const projectId = await e.store.get('currentProjectId')
        if (saved) {
          set({ projects: saved })
          if (projectId) {
            const current = saved.find((p: Project) => p.id === projectId)
            if (current) set({ currentProject: current })
          }
        }
      } else {
        const saved = localStorage.getItem('srs-projects')
        if (saved) set({ projects: JSON.parse(saved) })
      }
      get().addLog("加载历史项目", "系统");
    } catch (err) {
      console.error('加载项目失败:', err)
      get().addLog("加载项目失败", "系统", String(err));
    }
  },

  saveProject: async () => {
    try {
      const { projects, currentProject } = get()
      const e = api()
      if (e?.store) {
        await e.store.set('projects', projects)
        await e.store.set('currentProjectId', currentProject?.id || null)
      } else {
        localStorage.setItem('srs-projects', JSON.stringify(projects))
      }
      // 同时保存完整项目结构到磁盘
      if (currentProject) {
        await saveProjectToDisk(currentProject);
        set({ currentProject: { ...currentProject, lastModified: new Date().toISOString() } });
      }
    } catch (err) {
      console.error('保存项目失败:', err)
    }
  }
}));

// 自动保存 Hook：每30秒自动保存当前项目
export const useAutoSave = () => {
  const { saveProject, currentProject } = useProjectStore();

  useEffect(() => {
    if (!currentProject) return;
    const interval = setInterval(() => saveProject(), 30000);
    return () => clearInterval(interval);
  }, [currentProject, saveProject]);
};
