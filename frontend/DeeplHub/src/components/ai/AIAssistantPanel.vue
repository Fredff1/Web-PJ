<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useAiChat } from '@/composables/useAiChat'
import type { AiMode } from '@/types/ai'

const props = withDefaults(
  defineProps<{
    mode: AiMode
    allowMinimize?: boolean
    allowClose?: boolean
    draggable?: boolean
  }>(),
  {
    allowMinimize: true,
    allowClose: true,
    draggable: false,
  },
)

const emit = defineEmits<{
  close: []
  minimize: []
  modeChange: [mode: AiMode]
  startDrag: [event: PointerEvent]
  startResize: [event: PointerEvent, direction: 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw']
}>()

const draft = ref('')
const chatBody = ref<HTMLElement | null>(null)
const { messages, loading, error, sendMessage } = useAiChat()

const modeLabel = computed(() => {
  if (props.mode === 'floating') return '悬浮'
  return '整页'
})

async function handleSend(): Promise<void> {
  if (!draft.value.trim()) return
  const text = draft.value
  draft.value = ''
  await sendMessage(text)
}

function onHeaderPointerDown(event: PointerEvent): void {
  if (!props.draggable) return
  emit('startDrag', event)
}

function onResizeHandlePointerDown(
  event: PointerEvent,
  direction: 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw',
): void {
  if (!props.draggable) return
  emit('startResize', event, direction)
}

watch(
  () => messages.value.length,
  async () => {
    await nextTick()
    if (chatBody.value) {
      chatBody.value.scrollTop = chatBody.value.scrollHeight
    }
  },
  { immediate: true },
)
</script>

<template>
  <section class="panel">
    <header class="panel-head" @pointerdown="onHeaderPointerDown">
      <div class="title-wrap">
        <span>AI 助手（Mock）</span>
        <small>{{ modeLabel }}</small>
      </div>

      <div class="actions">
        <button
          type="button"
          class="action-btn"
          :class="{ active: mode === 'floating' }"
          @click="emit('modeChange', 'floating')"
        >
          悬浮
        </button>
        <button
          type="button"
          class="action-btn"
          :class="{ active: mode === 'page' }"
          @click="emit('modeChange', 'page')"
        >
          整页
        </button>
        <button v-if="allowMinimize" type="button" class="action-btn" @click="emit('minimize')">_</button>
        <button v-if="allowClose" type="button" class="action-btn" @click="emit('close')">×</button>
      </div>
    </header>

    <div ref="chatBody" class="messages">
      <article v-for="item in messages" :key="item.id" class="message" :class="item.role">
        {{ item.content }}
      </article>
      <p v-if="error" class="error">{{ error }}</p>
    </div>

    <footer class="composer">
      <input
        v-model="draft"
        placeholder="输入你的问题..."
        @keydown.enter.prevent="handleSend"
      />
      <button type="button" :disabled="loading" @click="handleSend">
        {{ loading ? '发送中...' : '发送' }}
      </button>
    </footer>

    <template v-if="mode === 'floating' && draggable">
      <button type="button" class="resize-edge edge-n" @pointerdown.stop.prevent="onResizeHandlePointerDown($event, 'n')" />
      <button type="button" class="resize-edge edge-s" @pointerdown.stop.prevent="onResizeHandlePointerDown($event, 's')" />
      <button type="button" class="resize-edge edge-e" @pointerdown.stop.prevent="onResizeHandlePointerDown($event, 'e')" />
      <button type="button" class="resize-edge edge-w" @pointerdown.stop.prevent="onResizeHandlePointerDown($event, 'w')" />
      <button type="button" class="resize-corner corner-ne" @pointerdown.stop.prevent="onResizeHandlePointerDown($event, 'ne')" />
      <button type="button" class="resize-corner corner-nw" @pointerdown.stop.prevent="onResizeHandlePointerDown($event, 'nw')" />
      <button type="button" class="resize-corner corner-se" @pointerdown.stop.prevent="onResizeHandlePointerDown($event, 'se')" />
      <button type="button" class="resize-corner corner-sw" @pointerdown.stop.prevent="onResizeHandlePointerDown($event, 'sw')" />
    </template>
  </section>
</template>

<style scoped>
.panel {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid var(--border-main);
  box-shadow: 0 14px 32px rgba(2, 6, 23, 0.18);
  display: grid;
  grid-template-rows: 52px 1fr 58px;
}

.panel-head {
  padding: 0 12px;
  border-bottom: 1px solid var(--border-main);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  user-select: none;
}

.title-wrap {
  display: grid;
  line-height: 1.2;
}

.title-wrap small {
  color: #64748b;
  font-size: 12px;
  font-weight: 500;
}

.actions {
  display: flex;
  gap: 6px;
}

.action-btn {
  border: 0;
  background: #f3f4f6;
  border-radius: 6px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
}

.action-btn.active {
  background: #dbeafe;
  color: #1d4ed8;
}

.messages {
  padding: 12px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message {
  width: fit-content;
  max-width: min(86%, 520px);
  padding: 6px 10px;
  border-radius: 12px;
  line-height: 1.35;
  white-space: pre-wrap;
  word-break: break-word;
}

.message.assistant {
  background: #f3f4f6;
  align-self: flex-start;
}

.message.user {
  background: #dbeafe;
  align-self: flex-end;
}

.error {
  margin: 0;
  color: #dc2626;
  font-size: 13px;
}

.composer {
  border-top: 1px solid var(--border-main);
  padding: 10px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
}

.composer input {
  width: 100%;
  border: 1px solid var(--border-main);
  border-radius: 8px;
  padding: 8px;
}

.composer button {
  border: 0;
  border-radius: 8px;
  background: #0ea5e9;
  color: #ffffff;
  padding: 0 14px;
  cursor: pointer;
}

.composer button:disabled {
  opacity: 0.65;
  cursor: default;
}

.resize-edge,
.resize-corner {
  position: absolute;
  border: 0;
  background: transparent;
  opacity: 0;
}

.edge-n {
  top: -5px;
  left: 12px;
  right: 12px;
  height: 10px;
  cursor: ns-resize;
}

.edge-s {
  bottom: -5px;
  left: 12px;
  right: 12px;
  height: 10px;
  cursor: ns-resize;
}

.edge-e {
  top: 12px;
  bottom: 12px;
  right: -5px;
  width: 10px;
  cursor: ew-resize;
}

.edge-w {
  top: 12px;
  bottom: 12px;
  left: -5px;
  width: 10px;
  cursor: ew-resize;
}

.resize-corner {
  width: 12px;
  height: 12px;
}

.corner-ne {
  top: -6px;
  right: -6px;
  cursor: nesw-resize;
}

.corner-nw {
  top: -6px;
  left: -6px;
  cursor: nwse-resize;
}

.corner-se {
  right: -6px;
  bottom: -6px;
  cursor: nwse-resize;
}

.corner-sw {
  left: -6px;
  bottom: -6px;
  cursor: nesw-resize;
}
</style>
