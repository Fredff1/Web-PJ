import { apiRequest } from '@/api/request'
import { mockLogin } from '@/mock/auth'
import type { LoginPayload, LoginResponse } from '@/types/auth'

const ENABLE_LOGIN_MOCK = true

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  if (ENABLE_LOGIN_MOCK) {
    return mockLogin(payload)
  }

  // TODO: 切换真实后端后，使用统一 apiRequest 发起登录请求并处理响应结构
  return apiRequest<LoginResponse>({
    url: '/auth/login',
    method: 'post',
    data: payload,
  })
}
