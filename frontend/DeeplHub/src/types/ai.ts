export type AiMode = 'floating' | 'page'

export interface AiSize {
  width: number
  height?: number
}

export interface ChatMessage {
  id: number
  role: 'user' | 'assistant'
  content: string
}
