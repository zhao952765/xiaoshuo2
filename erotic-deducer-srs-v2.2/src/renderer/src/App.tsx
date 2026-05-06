import { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { useProjectStore, useAutoSave } from './store/projectStore';
import Dashboard from './pages/Dashboard';
import OneClickDeduce from './pages/OneClickDeduce';
import EditCenter from './pages/EditCenter';
import WritingArea from './pages/WritingArea';
import PolishArea from './pages/PolishArea';
import AIDialogue from './pages/AIDialogue';
import TemplateLibrary from './pages/TemplateLibrary';

const pages = {
  dashboard: Dashboard,
  onededuce: OneClickDeduce,
  editcenter: EditCenter,
  writing: WritingArea,
  polish: PolishArea,
  aidialogue: AIDialogue,
  templates: TemplateLibrary,
};

export default function App() {
  const [activePage, setActivePage] = useState<keyof typeof pages>('dashboard');
  const loadProjects = useProjectStore(s => s.loadProjects);
  useAutoSave();

  useEffect(() => {
    loadProjects();

    // 监听自定义导航事件（从一键推导页面触发的跳转）
    const handleNavigate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail in pages) {
        setActivePage(detail as keyof typeof pages);
      }
    };

    window.addEventListener('navigate', handleNavigate);
    return () => window.removeEventListener('navigate', handleNavigate);
  }, []);

  const CurrentPage = pages[activePage];

  return (
    <div className="flex h-screen bg-[#0F0F12] text-white overflow-hidden">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      
      <div className="flex-1 overflow-auto">
        <CurrentPage />
      </div>
    </div>
  );
}
