// Cloudflare Pages Function: GET /api/likes
// Returns the current like count for every product that has at least one like,
// as { "<productId>": <count>, ... }. Requires the LIKES_KV binding (see like.js).

export async function onRequestGet(context) {
  const { env } = context;
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' };

  if (!env.LIKES_KV) {
    return new Response(JSON.stringify({ error: 'LIKES_KV binding not configured' }), { status: 500, headers });
  }

  const counts = {};
  let cursor;
  do {
    const page = await env.LIKES_KV.list({ prefix: 'likes:', cursor });
    for (const key of page.keys) {
      const id = key.name.slice('likes:'.length);
      counts[id] = parseInt(await env.LIKES_KV.get(key.name), 10) || 0;
    }
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);

  return new Response(JSON.stringify(counts), { headers });
}
