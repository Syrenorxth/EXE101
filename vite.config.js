import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// API key được đọc từ file .env và chỉ dùng trong proxy của máy chủ dev,
// trình duyệt chỉ gọi /api/chat nên không bao giờ thấy key.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = env.AI_BASE_URL || 'https://api.openai.com/v1'
  const url = new URL(base)
  const basePath = url.pathname.replace(/\/$/, '')
  const enabled = Boolean(env.AI_API_KEY)

  return {
    plugins: [react()],
    define: {
      __AI_ENABLED__: JSON.stringify(enabled),
      __AI_MODEL__: JSON.stringify(env.AI_MODEL || 'gpt-4o-mini')
    },
    server: {
      port: 5173,
      open: true,
      proxy: enabled
        ? {
            '/api/chat': {
              target: url.origin,
              changeOrigin: true,
              rewrite: () => `${basePath}/chat/completions`,
              headers: { Authorization: `Bearer ${env.AI_API_KEY}` }
            }
          }
        : undefined
    }
  }
})
