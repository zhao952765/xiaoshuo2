import { useState } from 'react';
import { Character } from '../types';
import { useProjectStore } from '../store/projectStore';

export default function RoleCardEditor({ character, onSave }: { character?: Character; onSave: (char: Character) => void }) {
  const [char, setChar] = useState<Character>(character || {
    id: '',
    name: '',
    age: 20,
    appearance: '',
    personality: '',
    nsfw: {
      role: '可攻可受',
      experience: '',
      kinks: [],
      sensitivePoints: [],
      climaxStyle: '',
      playList: []
    },
    relationships: {}
  });

  const addKink = () => {
    const kink = prompt("新增性癖标签：");
    if (kink) setChar(prev => ({...prev, nsfw: {...prev.nsfw, kinks: [...prev.nsfw.kinks, kink]}}));
  };

  const removeKink = (index: number) => {
    setChar(prev => ({
      ...prev,
      nsfw: {
        ...prev.nsfw,
        kinks: prev.nsfw.kinks.filter((_, i) => i !== index)
      }
    }));
  };

  return (
    <div className="bg-[#1A1A22] p-8 rounded-3xl max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-[#FF4D94]">角色卡编辑器</h2>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <label className="block text-sm text-gray-400 mb-2">姓名</label>
          <input
            value={char.name}
            onChange={e => setChar({...char, name: e.target.value})}
            className="w-full bg-[#272732] p-4 rounded-2xl mb-6 focus:outline-none focus:ring-2 focus:ring-[#FF4D94]/50"
          />

          <label className="block text-sm text-gray-400 mb-2">年龄（必须 ≥18）</label>
          <input
            type="number" min="18"
            value={char.age}
            onChange={e => setChar({...char, age: parseInt(e.target.value) || 18})}
            className="w-full bg-[#272732] p-4 rounded-2xl mb-6 focus:outline-none focus:ring-2 focus:ring-[#FF4D94]/50"
          />

          <label className="block text-sm text-gray-400 mb-2">外貌描写（建议1200字+）</label>
          <textarea
            value={char.appearance}
            onChange={e => setChar({...char, appearance: e.target.value})}
            className="w-full h-48 bg-[#272732] p-4 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-[#FF4D94]/50"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">性格心理</label>
          <textarea
            value={char.personality}
            onChange={e => setChar({...char, personality: e.target.value})}
            className="w-full h-48 bg-[#272732] p-4 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-[#FF4D94]/50 mb-6"
          />

          <h3 className="text-xl mb-4 text-[#FF4D94]">NSFW 属性</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">角色定位</label>
              <select
                value={char.nsfw.role}
                onChange={e => setChar({...char, nsfw: {...char.nsfw, role: e.target.value}})}
                className="w-full bg-[#272732] p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF4D94]/50"
              >
                <option>纯受</option>
                <option>纯攻</option>
                <option>可攻可受</option>
                <option>女王</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">性经验</label>
              <textarea
                value={char.nsfw.experience}
                onChange={e => setChar({...char, nsfw: {...char.nsfw, experience: e.target.value}})}
                className="w-full bg-[#272732] p-4 rounded-2xl resize-none h-20 focus:outline-none focus:ring-2 focus:ring-[#FF4D94]/50"
                placeholder="描述角色的性经验背景..."
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">性癖标签</label>
              <button onClick={addKink} className="w-full py-4 border border-dashed border-[#FF4D94] rounded-2xl text-[#FF4D94] hover:bg-[#FF4D94]/10 mb-3">
                + 添加性癖标签
              </button>
              <div className="flex flex-wrap gap-2">
                {char.nsfw.kinks.map((k, i) => (
                  <span key={i} className="bg-[#FF4D94]/20 text-[#FF4D94] px-4 py-1 rounded-full text-sm flex items-center gap-2">
                    {k}
                    <button onClick={() => removeKink(i)} className="text-white/50 hover:text-white">&times;</button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">敏感点</label>
              <input
                value={char.nsfw.sensitivePoints.join(', ')}
                onChange={e => setChar({...char, nsfw: {...char.nsfw, sensitivePoints: e.target.value.split(',').map(s => s.trim()).filter(Boolean)}})}
                className="w-full bg-[#272732] p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF4D94]/50"
                placeholder="用逗号分隔多个敏感点"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">高潮风格</label>
              <input
                value={char.nsfw.climaxStyle}
                onChange={e => setChar({...char, nsfw: {...char.nsfw, climaxStyle: e.target.value}})}
                className="w-full bg-[#272732] p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF4D94]/50"
                placeholder="如：潮吹型、颤抖型、失禁型..."
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">玩法列表</label>
              <input
                value={char.nsfw.playList.join(', ')}
                onChange={e => setChar({...char, nsfw: {...char.nsfw, playList: e.target.value.split(',').map(s => s.trim()).filter(Boolean)}})}
                className="w-full bg-[#272732] p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF4D94]/50"
                placeholder="用逗号分隔（如：捆绑, 口交, 后入...）"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => onSave(char)}
        className="mt-10 w-full bg-[#FF4D94] hover:bg-[#E63E85] py-5 rounded-2xl text-xl font-bold transition-all"
      >
        保存角色卡
      </button>
    </div>
  );
}
