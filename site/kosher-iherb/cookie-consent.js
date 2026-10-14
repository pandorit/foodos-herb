/* FOODOS Cookie Consent — Hebrew RTL */
(function () {
  var KEY = 'foodos_cc';

  // אם כבר ענתה — מפעיל כלים אם הסכימה, יוצא
  var saved = localStorage.getItem(KEY);
  if (saved === 'y') { if (typeof window.loadGA4 === 'function') window.loadGA4(); return; }
  if (saved === 'n') return;

  // בנר
  var style = document.createElement('style');
  style.textContent = [
    '#foodos-cc{position:fixed;bottom:0;right:0;left:0;z-index:9999;display:flex;justify-content:center;padding:12px 16px;background:rgba(28,28,28,.96);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);box-shadow:0 -2px 16px rgba(0,0,0,.18);}',
    '#foodos-cc-inner{display:flex;align-items:center;gap:16px;flex-wrap:wrap;justify-content:center;max-width:860px;width:100%;direction:rtl;font-family:"Varela Round","Assistant",sans-serif;}',
    '#foodos-cc p{margin:0;font-size:.88rem;line-height:1.5;color:#e8f5f5;flex:1;min-width:200px;}',
    '#foodos-cc p a{color:#7dcfcc;text-decoration:underline;}',
    '#foodos-cc-btns{display:flex;gap:10px;flex-shrink:0;}',
    '#foodos-cc-accept{background:#4A9D9A;color:#fff;border:none;padding:9px 22px;border-radius:100px;font-family:inherit;font-size:.85rem;font-weight:700;cursor:pointer;transition:background .18s;}',
    '#foodos-cc-accept:hover{background:#2C6360;}',
    '#foodos-cc-decline{background:transparent;color:#aaa;border:1.5px solid #555;padding:9px 18px;border-radius:100px;font-family:inherit;font-size:.85rem;cursor:pointer;transition:all .18s;}',
    '#foodos-cc-decline:hover{border-color:#aaa;color:#ddd;}'
  ].join('');
  document.head.appendChild(style);

  var bar = document.createElement('div');
  bar.id = 'foodos-cc';
  bar.innerHTML = [
    '<div id="foodos-cc-inner">',
    '  <p>🍪 <strong>היי אתם,</strong> כדי לשפר את האתר ולהכיר טוב יותר את ההעדפות שלכם, קהילת הפודוסים בארץ ובעולם, אנחנו משתמשים בכלי מעקב וניתוח שאוספים נתונים בצורה אנונימית בלבד. נשמח אם תוכלו לאשר את הקוקיז כדי שנדע אילו מוצרים אנשים אוהבים במיוחד.',
    '  <a href="privacy.html">מדיניות פרטיות</a></p>',
    '  <div id="foodos-cc-btns">',
    '    <button id="foodos-cc-accept">בסדר, אני בעניין</button>',
    '    <button id="foodos-cc-decline">לא תודה</button>',
    '  </div>',
    '</div>'
  ].join('');

  function close() { bar.style.transition = 'opacity .3s'; bar.style.opacity = '0'; setTimeout(function(){ bar.remove(); }, 320); }

  document.body.appendChild(bar);

  document.getElementById('foodos-cc-accept').onclick = function () {
    localStorage.setItem(KEY, 'y');
    if (typeof window.loadGA4 === 'function') window.loadGA4();
    close();
  };
  document.getElementById('foodos-cc-decline').onclick = function () {
    localStorage.setItem(KEY, 'n');
    close();
  };
})();
