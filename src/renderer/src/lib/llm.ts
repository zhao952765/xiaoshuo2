/**
 * 本地 LLM 集成
 * 支持 Ollama / LM Studio / SillyTavern 等兼容 OpenAI 接口的本地模型
 */

export async function callLocalLLM(
  prompt: string,
  onStream?: (chunk: string) => void,
  options?: { model?: string; temperature?: number }
) {
  const model = options?.model || 'qwen2.5-32b-instruct'
  const temperature = options?.temperature ?? 0.85

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        stream: true,
        temperature,
      }),
    })

    if (!response.ok) {
      throw new Error(`Ollama 返回 ${response.status}`)
    }

    const reader = response.body?.getReader()
    if (!reader) return

    const decoder = new TextDecoder()
    let fullText = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      // Ollama 流式返回 JSON 行: {"response":"xxx"}
      const lines = chunk.split('\n').filter(Boolean)
      for (const line of lines) {
        try {
          const parsed = JSON.parse(line)
          if (parsed.response) {
            fullText += parsed.response
            onStream?.(fullText)
          }
        } catch {
          // 非 JSON 行直接追加
          fullText += line
          onStream?.(fullText)
        }
      }
    }

    return fullText
  } catch (e) {
    console.error('LLM 调用失败:', e)

    // 尝试兼容 OpenAI 格式（LM Studio / SillyTavern）
    try {
      const response = await fetch('http://localhost:1234/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: options?.model || 'local-model',
          messages: [{ role: 'user', content: prompt }],
          temperature,
          stream: true,
        }),
      })
      if (!response.ok) throw new Error(`LM Studio 返回 ${response.status}`)

      const reader = response.body?.getReader()
      if (!reader) return

      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '))
        for (const line of lines) {
          try {
            const data = JSON.parse(line.slice(6))
            const content = data.choices?.[0]?.delta?.content || ''
            if (content) {
              fullText += content
              onStream?.(fullText)
            }
          } catch { /* skip partial */ }
        }
      }
      return fullText
    } catch {
      return '本地 LLM 连接失败，请确保 Ollama 或 LM Studio 已启动并加载模型。'
    }
  }
}

/**
 * 同步调用（非流式）
 */
export async function callLocalLLMSync(
  prompt: string,
  options?: { model?: string; temperature?: number }
): Promise<string> {
  const result = await callLocalLLM(prompt, undefined, options)
  return result || ''
}
