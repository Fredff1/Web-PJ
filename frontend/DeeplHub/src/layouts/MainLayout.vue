<script setup lang="ts">
import { computed } from 'vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import AIAssistant from '@/components/ai/AIAssistant.vue'
import { useUiStore } from '@/store/ui'

const uiStore = useUiStore()
const collapsed = computed(() => uiStore.sidebarCollapsed)
</script>

<template>
  <div class="app-layout" :class="{ collapsed }">
    <AppSidebar />
    <div class="layout-main">
      <AppTopbar />
      <main class="layout-content">
        <RouterView />
      </main>
    </div>
    <AIAssistant />
  </div>
</template>

<style scoped>
.app-layout {
  height: 100vh;
  display: grid;
  grid-template-columns: 240px 1fr;
  background: var(--bg-page);
}

.app-layout.collapsed {
  grid-template-columns: 76px 1fr;
}

.layout-main {
  min-width: 0;
  display: grid;
  grid-template-rows: 64px 1fr;
}

.layout-content {
  min-height: 0;
  padding: 20px;
  overflow: auto;
}

@media (max-width: 900px) {
  .app-layout {
    grid-template-columns: 1fr;
  }
}
</style>
