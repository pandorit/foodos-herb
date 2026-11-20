// Shared handler: injects the real product title/description/image into product.html's
// <title> and og:/meta tags server-side, before the response reaches the client.
// Needed because WhatsApp/Telegram/Facebook link-preview crawlers read the raw HTML only
// (they never run the page's JavaScript), so without this every shared product link showed
// the same generic placeholder text instead of the actual product.
//
// Safe-by-default: any failure (bad id, fetch error, parse error) falls back to returning
// the original, unmodified response rather than breaking the page.

function extractProducts(jsText) {
  // Workers disallows dynamic code generation (new Function/eval), so parse as JSON
  // instead of executing it — the file's array literal is already valid JSON once the
  // "window.FOODOS_PRODUCTS = " prefix and trailing ";" are stripped.
  const code = jsText.replace(/^window\.FOODOS_PRODUCTS\s*=\s*/, '').replace(/;\s*$/, '');
  return JSON.parse(code);
}

function buildProductTitle(product) {
  return (product.nameHe || product.name) + ' כשר מ-iHerb, Foodos Online';
}

function buildProductDesc(product) {
  const short = (product.descNew || product.desc || '').substring(0, 155);
  if (short) return short;
  return `${product.nameHe || product.name}, מוצר כשר מ-iHerb, כשרות ${product.cert}, משלוח ישיר לישראל.`;
}

export async function injectProductMeta(context) {
  const { request, env } = context;
  const originResponse = await context.next();

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) return originResponse;

    const contentType = originResponse.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) return originResponse;

    const [baseRes, overrideRes] = await Promise.all([
      env.ASSETS.fetch(new URL('/kosher-iherb/data/products-data.js', url)),
      env.ASSETS.fetch(new URL('/kosher-iherb/data/products_explained_human_descriptions.json', url)),
    ]);
    if (!baseRes.ok) return originResponse;

    const baseProducts = extractProducts(await baseRes.text());
    const overrideProducts = overrideRes.ok ? JSON.parse(await overrideRes.text()) : [];
    const overrideMap = new Map(overrideProducts.map(p => [String(p.id), p]));

    // Some products exist only in the override file, not in the base array at all.
    const base = baseProducts.find(p => String(p.id) === String(id));
    const override = overrideMap.get(String(id));
    if (!base && !override) return originResponse;
    const product = base ? (override ? Object.assign({}, base, override) : base) : override;

    const title = buildProductTitle(product);
    const desc = buildProductDesc(product);
    const imageUrl = product.img ? new URL(product.img, url).href : '';

    return new HTMLRewriter()
      .on('title#page-title', { element(el) { el.setInnerContent(title); } })
      .on('meta#meta-description', { element(el) { el.setAttribute('content', desc); } })
      .on('meta#og-title', { element(el) { el.setAttribute('content', title); } })
      .on('meta#og-description', { element(el) { el.setAttribute('content', desc); } })
      .on('meta#og-image', { element(el) { if (imageUrl) el.setAttribute('content', imageUrl); } })
      .transform(originResponse);
  } catch (err) {
    console.error('product-meta injection failed:', err && err.stack || err);
    return originResponse;
  }
}
