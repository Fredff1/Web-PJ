<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUiStore } from '@/store/ui'

const route = useRoute()
const uiStore = useUiStore()

const menus = [
  { name: 'home', label: 'Home', ready: true },
  { name: 'assistant', label: 'AI Assistant', ready: true },
  { name: 'experiments', label: 'Experiments', ready: false },
  { name: 'learning', label: 'Learning', ready: false },
]

const collapsed = computed(() => uiStore.sidebarCollapsed)
</script>

<template>
  <aside class="sidebar" :class="{ collapsed }">
    <div class="logo">
      <div class="logo-mark">D</div>
      <span v-if="!collapsed" class="logo-text">DeepLHub</span>
    </div>

    <nav class="menu">
      <template v-for="item in menus" :key="item.name">
        <RouterLink
          v-if="item.ready"
          :to="{ name: item.name }"
          class="menu-item"
          :class="{ active: route.name === item.name }"
        >
          <span class="dot" />
          <span v-if="!collapsed">{{ item.label }}</span>
        </RouterLink>
      </template>
      <div
        v-for="item in menus.filter((menu) => !menu.ready)"
        :key="item.name"
        class="menu-item disabled"
      >
        <span class="dot disabled-dot" />
        <span v-if="!collapsed">{{ item.label }}</span>
      </div>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  background: linear-gradient(180deg, #0f172a, #111827);
  color: #d1d5db;
  border-right: 1px solid #1f2937;
  padding: 18px 14px;
  transition: width 0.2s ease;
  width: 240px;
}

.sidebar.collapsed {
  width: 76px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.logo-mark {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  font-weight: 700;
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  color: #ffffff;
}

.logo-text {
  font-size: 16px;
  font-weight: 600;
}

.menu {
  display: grid;
  gap: 8px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: inherit;
  text-decoration: none;
  border-radius: 10px;
  padding: 10px;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.menu-item.active {
  background: rgba(14, 165, 233, 0.24);
  color: #f8fafc;
}

.menu-item.disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #38bdf8;
}

.disabled-dot {
  background: #64748b;
}

@media (max-width: 900px) {
  .sidebar {
    display: none;
  }
}
</style>
