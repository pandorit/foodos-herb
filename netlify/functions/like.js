// Netlify Function: /.netlify/functions/like
// Increments the like count for a product in likes.json on GitHub.
// Requires GITHUB_TOKEN env var with repo write access.

const REPO        = 'pandorit/foodos-herb';
const FILE_PATH   = 'site/kosher-iherb/data/likes.json';
const BRANCH      = 'master';
const GH_API      = 'https://api.github.com';

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  let productId;
  try {
    ({ productId } = JSON.parse(event.body || '{}'));
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  if (!productId) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'productId required' }) };
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server misconfigured' }) };
  }

  const ghHeaders = {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    'User-Agent': 'foodos-likes/1.0',
  };

  try {
    // 1. Fetch current likes.json
    const getRes = await fetch(
      `${GH_API}/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`,
      { headers: ghHeaders }
    );

    let likes = {};
    let sha;

    if (getRes.ok) {
      const fileData = await getRes.json();
      sha = fileData.sha;
      const decoded = Buffer.from(fileData.content, 'base64').toString('utf-8');
      likes = JSON.parse(decoded);
    } else if (getRes.status === 404) {
      // File doesn't exist yet — create it
      sha = undefined;
    } else {
      throw new Error(`GitHub GET failed: ${getRes.status}`);
    }

    // 2. Increment
    const id = String(productId);
    likes[id] = (likes[id] || 0) + 1;
    const newCount = likes[id];

    // 3. Write back
    const body = {
      message: `like: product ${id} (${newCount})`,
      content: Buffer.from(JSON.stringify(likes, null, 2)).toString('base64'),
      branch: BRANCH,
    };
    if (sha) body.sha = sha;

    const putRes = await fetch(
      `${GH_API}/repos/${REPO}/contents/${FILE_PATH}`,
      { method: 'PUT', headers: ghHeaders, body: JSON.stringify(body) }
    );

    if (!putRes.ok) {
      const errText = await putRes.text();
      // 409 = conflict (race condition) — return optimistic count anyway
      if (putRes.status === 409) {
        return { statusCode: 200, headers, body: JSON.stringify({ likes: newCount, conflict: true }) };
      }
      throw new Error(`GitHub PUT failed: ${putRes.status} — ${errText}`);
    }

    return { statusCode: 200, headers, body: JSON.stringify({ likes: newCount }) };

  } catch (err) {
    console.error('like function error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
