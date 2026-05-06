import { useState } from 'react';
import { MessageSquare } from 'lucide-react';

export default function AIDialogue() {
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([
    { role: 'assistant', content: '我是你的专属情色小说创作助手。有什么剧情、角色或肉戏需要讨论吗？' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');

    // 模拟AI回复
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '已理解需求。我建议在第12章安排一次高强度肉戏，重点突出纯欲反差与情感爆发。可以继续细化吗？' 
      }]);
    }, 1200);
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <h1 className="text-4xl font-bold mb-6 flex items-center gap-3">
        <MessageSquare className="text-[#FF4D94]" /> AI 创作对话
      </h1>

      <div className="flex-1 bg-[#1A1A22] rounded-3xl p-6 overflow-auto space-y-6 mb-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-5 rounded-3xl ${msg.role === 'user' ? 'bg-[#FF4D94] text-black' : 'bg-[#272732]'}`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          className="flex-1 bg-[#272732] rounded-2xl px-6 py-4 focus:outline-none"
          placeholder="输入剧情讨论、肉戏脑暴、角色调整等..."
        />
        <button onClick={sendMessage} className="bg-[#FF4D94] px-10 rounded-2xl font-bold">发送</button>
      </div>
    </div>
  );
}
