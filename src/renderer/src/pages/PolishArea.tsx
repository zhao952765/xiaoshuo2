import { useState } from 'react';
import { buildSexScenePrompt } from '../lib/prompts';

export default function PolishArea() {
  const [text, setText] = useState('');
  const [polished, setPolished] = useState('');
  const [style, setStyle] = useState('情色感官强化');

  const handlePolish = () => {
    // 模拟润色
    setTimeout(() => {
      setPolished(`【润色后】\n\n${text}\n\n—— 强化了五感描写、心理活动与情欲张力 ——`);
    }, 800);
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">润色区</h1>
      
      <div className="grid grid-cols-2 gap-6 h-[calc(100vh-180px)]">
        <div className="flex flex-col">
          <div className="mb-3 flex justify-between">
            <span>原文</span>
            <select value={style} onChange={e=>setStyle(e.target.value)} className="bg-[#272732] px-4 py-1 rounded-lg text-sm">
              <option>情色感官强化</option>
              <option>文学化去AI味</option>
              <option>情绪张力提升</option>
              <option>纯欲/病娇风格</option>
            </select>
          </div>
          <textarea 
            className="flex-1 bg-[#1A1A22] p-6 rounded-3xl" 
            value={text} 
            onChange={e=>setText(e.target.value)}
            placeholder="粘贴需要润色的段落..."
          />
          <button onClick={handlePolish} className="mt-4 bg-[#FF4D94] py-4 rounded-2xl font-bold">开始润色</button>
        </div>

        <div className="flex flex-col">
          <div className="mb-3">润色结果</div>
          <div className="flex-1 bg-[#1A1A22] p-6 rounded-3xl overflow-auto whitespace-pre-wrap">
            {polished || "润色结果将在这里显示..."}
          </div>
        </div>
      </div>
    </div>
  );
}
