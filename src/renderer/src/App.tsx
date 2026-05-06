import { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import OneClickDeduce from './pages/OneClickDeduce';
import EditCenter from './pages/EditCenter';
import WritingArea from './pages/WritingArea';
import PolishArea from './pages/PolishArea';
import AIDialogue from './pages/AIDialogue';
import TemplateLibrary from './pages/TemplateLibrary';
import { useProjectStore } from './store/projectStore';
import { useAutoSave } from './store/projectStore';

const pages: Record<string, React.ComponentType> = {
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
  const { loadProjects } = useProjectStore();

  useAutoSave();
  
  useEffect(() => {
    loadProjects();
  }, []);

  // 监听跨页面跳转
  useEffect(() => {
    const handleNavigate = (e: CustomEvent) => {
      if (pages[e.detail as keyof typeof pages]) {
        setActivePage(e.detail as keyof typeof pages);
      }
    };
    window.addEventListener('navigate', handleNavigate as any);
    return () => window.removeEventListener('navigate', handleNavigate as any);
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
