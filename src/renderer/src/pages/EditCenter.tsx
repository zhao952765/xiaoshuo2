import { useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import TimelineFlow from '../components/TimelineFlow';
import ChapterTree from '../components/ChapterTree';
import RoleCardEditor from '../components/RoleCardEditor';
import { Character } from '../types';
import { Save, Users, Trash2 } from 'lucide-react';

export default function EditCenter() {
  const {
    currentProject,
    overview,
    emotionArc,
    lustArc,
    characters,
    updateOverview,
    addCharacter,
    saveProject,
    addLog
  } = useProjectStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'emotion' | 'lust' | 'outline' | 'characters' | 'relations'>('overview');
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [showRoleEditor, setShowRoleEditor] = useState(false);

  const handleSaveAll = () => {
    saveProject();
    addLog("手动保存全部编辑内容", "编辑中心");
  };

  const openRoleEditor = (char?: Character) => {
    setEditingCharacter(char || null);
    setShowRoleEditor(true);
  };

  const handleRoleSave = (char: Character) => {
    if (!char.id) {
      char.id = Date.now().toString();
      addCharacter(char);
    } else {
      // 直接更新 store 中的角色
      const state = useProjectStore.getState();
      const updated = state.characters.map(c => c.id === char.id ? char : c);
      useProjectStore.setState({ characters: updated });
      addLog(`更新角色卡: ${char.name}`, "角色管理");
    }
    setShowRoleEditor(false);
    setEditingCharacter(null);
    addLog(`保存角色卡: ${char.name}`, "角色管理");
  };

  const handleDeleteCharacter = (char: Character) => {
    if (window.confirm(`确定要删除角色 "${char.name}" 吗？此操作不可恢复。`)) {
      const state = useProjectStore.getState();
      const filtered = state.characters.filter(c => c.id !== char.id);
      useProjectStore.setState({ characters: filtered });
      addLog(`删除角色: ${char.name}`, "角色管理");
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0F0F12]">
      {/* 顶部栏 */}
      <div className="border-b border-[#FF4D94]/20 px-8 py-5 flex items-center justify-between bg-[#1A1A22]">
        <div>
          <h1 className="text-4xl font-bold text-[#FF4D94]">{currentProject?.title || "编辑中心"}</h1>
          <p className="text-gray-400 text-sm">管理故事核心：梗概 · 情感 · 肉欲 · 章节 · 角色</p>
        </div>
        <button
          onClick={handleSaveAll}
          className="flex items-center gap-2 bg-[#FF4D94] hover:bg-[#E63E85] px-8 py-3 rounded-2xl font-bold transition-all"
        >
          <Save size={20} /> 保存全部
        </button>
      </div>

      {/* Tab 导航 */}
      <div className="px-8 pt-6 flex gap-2 border-b border-[#FF4D94]/20 bg-[#1A1A22]">
        {[
          { key: 'overview', label: '故事梗概' },
          { key: 'emotion', label: '感情线' },
          { key: 'lust', label: '肉欲线' },
          { key: 'outline', label: '章节目录' },
          { key: 'characters', label: '角色管理' },
          { key: 'relations', label: '关系图' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-8 py-4 rounded-t-2xl font-medium transition-all ${activeTab === tab.key 
              ? 'bg-[#FF4D94] text-black' 
              : 'hover:bg-[#272732] text-gray-300'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-auto p-8">
        {activeTab === 'overview' && (
          <textarea
            className="w-full h-full bg-[#1A1A22] p-8 rounded-3xl text-lg leading-relaxed resize-none focus:outline-none border border-[#FF4D94]/30"
            value={overview}
            onChange={(e) => updateOverview(e.target.value)}
            placeholder="在这里编辑完整故事梗概..."
          />
        )}

        {activeTab === 'emotion' && (
          <div className="h-[calc(100vh-220px)]">
            <h3 className="text-2xl mb-4">感情线时间轴</h3>
            <TimelineFlow type="emotion" data={emotionArc} />
          </div>
        )}

        {activeTab === 'lust' && (
          <div className="h-[calc(100vh-220px)]">
            <h3 className="text-2xl mb-4">肉欲线强度曲线</h3>
            <TimelineFlow type="lust" data={lustArc} />
          </div>
        )}

        {activeTab === 'outline' && (
          <div>
            <h3 className="text-2xl mb-6">章节目录（支持拖拽排序）</h3>
            <ChapterTree />
          </div>
        )}

        {activeTab === 'characters' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl">角色管理</h3>
              <button
                onClick={() => openRoleEditor()}
                className="bg-[#FF4D94] px-6 py-3 rounded-2xl flex items-center gap-2"
              >
                + 新建角色卡
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {characters.map((char) => (
                <div key={char.id} className="bg-[#1A1A22] p-6 rounded-3xl border border-[#FF4D94]/20 hover:border-[#FF4D94] relative group">
                  <button
                    onClick={() => handleDeleteCharacter(char)}
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                    title="删除角色"
                  >
                    <Trash2 size={18} />
                  </button>
                  <h4 className="text-2xl font-bold">{char.name} <span className="text-sm text-gray-500">({char.age}岁)</span></h4>
                  <p className="text-sm text-gray-400 mt-2 line-clamp-3">{char.appearance}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {char.nsfw.kinks.slice(0, 4).map((k, i) => (
                      <span key={i} className="text-xs bg-pink-500/10 text-pink-400 px-3 py-1 rounded-full">{k}</span>
                    ))}
                  </div>
                  <button
                    onClick={() => openRoleEditor(char)}
                    className="mt-6 text-[#FF4D94] hover:underline"
                  >
                    编辑完整角色卡 →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'relations' && (
          <div className="h-[calc(100vh-220px)]">
            <h3 className="text-2xl mb-4 flex items-center gap-3">
              <Users /> 角色关系图
            </h3>
            <div className="h-full bg-[#1A1A22] rounded-3xl flex items-center justify-center border border-dashed border-[#FF4D94]/30">
              <div className="text-center">
                <p className="text-2xl mb-4">角色关系网（React Flow）</p>
                <p className="text-gray-400 max-w-md mx-auto">
                  支持拖拽连线、关系强度标注、NTR/纯爱标签<br/>
                  <span className="text-sm">即将推出：可视化编辑角色间的复杂关系网络</span>
                </p>
                <div className="mt-6 space-y-3">
                  <button className="px-8 py-4 bg-[#FF4D94] rounded-2xl hover:bg-[#E63E85] transition-colors">
                    初始化关系图
                  </button>
                  <p className="text-xs text-gray-500">
                    当前有 {characters.length} 个角色可关联
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 角色编辑器弹窗 */}
      {showRoleEditor && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <RoleCardEditor character={editingCharacter || undefined} onSave={handleRoleSave} />
        </div>
      )}
    </div>
  );
}
