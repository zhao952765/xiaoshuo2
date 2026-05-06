import { Home, Zap, Edit3, PenTool, Sparkles, MessageSquare, Library, Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

const navItems = [
  { id: 'dashboard', label: '仪表盘', icon: Home },
  { id: 'onededuce', label: '一键推导', icon: Zap },
  { id: 'editcenter', label: '编辑中心', icon: Edit3 },
  { id: 'writing', label: '写作区', icon: PenTool },
  { id: 'polish', label: '润色区', icon: Sparkles },
  { id: 'aidialogue', label: 'AI 对话', icon: MessageSquare },
  { id: 'templates', label: '模板库', icon: Library },
];

export function Sidebar({ activePage, setActivePage }: any) {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="w-72 bg-[#1A1A22] border-r border-[#FF4D94]/30 flex flex-col">
      <div className="p-6 border-b border-[#FF4D94]/20">
        <h1 className="text-3xl font-bold text-[#FF4D94]">情色推导器</h1>
        <p className="text-xs text-gray-500 mt-1">SRS v2.2 • 本地运行</p>
      </div>

      <div className="flex-1 px-4 py-6 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all text-left ${
                isActive 
                  ? 'bg-[#FF4D94] text-black shadow-lg shadow-[#FF4D94]/40' 
                  : 'hover:bg-[#272732] text-gray-300'
              }`}
            >
              <Icon size={22} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-[#FF4D94]/20">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl hover:bg-[#272732]"
        >
          {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
          <span>切换主题</span>
        </button>
      </div>
    </div>
  );
}
