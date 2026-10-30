# FOODOS Online — מסמך איפיון

> **עדכון אחרון:** אוקטובר 2026  
> **קרא קובץ זה לפני כל עבודה על הפרויקט.**

---

## מה זה FOODOS?

אתר אפיליאציה של מוצרי מזון כשרים מ-iHerb, מופעל על ידי קהילת פודוס (56,000+ חברים). האתר עוזר לישראלים לגלות מוצרים כשרים מאומתים ב-iHerb, לחסוך זמן בדיקה, ולרכוש עם קוד שותפים.

**קהל יעד:** ישראלים דוברי עברית, שומרי כשרות, קהל קולינרי מתעניין  
**שפה:** עברית, RTL  
**מודל הכנסות:** קמיסיה מ-iHerb על כל רכישה דרך קישורי האפיליאציה

---

## פרטים טכניים

| פרמטר | ערך |
|--------|------|
| דומיין | `online.foodos.co.il` |
| נתיב מאושר על ידי iHerb | `online.foodos.co.il/kosher-iherb` |
| GitHub repo | `pandorit/foodos-herb` |
| Publish directory | `site/` |
| Hosting | Cloudflare Pages (פעיל, הועבר מ-Netlify). Functions ב-`functions/api/` (`like.js`/`likes.js`) דורשים KV binding בשם `LIKES_KV`. `netlify.toml` ו-`netlify/functions/` נותרו כקוד ישן ולא פעיל. |
| DNS | mynames.co.il |
| Build | אין — אתר סטטי לחלוטין (HTML/CSS/JS) |
| שרת מקומי | `python -m http.server 7824` מתיקיית `site/` |
| קוד אפיליאציה | `rcode=FOO0434` |

---

## מבנה קבצים

```
site/
├── foodos-herb-homepage.html     ← דף הבית
├── sitemap.xml
├── robots.txt
└── kosher-iherb/
    ├── category.html             ← דף קטגוריה (?cat=תבלינים)
    ├── product.html              ← דף מוצר (?id=123)
    ├── brand.html                ← דף מותג (?brand=Bragg)
    ├── certs.html                ← סקירת כל הכשרויות
    ├── cert.html                 ← דף כשרות בודדת (?cert=OU)
    ├── privacy.html              ← מדיניות פרטיות
    ├── terms.html                ← תנאי שימוש
    ├── accessibility.html        ← הצהרת נגישות
    ├── admin/index.html           ← דשבורד ניהול (לא admin-descriptions.html)
    └── data/
        ├── products-data.js                           ← מקור ראשי (527+ מוצרים)
        ├── products_explained_human_descriptions.json ← שכבת עישור
        ├── brands_with_descriptions2.json             ← תיאורי מותגים
        └── content.json                               ← תוכן עריכתי
```

---

## ארכיטקטורת נתונים

### שני קבצים, מיזוג בזמן ריצה

**`products-data.js`** — הקובץ הראשי  
- נטען כ-`window.FOODOS_PRODUCTS` (embedded script)
- מכיל 527+ מוצרים עם כל שדות החובה
- לא נערך על ידי הדשבורד

**`products_explained_human_descriptions.json`** — שכבת עישור  
- נטען ב-fetch בזמן ריצה
- מכיל תיאורים ארוכים, תגיות, ו-overrides
- הדשבורד כותב לקובץ זה בלבד (דרך GitHub API, ענף dev)
- כ-343 מוצרים — 184 מוצרים (IDs 324–527) עדיין חסרים מכאן

**פטרן המיזוג** (בכל הדפים הציבוריים):
```js
const overrideMap = {};
jsonProducts.forEach(p => { overrideMap[p.id] = p; });
allProducts = baseProducts.map(p =>
  overrideMap[p.id] ? Object.assign({}, p, overrideMap[p.id]) : p
);
```

### שדות מוצר עיקריים

```js
{
  id: number,            // מספר עוקב ייחודי
  name: "...",           // שם באנגלית
  nameHe: "...",         // שם בעברית
  brand: "...",          // שם מותג (חייב להתאים ל-brands.json)
  cat: ["קטגוריה"],     // מערך — יכול להכיל כמה קטגוריות
  cert: "OU",            // תעודת כשרות
  certVerified: true,
  conf: 1,               // רמת ביטחון (1=גבוה)
  img: "https://...",    // תמונה מ-iHerb CDN
  url: "https://...",    // קישור iHerb רגיל
  affiliateUrl: "https://...?rcode=FOO0434",
  priceILS: 45,
  available: true,
  dairy: false,          // true אם OU-D
  desc: "...",           // תיאור קצר
  descNew: "...",        // תיאור משופר
  longDesc: "...",       // תיאור ארוך (אופציונלי)
  tags: ["organic"],     // אופציונלי
  suspended: false       // true = הסתר לחלוטין
}
```

---

## דפי האתר

### דף הבית (`foodos-herb-homepage.html`)
- Hero עם carousel מוצרים (CSS animation)
- גריד מוצרים נבחרים עם filter pills לפי קטגוריה
- Featured product (split layout)
- Shop by category (horizontal scroll)
- Testimonials (dark teal bg)
- Values section + accordion
- Footer

### דף קטגוריה (`category.html`)
- פרמטר: `?cat=תבלינים`
- גריד מוצרים מסוננים לפי קטגוריה
- Meta tags דינמיים לפי קטגוריה

### דף מוצר (`product.html`)
- פרמטר: `?id=123`
- תמונה, שם, תיאור קצר + ארוך
- תווית כשרות, מותג, קטגוריה
- כפתור iHerb עם קוד שותפים
- מוצרים קשורים (seeAlso)
- Meta tags דינמיים לפי מוצר

### דף מותג (`brand.html`)
- פרמטר: `?brand=Bragg`
- תיאור מותג + כל המוצרים שלו
- כרטיסי מוצר עם כפתור iHerb + קישור לדף מוצר

### דשבורד ניהול (`admin-descriptions.html`)
- עריכת descNew, longDesc, תגיות, כשרות, dairy
- שמירה לענף dev דרך GitHub API
- לא נוגע ב-products-data.js

---

## עיצוב

| אלמנט | ערך |
|--------|------|
| Primary teal | `#4A9D9A` |
| Dark teal | `#2C6360` |
| Light teal bg | `#EBF6F6` |
| Text | `#1A1A1A` |
| Orange accent | `#E85D04` |
| כותרות | Playfair Display (serif, italic לכותרות גדולות) |
| גוף | Inter |
| פינות מעוגלות | 12-20px לכרטיסים, 100px לpills |
| RTL | `dir="rtl"`, `lang="he"` בכל הדפים |

---

## כללים קריטיים

### כשרות
- רשימת הכשרויות המאושרות נמצאת ב-`CLAUDE.md`
- לעולם לא להוסיף מוצר ללא כשרות מאושרת
- OU-D = חובה `dairy: true` + badge "חלבי"

### UX — כרטיסי מוצר
- תמונת מוצר חייבת להיות קליקבילית ולנווט ל-`product.html?id=X`
- רכיבים פנימיים (כפתורים, badges) חייבים `onclick="event.stopPropagation()"`

### כתיבה
- **אסור מקף ארוך (—)** — להשתמש בפסיק, נקודה, או נקודה-פסיק
- עברית טבעית ושיחתית
- שמות מותגים ומוצרים נשארים באנגלית

### Git
- **לעולם לא לדחוף ל-master ללא הוראה מפורשת**
- master = live, dev = ניסוי ודשבורד

---

## קטגוריות מאושרות

`תבלינים` / `שמנים` / `קמחים` / `שוקולד` / `ממרחים` / `רטבים` / `אסייתי` / `תה` / `קפה` / `דגנים` / `אגוזים וזרעים` / `שתייה` / `חומץ` / `פסטה`

---

## סטטוס אפיליאציה — iHerb

- חשבון פעיל תחת Partnerize
- איש קשר: Sean Stevens
- **שאלה פתוחה:** פורמט קישור Partnerize לעומת HTK2300 — תשובת Sean ממתינה
- **קוד הנחה 25%** — תקף עד סוף אוקטובר 2026 בלבד. לא להציג כהצעה קבועה.

---

## פיצ'רים פתוחים / חלקיים

| פיצ'ר | סטטוס |
|--------|--------|
| Supabase (לייקים + דיווחים) | מתוכנן, לא מומש |
| עדכון זמינות שבועי אוטומטי | מוסכם, לא נבנה |
| Schema markup (structured data) | לא מומש |
| Google Analytics 4 | **מומש** ב-site/index.html (gtag, נטען אחרי הסכמת קוקיז) — יש לבדוק אם קיים בכל הדפים |
| Facebook Pixel | לא מחובר |
| Cookie consent banner | **מומש** ב-site/index.html דרך `cookie-consent.js` — יש לבדוק אם קיים בכל הדפים |
| Google Search Console | לא רשום |
| nav dropdowns ב-product.html | חסר (קיים ב-brand.html ו-category.html) |
| affiliate disclosure בכל הדפים | חסר ב-brand.html, cert.html, certs.html |
| negishot widget בכל הדפים | חסר ב-brand.html, cert.html |

פירוט מלא: `memory/seo_and_marketing.md`

---

## תוכניות עתידיות

- גרסה באנגלית
- ערוץ טלגרם FOODOS
- קטגוריית תוספי תזונה
- הרחבה ל-AliExpress (`/express/`)
- iHerb API לסנכרון מחירים אוטומטי
- אתר קהילתי מלא (foodos.co.il) — פרויקט נפרד

פירוט: `memory/future_plans.md`

---

## קבצי זיכרון (Claude Memory)

| קובץ | תוכן |
|------|------|
| `memory/project_decisions.md` | ארכיטקטורה, כללים, Git, hosting |
| `memory/product_data_notes.md` | מוצרים, עדכונים אחרונים, certifications |
| `memory/seo_and_marketing.md` | משימות SEO, Analytics, Pixels, קישורים |
| `memory/future_plans.md` | תוכניות עתידיות |
| `docs/CHECKLIST.md` | **צ'קליסט להוספת מוצר חדש — קרא לפני כל הוספת מוצר** |
