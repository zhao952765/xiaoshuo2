export async function callLocalLLM(prompt: string, onStream?: (chunk: string) => void) {
  const backends = [
    { url: 'http://localhost:11434/api/generate', name: 'Ollama' },
    { url: 'http://localhost:1234/v1/chat/completions', name: 'LM Studio' }
  ];

  for (const backend of backends) {
    try {
      const res = await fetch(backend.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: "qwen2.5",
          prompt: prompt,
          stream: !!onStream,
          temperature: 0.85,
        })
      });

      if (!res.ok) continue;

      if (onStream && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          onStream(buffer);
        }
      }
      return await res.text();
    } catch (e) {
      console.warn(`${backend.name} 连接失败`);
    }
  }
  return "❌ 本地 LLM 连接失败，请启动 Ollama 或 LM Studio";
}
