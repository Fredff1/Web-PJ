<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AIAssistantPanel from './AIAssistantPanel.vue'
import { useUiStore } from '@/store/ui'
import type { AiMode, AiSize } from '@/types/ai'

const BUTTON_SIZE = 54
const MARGIN = 16
const MIN_PANEL_WIDTH = 320
const MAX_PANEL_WIDTH = 840
const MIN_PANEL_HEIGHT = 380
const MAX_PANEL_HEIGHT = 760
type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

const route = useRoute()
const router = useRouter()
const uiStore = useUiStore()

const inAssistantPage = computed(() => route.name === 'assistant')
const shouldShowEntry = computed(
  () => !inAssistantPage.value && (!uiStore.aiOpen || uiStore.aiMinimized || uiStore.aiMode === 'page'),
)
const shouldShowFloatingPanel = computed(
  () => uiStore.aiOpen && !uiStore.aiMinimized && uiStore.aiMode === 'floating' && !inAssistantPage.value,
)

const dragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const dragOrigin = ref({ x: 0, y: 0 })
const launcherMoved = ref(false)

const resizing = ref(false)
const resizeDirection = ref<ResizeDirection | null>(null)
const resizeStart = ref({ x: 0, y: 0 })
const resizeOrigin = ref({ x: 0, y: 0, width: 380, height: 520 })

const launcherStyle = computed(() => {
  const position = clampLauncherPosition(uiStore.aiPosition.x, uiStore.aiPosition.y)
  return {
    transform: `translate(${position.x}px, ${position.y}px)`,
  }
})

const floatingPanelStyle = computed(() => {
  const size = getEffectivePanelSize()
  const width = size.width
  const height = size.height
  const position = clampPanelPosition(uiStore.aiPosition.x, uiStore.aiPosition.y, width, height)
  return {
    width: `${width}px`,
    height: `${height}px`,
    transform: `translate(${position.x}px, ${position.y}px)`,
  }
})

function clampLauncherPosition(x: number, y: number): { x: number; y: number } {
  const maxX = Math.max(window.innerWidth - BUTTON_SIZE - MARGIN, MARGIN)
  const maxY = Math.max(window.innerHeight - BUTTON_SIZE - MARGIN, MARGIN)

  return {
    x: Math.min(Math.max(x, MARGIN), maxX),
    y: Math.min(Math.max(y, MARGIN), maxY),
  }
}

function clampPanelWidth(width: number): number {
  const max = Math.max(window.innerWidth - MARGIN * 2, MIN_PANEL_WIDTH)
  return Math.min(Math.max(width, MIN_PANEL_WIDTH), Math.min(MAX_PANEL_WIDTH, max))
}

function getAdaptivePanelHeight(): number {
  const viewportMax = Math.max(window.innerHeight - MARGIN * 2, MIN_PANEL_HEIGHT)
  const preferred = Math.round(window.innerHeight * 0.68)
  return Math.min(Math.max(preferred, MIN_PANEL_HEIGHT), Math.min(MAX_PANEL_HEIGHT, viewportMax))
}

function clampPanelHeight(height: number): number {
  const viewportMax = Math.max(window.innerHeight - MARGIN * 2, MIN_PANEL_HEIGHT)
  return Math.min(Math.max(height, MIN_PANEL_HEIGHT), Math.min(MAX_PANEL_HEIGHT, viewportMax))
}

function getEffectivePanelSize(): { width: number; height: number } {
  const width = clampPanelWidth(uiStore.aiSize.width)
  const baseHeight = uiStore.aiSize.height ?? getAdaptivePanelHeight()
  const height = clampPanelHeight(baseHeight)

  return { width, height }
}

function clampPanelPosition(x: number, y: number, width: number, height: number): { x: number; y: number } {
  const maxX = Math.max(window.innerWidth - width - MARGIN, MARGIN)
  const maxY = Math.max(window.innerHeight - height - MARGIN, MARGIN)

  return {
    x: Math.min(Math.max(x, MARGIN), maxX),
    y: Math.min(Math.max(y, MARGIN), maxY),
  }
}

function ensureLauncherPosition(): void {
  const { x, y } = uiStore.aiPosition

  if (x === 0 && y === 0) {
    const next = clampLauncherPosition(
      window.innerWidth - BUTTON_SIZE - MARGIN - 18,
      window.innerHeight - BUTTON_SIZE - MARGIN - 18,
    )
    uiStore.setAiPosition(next)
    return
  }

  uiStore.setAiPosition(clampLauncherPosition(x, y))
}

function ensureFloatingFrame(): void {
  const { width, height } = getEffectivePanelSize()
  const position = clampPanelPosition(uiStore.aiPosition.x, uiStore.aiPosition.y, width, height)

  uiStore.setAiSize({
    width,
    height: uiStore.aiSize.height == null ? undefined : height,
  })
  uiStore.setAiPosition(position)
}

function openFromLauncher(): void {
  if (launcherMoved.value) {
    launcherMoved.value = false
    return
  }

  if (uiStore.aiMode === 'page') {
    uiStore.setAiMode('floating')
  }

  uiStore.openAi()
  ensureFloatingFrame()

  if (route.name === 'assistant') {
    void router.push({ name: 'home' })
  }
}

function handleModeChange(mode: AiMode): void {
  uiStore.setAiMode(mode)

  if (mode === 'page') {
    void router.push({ name: 'assistant' })
    return
  }

  if (route.name === 'assistant') {
    void router.push({ name: 'home' })
  }
}

function startDrag(event: PointerEvent): void {
  if (uiStore.aiMode !== 'floating') return
  if (event.button !== 0) return

  dragging.value = true
  dragStart.value = { x: event.clientX, y: event.clientY }
  dragOrigin.value = { ...uiStore.aiPosition }
}

function startLauncherDrag(event: PointerEvent): void {
  if (event.button !== 0) return

  dragging.value = true
  launcherMoved.value = false
  dragStart.value = { x: event.clientX, y: event.clientY }
  dragOrigin.value = { ...uiStore.aiPosition }
}

function startResize(event: PointerEvent, direction: ResizeDirection): void {
  if (uiStore.aiMode !== 'floating') return
  if (event.button !== 0) return

  const { width, height } = getEffectivePanelSize()
  resizing.value = true
  resizeDirection.value = direction
  resizeStart.value = { x: event.clientX, y: event.clientY }
  resizeOrigin.value = {
    x: uiStore.aiPosition.x,
    y: uiStore.aiPosition.y,
    width,
    height,
  }
}

function onPointerMove(event: PointerEvent): void {
  if (resizing.value) {
    const direction = resizeDirection.value
    if (!direction) return

    const deltaX = event.clientX - resizeStart.value.x
    const deltaY = event.clientY - resizeStart.value.y

    let width = resizeOrigin.value.width
    let height = resizeOrigin.value.height
    let x = resizeOrigin.value.x
    let y = resizeOrigin.value.y

    if (direction.includes('e')) {
      width = clampPanelWidth(resizeOrigin.value.width + deltaX)
    }
    if (direction.includes('w')) {
      width = clampPanelWidth(resizeOrigin.value.width - deltaX)
      x = resizeOrigin.value.x + (resizeOrigin.value.width - width)
    }
    if (direction.includes('s')) {
      height = clampPanelHeight(resizeOrigin.value.height + deltaY)
    }
    if (direction.includes('n')) {
      height = clampPanelHeight(resizeOrigin.value.height - deltaY)
      y = resizeOrigin.value.y + (resizeOrigin.value.height - height)
    }

    const nextPosition = clampPanelPosition(x, y, width, height)
    uiStore.setAiSize({ width, height })
    uiStore.setAiPosition(nextPosition)
    return
  }

  if (!dragging.value) return

  const deltaX = event.clientX - dragStart.value.x
  const deltaY = event.clientY - dragStart.value.y
  const nextX = dragOrigin.value.x + deltaX
  const nextY = dragOrigin.value.y + deltaY
  const floatingWidth = clampPanelWidth(uiStore.aiSize.width)
  const floatingHeight = getAdaptivePanelHeight()
  const position = shouldShowFloatingPanel.value
    ? clampPanelPosition(nextX, nextY, floatingWidth, floatingHeight)
    : clampLauncherPosition(nextX, nextY)

  if (!shouldShowFloatingPanel.value && (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3)) {
    launcherMoved.value = true
  }

  uiStore.setAiPosition(position)
}

function stopDrag(): void {
  dragging.value = false
  resizing.value = false
  resizeDirection.value = null
}

function handleWindowResize(): void {
  if (shouldShowFloatingPanel.value) {
    ensureFloatingFrame()
    return
  }
  ensureLauncherPosition()
}

watch(
  () => [uiStore.aiMode, uiStore.aiOpen, uiStore.aiMinimized] as const,
  ([mode, open]) => {
    if (mode === 'floating' && open && !uiStore.aiMinimized) {
      ensureFloatingFrame()
    } else {
      ensureLauncherPosition()
    }
  },
  { immediate: true },
)

onMounted(() => {
  ensureLauncherPosition()
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', stopDrag)
  window.addEventListener('resize', handleWindowResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', stopDrag)
  window.removeEventListener('resize', handleWindowResize)
})
</script>

<template>
  <div class="assistant-root">
    <button
      v-if="shouldShowEntry"
      type="button"
      class="floating-btn"
      :style="launcherStyle"
      @pointerdown.stop.prevent="startLauncherDrag"
      @click="openFromLauncher"
    >
      AI
    </button>

    <section v-if="shouldShowFloatingPanel" class="floating-panel-wrap" :style="floatingPanelStyle">
      <AIAssistantPanel
        mode="floating"
        draggable
        @close="uiStore.closeAi"
        @minimize="uiStore.minimizeAi"
        @mode-change="handleModeChange"
        @start-drag="startDrag"
        @start-resize="startResize"
      />
    </section>
  </div>
</template>

<style scoped>
.assistant-root {
  position: static;
  z-index: 20;
  pointer-events: none;
}

.floating-btn {
  position: fixed;
  top: 0;
  left: 0;
  width: 54px;
  height: 54px;
  border: 0;
  border-radius: 999px;
  background: linear-gradient(135deg, #2563eb, #0891b2);
  color: #ffffff;
  font-weight: 700;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.35);
  cursor: pointer;
  pointer-events: auto;
}

.floating-panel-wrap {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: auto;
}
</style>
