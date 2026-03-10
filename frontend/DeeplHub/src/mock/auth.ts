import type { LoginPayload, LoginResponse } from '@/types/auth'

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export async function mockLogin(payload: LoginPayload): Promise<LoginResponse> {
  await wait(500)

  const safeName = payload.username.trim() || 'student'

  return {
    token: `mock-token-${Date.now()}`,
    user: {
      id: 'u-1001',
      name: safeName,
      role: 'student',
    },
  }
}
