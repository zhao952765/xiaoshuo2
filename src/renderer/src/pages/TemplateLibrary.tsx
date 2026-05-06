import { useState } from 'react';
import { promptLibrary } from '../lib/prompts';
import { useProjectStore } from '../store/projectStore';

export default function TemplateLibrary() {
  const { addLog } = useProjectStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['all', 'core', 'character', 'erotic', 'theme', 'writing', 'planning'];

  const filteredTemplates = promptLibrary.filter(p => {
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       p.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const useTemplate = (template: any) => {
    addLog(`使用模板：${template.name}`, "模板库");
    // 可复制到剪贴板或打开AI对话
    navigator.clipboard.writeText(template.content);
    alert(`已复制模板「${template.name}」到剪贴板`);
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">模板库</h1>
      
      <div className="flex gap-4 mb-8">
        <input
          type="text"
          placeholder="搜索模板..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-[#272732] rounded-2xl px-6 py-4 focus:outline-none"
        />
        
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-[#272732] rounded-2xl px-6 py-4"
        >
          <option value="all">全部模板</option>
          <option value="core">核心生成</option>
          <option value="character">角色设计</option>
          <option value="erotic">肉戏专用</option>
          <option value="theme">主题模板</option>
          <option value="writing">写作润色</option>
          <option value="planning">规划设定</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {filteredTemplates.map((template, index) => (
          <div key={index} className="bg-[#1A1A22] border border-[#FF4D94]/20 rounded-3xl p-6 hover:border-[#FF4D94] transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">{template.name}</h3>
                <p className="text-xs text-[#FF4D94] uppercase tracking-widest">{template.category}</p>
              </div>
              <button 
                onClick={() => useTemplate(template)}
                className="opacity-0 group-hover:opacity-100 bg-[#FF4D94] text-black px-5 py-2 rounded-xl text-sm font-medium transition-all"
              >
                使用模板
              </button>
            </div>
            <p className="text-sm text-gray-400 line-clamp-4 leading-relaxed">
              {template.content.substring(0, 220)}...
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
