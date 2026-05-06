import { v4 as uuidv4 } from 'uuid';
import { useProjectStore } from '../store/projectStore';
import type { Project } from '../types';

// 创建项目文件夹结构
export const createProjectFolder = async (project: Project) => {
  const projectPath = `./projects/${project.id}`;

  const manifest = {
    id: project.id,
    title: project.title,
    type: project.type,
    scale: project.scale,
    targetWords: project.targetWords,
    createdAt: project.createdAt,
    lastModified: project.lastModified,
  };

  console.log(`[FS] 项目文件夹已创建: ${projectPath}`);

  return {
    manifest,
    overviewPath: `${projectPath}/story_overview.md`,
    emotionPath: `${projectPath}/emotion_arc.json`,
    lustPath: `${projectPath}/lust_arc.json`,
    outlinePath: `${projectPath}/outline.json`,
    charactersPath: `${projectPath}/characters.json`,
    logsPath: `${projectPath}/logs.json`,
  };
};

// 保存完整项目到磁盘
export const saveProjectToDisk = async (project: Project) => {
  const basePath = `./projects/${project.id}`;
  const state = useProjectStore.getState();

  try {
    const e = (window as any).electronAPI;
    if (e?.saveFile) {
      // 并行写入所有文件
      await Promise.all([
        e.saveFile(JSON.stringify(project, null, 2), `${basePath}/manifest.json`),
        e.saveFile(state.overview || '', `${basePath}/story_overview.md`),
        e.saveFile(JSON.stringify(state.emotionArc, null, 2), `${basePath}/emotion_arc.json`),
        e.saveFile(JSON.stringify(state.lustArc, null, 2), `${basePath}/lust_arc.json`),
        e.saveFile(JSON.stringify(state.chapters, null, 2), `${basePath}/outline.json`),
        e.saveFile(JSON.stringify(state.characters, null, 2), `${basePath}/characters.json`),
        e.saveFile(JSON.stringify(state.logs.slice(0, 50), null, 2), `${basePath}/logs.json`),
      ]);
    } else {
      // 浏览器环境 fallback：保存到 localStorage
      localStorage.setItem(`srs-project-${project.id}`, JSON.stringify({
        project,
        overview: state.overview,
        emotionArc: state.emotionArc,
        lustArc: state.lustArc,
        chapters: state.chapters,
        characters: state.characters,
      }));
    }
    console.log(`✅ 项目完整保存至: ${basePath}`);
  } catch (err) {
    console.error('保存项目到磁盘失败:', err);
  }
};

// 从磁盘加载完整项目
export const loadProjectFromDisk = async (projectId: string) => {
  const basePath = `./projects/${projectId}`;

  try {
    const e = (window as any).electronAPI;
    if (e?.readFile) {
      const [manifest, overview, emotionArc, lustArc, outline, characters] = await Promise.all([
        e.readFile(`${basePath}/manifest.json`),
        e.readFile(`${basePath}/story_overview.md`),
        e.readFile(`${basePath}/emotion_arc.json`),
        e.readFile(`${basePath}/lust_arc.json`),
        e.readFile(`${basePath}/outline.json`),
        e.readFile(`${basePath}/characters.json`),
      ]);

      return {
        project: manifest ? JSON.parse(manifest) : null,
        overview: overview || '',
        emotionArc: emotionArc ? JSON.parse(emotionArc) : null,
        lustArc: lustArc ? JSON.parse(lustArc) : null,
        chapters: outline ? JSON.parse(outline) : [],
        characters: characters ? JSON.parse(characters) : [],
      };
    }
  } catch (err) {
    console.error('从磁盘加载项目失败:', err);
  }

  // localStorage fallback
  const saved = localStorage.getItem(`srs-project-${projectId}`);
  if (saved) {
    return JSON.parse(saved);
  }

  return null;
};

// 生成默认示例数据（情感弧 + 肉欲弧）
export const generateSampleData = (projectId: string) => {
  const emotionArc = {
    id: uuidv4(),
    title: "情感发展弧线",
    points: [
      {
        id: uuidv4(),
        chapter: 1,
        title: "初遇",
        description: "女主与男主初次相遇，目光交错间产生微妙好感",
        intensity: 4,
        characters: ["女主", "男主"]
      },
      {
        id: uuidv4(),
        chapter: 3,
        title: "试探",
        description: "反复接触中试探对方心意，暧昧氛围渐浓",
        intensity: 5,
        characters: ["女主", "男主"]
      },
      {
        id: uuidv4(),
        chapter: 5,
        title: "心动",
        description: "情感升温，第一次亲密接触，心跳加速",
        intensity: 7,
        characters: ["女主", "男主"]
      },
      {
        id: uuidv4(),
        chapter: 8,
        title: "波折",
        description: "误会与冲突爆发，情感陷入低谷",
        intensity: 6,
        characters: ["女主", "男主", "情敌"]
      },
      {
        id: uuidv4(),
        chapter: 10,
        title: "和解",
        description: "坦诚相见，破冰和解，感情更加坚定",
        intensity: 8,
        characters: ["女主", "男主"]
      },
      {
        id: uuidv4(),
        chapter: 12,
        title: "告白",
        description: "深层情感联结，正式确立关系",
        intensity: 9,
        characters: ["女主", "男主"]
      },
      {
        id: uuidv4(),
        chapter: 15,
        title: "圆满",
        description: "所有羁绊收束，情感线完美收官",
        intensity: 10,
        characters: ["女主", "男主"]
      },
    ]
  };

  const lustArc = {
    id: uuidv4(),
    title: "肉欲线规划",
    points: [
      {
        id: uuidv4(),
        chapter: 2,
        sceneTitle: "肌肤之亲",
        description: "不经意的肢体接触，指尖触碰引发战栗",
        intensity: 4,
        characters: ["女主", "男主"],
        tags: ["触碰", "暧昧"],
        position: 40
      },
      {
        id: uuidv4(),
        chapter: 4,
        sceneTitle: "浴室窥视",
        description: "意外的视觉冲击，窥见对方身体",
        intensity: 6,
        characters: ["女主", "男主"],
        tags: ["窥视", "裸露"],
        position: 55
      },
      {
        id: uuidv4(),
        chapter: 6,
        sceneTitle: "前戏",
        description: "精心铺垫的情欲前戏，五感交织",
        intensity: 7,
        characters: ["女主", "男主"],
        tags: ["亲吻", "抚摸", "挑逗"],
        position: 60
      },
      {
        id: uuidv4(),
        chapter: 8,
        sceneTitle: "初夜",
        description: "第一次完整结合，疼痛与快感的交织",
        intensity: 8,
        characters: ["女主", "男主"],
        tags: ["口交", "插入", "高潮", "破处"],
        position: 75
      },
      {
        id: uuidv4(),
        chapter: 11,
        sceneTitle: "情趣探索",
        description: "尝试新玩法，角色扮演与轻度束缚",
        intensity: 9,
        characters: ["女主", "男主"],
        tags: ["束缚", "角色扮演", "多体位"],
        position: 80
      },
      {
        id: uuidv4(),
        chapter: 14,
        sceneTitle: "极致缠绵",
        description: "高潮迭起的多轮激烈肉戏",
        intensity: 10,
        characters: ["女主", "男主"],
        tags: ["SM", "多轮高潮", "潮吹", "极致快感"],
        position: 90
      },
    ]
  };

  return { emotionArc, lustArc };
};
