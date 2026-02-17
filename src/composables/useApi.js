/**
 * Composable para llamadas API con manejo de errores
 * Uso: const { get, post, put, del } = useApi()
 */
import { http } from '@/services/api/client'

export function useApi() {
  const get = (url, config = {}) => http.get(url, config)
  const post = (url, data, config = {}) => http.post(url, data, config)
  const put = (url, data, config = {}) => http.put(url, data, config)
  const del = (url, config = {}) => http.delete(url, config)

  return { get, post, put, del }
}
