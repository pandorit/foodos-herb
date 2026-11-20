// Cloudflare Pages Function: GET /kosher-iherb/product.html (the form internal site links use)
import { injectProductMeta } from './_lib/product-meta.js';

export async function onRequestGet(context) {
  return injectProductMeta(context);
}
