<script setup lang="ts">
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useApiRequest } from '@/composables/useApiRequest'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = reactive({
  username: '',
  password: '',
})

const { loading, error, execute, reset } = useApiRequest(authStore.login)

async function handleSubmit(): Promise<void> {
  reset()
  await execute({
    username: form.username,
    password: form.password,
  })

  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/home'
  await router.replace(redirect)
}
</script>

<template>
  <main class="login-page">
    <section class="login-card">
      <h1>DeepLHub</h1>
      <p class="desc">前端基础框架阶段 - 登录模块（Mock Auth）</p>

      <form @submit.prevent="handleSubmit">
        <label class="field">
          <span>Username</span>
          <input v-model="form.username" required placeholder="输入用户名" />
        </label>

        <label class="field">
          <span>Password</span>
          <input v-model="form.password" required type="password" placeholder="输入密码" />
        </label>

        <button class="submit" type="submit" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>

        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 20px;
  background:
    radial-gradient(circle at 20% 10%, rgba(14, 165, 233, 0.25), transparent 34%),
    radial-gradient(circle at 80% 90%, rgba(59, 130, 246, 0.2), transparent 30%),
    #f8fafc;
}

.login-card {
  width: min(420px, 100%);
  background: #ffffff;
  border: 1px solid var(--border-main);
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  padding: 26px;
}

h1 {
  font-size: 28px;
  font-weight: 700;
}

.desc {
  margin-top: 8px;
  margin-bottom: 18px;
  color: #6b7280;
}

form {
  display: grid;
  gap: 12px;
}

.field {
  display: grid;
  gap: 6px;
}

.field span {
  font-size: 14px;
  color: #334155;
}

.field input {
  border: 1px solid var(--border-main);
  border-radius: 10px;
  padding: 10px 12px;
}

.submit {
  margin-top: 8px;
  border: 0;
  border-radius: 10px;
  background: linear-gradient(135deg, #0284c7, #2563eb);
  color: #ffffff;
  padding: 11px 12px;
  cursor: pointer;
}

.submit:disabled {
  opacity: 0.72;
  cursor: default;
}

.error {
  color: #dc2626;
  font-size: 14px;
}
</style>
