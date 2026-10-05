# FOODOS Kosher iHerb — Project State

**Last updated:** 2026-10-05  
**Domain:** online.foodos.co.il/kosher-iherb/ (NOT herb.foodos.co.il — redirect/alias only)  
**Hosting:** Netlify, publish dir: `site/`  
**Git remote:** verified via `git remote -v`

---

## Product Database

**File:** `site/kosher-iherb/data/products_explained_human_descriptions.json`

- Total products: 304
- Active (available): 204
- Unavailable (shown at bottom, greyed out): 72
- Suspended (hidden completely): 28
- Max ID: 490

### Product Status Logic

| Field | Behavior |
|-------|----------|
| `suspended: true` | Hidden from all pages entirely |
| `available: false` | Shown at bottom of listings with "אזל מהמלאי" badge + grayscale |
| _(default)_ | Active, shown normally |

### Image URLs

Pattern: `https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/s3-media/Images/Products/{SKU}/{SKU}.jpg`

Each product card has `onerror` fallback to emoji if image fails.

### Affiliate Links

Format: `https://iherb.prf.hn/click/camref:1011l5NRzk/creativeref:1100l48780/destination:{encoded_iherb_url}`

This is the Partnerize format (NOT the old HTK2300 format). Status: awaiting confirmation from iHerb rep Sean Stevens on which format to use long-term.

---

## iHerb Affiliate Status

- Account: active under Partnerize
- Contact: Sean Stevens (iHerb rep), email thread open
- **Open question:** Partnerize creativeref vs HTK2300 link format. Sean's response pending as of 2026-10-05.
- **Launch announcement:** on hold until Sean responds.
- **25% discount code:** valid only until end of October 2026. Must NOT be presented as a permanent offer. Remove or update after October.

---

## Kosher Certification Policy

**Approved certifications** are listed in `CLAUDE.md` (see "Approved Kosher Certifications").

### Policy for adding new certifications

We use the **cRc ASKcRc database** (asktherav.com or crcweb.org) as the authoritative source.

- **"Recommended"** by cRc = approved for the site
- **"Not Recommended" / "Caution"** = do NOT add

**KCK (Vaad HaKashruth of Kansas City)** was added on 2026-10-05 after verifying it appears as "Recommended" on ASKcRc. Products with KCK: Date Lady Chocolate Spread (488), Date Lady Date Sugar (489), Date Lady BBQ Sauce (490).

**Research method:** When a user shows a product with an unfamiliar cert symbol, look up the agency name in ASKcRc before adding. Screenshot verification is sufficient.

---

## File Map

### Pages (all under `site/kosher-iherb/`)

| File | Purpose | Notes |
|------|---------|-------|
| `foodos-herb-homepage.html` | Main homepage | Root of `site/`, NOT in kosher-iherb/ |
| `category.html` | Category listing page | `?category=X` param |
| `brand.html` | Brand listing page | `?brand=X` param |
| `product.html` | Single product page | `?id=X` param |
| `cert.html` | Single cert page | `?cert=X` param |
| `certs.html` | All certifications overview | |
| `privacy.html` | Privacy policy | Full legal text, implemented |
| `terms.html` | Terms of use | Full legal text, implemented |
| `accessibility.html` | Accessibility statement | Full legal text + negishot widget |

### Redirects (`netlify.toml`)

`/kosher-iherb/` -> `/foodos-herb-homepage.html` (302)

---

## Incomplete / Pending Features

### Accessibility Widget (negishot.co.il)

Script tag: `<script src="https://negishot.co.il/cdn/widget.php?code=NGS_D51C06908CC9">`

**Present in:** foodos-herb-homepage.html, category.html, product.html, certs.html (partial), privacy.html, terms.html, accessibility.html  
**Missing from:** brand.html, cert.html, certs.html (needs verification)

### Affiliate Disclosure Sentence

Full disclosure text (Hebrew) is present in category.html and accessibility.html footers.  
**Missing from:** brand.html, cert.html, certs.html (only have short copyright line).

### Supabase (not yet implemented)

User plans to open a Supabase account with foodos.online@gmail.com.

**Features to implement once account is created:**
1. **Likes button** on product cards — user can like products, stored in Supabase. Login via social (Google/Facebook).
2. **Report button** — user reports wrong/expired kosher info. First reporter gets 10 NIS via Bit. Currently the report button is email-based (`mailto:`) modal in foodos-herb-homepage.html.

**DB tables needed (once Supabase is set up):**
- `product_likes` (product_id, user_id / social_id, created_at)
- `product_reports` (product_id, reporter_email_or_id, issue_text, created_at, rewarded: bool)

When user provides Project URL + anon key, implement:
- Replace mailto modal with Supabase insert
- Add like toggle on product cards
- Show like count per product

### Filter Pills Redesign

Current look was flagged as "AI-generated" by user. Awaiting design decision.  
Options discussed: tabs / dots / editorial/horizontal rule style.  
Location: foodos-herb-homepage.html filter bar, category.html filter bar.

### Weekly Feed Availability Agent

Agreed to build a Claude agent (or script) that:
- Runs once a week
- Downloads/reads the iHerb Israel CSV/feed
- Compares each product's availability in the feed against `available` field in the JSON DB
- Flags changes for human review (does NOT auto-update — user reviews and confirms)
- Not yet built.

### Nav Dropdowns (product.html)

brand.html and category.html have three nav dropdowns (קטגוריות, מותגים, הכשרויות).  
product.html nav was not updated with these dropdowns yet.

### TAG_DEFS (auto-tagging)

Tags like "ללא גלוטן", "אורגני", "טבעוני" are matched by regex against product text fields (name, descNew, desc, etc.). No separate boolean fields needed. Adding a keyword to a product's description auto-adds it to the filter.

---

## README.md Status

`README.md` at repo root is outdated — still references "מאיהרב-כשר" (old project name).  
**Do not update now** — wait for launch announcement decision.

---

## Deployment

- Push to `main` -> Netlify auto-deploys
- No build step — pure static HTML/CSS/JS
- `netlify.toml` handles redirects and cache headers

---

## Design System

- Primary teal: `#4A9D9A`
- Dark teal: `#2C6360`
- Light teal bg: `#EBF6F6`
- Text: `#1A1A1A`
- Orange badge accent: `#E85D04`
- Font headings: Playfair Display (serif, italic for big headlines)
- Font body: Inter
- RTL throughout (`dir="rtl"`, `lang="he"`)
- Rounded corners: 12-20px for cards, 100px for pills
- Writing rule: no em dash (—); use comma or semicolon instead

---

## Session History (key decisions)

- 2026-10-05: Added KCK to approved certs (ASKcRc "Recommended")
- 2026-10-05: Added 8 new products (IDs 483-490): PUR Gum xylitol, Simply Desserts x2, Comvita Manuka Honey x3, Date Lady x3
- 2026-10-05: Unavailable products sorted to bottom on all pages + "אזל מהמלאי" badge + grayscale
- 2026-10-05: Price display added to all product cards ("החל מ-" for multi-size)
- 2026-10-05: brand.html: product images added, nav dropdowns added, logo enlarged to 80px
- 2026-10-05: category.html: split-mode card-unavailable class fixed
