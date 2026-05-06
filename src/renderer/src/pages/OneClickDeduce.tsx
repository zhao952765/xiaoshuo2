import { useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import { buildOneClickPrompt } from '../lib/prompts';
import { callLocalLLM } from '../lib/llm';
import { v4 as uuidv4 } from 'uuid';

export default function OneClickDeduce() {
  const { createNewProject, addLog } = useProjectStore();
  const [form, setForm] = useState({
    title: '',
    type: '都市',
    scale: '重度',
    targetWords: 300000,
    roleCount: 5,
    customPrompt: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState('');

  const handleGenerate = async () => {
    if (!form.title) {
      alert("请填写小说标题");
      return;
    }

    setIsGenerating(true);
    setResult("正在调用本地 LLM 生成前期推导包...\n\n");
    addLog("开始调用本地LLM", "一键推导");

    const fullPrompt = buildOneClickPrompt(form);
    let accumulated = '';

    await callLocalLLM(fullPrompt, (chunk: string) => {
      accumulated = chunk;
      setResult(accumulated);
    });

    // 生成完成后自动创建项目
    const newProject = {
      title: form.title,
      type: form.type,
      scale: form.scale,
      targetWords: form.targetWords,
    };
    
    createNewProject(newProject);

    // 生成示例弧线数据
    const sampleEmotionArc = {
      id: uuidv4(),
      title: "情感发展弧线",
      points: [
        { id: uuidv4(), chapter: 1, title: "初遇", description: "初次相遇，产生好感", intensity: 4, characters: ["女主", "男主"] },
        { id: uuidv4(), chapter: 5, title: "心动", description: "情感升温", intensity: 7, characters: ["女主", "男主"] },
        { id: uuidv4(), chapter: 12, title: "告白", description: "深层情感联结", intensity: 9, characters: ["女主", "男主"] },
      ]
    };
    const sampleLustArc = {
      id: uuidv4(),
      title: "肉欲线规划",
      points: [
        { id: uuidv4(), chapter: 3, sceneTitle: "试探", description: "暧昧前戏", intensity: 5, characters: ["女主", "男主"], tags: ["亲吻", "抚摸"], position: 60 },
        { id: uuidv4(), chapter: 8, sceneTitle: "初夜", description: "第一次完整肉戏", intensity: 8, characters: ["女主", "男主"], tags: ["插入", "高潮"], position: 75 },
        { id: uuidv4(), chapter: 15, sceneTitle: "极致", description: "高强度肉戏", intensity: 10, characters: ["女主", "男主"], tags: ["多轮高潮"], position: 90 },
      ]
    };

    useProjectStore.setState({
      overview: `【LLM生成的故事梗概】\n${accumulated.split('故事梗概')[1]?.slice(0, 800) || '故事梗概已生成，可手动编辑优化。'}`,
      emotionArc: sampleEmotionArc,
      lustArc: sampleLustArc,
      chapters: Array.from({length: 15}, (_, i) => ({
        id: uuidv4(),
        number: i + 1,
        title: `第${i+1}章 欲望的序章`,
        content: "",
        emotionProgress: Math.min(100, (i + 1) * 6),
        lustIntensity: Math.floor(Math.random() * 5) + 5,
      }))
    });

    addLog("一键推导完成，已自动加载故事梗概、感情线、肉欲线、章节目录", "一键推导");
    setIsGenerating(false);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-2 text-[#FF4D94]">一键推导</h1>
      <p className="text-gray-400 mb-8">输入参数 → 自动生成完整前期包（故事梗概 + 感情线 + 肉欲线 + 章节目录 + 角色卡）</p>

      <div className="grid grid-cols-2 gap-8">
        {/* 参数输入 */}
        <div className="bg-[#1A1A22] p-8 rounded-3xl border border-[#FF4D94]/20">
          <h2 className="text-2xl mb-6">生成参数</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm mb-2">小说标题</label>
              <input type="text" className="w-full bg-[#272732] rounded-xl px-4 py-3" 
                value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2">小说类型</label>
                <select className="w-full bg-[#272732] rounded-xl px-4 py-3" 
                  value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                  <option>都市</option><option>玄幻</option><option>古代</option><option>末世</option><option>星际</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2">尺度</label>
                <select className="w-full bg-[#272732] rounded-xl px-4 py-3" 
                  value={form.scale} onChange={e => setForm({...form, scale: e.target.value as any})}>
                  <option>轻度</option><option>中度</option><option>重度</option><option>纯肉</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-[#FF4D94] hover:bg-[#E63E85] py-4 rounded-2xl text-lg font-bold transition-all disabled:opacity-70"
            >
              {isGenerating ? "正在推导中..." : "🚀 一键生成完整前期包"}
            </button>
          </div>
        </div>

        {/* 生成结果 */}
        <div className="bg-[#1A1A22] p-8 rounded-3xl border border-[#FF4D94]/20">
          <h2 className="text-2xl mb-4">生成结果</h2>
          {result ? (
            <div className="prose prose-invert max-h-[600px] overflow-auto text-sm">
              <pre className="whitespace-pre-wrap">{result}</pre>
              <button
                onClick={() => {
                  const appEvent = new CustomEvent('navigate', { detail: 'editcenter' });
                  window.dispatchEvent(appEvent);
                }}
                className="mt-6 w-full bg-white/10 hover:bg-white/20 py-3 rounded-xl transition-all"
              >
                打开编辑中心调整 →
              </button>
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center text-gray-500">
              填写左侧参数后点击生成
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
