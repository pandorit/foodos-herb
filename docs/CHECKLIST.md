# צ'קליסט: הוספת מוצר חדש ל-FOODOS

> עדכון אחרון: אוקטובר 2026

---

## שלב 0: בדיקות מוקדמות

- [ ] **כשרות מאושרת** — האם תעודת הכשרות נמצאת ברשימת המאושרות ב-CLAUDE.md?  
      רשימה מהירה: OU, OK, KOF-K, Star-K, COR, CRC, JSOR, MK, Kehilla Kosher, EarthKosher, KVH, MR, KSA, Kosher Scroll K, Kosher Check, KCK, KA  
      **אם לא — לא לאשר את המוצר.**

- [ ] **בדיקת כפילות** — חפש ב-`products-data.js` לפי שם מותג ושם מוצר. בדוק גם id חדש שלא כבר תפוס.

- [ ] **מותג קיים?** — בדוק ב-`data/brands_with_descriptions2.json`. אם המותג חדש לגמרי, יש להוסיף רשומה.

- [ ] **קטגוריה קיימת?** — קטגוריות מאושרות: `תבלינים`, `שמנים`, `קמחים`, `שוקולד`, `ממרחים`, `רטבים`, `אסייתי`, `תה`, `קפה`, `דגנים`, `אגוזים וזרעים`, `שתייה`, `חומץ`, `פסטה`.  
      אם הקטגוריה חדשה, יש לעדכן גם את `content.json` ואת `sitemap.xml`.

---

## שלב 1: הוספה ל-`products-data.js`

הקובץ: `site/kosher-iherb/data/products-data.js`

### שדות חובה

```js
{
  id: 528,                          // מספר עוקב — בדוק מה ה-id האחרון
  name: "...",                      // שם באנגלית (מ-iHerb)
  nameHe: "...",                    // שם בעברית
  brand: "...",                     // שם מותג — חייב להתאים לשם ב-brands.json
  cat: ["קטגוריה1"],               // מערך קטגוריות
  cert: "OU",                       // שם תעודת הכשרות
  certVerified: true,               // האם אומת ידנית
  _certVerified: "2025-01-01",      // תאריך אימות
  conf: 1,                          // רמת ביטחון: 1=גבוה, 2=בינוני, 3=נמוך
  img: "https://...",               // URL לתמונה מ-iHerb (cdn.iherb.com)
  url: "https://www.iherb.com/pr/...", // קישור מוצר ב-iHerb
  affiliateUrl: "https://www.iherb.com/pr/...?rcode=FOO0434", // עם קוד שותפים
  priceILS: 45,                     // מחיר ב-₪ (בדוק ב-iHerb, המר לפי שער)
  available: true,                  // האם זמין עכשיו
  dairy: false,                     // true רק אם OU-D
  desc: "...",                      // תיאור קצר בעברית (1-2 משפטים)
  descNew: "...",                   // תיאור משופר בעברית (מהאדמין/ידנית)
  _descStatus: "human"              // "human" = נכתב ידנית, "ai" = נוצר אוטומטי
}
```

### שדות אופציונליים

```js
  longDesc: "...",                  // תיאור ארוך — מופיע בעמוד המוצר
  tags: ["אורגני", "גלוטן פרי"],   // תגיות חיפוש
  seeAlso: [101, 205],              // מוצרים קשורים (מערך id-ים)
  seeAlsoNote: "...",               // הסבר לקישור הצולב
  sizes: [                          // אם יש כמה גדלים — מערך
    { size: "100g", url: "...", affiliateUrl: "...", priceILS: 40 },
    { size: "250g", url: "...", affiliateUrl: "...", priceILS: 85 }
  ],
  glutenFree: true,                 // האם גלוטן פרי מוצהר על האריזה
  suspended: false                  // true = הסתר מכל הדפים (אזל/בעיה)
```

### כלל OU-D

אם `cert: "OU-D"` — חובה להוסיף `dairy: true`.  
הוסף לשדה `cat` גם `"חלבי"` (לפי הצורך).

---

## שלב 2: הוספה ל-`products_explained_human_descriptions.json`

הקובץ: `site/kosher-iherb/data/products_explained_human_descriptions.json`

זה אופציונלי אך מומלץ לכל מוצר שיש לו תיאור מעבר לבסיסי.  
שדות בקובץ זה **מחליפים** את השדות המקבילים ב-`products-data.js` (merge).

```json
{
  "id": 528,
  "descNew": "...",
  "longDesc": "...",
  "tags": [...],
  "seeAlso": [...]
}
```

> **הערה:** אם המוצר קיים רק ב-JSON (לא ב-products-data.js), שדות החובה מ-שלב 1 חייבים להיות כאן במלואם.

---

## שלב 3: בדיקת brands.json

הקובץ: `site/kosher-iherb/data/brands_with_descriptions2.json`

- [ ] האם המותג כבר מופיע? אם כן — המשך.
- [ ] אם המותג חדש: הוסף רשומה עם `name`, `nameHe`, `desc`, `logo` (URL).

---

## שלב 4: בדיקות כתיבה

- [ ] **אין מקף ארוך (em dash: —)** — השתמש בפסיק, נקודה, או נקודה-פסיק במקומו.
- [ ] **אין hardcode שאמור להיות משתנה** (למשל מחיר ישן, URL שגוי).
- [ ] **תיאור descNew** — עברית תקינה, בגוף שלישי, בלי שיווק מוגזם.
- [ ] **longDesc** — אם יש 24 רכיבים, תבלינים, מרכיבים — פרט אותם.

---

## שלב 5: בדיקות בדפדפן (לאחר שמירה מקומית)

- [ ] **עמוד מוצר** — `product.html?id=528` נטען, מציג תמונה, שם, תיאור, תווית כשרות.
- [ ] **עמוד קטגוריה** — `category.html?cat=תבלינים` מציג את המוצר בגריד.
- [ ] **עמוד מותג** — `brand.html?brand=...` מציג את המוצר ברשימת המותג.
- [ ] **תמונת מוצר קליקבילית** — לחיצה על התמונה בכרטיס מנווטת לעמוד המוצר.
- [ ] **כפתור iHerb** — לחיצה מובילה ל-iHerb עם קוד שותפים.
- [ ] **OU-D** — אם חלבי, מוצג badge "חלבי" בכרטיס.

---

## שלב 6: פריסה

- [ ] שמור את הקבצים.
- [ ] `git add` לקבצים הרלוונטיים בלבד (אל תוסיף קבצים זרים).
- [ ] `git commit` עם הודעה ברורה, למשל: `add product 528: Frontier Za'atar`.
- [ ] `git push origin master` — פריסה ל-Netlify מתרחשת אוטומטית.
- [ ] בדוק ב-`https://online.foodos.co.il/kosher-iherb/product.html?id=528` שהמוצר חי.

---

## נספח: מי מכיל מה

| קובץ | תפקיד |
|------|--------|
| `products-data.js` | מקור ראשי — כל 527+ מוצרים, נטען כ-`window.FOODOS_PRODUCTS` |
| `products_explained_human_descriptions.json` | שכבת override — תיאורים ותגיות ידניים |
| `brands_with_descriptions2.json` | תיאורי מותגים לעמוד brand.html |
| `content.json` | תוכן עריכה: כותרות, testimonials, values section |
| `sitemap.xml` | SEO — עדכן אם מוסיפים קטגוריה חדשה |

---

## נספח: קטגוריות מאושרות

`תבלינים` / `שמנים` / `קמחים` / `שוקולד` / `ממרחים` / `רטבים` / `אסייתי` / `תה` / `קפה` / `דגנים` / `אגוזים וזרעים` / `שתייה` / `חומץ` / `פסטה`

---

## נספח: קוד שותפים

`rcode=FOO0434` — יש לוודא שהוא מופיע ב-`affiliateUrl` של כל מוצר ובכל גדל ב-`sizes`.
