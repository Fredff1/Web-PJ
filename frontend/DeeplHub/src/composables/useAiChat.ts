import { ref } from 'vue'
import { mockAiReply } from '@/mock/ai'
import type { ChatMessage } from '@/types/ai'

const messages = ref<ChatMessage[]>([
  {
    id: 1,
    role: 'assistant',
    content: '你好，我是 AI 助手。当前是 mock 模式，可以先用于前端交互联调。',
  },
])

const loading = ref(false)
const error = ref('')

function toErrorMessage(reason: unknown): string {
  if (reason instanceof Error) return reason.message
  return 'AI 响应失败，请稍后再试'
}

export function useAiChat() {
  async function sendMessage(content: string): Promise<void> {
    const clean = content.trim()
    if (!clean || loading.value) return

    error.value = ''
    messages.value.push({
      id: Date.now(),
      role: 'user',
      content: clean,
    })

    loading.value = true
    try {
      const reply = await mockAiReply(clean)
      messages.value.push({
        id: Date.now() + 1,
        role: 'assistant',
        content: reply,
      })
    } catch (reason) {
      error.value = toErrorMessage(reason)
    } finally {
      loading.value = false
    }
  }

  return {
    messages,
    loading,
    error,
    sendMessage,
  }
}
