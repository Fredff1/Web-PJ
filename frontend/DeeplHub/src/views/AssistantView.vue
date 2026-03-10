<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AIAssistantPanel from '@/components/ai/AIAssistantPanel.vue'
import { useUiStore } from '@/store/ui'
import type { AiMode } from '@/types/ai'

const uiStore = useUiStore()
const router = useRouter()

function handleModeChange(mode: AiMode): void {
  uiStore.setAiMode(mode)
  if (mode !== 'page') {
    void router.push({ name: 'home' })
  }
}

function handleClose(): void {
  uiStore.closeAi()
  void router.push({ name: 'home' })
}

onMounted(() => {
  uiStore.openAi()
  uiStore.setAiMode('page')
})
</script>

<template>
  <section class="assistant-page">
    <AIAssistantPanel
      mode="page"
      :allow-minimize="false"
      @close="handleClose"
      @mode-change="handleModeChange"
    />
  </section>
</template>

<style scoped>
.assistant-page {
  height: calc(100vh - 64px - 40px);
  min-height: 560px;
}

@media (max-width: 900px) {
  .assistant-page {
    height: calc(100vh - 64px - 40px);
    min-height: 420px;
  }
}
</style>
