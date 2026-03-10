import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AiMode, AiSize } from '@/types/ai'

interface AiPosition {
  x: number
  y: number
}

const UI_STATE_KEY = 'deeplhub_ui_state'

interface PersistedUiState {
  sidebarCollapsed: boolean
  aiMode: AiMode
  aiPosition: AiPosition
  aiSize: AiSize
}

function normalizeMode(mode: unknown): AiMode {
  return mode === 'page' ? 'page' : 'floating'
}

function normalizeSize(size: unknown): AiSize {
  if (!size || typeof size !== 'object') {
    return { width: 380 }
  }

  const width = Number((size as { width?: unknown }).width)
  const height = Number((size as { height?: unknown }).height)
  if (Number.isFinite(width) && width > 0) {
    if (Number.isFinite(height) && height > 0) {
      return { width, height }
    }
    return { width }
  }

  return { width: 380 }
}

function loadState(): PersistedUiState {
  const fallback: PersistedUiState = {
    sidebarCollapsed: false,
    aiMode: 'floating',
    aiPosition: {
      x: 0,
      y: 0,
    },
    aiSize: {
      width: 380,
    },
  }

  const raw = localStorage.getItem(UI_STATE_KEY)
  if (!raw) return fallback

  try {
    const parsed = JSON.parse(raw) as PersistedUiState
    return {
      sidebarCollapsed: Boolean(parsed.sidebarCollapsed),
      aiMode: normalizeMode(parsed.aiMode),
      aiPosition: parsed.aiPosition ?? { x: 0, y: 0 },
      aiSize: normalizeSize(parsed.aiSize),
    }
  } catch {
    return fallback
  }
}

export const useUiStore = defineStore('ui', () => {
  const cached = loadState()
  const sidebarCollapsed = ref(cached.sidebarCollapsed)
  const aiOpen = ref(false)
  const aiMinimized = ref(false)
  const aiMode = ref<AiMode>(cached.aiMode)
  const aiPosition = ref<AiPosition>(cached.aiPosition)
  const aiSize = ref<AiSize>(cached.aiSize)

  function persist(): void {
    localStorage.setItem(
      UI_STATE_KEY,
      JSON.stringify({
        sidebarCollapsed: sidebarCollapsed.value,
        aiMode: aiMode.value,
        aiPosition: aiPosition.value,
        aiSize: aiSize.value,
      } satisfies PersistedUiState),
    )
  }

  function toggleSidebar(): void {
    sidebarCollapsed.value = !sidebarCollapsed.value
    persist()
  }

  function openAi(): void {
    aiOpen.value = true
    aiMinimized.value = false
  }

  function closeAi(): void {
    aiOpen.value = false
    aiMinimized.value = false
  }

  function minimizeAi(): void {
    aiMinimized.value = true
  }

  function restoreAi(): void {
    aiOpen.value = true
    aiMinimized.value = false
  }

  function setAiMode(mode: AiMode): void {
    aiMode.value = mode
    aiOpen.value = true
    aiMinimized.value = false
    persist()
  }

  function setAiPosition(position: AiPosition): void {
    aiPosition.value = position
    persist()
  }

  function setAiSize(size: AiSize): void {
    aiSize.value = size
    persist()
  }

  return {
    sidebarCollapsed,
    aiOpen,
    aiMinimized,
    aiMode,
    aiPosition,
    aiSize,
    toggleSidebar,
    openAi,
    closeAi,
    minimizeAi,
    restoreAi,
    setAiMode,
    setAiPosition,
    setAiSize,
  }
})
