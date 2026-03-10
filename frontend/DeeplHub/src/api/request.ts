import type { AxiosRequestConfig } from 'axios'
import http from './http'

export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await http.request<T>(config)
  return response.data
}
