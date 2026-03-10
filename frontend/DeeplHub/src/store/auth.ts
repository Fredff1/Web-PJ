import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { clearToken, getToken, setToken } from '@/utils/token'
import { login as loginApi } from '@/api/modules/auth'
import type { LoginPayload, UserProfile } from '@/types/auth'

const USER_KEY = 'deeplhub_user'

function loadUser(): UserProfile | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as UserProfile
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref(getToken())
  const user = ref<UserProfile | null>(loadUser())

  const isAuthenticated = computed(() => Boolean(token.value))

  async function login(payload: LoginPayload): Promise<void> {
    const result = await loginApi(payload)
    token.value = result.token
    user.value = result.user

    setToken(result.token)
    localStorage.setItem(USER_KEY, JSON.stringify(result.user))
  }

  function logout(): void {
    token.value = ''
    user.value = null
    clearToken()
    localStorage.removeItem(USER_KEY)
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
  }
})
