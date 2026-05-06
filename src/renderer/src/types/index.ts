export interface Project {
  id: string;
  title: string;
  type: string;
  scale: '轻度' | '中度' | '重度' | '纯肉';
  targetWords: number;
  createdAt: string;
  lastModified: string;
  completion: number;
  totalWords: number;
}

export interface EmotionPoint {
  id: string;
  chapter: number;
  title: string;
  description: string;
  intensity: number; // 1-10
  characters: string[];
}

export interface EmotionArc {
  id: string;
  title: string;
  points: EmotionPoint[];
}

export interface LustPoint {
  id: string;
  chapter: number;
  sceneTitle: string;
  description: string;
  intensity: number; // 1-10
  characters: string[];
  tags: string[];
  position: number; // 在章节中的位置百分比
}

export interface LustArc {
  id: string;
  title: string;
  points: LustPoint[];
}

export interface Character {
  id: string;
  name: string;
  age: number;
  avatar?: string;
  appearance: string;      // 1200+字外貌
  personality: string;
  nsfw: {
    role: string;           // 攻/受/可攻可受
    experience: string;
    kinks: string[];
    sensitivePoints: string[];
    climaxStyle: string;
    playList: string[];
  };
  relationships: Record<string, string>;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  content: string;
  emotionProgress: number;
  lustIntensity: number;
  lastModified?: string;
}

export type LogEntry = {
  time: string;
  action: string;
  module: string;
  details?: string;
};
