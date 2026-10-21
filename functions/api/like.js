// Cloudflare Pages Function: POST /api/like
// Increments or decrements a product's like count in the LIKES_KV namespace.
// Requires a KV binding named LIKES_KV on the Pages project (set in the Cloudflare dashboard).

export async function onRequestPost(context) {
  const { request, env } = context;
  const headers = { 'Content-Type': 'application/json' };

  if (!env.LIKES_KV) {
    return new Response(JSON.stringify({ error: 'LIKES_KV binding not configured' }), { status: 500, headers });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid JSON' }), { status: 400, headers });
  }

  const id = body && body.id;
  const action = body && body.action;
  if (!id || (action !== 'like' && action !== 'unlike')) {
    return new Response(JSON.stringify({ error: 'id and action (like|unlike) required' }), { status: 400, headers });
  }

  const key = 'likes:' + id;
  const current = parseInt(await env.LIKES_KV.get(key), 10) || 0;
  const next = Math.max(0, current + (action === 'like' ? 1 : -1));
  await env.LIKES_KV.put(key, String(next));

  return new Response(JSON.stringify({ id, count: next }), { headers });
}
