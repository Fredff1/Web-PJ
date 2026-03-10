<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useUiStore } from '@/store/ui'

const authStore = useAuthStore()
const uiStore = useUiStore()
const router = useRouter()

function handleLogout(): void {
  authStore.logout()
  void router.replace({ name: 'login' })
}
</script>

<template>
  <header class="topbar">
    <div class="topbar-left">
      <button class="icon-btn" type="button" @click="uiStore.toggleSidebar">≡</button>
      <h1 class="title">Deep Learning Hub</h1>
    </div>
    <div class="topbar-right">
      <span class="user-name">{{ authStore.user?.name ?? 'guest' }}</span>
      <button class="logout-btn" type="button" @click="handleLogout">Logout</button>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid var(--border-main);
  background: #ffffff;
}

.topbar-left,
.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.2px;
  color: #111827;
}

.icon-btn,
.logout-btn {
  border: 0;
  background: #f3f4f6;
  color: #111827;
  border-radius: 8px;
  cursor: pointer;
  padding: 8px 10px;
}

.icon-btn:hover,
.logout-btn:hover {
  background: #e5e7eb;
}

.user-name {
  color: #4b5563;
  font-size: 14px;
}

@media (max-width: 700px) {
  .title {
    font-size: 16px;
  }
}
</style>
