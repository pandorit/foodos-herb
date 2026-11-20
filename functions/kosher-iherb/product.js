// Cloudflare Pages Function: GET /kosher-iherb/product (clean-URL form)
import { injectProductMeta } from './_lib/product-meta.js';

export async function onRequestGet(context) {
  return injectProductMeta(context);
}
