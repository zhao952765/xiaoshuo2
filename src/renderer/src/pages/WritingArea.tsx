import { useProjectStore } from '../store/projectStore';
import { useState, useEffect } from 'react';

export default function WritingArea() {
  const { chapters, updateChapter, currentProject } = useProjectStore();
  const [selectedChapterId, setSelectedChapterId] = useState('');
  const [content, setContent] = useState('');

  const currentChap = chapters.find(c => c.id === selectedChapterId);

  useEffect(() => {
    if (currentChap) setContent(currentChap.content);
  }, [currentChap]);

  const saveCurrentChapter = () => {
    if (!currentChap) return;
    updateChapter({ ...currentChap, content, lastModified: new Date().toISOString() });
  };

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">写作区</h1>
        <button 
          onClick={saveCurrentChapter}
          className="bg-[#FF4D94] px-8 py-3 rounded-2xl font-bold hover:bg-[#E63E85]"
        >
          保存当前章节
        </button>
      </div>

      <div className="flex-1 flex border border-[#FF4D94]/20 rounded-3xl overflow-hidden bg-[#1A1A22]">
        {/* 左侧章节列表 */}
        <div className="w-80 border-r border-[#FF4D94]/20 p-4 overflow-auto">
          <h3 className="font-semibold mb-4 text-[#FF4D94]">章节目录</h3>
          {chapters.map(chap => (
            <div
              key={chap.id}
              onClick={() => setSelectedChapterId(chap.id)}
              className={`p-4 rounded-2xl mb-3 cursor-pointer transition-all ${selectedChapterId === chap.id ? 'bg-[#FF4D94] text-black' : 'hover:bg-[#272732]'}`}
            >
              <div className="font-bold">第{chap.number}章 {chap.title}</div>
              <div className="text-xs mt-2 opacity-75">
                感情进度：{chap.emotionProgress}% | 肉欲强度：{chap.lustIntensity}★
              </div>
            </div>
          ))}
        </div>

        {/* 右侧写作区 */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-[#FF4D94]/20 bg-[#272732] flex items-center justify-between">
            <div className="font-medium">
              {currentChap ? `第${currentChap.number}章 ${currentChap.title}` : '请选择章节开始写作'}
            </div>
            <div className="text-xs text-gray-400">实时同步感情线 / 肉欲线节点提示</div>
          </div>
          
          <textarea
            className="flex-1 p-8 bg-transparent text-lg leading-relaxed resize-none focus:outline-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="在这里尽情创作... 系统会根据当前章节的感情/肉欲节点自动提供参考"
          />
        </div>
      </div>
    </div>
  );
}
