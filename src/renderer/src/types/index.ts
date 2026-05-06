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
  intensity: number;
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
  intensity: number;
  characters: string[];
  tags: string[];
  position: number;
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
  appearance: string;
  personality: string;
  nsfw: {
    role: string;
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
}

export interface LogEntry {
  time: string;
  action: string;
  module: string;
  details?: string;
}
