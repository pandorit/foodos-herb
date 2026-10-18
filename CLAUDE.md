# CLAUDE.md

> תיעוד מלא של מצב הפרויקט, החלטות ארכיטקטוניות ומשימות פתוחות: `docs/project-state.md`

---

## CRITICAL — Domain Name

**הדומיין הנכון והיחיד של האתר: `online.foodos.co.il`**
**הנתיב המאושר על ידי iHerb: `online.foodos.co.il/kosher-iherb`**

- **לעולם אל תשתמש ב-`herb.foodos.co.il`** — זה לא הדומיין, ו-iHerb לא אישרו אותו.
- `herb.foodos.co.il` אינו קיים ואינו בשימוש.
- שם התיקייה הפנימית `/kosher-iherb/` הוא נתיב תוכן בלבד, לא שם הדומיין.
- iHerb אישרו במפורש: "Domain looks good to us" — על `online.foodos.co.il/kosher-iherb`.

---

## CRITICAL — המילה "HERB" אסורה בלוגו ובדומיין

**המילה "HERB" (או "herb") אסורה לחלוטין כחלק מהלוגו, שם המותג, או הדומיין הגלוי.**
שם המותג התקני היחיד הוא **"FOODOS Online"** (עם לוגו העיגול הטיל, קובץ `FOODOS_online2_LOGO.png`).

- אסור: לוגו/כותרת/תגית/aria-label/title-tag עם "FOODOS herb", "herb", או וריאציה דומה.
- `kosher-iherb` הוא שם תיקייה טכני פנימי בלבד ואסור שיופיע ללקוח כשם מותג.

**איפה כן מותר שהמילה "herb"/"iHerb" תופיע:**
- בנתיב ה-URL עצמו: `online.foodos.co.il/kosher-iherb` (אושר על ידי iHerb, זה לא שם המותג אלא נתיב טכני).
- בדף "אודות" (`about.html`), כשמדברים על הקשר לחברת iHerb האמיתית.
- בטקסט תיאורי בעמוד הבית שמסביר את אופי האתר ומניין מגיעים המוצרים (כלומר, אזכור לגיטימי של "iHerb" כחברה/ספק, לא כחלק מהמותג של פודוס עצמו).

נתגלה ותוקן באוקטובר 2026: קבצי `index.html`, `404.html`, `product.html`, `terms.html`, `privacy.html`, `accessibility.html` ו-`about.html` כולם הכילו שרידי לוגו ישנים עם המילה "herb" חשופה (בתג `<title>`, בתווית הלוגו בניווט, ובפירורי לחם). כל אלה הוחלפו בלוגו האמיתי (`<img class="logo-img">`).

---

## Approved Kosher Certifications

**Most Reliable:** OU, OK, KOF-K, Star-K, COR

**Reliable:** CRC, JSOR, MK, Kehilla Kosher, EarthKosher, KVH, MR, KSA, Kosher Scroll K, Kosher Check, KCK, KA (Kosher Authority of Australia and NZ — cRc Recommended)

**OU Variants:** OU-D (dairy — must display "חלבי" badge), OU-P (Passover), OU-M (meat)
Note: All OU variants are approved. OU-D products must be visually flagged as dairy in all card displays.

Policy: certifications rated "Recommended" by cRc ASKcRc are approved. See `docs/project-state.md` for details.

**IMPORTANT:** Do NOT include any product without one of these certifications.

---

## Writing Style

**אסור להשתמש במקף ארוך (em dash): —**
במקומו להשתמש בפסיק, נקודה, או פסיק-נקודה בהתאם להקשר.

---

## Product Card UX Rules

**תמונת מוצר חייבת להיות קליקבילית ולנווט לדף המוצר.**

בכל כרטיס מוצר (homepage, category.html, וכל דף עתידי), ה-`card-img-wrap` חייב לכלול:
- `style="cursor:pointer"`
- `onclick="window.location.href='product.html?id=${p.id}'"` (נתיב יחסי לפי המיקום)

רכיבים פנימיים ב-`card-img-wrap` שאינם חלק מניווט המוצר (כמו כפתור לב וחותמת כשרות) חייבים לכלול `onclick="event.stopPropagation()"` כדי שלא יפעילו את הניווט.

---

## Model

model: claude-sonnet-4-5-20251001
