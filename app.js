// ===== POTATUEV AUTO — Telegram Mini App =====

const tg = window.Telegram && window.Telegram.WebApp;
let tgBackHandler = null;

function initTelegram() {
  if (!tg) return;
  tg.ready();
  tg.expand();
  try { tg.disableVerticalSwipes(); } catch (e) {}
  try { tg.requestFullscreen(); } catch (e) {}
  try { tg.setHeaderColor('#121110'); } catch (e) {}
  try { tg.setBackgroundColor('#121110'); } catch (e) {}
  try { tg.setBottomBarColor('#121110'); } catch (e) {}
}

// ---------- Icons ----------
const ICONS = {
  home: '<path d="M4 11.5 12 4l8 7.5"/><path d="M6 10v9h12v-9"/><path d="M10 19v-5h4v5"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  heart: '<path d="M12 20s-7-4.35-9.5-8.8C.8 7.9 2.2 4.5 5.6 4c2-.3 3.7.8 4.9 2.6C11.7 4.8 13.4 3.7 15.4 4c3.4.5 4.8 3.9 3.1 7.2C19 15.65 12 20 12 20Z"/>',
  user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-3.5-3.5"/>',
  sliders: '<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="1.6" fill="#121110"/><circle cx="15" cy="12" r="1.6" fill="#121110"/><circle cx="8" cy="18" r="1.6" fill="#121110"/>',
  chevronLeft: '<path d="m15 6-6 6 6 6"/>',
  chevronRight: '<path d="m9 6 6 6-6 6"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  check: '<path d="M5 13l4 4L19 7"/>',
  truck: '<rect x="2" y="8" width="12" height="8" rx="1.5"/><path d="M14 11h4l3 3v2h-7z"/><circle cx="6.5" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/>',
  shield: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z"/><path d="m9 12 2 2 4-4"/>',
  doc: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/><path d="M9.5 12h5M9.5 15.5h5"/>',
  wallet: '<rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18"/><circle cx="17" cy="14" r="1.4"/>',
  phone: '<path d="M6 3h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4 6.2 2 2 0 0 1 6 3Z"/>',
  telegram: '<path d="M3 11.5 20 4l-3 16-5.5-4-3 3-1-4.5Z"/><path d="M11.5 14.8 17 8"/>',
  star: '<path d="m12 3 2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1L6.6 19.3l1.3-6L3.3 9.2l6.1-.6Z"/>',
  bell: '<path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9Z"/><path d="M10 19a2 2 0 0 0 4 0"/>',
  mapPin: '<path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.3"/>',
  gauge: '<path d="M4 15a8 8 0 1 1 16 0"/><path d="M12 15l4-5"/><circle cx="12" cy="15" r="1.3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  battery: '<rect x="2" y="9" width="17" height="6" rx="1.5"/><path d="M19 11v2"/><path d="M6 12h2M10 12h2"/>',
  drive: '<circle cx="7" cy="17" r="2.2"/><circle cx="17" cy="17" r="2.2"/><path d="M7 17h6l3-8h3M13 17l-1-4"/>',
  edit: '<path d="M4 20l1-4 11-11 3 3-11 11-4 1Z"/>',
  logout: '<path d="M15 4h-6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6"/><path d="M19 12H9"/><path d="m15 8 4 4-4 4"/>',
  percent: '<circle cx="7" cy="7" r="2"/><circle cx="17" cy="17" r="2"/><path d="M6 18 18 6"/>',
  cam: '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'
};
function icon(name, size, strokeWidth) {
  size = size || 20; strokeWidth = strokeWidth || 1.8;
  return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + strokeWidth + '" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[name] || '') + '</svg>';
}
function iconFill(name, size) {
  size = size || 20;
  return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.3">' + (ICONS[name] || '') + '</svg>';
}

// ---------- Favorites (persisted) ----------
let favorites;
try {
  const saved = JSON.parse(localStorage.getItem('potatuevauto_favorites'));
  favorites = new Set(saved && saved.length ? saved : ['zeekr001', 'et7', 'l9']);
} catch (e) {
  favorites = new Set(['zeekr001', 'et7', 'l9']);
}
function isFav(id) { return favorites.has(id); }
function toggleFavorite(id) {
  favorites.has(id) ? favorites.delete(id) : favorites.add(id);
  try { localStorage.setItem('potatuevauto_favorites', JSON.stringify([...favorites])); } catch (e) {}
  render();
}

// ---------- Shared UI pieces ----------
function bottomNav(active) {
  const items = [
    { id: 'home', label: 'Главная', i: 'home' },
    { id: 'catalog', label: 'Каталог', i: 'grid' },
    { id: 'favorites', label: 'Избранное', i: 'heart' },
    { id: 'profile', label: 'Профиль', i: 'user' }
  ];
  return '<nav class="bottom-nav">' + items.map(it =>
    '<button class="nav-item ' + (active === it.id ? 'active' : '') + '" data-nav="' + it.id + '">' +
      icon(it.i, 22, active === it.id ? 1.9 : 1.8) + '<span>' + it.label + '</span></button>'
  ).join('') + '</nav>';
}
function topBack(title, subtitle, backTarget) {
  return '<div class="topbar-back">' +
    '<span class="back-arrow icon-btn" style="background:none;border:none;color:var(--tx1);" data-nav="' + backTarget + '">' + icon('chevronLeft', 20, 2) + '</span>' +
    '<div><div class="h title-md">' + title + '</div>' +
    (subtitle ? '<div class="subtitle" style="margin-top:1px;">' + subtitle + '</div>' : '') +
    '</div></div>';
}
function statBlock(value, label) {
  return '<div style="text-align:center;"><div class="h" style="font-size:17px;font-weight:800;color:var(--gold);">' + value + '</div>' +
    '<div style="font-size:10px;color:var(--tx3);line-height:1.3;margin-top:3px;">' + label + '</div></div>';
}
function advantage(iconName, title, desc) {
  return '<div class="card" style="display:flex;gap:12px;align-items:flex-start;padding:14px;">' +
    '<div style="width:38px;height:38px;flex:none;border-radius:11px;background:var(--gold-soft);color:var(--gold);display:flex;align-items:center;justify-content:center;">' + icon(iconName, 19) + '</div>' +
    '<div><div style="font-size:13.5px;font-weight:700;">' + title + '</div><div style="font-size:12px;color:var(--tx2);line-height:1.4;margin-top:2px;">' + desc + '</div></div></div>';
}
function miniCard(c) {
  return '<div class="card" style="flex:none;width:150px;overflow:hidden;cursor:pointer;" data-nav="car/' + c.id + '">' +
    '<div style="height:100px;position:relative;"><img src="' + c.img + '" style="width:100%;height:100%;object-fit:cover;">' +
    '<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(18,17,16,0) 55%,rgba(18,17,16,.85) 100%);"></div></div>' +
    '<div style="padding:10px 12px 12px;"><div style="font-size:12.5px;font-weight:700;">' + c.brand + ' ' + c.model + '</div>' +
    '<div style="font-size:10.5px;color:var(--tx3);margin:2px 0 6px;">' + c.year + ' год</div>' +
    '<div style="font-size:12.5px;font-weight:700;color:var(--gold);">' + formatPrice(c.price) + '</div></div></div>';
}
function carRow(c) {
  const fav = isFav(c.id);
  return '<div class="card car-row" style="cursor:pointer;" data-nav="car/' + c.id + '">' +
    '<div class="car-thumb" style="width:104px;height:88px;"><img src="' + c.img + '"></div>' +
    '<div style="flex:1;padding:2px 0;">' +
    '<div style="display:flex;justify-content:space-between;align-items:flex-start;">' +
    '<div style="font-size:13.5px;font-weight:700;">' + c.brand + ' ' + c.model + '</div>' +
    '<button class="heart-btn" data-fav="' + c.id + '" style="width:28px;height:28px;background:none;color:' + (fav ? 'var(--gold)' : 'var(--tx3)') + ';">' + (fav ? iconFill('heart', 16) : icon('heart', 16)) + '</button>' +
    '</div><div style="font-size:11px;color:var(--tx3);margin:2px 0 8px;">' + c.year + ' · ' + c.type + ' · ' + c.body + '</div>' +
    '<div style="font-size:14px;font-weight:700;color:var(--gold);">' + formatPrice(c.price) + '</div></div></div>';
}
function specTile(iconName, value, label) {
  return '<div class="card" style="padding:13px;"><div style="color:var(--gold);">' + icon(iconName, 18) + '</div>' +
    '<div style="font-size:15px;font-weight:700;margin-top:8px;">' + value + '</div><div style="font-size:11px;color:var(--tx3);margin-top:1px;">' + label + '</div></div>';
}
function infoLine(iconName, text) {
  return '<div style="display:flex;align-items:center;gap:10px;"><span style="color:var(--gold);">' + icon(iconName, 17) + '</span>' +
    '<div style="font-size:12.5px;color:var(--tx2);">' + text + '</div></div>';
}
function emptyState(title, desc) {
  return '<div style="text-align:center;padding:40px 20px;color:var(--tx3);"><div style="font-size:14px;font-weight:700;color:var(--tx2);">' + title + '</div>' +
    '<div style="font-size:12.5px;margin-top:4px;">' + desc + '</div></div>';
}

// ---------- "Скоро появится" modal ----------
function showComingSoon(label) {
  let modal = document.getElementById('soonModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'soonModal';
    document.body.appendChild(modal);
  }
  modal.innerHTML =
    '<div class="modal-backdrop" data-soon-close>' +
    '<div class="modal-box" data-soon-stop>' +
    '<div style="width:46px;height:46px;border-radius:14px;background:var(--gold-soft);color:var(--gold);display:flex;align-items:center;justify-content:center;margin:0 auto 14px;">' + icon('clock', 22) + '</div>' +
    '<div class="h" style="font-size:16px;font-weight:800;text-align:center;">Скоро появится</div>' +
    '<div style="font-size:12.5px;color:var(--tx2);text-align:center;margin-top:6px;line-height:1.5;">' + (label || 'Этот раздел') + ' пока в разработке — мы уже над этим работаем.</div>' +
    '<button class="btn-primary" style="width:100%;margin-top:18px;" data-soon-close>Понятно</button>' +
    '</div></div>';
  modal.style.display = 'block';
}
function hideComingSoon() {
  const modal = document.getElementById('soonModal');
  if (modal) modal.style.display = 'none';
}

// ---------- Screens ----------
function screenHome() {
  const popular = CARS.slice(0, 4);
  return '<div class="screen"><div class="scroll pad-nav">' +
    '<div class="topbar container"><div class="h" style="font-size:18px;font-weight:800;letter-spacing:.02em;">Potatuev <span style="color:var(--gold);">Auto</span></div>' +
    '<div style="display:flex;align-items:center;gap:14px;"><div style="display:flex;align-items:center;gap:5px;color:var(--tx2);font-size:12px;">' + icon('mapPin', 15) + ' Москва</div>' +
    '<button class="icon-btn" data-nav="contacts">' + icon('bell', 18) + '</button></div></div>' +

    '<div class="container" style="padding:0 20px;">' +
    '<div style="margin-top:14px;border-radius:24px;overflow:hidden;position:relative;height:240px;background:radial-gradient(130% 95% at 88% -12%, rgba(242,179,61,.24) 0%, rgba(242,179,61,0) 55%), linear-gradient(160deg,#201C15 0%,#161310 60%,#100F0D 100%);">' +
    '<div style="position:absolute;left:20px;right:20px;bottom:22px;">' +
    '<div style="font-size:11px;font-weight:700;letter-spacing:.1em;color:var(--gold);text-transform:uppercase;margin-bottom:8px;">Подбор и доставка</div>' +
    '<div class="h" style="font-size:24px;font-weight:800;line-height:1.12;margin-bottom:8px;">Автомобили<br>из Китая под ключ</div>' +
    '<div style="font-size:13px;color:var(--tx2);line-height:1.5;max-width:300px;">Проверенные поставщики, честная цена и сопровождение сделки от подбора до учёта в ГИБДД.</div></div></div>' +

    '<div style="display:flex;gap:10px;padding:16px 0 0;">' +
    '<button class="btn-primary" style="flex:1;" data-nav="finder">Подобрать авто</button>' +
    '<button class="btn-outline" style="flex:1;" data-nav="calculator">Рассчитать стоимость</button></div>' +

    '<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;padding:20px 0 0;">' +
    statBlock('1200+', 'доставлено авто') + statBlock('30–45', 'дней до получения') + statBlock('0%', 'скрытых доплат') + statBlock('36 мес', 'гарантия сервиса') + '</div>' +

    '<div style="padding:24px 0 0;display:flex;flex-direction:column;gap:10px;">' +
    advantage('percent', 'Честная цена', 'Фиксируем стоимость в договоре — без доплат по факту.') +
    advantage('truck', 'Полное сопровождение', 'Ведём сделку от подбора до постановки на учёт.') +
    advantage('shield', 'Проверка перед покупкой', 'Технический аудит и юридическая чистота каждого авто.') + '</div>' +

    '<div style="display:flex;align-items:center;justify-content:space-between;padding:26px 0 12px;">' +
    '<div class="h" style="font-size:17px;font-weight:700;">Популярные модели</div>' +
    '<span style="font-size:12px;color:var(--gold);font-weight:600;cursor:pointer;" data-nav="catalog">Все →</span></div></div>' +

    '<div class="scroll" style="display:flex;gap:12px;overflow-x:auto;padding:0 20px 4px;">' + popular.map(miniCard).join('') + '</div>' +

    '<div class="container" style="padding:0 20px;">' +
    '<div class="card" style="margin:24px 0 0;padding:16px;display:flex;align-items:center;gap:12px;cursor:pointer;" data-nav="how">' +
    '<div style="width:42px;height:42px;flex:none;border-radius:12px;background:var(--gold-soft);color:var(--gold);display:flex;align-items:center;justify-content:center;">' + icon('home', 20) + '</div>' +
    '<div style="flex:1;"><div style="font-size:13px;font-weight:700;">Как мы работаем</div><div style="font-size:11.5px;color:var(--tx2);margin-top:1px;">5 шагов от заявки до получения ключей</div></div>' +
    icon('chevronRight', 18) + '</div></div>' +
    '</div>' + bottomNav('home') + '</div>';
}

let catalogSearch = '';
let filterPanelOpen = false;
let catalogFilters = { brands: new Set(), bodies: new Set(), engines: new Set(), priceMax: null, yearMin: null, accelMax: null, rangeMin: null };
function resetCatalogFilters() {
  catalogFilters = { brands: new Set(), bodies: new Set(), engines: new Set(), priceMax: null, yearMin: null, accelMax: null, rangeMin: null };
  catalogSearch = '';
}
function activeFilterCount() {
  return catalogFilters.brands.size + catalogFilters.bodies.size + catalogFilters.engines.size +
    (catalogFilters.priceMax ? 1 : 0) + (catalogFilters.yearMin ? 1 : 0) + (catalogFilters.accelMax ? 1 : 0) + (catalogFilters.rangeMin ? 1 : 0);
}
function matchesCatalog(c) {
  const f = catalogFilters;
  if (f.brands.size && !f.brands.has(c.brand)) return false;
  if (f.bodies.size && !f.bodies.has(c.body)) return false;
  if (f.engines.size && !f.engines.has(c.type)) return false;
  if (f.priceMax && c.price > f.priceMax) return false;
  if (f.yearMin && c.year < f.yearMin) return false;
  if (f.accelMax && c.accel0 > f.accelMax) return false;
  if (f.rangeMin && c.rangeKm < f.rangeMin) return false;
  if (catalogSearch) {
    const q = catalogSearch.toLowerCase();
    if (!(c.brand.toLowerCase().indexOf(q) !== -1 || c.model.toLowerCase().indexOf(q) !== -1)) return false;
  }
  return true;
}
function catalogCountText() {
  const n = CARS.filter(matchesCatalog).length;
  return 'Найдено ' + n + ' ' + pluralRu(n, 'вариант', 'варианта', 'вариантов');
}
function renderCatalogResultsHTML() {
  const list = CARS.filter(matchesCatalog);
  return list.length ? list.map(carRow).join('') : emptyState('Ничего не найдено', 'Попробуйте изменить фильтры или сбросить их');
}
function catFilterChips(title, options, isOn, field) {
  return '<div style="padding-top:14px;"><div style="font-size:12px;font-weight:700;color:var(--tx2);">' + title + '</div>' +
    '<div style="display:flex;flex-wrap:wrap;gap:7px;margin-top:8px;">' +
    options.map(o => '<span class="' + (isOn(o.value) ? 'chip-on' : 'chip') + '" style="cursor:pointer;font-size:11.5px;padding:7px 12px;" data-catfilter="' + field + ':' + o.value + '">' + o.label + '</span>').join('') +
    '</div></div>';
}
function screenCatalog() {
  const f = catalogFilters;
  const brandOpts = ['Xiaomi', 'Zeekr', 'NIO', 'BYD', 'Li Auto'].map(v => ({ value: v, label: v }));
  const bodyOpts = ['Седан', 'Кроссовер', 'Лифтбэк'].map(v => ({ value: v, label: v }));
  const engineOpts = ['Электро', 'Гибрид'].map(v => ({ value: v, label: v }));
  const priceOpts = [4000000, 6000000, 8000000, 10000000].map(v => ({ value: v, label: 'до ' + (v / 1000000) + ' млн' }));
  const yearOpts = [2022, 2023, 2024, 2025].map(v => ({ value: v, label: v + '+' }));
  const accelOpts = [4, 5, 6, 8].map(v => ({ value: v, label: 'до ' + v + ' сек' }));
  const rangeOpts = [400, 500, 600, 700].map(v => ({ value: v, label: 'от ' + v + ' км' }));
  const count = activeFilterCount();
  const panel = filterPanelOpen ?
    '<div class="container" style="padding:0 20px;"><div class="card" style="margin-top:10px;padding:14px 16px 16px;">' +
    catFilterChips('Марка', brandOpts, v => f.brands.has(v), 'brand') +
    catFilterChips('Кузов', bodyOpts, v => f.bodies.has(v), 'body') +
    catFilterChips('Двигатель', engineOpts, v => f.engines.has(v), 'engine') +
    catFilterChips('Цена', priceOpts, v => f.priceMax === v, 'price') +
    catFilterChips('Год выпуска', yearOpts, v => f.yearMin === v, 'year') +
    catFilterChips('Разгон 0–100', accelOpts, v => f.accelMax === v, 'accel') +
    catFilterChips('Запас хода', rangeOpts, v => f.rangeMin === v, 'range') +
    '<div style="display:flex;gap:8px;margin-top:16px;">' +
    '<button class="btn-secondary" style="flex:1;" data-reset-filters>Сбросить</button>' +
    '<button class="btn-primary" style="flex:1;" data-toggle-filters>Готово</button></div>' +
    '</div></div>' : '';
  return '<div class="screen"><div class="scroll pad-nav">' +
    '<div class="container" style="padding:22px 20px 0;"><div class="h title-lg">Каталог</div><div class="subtitle">' + CARS.length + ' автомобилей в наличии и под заказ</div></div>' +
    '<div class="container" style="display:flex;gap:10px;padding:16px 20px 0;">' +
    '<div class="card" style="flex:1;display:flex;align-items:center;gap:8px;padding:0 14px;color:var(--tx3);">' + icon('search', 17) +
    '<input id="catalogSearchInput" placeholder="Марка, модель..." value="' + catalogSearch.replace(/"/g, '&quot;') + '" style="background:none;border:none;padding:12px 0;color:var(--tx1);">' + '</div>' +
    '<div class="icon-btn" style="width:46px;height:46px;position:relative;' + (filterPanelOpen || count ? 'background:var(--gold-soft);border-color:var(--gold);' : '') + '" data-toggle-filters>' + icon('sliders', 18, 1.9) +
    (count ? '<span style="position:absolute;top:-5px;right:-5px;background:var(--gold);color:var(--btn-tx);font-size:10px;font-weight:800;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;">' + count + '</span>' : '') +
    '</div></div>' +
    panel +
    '<div class="container" style="padding:14px 20px 4px;font-size:12px;color:var(--tx3);" id="catalogCountText">' + catalogCountText() + '</div>' +
    '<div class="container" style="display:flex;flex-direction:column;gap:12px;padding:12px 20px 4px;" id="catalogResults">' + renderCatalogResultsHTML() + '</div>' +
    '</div>' + bottomNav('catalog') + '</div>';
}

function screenCar(id) {
  const c = CARS.find(x => x.id === id) || CARS[0];
  const fav = isFav(c.id);
  return '<div class="screen"><div class="scroll pad-cta">' +
    '<div style="position:relative;"><img src="' + c.img + '" style="width:100%;height:280px;object-fit:cover;">' +
    '<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(18,17,16,.55) 0%,rgba(18,17,16,0) 22%,rgba(18,17,16,0) 70%,rgba(18,17,16,.9) 100%);"></div>' +
    '<div style="position:absolute;top:22px;left:20px;right:20px;display:flex;justify-content:space-between;">' +
    '<span class="icon-btn" style="background:rgba(18,17,16,.55);border:none;" data-nav="catalog">' + icon('chevronLeft', 18, 2) + '</span>' +
    '<button class="icon-btn" style="background:rgba(18,17,16,.55);border:none;color:' + (fav ? 'var(--gold)' : '#F5F1EA') + ';" data-fav="' + c.id + '">' + (fav ? iconFill('heart', 18) : icon('heart', 18)) + '</button>' +
    '</div></div>' +
    '<div class="container" style="padding:18px 20px 0;">' +
    '<div style="display:flex;justify-content:space-between;align-items:flex-start;">' +
    '<div><div class="h" style="font-size:21px;font-weight:800;">' + c.brand + ' ' + c.model + ' ' + c.year + '</div>' +
    '<div class="subtitle">' + (c.type === 'Электро' ? 'Электрический' : 'Гибридный') + ' ' + c.body.toLowerCase() + ' · ' + c.drive + '</div></div>' +
    '<span class="badge">В наличии</span></div>' +
    '<div class="h" style="font-size:24px;font-weight:800;color:var(--gold);margin-top:14px;">' + formatPrice(c.price) + '</div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:18px;">' +
    specTile('gauge', c.power, 'Мощность') + specTile('clock', c.accel, 'Разгон 0–100') + specTile('battery', c.range, 'Запас хода') + specTile('drive', c.drive, 'Привод') + '</div>' +
    '<div class="h" style="font-size:15px;font-weight:700;margin-top:22px;">Комплектация</div>' +
    '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;">' + c.options.map(o => '<span class="chip">' + o + '</span>').join('') + '</div>' +
    '<div class="h" style="font-size:15px;font-weight:700;margin-top:22px;">Оплата и доставка</div>' +
    '<div style="display:flex;flex-direction:column;gap:9px;margin-top:10px;">' +
    infoLine('truck', 'Доставка 30–35 дней, ж/д + автовоз') + infoLine('wallet', 'Возможна рассрочка от банка-партнёра') +
    infoLine('shield', 'Гарантия сервиса 24 месяца') + infoLine('cam', 'Видео-осмотр перед покупкой') + '</div></div></div>' +
    '<div class="sticky-cta"><div><div style="font-size:10.5px;color:var(--tx3);">Цена</div>' +
    '<div class="h" style="font-size:16px;font-weight:800;color:var(--gold);">' + c.price.toLocaleString('ru-RU') + ' ₽</div></div>' +
    '<button class="btn-primary" style="flex:1;" data-nav="order">Оставить заявку</button></div></div>';
}

let finderState = { budget: '4–6 млн', brands: new Set(['Zeekr']), body: 'Лифтбэк', year: 2023, fuel: 'Электро' };
function matchesFinder(c) {
  if (finderState.brands.size && !finderState.brands.has(c.brand)) return false;
  if (finderState.body && c.body !== finderState.body) return false;
  if (finderState.fuel && c.type !== finderState.fuel) return false;
  if (finderState.year && c.year < finderState.year) return false;
  const p = c.price;
  switch (finderState.budget) {
    case 'до 4 млн': return p < 4000000;
    case '4–6 млн': return p >= 4000000 && p <= 6000000;
    case '6–9 млн': return p > 6000000 && p <= 9000000;
    case '9 млн +': return p > 9000000;
    default: return true;
  }
}
function screenFinder() {
  const budgets = ['до 4 млн', '4–6 млн', '6–9 млн', '9 млн +'];
  const brands = ['Zeekr', 'NIO', 'Xiaomi', 'BYD', 'Li Auto'];
  const bodies = ['Седан', 'Кроссовер', 'Лифтбэк'];
  const years = [2022, 2023, 2024, 2025];
  const fuels = ['Электро', 'Гибрид'];
  const results = CARS.filter(matchesFinder);
  function chipRow(title, arr, isOn, field) {
    return '<div class="container" style="padding:20px 20px 0;"><div style="font-size:13px;font-weight:700;">' + title + '</div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;">' +
      arr.map(v => '<span class="' + (isOn(v) ? 'chip-on' : 'chip') + '" style="cursor:pointer;" data-finder="' + field + ':' + v + '">' + v + '</span>').join('') + '</div></div>';
  }
  return '<div class="screen"><div class="scroll pad-cta">' +
    topBack('Подбор автомобиля', null, 'home') +
    '<div class="container" style="padding:6px 20px 0;font-size:12.5px;color:var(--tx2);line-height:1.4;">Укажите параметры — подберём 2–3 варианта из наличия в Китае под ваш бюджет.</div>' +
    chipRow('Бюджет', budgets, v => finderState.budget === v, 'budget') +
    chipRow('Марка', brands, v => finderState.brands.has(v), 'brand') +
    chipRow('Тип кузова', bodies, v => finderState.body === v, 'body') +
    chipRow('Год выпуска не старше', years, v => finderState.year === v, 'year') +
    chipRow('Тип двигателя', fuels, v => finderState.fuel === v, 'fuel') +
    '<div class="container" style="padding:0 20px;"><div class="card" style="margin:26px 0 0;padding:16px;">' +
    '<div style="display:flex;align-items:center;gap:8px;color:var(--gold);">' + icon('star', 17) + '<div style="font-size:13.5px;font-weight:700;">Найдено ' + results.length + ' ' + pluralRu(results.length, 'автомобиль', 'автомобиля', 'автомобилей') + '</div></div>' +
    '<div style="font-size:12px;color:var(--tx2);margin-top:6px;">по вашим параметрам' + (results.length ? ', включая:' : '') + '</div>' +
    (results.length ? '<div style="display:flex;gap:8px;margin-top:12px;">' + results.slice(0, 3).map(c => '<div style="width:64px;height:52px;border-radius:11px;overflow:hidden;cursor:pointer;" data-nav="car/' + c.id + '"><img src="' + c.img + '" style="width:100%;height:100%;object-fit:cover;"></div>').join('') + '</div>' : '') +
    '</div></div></div>' +
    '<div class="sticky-cta" style="display:block;"><button class="btn-primary" style="width:100%;" data-nav="order">Оставить заявку на подбор</button></div></div>';
}

let calcCarId = 'zeekr001';
let calcPickerOpen = false;
function screenCalculator() {
  const c = CARS.find(x => x.id === calcCarId) || CARS[1];
  const logistics = 320000;
  const customs = Math.round(c.price * 0.18 / 10000) * 10000;
  const services = 400000;
  const total = c.price + logistics + customs + services;
  function row(label, value) {
    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:13px 0;border-bottom:1px solid var(--line);">' +
      '<div style="font-size:13px;color:var(--tx2);">' + label + '</div><div style="font-size:13.5px;font-weight:700;">' + value.toLocaleString('ru-RU') + ' ₽</div></div>';
  }
  const pickerList = calcPickerOpen ?
    '<div class="card" style="margin:8px 0 0;padding:6px;">' +
    CARS.map(x => '<div style="display:flex;align-items:center;gap:10px;padding:9px;border-radius:12px;cursor:pointer;' + (x.id === calcCarId ? 'background:var(--gold-soft);' : '') + '" data-pick-calc-car="' + x.id + '">' +
      '<div style="width:52px;height:40px;border-radius:9px;overflow:hidden;flex:none;"><img src="' + x.img + '" style="width:100%;height:100%;object-fit:cover;"></div>' +
      '<div style="flex:1;"><div style="font-size:12.5px;font-weight:700;">' + x.brand + ' ' + x.model + '</div><div style="font-size:10.5px;color:var(--tx3);margin-top:1px;">' + x.year + ' · ' + formatPrice(x.price) + '</div></div>' +
      (x.id === calcCarId ? '<span style="color:var(--gold);">' + icon('check', 16, 2.2) + '</span>' : '') +
      '</div>').join('') + '</div>' : '';
  return '<div class="screen"><div class="scroll pad-cta">' +
    topBack('Расчёт стоимости', null, 'home') +
    '<div class="container" style="padding:6px 20px 0;font-size:12.5px;color:var(--tx2);line-height:1.4;">Выберите автомобиль — рассчитаем полную стоимость доставки из Китая под ключ.</div>' +
    '<div class="container" style="padding:0 20px;">' +
    '<div class="card" style="margin:20px 0 0;padding:12px;display:flex;align-items:center;gap:12px;cursor:pointer;" data-toggle-calc-picker>' +
    '<div style="width:64px;height:52px;border-radius:12px;overflow:hidden;flex:none;"><img src="' + c.img + '" style="width:100%;height:100%;object-fit:cover;"></div>' +
    '<div style="flex:1;"><div style="font-size:13.5px;font-weight:700;">' + c.brand + ' ' + c.model + ', ' + c.year + '</div>' +
    '<div style="font-size:11px;color:var(--tx3);margin-top:2px;">' + c.type + ' · ' + c.drive + '</div></div>' +
    '<div style="display:flex;align-items:center;gap:4px;color:var(--gold);font-size:12px;font-weight:600;">Выбрать авто' + icon(calcPickerOpen ? 'chevronDown' : 'chevronRight', 14, 2) + '</div></div>' +
    pickerList +
    '<div class="card" style="margin:20px 0 0;padding:6px 16px 4px;">' +
    row('Стоимость авто в Китае', c.price) + row('Логистика до России', logistics) + row('Таможенная пошлина и сборы', customs) +
    '<div style="display:flex;justify-content:space-between;align-items:center;padding:13px 0;"><div style="font-size:13px;color:var(--tx2);">Услуги компании</div><div style="font-size:13.5px;font-weight:700;">' + services.toLocaleString('ru-RU') + ' ₽</div></div>' +
    '</div>' +
    '<div style="margin:14px 0 0;background:linear-gradient(135deg,rgba(242,179,61,.16),rgba(201,138,44,.08));border:1px solid var(--gold);border-radius:20px;padding:18px;">' +
    '<div style="font-size:12px;color:var(--tx2);">Итого ориентировочно</div><div class="h" style="font-size:26px;font-weight:800;color:var(--gold);margin-top:4px;">' + total.toLocaleString('ru-RU') + ' ₽</div></div>' +
    '<div style="display:flex;gap:9px;padding:16px 0 0;color:var(--tx3);font-size:11.5px;line-height:1.5;">Точная сумма фиксируется в договоре после подбора конкретного автомобиля и курса валют на дату сделки.</div>' +
    '</div></div>' +
    '<div class="sticky-cta" style="display:block;"><button class="btn-primary" style="width:100%;" data-nav="order">Отправить заявку на расчёт</button></div></div>';
}

function screenHow() {
  const steps = [
    ['Заявка', 'Оставляете заявку на сайте или пишете менеджеру в Telegram.'],
    ['Подбор', 'Находим 2–3 подходящих варианта под бюджет и задачи, с фото и видео с площадки.'],
    ['Договор', 'Заключаем договор, фиксируем итоговую цену и сроки поставки.'],
    ['Доставка', 'Везём автомобиль из Китая, проходим таможенное оформление в РФ.'],
    ['Получение', 'Ставим автомобиль на учёт и передаём вам ключи.']
  ];
  return '<div class="screen"><div class="scroll" style="padding-bottom:40px;">' +
    topBack('Как мы работаем', null, 'home') +
    '<div class="container" style="padding:6px 20px 0;font-size:12.5px;color:var(--tx2);line-height:1.4;">5 понятных шагов от первой заявки до получения ключей.</div>' +
    '<div class="container" style="padding:26px 20px 0;position:relative;">' +
    '<div style="position:absolute;left:38px;top:34px;bottom:34px;width:2px;background:var(--line);"></div>' +
    steps.map((s, i) =>
      '<div style="display:flex;gap:16px;padding-bottom:30px;position:relative;">' +
      '<div style="width:40px;height:40px;flex:none;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:15px;z-index:1;' +
      (i === 0 ? 'background:var(--gold);color:var(--btn-tx);' : 'background:var(--bg3);border:1.5px solid var(--line);color:var(--tx3);') + '">' + (i + 1) + '</div>' +
      '<div style="padding-top:6px;"><div style="font-size:14.5px;font-weight:700;">' + s[0] + '</div>' +
      '<div style="font-size:12.5px;color:var(--tx2);line-height:1.5;margin-top:4px;max-width:250px;">' + s[1] + '</div></div></div>'
    ).join('') + '</div>' +
    '<div class="container" style="padding:0 20px;"><div class="card" style="margin:8px 0 0;padding:16px;">' +
    '<div style="font-size:14px;font-weight:700;margin-bottom:10px;">Почему с нами выгодно</div>' +
    '<div style="display:flex;flex-direction:column;gap:9px;">' +
    ['Прямые поставки из Китая, без посредников', 'Без скрытых платежей на любом этапе', 'Помощь в выборе и полная проверка авто'].map(t =>
      '<div style="display:flex;align-items:center;gap:9px;"><span style="color:var(--gold);">' + icon('check', 16, 2) + '</span><div style="font-size:12.5px;color:var(--tx2);">' + t + '</div></div>'
    ).join('') + '</div></div></div>' +
    '</div><div class="sticky-cta" style="display:block;"><button class="btn-primary" style="width:100%;" data-nav="finder">Оставить заявку</button></div></div>';
}

function screenServices() {
  const services = [
    ['search', 'Подбор автомобиля', 'Найдём модель под бюджет и задачи, с фото и видео с площадки в Китае.', 'finder'],
    ['shield', 'Проверка и аудит', 'Технический осмотр, история пробега и юридическая чистота перед покупкой.', null],
    ['truck', 'Доставка и растаможка', 'Полное сопровождение перевозки и таможенного оформления в РФ.', 'calculator'],
    ['doc', 'Документы и регистрация', 'Оформим ЭПТС, поставим на учёт в ГИБДД, поможем со страховкой.', null]
  ];
  return '<div class="screen"><div class="scroll" style="padding-bottom:40px;">' +
    topBack('Услуги', null, 'home') +
    '<div class="container" style="padding:6px 20px 0;font-size:12.5px;color:var(--tx2);line-height:1.4;">Полный цикл: от подбора модели до постановки на учёт.</div>' +
    '<div class="container" style="display:flex;flex-direction:column;gap:12px;padding:20px 20px 0;">' +
    services.map(s => '<div class="card" style="padding:16px;display:flex;gap:14px;align-items:flex-start;cursor:pointer;" ' + (s[3] ? 'data-nav="' + s[3] + '"' : 'data-soon="' + s[1] + '"') + '>' +
      '<div style="width:46px;height:46px;flex:none;border-radius:13px;background:var(--gold-soft);color:var(--gold);display:flex;align-items:center;justify-content:center;">' + icon(s[0], 22) + '</div>' +
      '<div style="flex:1;"><div style="font-size:14.5px;font-weight:700;">' + s[1] + '</div><div style="font-size:12.5px;color:var(--tx2);line-height:1.5;margin-top:4px;">' + s[2] + '</div></div>' +
      icon('chevronRight', 17) + '</div>').join('') + '</div>' +
    '<div class="container" style="padding:0 20px;"><div class="card" style="margin:22px 0 0;padding:16px;display:flex;align-items:center;gap:12px;cursor:pointer;" data-nav="contacts">' +
    '<div style="width:42px;height:42px;flex:none;border-radius:12px;background:var(--gold-soft);color:var(--gold);display:flex;align-items:center;justify-content:center;">' + icon('bell', 20) + '</div>' +
    '<div style="flex:1;"><div style="font-size:13px;font-weight:700;">Остались вопросы?</div><div style="font-size:11.5px;color:var(--tx2);margin-top:1px;">Персональный менеджер ответит за 15 минут</div></div>' +
    icon('chevronRight', 17) + '</div></div></div></div>';
}

function screenFavorites() {
  const list = CARS.filter(c => isFav(c.id));
  return '<div class="screen"><div class="scroll pad-nav">' +
    '<div class="container" style="padding:22px 20px 14px;"><div class="h title-lg">Избранное</div>' +
    '<div class="subtitle">' + list.length + ' ' + pluralRu(list.length, 'сохранённый автомобиль', 'сохранённых автомобиля', 'сохранённых автомобилей') + '</div></div>' +
    '<div class="container" style="display:flex;flex-direction:column;gap:12px;padding:8px 20px 0;">' +
    (list.length ? list.map(c =>
      '<div class="card" style="overflow:hidden;">' +
      '<div style="position:relative;height:150px;cursor:pointer;" data-nav="car/' + c.id + '"><img src="' + c.img + '" style="width:100%;height:100%;object-fit:cover;">' +
      '<button class="heart-btn" data-fav="' + c.id + '" style="position:absolute;top:12px;right:12px;width:34px;height:34px;color:var(--gold);">' + iconFill('heart', 17) + '</button></div>' +
      '<div style="padding:13px 14px;display:flex;align-items:center;justify-content:space-between;">' +
      '<div><div style="font-size:14px;font-weight:700;">' + c.brand + ' ' + c.model + '</div>' +
      '<div style="font-size:11px;color:var(--tx3);margin:2px 0 4px;">' + c.year + ' год · ' + c.type + '</div>' +
      '<div style="font-size:14px;font-weight:700;color:var(--gold);">' + formatPrice(c.price) + '</div></div>' +
      '<button class="btn-secondary" data-nav="order">Заявка</button></div></div>'
    ).join('') : emptyState('Пока пусто', 'Добавляйте автомобили в избранное нажатием на сердце')) + '</div>' +
    '</div>' + bottomNav('favorites') + '</div>';
}

function screenProfile() {
  function mi(iconName, label, count, target) {
    const attr = target ? 'data-nav="' + target + '"' : 'data-soon="' + label + '"';
    return '<div style="display:flex;align-items:center;gap:12px;padding:14px 4px;border-bottom:1px solid var(--line);cursor:pointer;" ' + attr + '>' +
      '<span style="color:var(--gold);">' + icon(iconName, 19) + '</span><div style="flex:1;font-size:13.5px;font-weight:600;">' + label + '</div>' +
      (count ? '<div style="font-size:11.5px;color:var(--tx3);">' + count + '</div>' : '') + icon('chevronRight', 15) + '</div>';
  }
  return '<div class="screen"><div class="scroll pad-nav">' +
    '<div class="container" style="padding:22px 20px 14px;"><div class="h title-lg">Профиль</div></div>' +
    '<div class="container" style="padding:0 20px;">' +
    '<div class="card" style="padding:16px;display:flex;align-items:center;gap:14px;">' +
    '<div class="h" style="width:56px;height:56px;border-radius:16px;background:linear-gradient(135deg,#F7C25C,#E4A029);color:var(--btn-tx);display:flex;align-items:center;justify-content:center;font-size:19px;font-weight:800;flex:none;">ИП</div>' +
    '<div style="flex:1;"><div style="font-size:15px;font-weight:700;">Иван Петров</div><div style="font-size:12px;color:var(--tx3);margin-top:2px;">+7 (999) 555-12-34</div></div>' +
    '<div class="icon-btn" style="cursor:pointer;" data-soon="Редактирование профиля">' + icon('edit', 16) + '</div></div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:14px 0 0;">' +
    '<div class="card" style="padding:13px;text-align:center;cursor:pointer;" data-soon="Мои заявки"><div class="h" style="font-size:19px;font-weight:800;color:var(--gold);">2</div><div style="font-size:11px;color:var(--tx3);margin-top:2px;">активные заявки</div></div>' +
    '<div class="card" style="padding:13px;text-align:center;cursor:pointer;" data-nav="order"><div class="h" style="font-size:19px;font-weight:800;color:var(--gold);">1</div><div style="font-size:11px;color:var(--tx3);margin-top:2px;">заказ в пути</div></div></div>' +
    '<div class="card" style="margin:20px 0 0;padding:4px 14px;">' +
    mi('doc', 'Мои заявки', 2) + mi('truck', 'Мои заказы', 1, 'order') + mi('clock', 'История заказов') + mi('heart', 'Избранное', [...favorites].length, 'favorites') +
    mi('wallet', 'Способы оплаты') + mi('grid', 'Услуги', null, 'services') + mi('home', 'Как мы работаем', null, 'how') + mi('bell', 'Контакты и поддержка', null, 'contacts') + '</div>' +
    '<div style="margin:14px 0 30px;display:flex;align-items:center;gap:10px;padding:14px 4px;color:var(--danger);cursor:pointer;" data-soon="Выход из аккаунта">' +
    icon('logout', 18) + '<div style="font-size:13.5px;font-weight:600;">Выйти из аккаунта</div></div>' +
    '</div></div>' + bottomNav('profile') + '</div>';
}

function screenOrder() {
  const c = CARS[1]; // Zeekr 001 — демонстрационный активный заказ
  function step(n, title, sub, state) {
    const style = state === 'done' ? 'background:var(--ok);color:#0F1A10;' : state === 'active' ? 'background:var(--gold);color:var(--btn-tx);' : 'background:var(--bg3);border:1.5px solid var(--line);color:var(--tx3);';
    return '<div style="display:flex;gap:14px;padding-bottom:22px;position:relative;">' +
      '<div style="width:32px;height:32px;flex:none;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;z-index:1;' + style + '">' +
      (state === 'done' ? icon('check', 15, 2.4) : n) + '</div>' +
      '<div style="padding-top:5px;"><div style="font-size:13.5px;font-weight:700;' + (state === 'todo' ? 'color:var(--tx2);' : '') + '">' + title + '</div>' +
      '<div style="font-size:11px;color:var(--tx3);margin-top:2px;">' + sub + '</div></div></div>';
  }
  return '<div class="screen"><div class="scroll" style="padding-bottom:40px;">' +
    '<div class="topbar-back"><span class="back-arrow icon-btn" style="background:none;border:none;color:var(--tx1);" data-nav="profile">' + icon('chevronLeft', 20, 2) + '</span>' +
    '<div><div class="h" style="font-size:18px;font-weight:800;">Заказ PA-260914</div><div style="font-size:11.5px;color:var(--tx3);margin-top:1px;">Оформлен 3 сентября 2026</div></div></div>' +
    '<div class="container" style="padding:0 20px;">' +
    '<div class="card" style="margin:18px 0 0;padding:12px;display:flex;gap:12px;align-items:center;">' +
    '<div style="width:80px;height:64px;border-radius:12px;overflow:hidden;flex:none;"><img src="' + c.img + '" style="width:100%;height:100%;object-fit:cover;"></div>' +
    '<div style="flex:1;"><div style="font-size:14px;font-weight:700;">' + c.brand + ' ' + c.model + ', ' + c.year + '</div>' +
    '<div style="font-size:11px;color:var(--tx3);margin-top:2px;">' + c.type + ' · ' + c.drive + '</div>' +
    '<div style="font-size:14px;font-weight:700;color:var(--gold);margin-top:4px;">' + c.price.toLocaleString('ru-RU') + ' ₽</div></div></div>' +
    '<div style="margin:20px 0 0;background:var(--gold-soft);border:1px solid var(--gold);border-radius:14px;padding:12px 14px;display:flex;align-items:center;gap:10px;">' +
    '<div style="width:8px;height:8px;border-radius:50%;background:var(--gold);flex:none;"></div><div style="font-size:13px;font-weight:700;color:var(--gold);">Статус: автомобиль в пути из Китая</div></div>' +
    '<div style="padding:20px 0 0;position:relative;"><div style="position:absolute;left:30px;top:28px;bottom:28px;width:2px;background:var(--line);"></div>' +
    step(1, 'Договор подписан', '28 августа 2026', 'done') + step(2, 'Оплата получена', '3 сентября 2026', 'done') +
    step(3, 'Доставка из Китая', 'В пути, ориентир — 20 сентября 2026', 'active') +
    step(4, 'Таможенное оформление', 'Ожидает прибытия', 'todo') + step(5, 'Готов к выдаче', 'Ожидает таможню', 'todo') + '</div>' +
    '<div class="h" style="font-size:14px;font-weight:700;padding:6px 0 0;">Документы</div>' +
    '<div class="card" style="margin:10px 0 0;padding:6px 14px;">' +
    ['Договор купли-продажи;Готово;ok', 'Инвойс поставщика;Готово;ok', 'ЭПТС;В процессе;gold', 'Полис ОСАГО;Ожидает;tx3'].map((r, i, arr) => {
      const [label, status, color] = r.split(';');
      return '<div style="display:flex;align-items:center;justify-content:space-between;padding:11px 0;' + (i < arr.length - 1 ? 'border-bottom:1px solid var(--line);' : '') + '">' +
        '<div style="font-size:12.5px;">' + label + '</div><div style="font-size:11px;font-weight:700;color:var(--' + color + ');">' + status + '</div></div>';
    }).join('') + '</div>' +
    '<div class="card" style="margin:16px 0 0;padding:13px;display:flex;align-items:center;gap:12px;">' +
    '<div class="h" style="width:42px;height:42px;border-radius:12px;background:linear-gradient(135deg,#F7C25C,#E4A029);color:var(--btn-tx);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:15px;flex:none;">АС</div>' +
    '<div style="flex:1;"><div style="font-size:13px;font-weight:700;">Артём Соколов</div><div style="font-size:11px;color:var(--tx3);margin-top:1px;">Ваш менеджер по заказу</div></div>' +
    '<a href="https://t.me/potatuevauto_manager" target="_blank" rel="noopener" class="icon-btn" style="background:var(--gold-soft);border-color:var(--gold);">' + icon('telegram', 16) + '</a></div>' +
    '</div></div></div>';
}

function screenContacts() {
  return '<div class="screen"><div class="scroll" style="padding-bottom:40px;">' +
    topBack('Контакты', 'Мы на связи каждый день', 'home') +
    '<div class="container" style="padding:0 20px;">' +
    '<div class="card" style="padding:16px;display:flex;align-items:center;gap:13px;">' +
    '<div class="h" style="width:52px;height:52px;border-radius:15px;background:linear-gradient(135deg,#F7C25C,#E4A029);color:var(--btn-tx);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:17px;flex:none;">АС</div>' +
    '<div style="flex:1;"><div style="font-size:14px;font-weight:700;">Артём Соколов</div><div style="font-size:11.5px;color:var(--tx3);margin-top:1px;">Персональный менеджер</div>' +
    '<div style="display:flex;align-items:center;gap:5px;margin-top:5px;color:var(--gold);font-size:11px;font-weight:600;"><div style="width:6px;height:6px;border-radius:50%;background:var(--gold);"></div>Отвечает в течение 15 минут</div></div></div>' +
    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:16px 0 0;">' +
    ['phone;WhatsApp;https://wa.me/79991234567', 'telegram;Telegram;https://t.me/potatuevauto_manager', 'phone;Позвонить;tel:+79991234567'].map(s => {
      const [ic, label, href] = s.split(';');
      return '<a href="' + href + '" target="_blank" rel="noopener" class="card" style="padding:14px 8px;display:flex;flex-direction:column;align-items:center;gap:7px;color:var(--tx1);">' +
        '<span style="color:var(--gold);">' + icon(ic, 20) + '</span><div style="font-size:11px;font-weight:600;">' + label + '</div></a>';
    }).join('') + '</div>' +
    '<div style="margin:16px 0 0;display:flex;flex-direction:column;gap:9px;">' +
    infoLine('phone', '+7 (999) 123-45-67') + infoLine('telegram', '@potatuevauto_manager') + infoLine('clock', 'Пн–Вс, 9:00–21:00 (МСК)') + '</div>' +
    '<div class="h" style="font-size:14.5px;font-weight:700;padding:22px 0 0;">Напишите нам</div>' +
    '<div id="contactForm" style="display:flex;flex-direction:column;gap:10px;padding:12px 0 0;">' +
    '<input id="cName" placeholder="Ваше имя"><input id="cPhone" placeholder="Телефон">' +
    '<textarea rows="3" placeholder="Расскажите, какой автомобиль интересует"></textarea>' +
    '<button id="contactSubmitBtn" class="btn-primary" style="margin-top:4px;">Отправить обращение</button>' +
    '<div id="contactNote" style="display:none;font-size:12px;color:var(--ok);text-align:center;">Заявка отправлена — менеджер свяжется с вами в Telegram.</div>' +
    '</div></div></div></div>';
}

// ---------- Router ----------
const ROOT_TABS = ['home', 'catalog', 'favorites', 'profile'];
const BACK_TARGETS = { car: 'catalog', finder: 'home', calculator: 'home', how: 'home', services: 'home', contacts: 'home', order: 'profile' };
const SCREEN_MAP = { home: screenHome, catalog: screenCatalog, finder: screenFinder, calculator: screenCalculator, how: screenHow, services: screenServices, favorites: screenFavorites, profile: screenProfile, order: screenOrder, contacts: screenContacts };

function currentRoute() {
  return location.hash.replace(/^#\/?/, '') || 'home';
}
function render() {
  const route = currentRoute();
  const root = route.split('/')[0];
  const html = root === 'car' ? screenCar(route.split('/')[1]) : (SCREEN_MAP[root] || screenHome)();
  document.getElementById('app').innerHTML = html;
  const sc = document.querySelector('.scroll');
  if (sc) sc.scrollTop = 0;
  updateTelegramBack(root);
}
function updateTelegramBack(root) {
  if (!tg || !tg.BackButton) return;
  if (ROOT_TABS.includes(root)) {
    tg.BackButton.hide();
    if (tgBackHandler) { tg.BackButton.offClick(tgBackHandler); tgBackHandler = null; }
  } else {
    tg.BackButton.show();
    if (tgBackHandler) tg.BackButton.offClick(tgBackHandler);
    const target = BACK_TARGETS[root] || 'home';
    tgBackHandler = function () { location.hash = '#/' + target; };
    tg.BackButton.onClick(tgBackHandler);
  }
}

// ---------- Event delegation ----------
document.addEventListener('click', function (e) {
  // "Скоро появится" modal
  const soonOk = e.target.closest('#soonModal [data-soon-close]');
  if (soonOk) { hideComingSoon(); return; }
  const soonStop = e.target.closest('#soonModal [data-soon-stop]');
  if (soonStop) { return; }

  const submitEl = e.target.closest('#contactSubmitBtn');
  if (submitEl) {
    submitEl.textContent = 'Заявка отправлена';
    submitEl.disabled = true;
    const note = document.getElementById('contactNote');
    if (note) note.style.display = 'block';
    return;
  }
  const finderEl = e.target.closest('[data-finder]');
  if (finderEl) {
    const parts = finderEl.dataset.finder.split(':');
    const field = parts[0], value = parts[1];
    if (field === 'brand') { finderState.brands.has(value) ? finderState.brands.delete(value) : finderState.brands.add(value); }
    else if (field === 'year') { finderState.year = parseInt(value, 10); }
    else { finderState[field] = value; }
    render(); return;
  }

  const catFilterEl = e.target.closest('[data-catfilter]');
  if (catFilterEl) {
    const parts = catFilterEl.dataset.catfilter.split(':');
    const field = parts[0], raw = parts[1];
    const f = catalogFilters;
    if (field === 'brand') { f.brands.has(raw) ? f.brands.delete(raw) : f.brands.add(raw); }
    else if (field === 'body') { f.bodies.has(raw) ? f.bodies.delete(raw) : f.bodies.add(raw); }
    else if (field === 'engine') { f.engines.has(raw) ? f.engines.delete(raw) : f.engines.add(raw); }
    else if (field === 'price') { const v = Number(raw); f.priceMax = f.priceMax === v ? null : v; }
    else if (field === 'year') { const v = Number(raw); f.yearMin = f.yearMin === v ? null : v; }
    else if (field === 'accel') { const v = Number(raw); f.accelMax = f.accelMax === v ? null : v; }
    else if (field === 'range') { const v = Number(raw); f.rangeMin = f.rangeMin === v ? null : v; }
    render(); return;
  }
  const toggleFiltersEl = e.target.closest('[data-toggle-filters]');
  if (toggleFiltersEl) { filterPanelOpen = !filterPanelOpen; render(); return; }
  const resetFiltersEl = e.target.closest('[data-reset-filters]');
  if (resetFiltersEl) { resetCatalogFilters(); render(); return; }

  const toggleCalcEl = e.target.closest('[data-toggle-calc-picker]');
  if (toggleCalcEl) { calcPickerOpen = !calcPickerOpen; render(); return; }
  const pickCalcEl = e.target.closest('[data-pick-calc-car]');
  if (pickCalcEl) { calcCarId = pickCalcEl.dataset.pickCalcCar; calcPickerOpen = false; render(); return; }

  const favEl = e.target.closest('[data-fav]');
  if (favEl) { toggleFavorite(favEl.dataset.fav); return; }

  const soonEl = e.target.closest('[data-soon]');
  if (soonEl) { showComingSoon(soonEl.dataset.soon); return; }

  const navEl = e.target.closest('[data-nav]');
  if (navEl) { location.hash = '#/' + navEl.dataset.nav; }
});

document.addEventListener('input', function (e) {
  if (e.target && e.target.id === 'catalogSearchInput') {
    catalogSearch = e.target.value;
    const resultsEl = document.getElementById('catalogResults');
    const countEl = document.getElementById('catalogCountText');
    if (resultsEl) resultsEl.innerHTML = renderCatalogResultsHTML();
    if (countEl) countEl.textContent = catalogCountText();
  }
});

window.addEventListener('hashchange', render);
window.addEventListener('DOMContentLoaded', function () {
  initTelegram();
  render();
  initSplash();
});

function initSplash() {
  const splash = document.getElementById('splash');
  if (!splash) return;
  const car = document.getElementById('splashCar');
  const logo = document.getElementById('splashLogo');
  let closed = false;
  const timers = [];
  function closeSplash() {
    if (closed) return;
    closed = true;
    timers.forEach(clearTimeout);
    splash.classList.add('splash-hide');
    setTimeout(function () { splash.remove(); }, 400);
  }
  splash.addEventListener('click', closeSplash);
  timers.push(setTimeout(function () { if (car) car.classList.add('go'); }, 200));
  timers.push(setTimeout(function () { if (logo) logo.classList.add('show'); }, 200 + 2700));
  timers.push(setTimeout(closeSplash, 4600));
}
