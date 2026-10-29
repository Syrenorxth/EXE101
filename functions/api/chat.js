// Cloudflare Pages Function cho POST /api/chat.
// Làm đúng việc của proxy trong vite.config.js khi chạy dev: giữ API key ở máy chủ,
// trình duyệt chỉ gọi /api/chat nên không bao giờ thấy key.
// Biến môi trường đặt trong Cloudflare Pages: AI_API_KEY (dạng Secret), AI_BASE_URL, AI_MODEL.

const json = (data, status) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } })

export async function onRequestPost({ request, env }) {
  if (!env.AI_API_KEY) return json({ error: 'Máy chủ chưa cấu hình AI_API_KEY.' }, 503)

  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Dữ liệu gửi lên không hợp lệ.' }, 400)
  }
  if (!Array.isArray(body?.messages)) return json({ error: 'Thiếu danh sách messages.' }, 400)

  const base = (env.AI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '')
  const res = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.AI_API_KEY}` },
    // Chỉ chuyển tiếp các trường app dùng, model lấy theo cấu hình máy chủ.
    body: JSON.stringify({
      model: env.AI_MODEL || body.model || 'gpt-4o-mini',
      messages: body.messages,
      temperature: typeof body.temperature === 'number' ? body.temperature : 0.7
    })
  })

  return new Response(res.body, {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('Content-Type') || 'application/json' }
  })
}
