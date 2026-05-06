import { useProjectStore } from '../store/projectStore';

const api = () => (window as any).electronAPI;

export const saveProjectToDisk = async (project: any) => {
  const e = api();
  if (!e) {
    console.warn("浏览器环境：使用 localStorage 模拟保存");
    localStorage.setItem(`project_${project.id}`, JSON.stringify(project));
    return;
  }

  const base = `projects/${project.id}`;
  const state = useProjectStore.getState();

  await e.saveFile(JSON.stringify(project, null, 2), `${base}/manifest.json`);
  await e.saveFile(state.overview, `${base}/story_overview.md`);
  await e.saveFile(JSON.stringify(state.emotionArc), `${base}/emotion_arc.json`);
  await e.saveFile(JSON.stringify(state.lustArc), `${base}/lust_arc.json`);
  await e.saveFile(JSON.stringify(state.chapters), `${base}/outline.json`);

  console.log(`✅ 项目保存成功: ${base}`);
};
