import { Home, Zap, Edit3, PenTool, Sparkles, MessageSquare, Library, Palette } from 'lucide-react';
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
    <div className="w-64 bg-[#1A1A22] border-r border-[#FF4D94]/20 flex flex-col">
      <div className="p-6 border-b border-[#FF4D94]/20">
        <h1 className="text-2xl font-bold text-[#FF4D94]">情色推导器</h1>
        <p className="text-xs text-gray-500">SRS v2.2</p>
      </div>

      <div className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive 
                ? 'bg-[#FF4D94] text-white shadow-lg shadow-[#FF4D94]/30' 
                : 'hover:bg-[#272732] text-gray-300'}`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* 底部：主题切换 + 隐私声明 */}
      <div className="p-4 border-t border-[#FF4D94]/20 space-y-3">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#272732] text-gray-300 transition-all"
        >
          <Palette size={20} />
          <span className="text-sm">{theme === 'dark' ? '粉欲模式' : '暗色模式'}</span>
        </button>
        <div className="text-xs text-gray-500 text-center">
          本地运行 • 完全隐私
        </div>
      </div>
    </div>
  );
}
