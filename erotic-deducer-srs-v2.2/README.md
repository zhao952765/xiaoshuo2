# 情色推导器 SRS v2.2

>   **Sexual Romance Storyteller** · 成人情色小说 AI 辅助创作桌面工具

基于 **Electron + React + TypeScript** 构建，集成本地 LLM 推理（Ollama / LM Studio），提供从一键推导到完整写作的全流程情色小说创作体验。

---

## 目录

- [功能模块总览](#功能模块总览)
- [安装与运行](#安装与运行)
- [功能说明](#功能说明)
  - [仪表盘](#1-仪表盘-dashboard)
  - [一键推导](#2-一键推导-oneclickdeduce)
  - [编辑中心](#3-编辑中心-editcenter)
  - [写作区](#4-写作区-writingarea)
  - [润色区](#5-润色区-polisharea)
  - [AI 对话](#6-ai-对话-aidialogue)
  - [模板库](#7-模板库-templatelibrary)
- [技术架构](#技术架构)
- [接口文档](#接口文档)
  - [Store 状态管理层](#1-store-状态管理层)
  - [Electron IPC 桥接层](#2-electron-ipc-桥接层)
  - [本地 LLM 调用层](#3-本地-llm-调用层)
  - [文件系统管理层](#4-文件系统管理层)
  - [提示词系统层](#5-提示词系统层)
  - [组件层](#6-组件层)
- [数据模型](#数据模型)
- [主题系统](#主题系统)
- [开发指南](#开发指南)
- [构建与发布](#构建与发布)

---

## 功能模块总览

| 模块 | 页面路由 | 核心功能 |
|------|----------|----------|
| 仪表盘 | `dashboard` | 项目概览、统计卡片、运行日志 |
| 一键推导 | `onededuce` | 主题参数输入 → LLM 生成完整前期包 |
| 编辑中心 | `editcenter` | 故事梗概/感情线/肉欲线/章节/角色管理 |
| 写作区 | `writing` | 分章写作编辑器 |
| 润色区 | `polish` | 风格化润色（情色感官/文学化去AI味等） |
| AI 对话 | `aidialogue` | 剧情讨论/肉戏脑暴/角色模拟 |
| 模板库 | `templates` | 18 个 Prompt 模板，按分类检索和使用 |

---

## 安装与运行

### 环境要求

- Node.js ≥ 18
- 推荐本地 LLM 引擎（二选一）：
  - [Ollama](https://ollama.ai/)（默认，端口 `11434`）
  - [LM Studio](https://lmstudio.ai/)（fallback，端口 `1234`）
- 推荐模型：`qwen2.5-32b-instruct` 或任意兼容 OpenAI API 的模型

### 安装

```bash
# 克隆项目
cd erotic-deducer-srs-v2.2

# 安装依赖
npm install

# 开发模式运行
npm run dev
```

### LLM 配置

项目默认连接 `http://localhost:11434`（Ollama），自动 fallback 到 `http://localhost:1234/v1/chat/completions`（LM Studio / SillyTavern）。

如需切换模型，在 `src/renderer/src/lib/llm.ts` 中修改 `model` 参数默认值。

---

## 功能说明

### 1. 仪表盘 (Dashboard)

**路径**: `src/renderer/src/pages/Dashboard.tsx`

项目首页，展示全局状态概览：

- **统计卡片**：当前项目名 / 总字数（含目标对比）/ 章节数与角色数 / 完成度（带渐变进度条）
- **故事梗概面板**：实时显示当前项目故事梗概
- **项目信息面板**：ID / 类型 / 尺度 / 创建时间 / 最后修改 / 历史项目数
- **运行日志**：按时间倒序显示所有操作记录（等宽字体，蓝色时间戳，粉色模块标签）
- **导出按钮**：导出运行日志 (.txt) / 导出完整项目

### 2. 一键推导 (OneClickDeduce)

**路径**: `src/renderer/src/pages/OneClickDeduce.tsx`

输入主题参数 → 调用本地 LLM → 自动生成完整前期推导包 → 创建项目：

- **生成参数**：标题、类型（都市/玄幻/古代/末世/星际）、尺度（轻度/中度/重度/纯肉）、目标字数（默认 30 万）、自定义提示词
- **生成过程**：流式输出显示实时结果
- **自动加载**：生成完成后自动创建项目，从 `generateSampleData` 加载示例：
  - 故事梗概（截取 LLM 输出）
  - 情感弧线（7 个情感节点：初遇→试探→心动→波折→和解→告白→圆满）
  - 肉欲弧线（6 个肉欲节点：肌肤之亲→浴室窥视→前戏→初夜→情趣探索→极致缠绵）
  - 15 章章节目录（自动编号 + 情感进度 + 肉欲强度）
- **一键跳转**：打开编辑中心继续调整

### 3. 编辑中心 (EditCenter)

**路径**: `src/renderer/src/pages/EditCenter.tsx`

6 个 Tab 管理的核心编辑区：

| Tab | 功能 | 关联组件 |
|-----|------|----------|
| 故事梗概 | 全屏文本编辑区 | — |
| 感情线 | 情感节点时间轴可视化 | `TimelineFlow` (React Flow) |
| 肉欲线 | 肉欲节点强度曲线 | `TimelineFlow` (React Flow) |
| 章节目录 | 拖拽重排 + 编辑标题 + 删除 | `ChapterTree` (@dnd-kit) |
| 角色管理 | 角色列表 + 新建/编辑/删除 | `RoleCardEditor` |
| 关系图 | 角色关系网络（开发中） | — |

### 4. 写作区 (WritingArea)

**路径**: `src/renderer/src/pages/WritingArea.tsx`

左右分栏写作编辑器：

- **左边栏**：章节列表（显示感情进度百分比 + 肉欲强度星级）
- **右侧编辑区**：大文本域，支持章节内容书写
- **实时同步**：跟随感情线/肉欲线节点提示
- **自动保存**：`useAutoSave` Hook 每 30 秒自动持久化

### 5. 润色区 (PolishArea)

**路径**: `src/renderer/src/pages/PolishArea.tsx`

左右对比式润色工具：

- **原文区**：粘贴待润色段落 + 选择润色风格
- **润色结果区**：显示处理后结果
- **支持风格**：
  - 情色感官强化（五感全开 + 心理深度）
  - 文学化去AI味（消除机器痕迹）
  - 情绪张力提升（强化高潮铺垫）
  - 纯欲/病娇风格（特定美学风格）
- 底层关联 `buildSexScenePrompt()` 构建完整润色 Prompt

### 6. AI 对话 (AIDialogue)

**路径**: `src/renderer/src/pages/AIDialogue.tsx`

聊天式创作助手（当前为前端模拟版本）：

- 消息气泡布局（用户右对齐粉色 / AI 左对齐深色）
- 回车快捷发送
- 场景：剧情讨论、肉戏脑暴、角色调整、设定修改

### 7. 模板库 (TemplateLibrary)

**路径**: `src/renderer/src/pages/TemplateLibrary.tsx`

18 个专业 Prompt 模板，按 7 类分：

| 分类 | 包含模板 |
|------|----------|
| 核心生成 | 一键推导核心 Prompt |
| 角色设计 | 单角色卡生成、批量角色生成 |
| 肉戏专用 | 肉戏高细节专用、纯肉/高强度肉戏 |
| 主题模板 | NTR、调教、纯欲、黑暗堕落、催眠、时停、常识修改、强制 |
| 写作润色 | 续写专用、润色专用 |
| 规划设定 | 大纲生成、世界观设定 |
| 对话 | AI 对话系统 |

- 支持搜索和分类过滤
- 一键复制到剪贴板

---

## 技术架构

```
erotic-deducer-srs-v2.2/
├── src/
│   ├── main/                  # Electron 主进程
│   │   └── index.ts           # 窗口创建 + IPC Handlers
│   ├── preload/               # preload 桥接层
│   │   ├── index.ts           # contextBridge 暴露 API
│   │   └── index.d.ts         # ElectronAPI 类型声明
│   ├── types/                 # 共享类型
│   │   └── index.ts
│   └── renderer/              # 渲染进程（React）
│       ├── index.html
│       ├── src/
│       │   ├── App.tsx                    # 应用入口 + 路由
│       │   ├── main.tsx                   # React 挂载
│       │   ├── index.css                  # Tailwind + 主题变量
│       │   ├── pages/                     # 7 个页面组件
│       │   │   ├── Dashboard.tsx
│       │   │   ├── OneClickDeduce.tsx
│       │   │   ├── EditCenter.tsx
│       │   │   ├── WritingArea.tsx
│       │   │   ├── PolishArea.tsx
│       │   │   ├── AIDialogue.tsx
│       │   │   └── TemplateLibrary.tsx
│       │   ├── components/               # 共享组件
│       │   │   ├── Sidebar.tsx           # 侧边导航栏
│       │   │   ├── ExportMenu.tsx         # 导出菜单
│       │   │   ├── ChapterTree.tsx        # 章节拖拽树
│       │   │   ├── RoleCardEditor.tsx     # 角色卡编辑器
│       │   │   └── TimelineFlow.tsx       # 时间轴流程图
│       │   ├── store/                    # Zustand 状态管理
│       │   │   ├── projectStore.ts        # 核心项目状态
│       │   │   └── themeStore.ts          # 主题状态
│       │   └── lib/                      # 工具函数
│       │       ├── llm.ts                # 本地 LLM 调用
│       │       ├── projectFS.ts          # 项目文件系统
│       │       └── prompts.ts            # 提示词加载
│       └── prompts.json                  # Prompt 库（18个模板）
├── package.json
├── electron.vite.config.ts
├── tailwind.config.js
└── tsconfig.json / tsconfig.web.json / tsconfig.node.json
```

---

## 接口文档

### 1. Store 状态管理层

基于 **Zustand**（v4.5+），三个独立的 Store：

#### useProjectStore (`src/renderer/src/store/projectStore.ts`)

核心业务状态，管理当前项目、角色、章节、弧线、日志。

**状态**:

| 字段 | 类型 | 说明 |
|------|------|------|
| `currentProject` | `Project \| null` | 当前正在编辑的项目 |
| `projects` | `Project[]` | 历史项目列表 |
| `characters` | `Character[]` | 当前项目角色列表 |
| `chapters` | `Chapter[]` | 当前项目章节列表 |
| `emotionArc` | `EmotionArc \| null` | 情感发展弧线 |
| `lustArc` | `LustArc \| null` | 肉欲线规划 |
| `overview` | `string` | 故事梗概 |
| `logs` | `LogEntry[]` | 运行日志（上限 200 条） |

**操作方法**:

| 方法 | 参数 | 说明 |
|------|------|------|
| `createNewProject(params)` | `{title?, type?, scale?, targetWords?, chapterCount?}` | 创建新项目 + 自动生成示例弧线 + 15章骨架 |
| `setCurrentProject(project)` | `Project` | 切换当前项目 |
| `addLog(action, module, details?)` | `string, string, string?` | 添加运行日志 |
| `updateOverview(text)` | `string` | 更新故事梗概 + 自动记日志 |
| `setEmotionArc(arc)` | `EmotionArc` | 更新情感弧线 |
| `setLustArc(arc)` | `LustArc` | 更新肉欲弧线 |
| `addCharacter(char)` | `Character` | 添加角色 + 自动保存 |
| `updateCharacter(char)` | `Character` | 更新角色 + 自动保存 |
| `deleteCharacter(id)` | `string` | 删除角色 + 自动保存 |
| `updateChapter(chapter)` | `Chapter` | 更新章节内容 + 自动保存 |
| `deleteChapter(id)` | `string` | 删除章节 + 自动保存 |
| `addChapter(chapter)` | `Chapter` | 新增章节 + 自动保存 |
| `loadProjects()` | — | 加载历史项目（electron-store → localStorage 回退） |
| `saveProject()` | — | 保存全部状态到持久化层 + 同步磁盘文件 |

**Hook**: `useAutoSave()` — 每 30 秒自动调用 `saveProject()`

#### useThemeStore (`src/renderer/src/store/themeStore.ts`)

**状态**:

| 字段 | 类型 | 说明 |
|------|------|------|
| `theme` | `'dark' \| 'pink-desire'` | 当前主题 |

**操作方法**:

| 方法 | 说明 |
|------|------|
| `toggleTheme()` | 切换主题（dark ↔ pink-desire），自动持久化到 localStorage key `srs-theme` |
| `setTheme(theme)` | 强制设置主题 |

**主题变量**:
- `dark`（深色模式）：背景 `#0F0F12`，主色 `#FF4D94`
- `pink-desire`（粉欲模式）：背景 `#FFF0F5`，主色 `#FF1493`

---

### 2. Electron IPC 桥接层

通过 `contextBridge.exposeInMainWorld('electronAPI', ...)` 暴露三个 API 命名空间：

#### `window.electronAPI.store` — electron-store 持久化

| 方法 | 参数 | 返回 |
|------|------|------|
| `get(key)` | `string` | `Promise<any>` |
| `set(key, data)` | `string, any` | `Promise<void>` |
| `delete(key)` | `string` | `Promise<void>` |

#### `window.electronAPI.file` — 文件系统读写

| 方法 | 参数 | 返回 |
|------|------|------|
| `save(content, path)` | `string, string` | `Promise<{success, path?}>` |
| `read(path)` | `string` | `Promise<string \| null>` |

#### `window.electronAPI.window` — 窗口控制

| 方法 | 说明 |
|------|------|
| `minimize()` | 最小化窗口 |
| `maximize()` | 最大化/还原窗口 |
| `close()` | 关闭窗口 |
| `isMaximized()` | `Promise<boolean>` 是否已最大化 |

---

### 3. 本地 LLM 调用层

**`src/renderer/src/lib/llm.ts`**

支持兼容 OpenAI 接口的本地推理引擎，双协议自动回退：

#### `callLocalLLM(prompt, onStream?, options?)`

| 参数 | 类型 | 说明 |
|------|------|------|
| `prompt` | `string` | 发送给 LLM 的提示词 |
| `onStream` | `(chunk: string) => void` | 流式回调，每次传入完整的累积文本 |
| `options.model` | `string` | 模型名，默认 `qwen2.5-32b-instruct` |
| `options.temperature` | `number` | 温度，默认 `0.85` |

**调用流程**:

1. 优先调用 **Ollama** (`POST http://localhost:11434/api/generate`) — 流式 JSON 行
2. 若失败，自动 fallback 到 **LM Studio / SillyTavern** (`POST http://localhost:1234/v1/chat/completions`) — SSE 流式
3. 两者均失败 → 返回 `"本地 LLM 连接失败，请确保 Ollama 或 LM Studio 已启动并加载模型。"`

#### `callLocalLLMSync(prompt, options?)`

非流式版本，返回 `Promise<string>`，内部调用 `callLocalLLM` 但不传回调。

---

### 4. 文件系统管理层

**`src/renderer/src/lib/projectFS.ts`**

#### `createProjectFolder(project)`

创建项目在磁盘上的文件夹结构，返回路径映射。

#### `saveProjectToDisk(project)`

保存完整项目（7 个文件并行写入）：

| 文件名 | 路径 | 内容 |
|--------|------|------|
| `manifest.json` | `./projects/{id}/` | 项目元数据 |
| `story_overview.md` | `./projects/{id}/` | 故事梗概 |
| `emotion_arc.json` | `./projects/{id}/` | 情感弧线 |
| `lust_arc.json` | `./projects/{id}/` | 肉欲弧线 |
| `outline.json` | `./projects/{id}/` | 章节列表 |
| `characters.json` | `./projects/{id}/` | 角色列表 |
| `logs.json` | `./projects/{id}/` | 最近 50 条日志 |

浏览器环境自动回退到 `localStorage` (`srs-project-{id}`)。

#### `loadProjectFromDisk(projectId)`

反向加载完整项目，读取 6 个文件（manifest/overview/emotionArc/lustArc/outline/characters），支持 localStorage 回退。

#### `generateSampleData(projectId)`

生成默认的两条弧线示例数据：

- **情感弧线**：7 个节点（初遇→试探→心动→波折→和解→告白→圆满），强度逐渐递增 4→10
- **肉欲弧线**：6 个节点（肌肤之亲→浴室窥视→前戏→初夜→情趣探索→极致缠绵），强度 4→10，含详细标签和位置百分比

---

### 5. 提示词系统层

**`src/renderer/src/lib/prompts.ts`** + **`prompts.json`**

#### `globalEthics`

全局伦理约束 Prompt，注入所有生成的头部。包含：年龄声明、禁止真实人物、黑/白名单规则、文学性要求。

#### `promptLibrary`

18 个 Prompt 模板数组，每项包含：

| 字段 | 说明 |
|------|------|
| `id` | 唯一标识（如 `oneClickDeduce`, `sexScene`, `NTR`） |
| `name` | 中文名称 |
| `category` | 分类（`core` / `character` / `erotic` / `theme` / `writing` / `planning` / `chat`） |
| `tags` | 标签数组 |
| `content` | Prompt 正文 |

#### `getPromptById(id)`

按 ID 查找单个模板。

#### `buildOneClickPrompt(userParams)`

构建一键推导完整 Prompt = `globalEthics + oneClickDeduce模板 + 用户参数JSON`。

#### `buildSexScenePrompt()`

构建肉戏专用 Prompt = `globalEthics + sexScene模板`。

---

### 6. 组件层

#### Sidebar (`src/renderer/src/components/Sidebar.tsx`)

侧边导航栏，7 个导航项 + 主题切换 + 隐私声明。

| 属性 | 类型 | 说明 |
|------|------|------|
| `activePage` | `string` | 当前激活页面 ID |
| `setActivePage` | `(id: string) => void` | 页面切换回调 |

#### ExportMenu (`src/renderer/src/components/ExportMenu.tsx`)

导出按钮组，依赖 `useProjectStore`。

| 方法 | 说明 |
|------|------|
| `exportLogs()` | 导出运行日志为 `.txt` 文件（Blob 下载） |
| `exportProject()` | 导出完整项目（当前为 alert 占位） |

#### ChapterTree (`src/renderer/src/components/ChapterTree.tsx`)

基于 `@dnd-kit` 的拖拽章节列表：

- 拖拽重排序（自动重新编号）
- 内联编辑标题
- 删除章节（自动重新编号）
- 新增按钮（尾部追加）

#### RoleCardEditor (`src/renderer/src/components/RoleCardEditor.tsx`)

角色卡编辑弹窗，支持完整 NSFW 属性：

| 属性 | 类型 | 说明 |
|------|------|------|
| `character` | `Character \| undefined` | 编辑模式传角色对象，新建模式传 undefined |
| `onSave` | `(char: Character) => void` | 保存回调 |

编辑字段：姓名、年龄（≥18）、外貌描写、性格心理、NSFW属性（角色定位/性经验/性癖标签/敏感点/高潮风格/玩法列表）。

#### TimelineFlow (`src/renderer/src/components/TimelineFlow.tsx`)

基于 React Flow 的时间轴可视化：

| 属性 | 说明 |
|------|------|
| `type` | `'emotion' \| 'lust'` — 决定节点样式 |
| `data` | `EmotionArc \| LustArc` — 弧线数据 |
| `onChange` | 节点变更回调 |

- 情感节点：粉色边框，显示章节 + 强度进度条
- 肉欲节点：粉色背景，显示章节 + 星级 + 标签

---

## 数据模型

**`src/renderer/src/types/index.ts`** 中定义的 7 个核心类型：

### Project

```typescript
interface Project {
  id: string;
  title: string;
  type: string;             // 小说类型（都市/玄幻/古代等）
  scale: '轻度' | '中度' | '重度' | '纯肉';
  targetWords: number;      // 目标字数量
  createdAt: string;        // ISO 时间戳
  lastModified: string;
  completion: number;       // 0-100
  totalWords: number;       // 当前总字数
}
```

### Chapter

```typescript
interface Chapter {
  id: string;
  number: number;
  title: string;
  content: string;           // 正文
  emotionProgress: number;   // 0-100，情感进度百分比
  lustIntensity: number;     // 1-10 肉欲强度
  lastModified?: string;
}
```

### EmotionArc / EmotionPoint

```typescript
interface EmotionPoint {
  id: string;
  chapter: number;           // 对应章节号
  title: string;             // 节点标题（如"初遇"）
  description: string;       // 描述
  intensity: number;         // 1-10
  characters: string[];      // 涉及角色名
}

interface EmotionArc {
  id: string;
  title: string;
  points: EmotionPoint[];
}
```

### LustArc / LustPoint

```typescript
interface LustPoint {
  id: string;
  chapter: number;
  sceneTitle: string;        // 场景标题
  description: string;
  intensity: number;         // 1-10
  characters: string[];
  tags: string[];            // 标签（如["亲吻","插入"]）
  position: number;          // 0-100，章节内位置百分比
}

interface LustArc {
  id: string;
  title: string;
  points: LustPoint[];
}
```

### Character

```typescript
interface Character {
  id: string;
  name: string;
  age: number;
  avatar?: string;
  appearance: string;        // 1200+ 字外貌描写
  personality: string;       // 性格心理描述
  nsfw: {
    role: string;            // 攻/受/可攻可受/女王
    experience: string;      // 性经验背景
    kinks: string[];         // 性癖标签列表
    sensitivePoints: string[]; // 敏感点
    climaxStyle: string;     // 高潮特征
    playList: string[];      // 玩法列表
  };
  relationships: Record<string, string>; // 关系网 {角色名: 关系描述}
}
```

### LogEntry

```typescript
type LogEntry = {
  time: string;      // ISO 时间戳
  action: string;    // 操作描述
  module: string;    // 所属模块（如"一键推导"、"角色管理"）
  details?: string;  // 可选的详细信息
};
```

---

## 主题系统

### 暗色模式 (dark)

| CSS 变量 | 值 |
|----------|-----|
| `--color-bg` | `#0F0F12` |
| `--color-surface` | `#1A1A22` |
| `--color-primary` | `#FF4D94` |

### 粉欲模式 (pink-desire)

| CSS 变量 | 值 |
|----------|-----|
| `--color-bg` | `#FFF0F5` |
| `--color-surface` | `#FFE4EC` |
| `--color-primary` | `#FF1493` |

主题通过 `data-theme` 属性切换，所有组件使用 CSS 变量实现自动适配。主题选择持久化在 `localStorage('srs-theme')`。

---

## 开发指南

### 目录结构约定

```
src/renderer/src/
├── pages/          # 页面级组件（每个文件一个页面）
├── components/     # 共享可复用组件
├── store/          # Zustand Store
├── lib/            # 纯函数工具库（无 React 依赖）
└── types/          # TypeScript 类型定义
```

### 添加新页面

1. 在 `pages/` 下创建组件（默认导出）
2. 在 `App.tsx` 的 `pages` 注册表中添加
3. 在 `Sidebar.tsx` 的 `navItems` 中添加导航项

### 持久化策略

- **Electron 环境**：使用 `electron-store`（通过 `window.electronAPI.store`）
- **浏览器环境**：自动回退到 `localStorage`
- **项目文件系统**：通过 `window.electronAPI.file`（Node.js `fs-extra`）写入 `./projects/` 目录
- **自动保存**：`useAutoSave` Hook 每 30 秒触发一次

### 事件系统

页面间导航使用自定义 DOM 事件：

```typescript
window.dispatchEvent(new CustomEvent('navigate', { detail: 'editcenter' }));
```

一键推导页面生成完成后，通过此机制跳转到编辑中心。

---

## 构建与发布

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 打包分发
npm run pack
```

构建配置：

- **打包工具**：`electron-builder`
- **构建工具**：`electron-vite`
- **渲染进程**：Vite + React + TypeScript
- **CSS**：Tailwind CSS v3
- **入口**：`out/main/index.js` (主进程)，`out/renderer/index.html` (渲染进程)

---

## 依赖清单

| 运行时依赖 | 用途 |
|------------|------|
| `zustand` | 状态管理 |
| `reactflow` | 弧线时间轴可视化 |
| `@dnd-kit/*` | 章节拖拽排序 |
| `lucide-react` | 图标库 |
| `date-fns` | 日期格式化 |
| `uuid` | 唯一 ID 生成 |
| `electron-store` | Electron 持久化存储 |
| `fs-extra` | 增强文件系统操作 |
| `@tiptap/*` | 富文本编辑器（预留） |
| `react-markdown` | Markdown 渲染 |

| 开发依赖 | 用途 |
|----------|------|
| `electron` + `electron-vite` + `electron-builder` | Electron 开发/构建 |
| `React 18` + `TypeScript` | 前端框架 |
| `Tailwind CSS` + `PostCSS` + `Autoprefixer` | CSS 框架 |

---

> **隐私声明**：所有数据在本地运行，LLM 调用仅连接本地端口（localhost），不会将任何数据发送到外部服务器。
