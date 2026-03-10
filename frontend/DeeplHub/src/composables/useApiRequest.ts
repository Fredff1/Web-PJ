import { ref } from 'vue'

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return '请求失败，请稍后重试'
}

export function useApiRequest<TData, TArgs extends unknown[]>(
  handler: (...args: TArgs) => Promise<TData>,
) {
  const loading = ref(false)
  const error = ref('')

  async function execute(...args: TArgs): Promise<TData> {
    loading.value = true
    error.value = ''

    try {
      return await handler(...args)
    } catch (err) {
      error.value = toErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function reset(): void {
    error.value = ''
  }

  return {
    loading,
    error,
    execute,
    reset,
  }
}
