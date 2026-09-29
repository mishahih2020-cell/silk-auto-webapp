// Синхронизация каталога с Carapis API (che168, dongchedi, encar).
// Запускается через GitHub Actions вручную (кнопка "Run workflow" в разделе Actions)
// или из командной строки: CARAPIS_API_KEY=... node scripts/sync-cars.js
//
// Требует Node 18+ (используется глобальный fetch).

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.CARAPIS_API_KEY;
if (!API_KEY) {
  console.error('Ошибка: переменная окружения CARAPIS_API_KEY не задана.');
  process.exit(1);
}

const BASE_URL = 'https://api.carapis.com/v2/listings';
const SOURCES = ['che168', 'dongchedi', 'encar'];
const PAGE_LIMIT = 50;
// Защитный потолок на источник, чтобы один прогон не съедал весь месячный лимит запросов.
const MAX_PAGES_PER_SOURCE = 10;

// Приблизительные курсы к рублю на дату написания скрипта (сентябрь 2026).
// Это грубая оценка для отображения цены — перед продакшеном стоит брать курс
// из актуального источника (например, ЦБ РФ) на момент синхронизации.
const FX_TO_RUB = { CNY: 12.5, KRW: 0.061, RUB: 1, USD: 95 };

const ENGINE_LABEL = {
  gasoline: 'Бензин', petrol: 'Бензин', gas: 'Бензин',
  diesel: 'Дизель',
  electric: 'Электро', ev: 'Электро',
  hybrid: 'Гибрид', phev: 'Гибрид'
};

async function fetchSource(source) {
  const items = [];
  let page = 1;
  let total = Infinity;
  while (items.length < total && page <= MAX_PAGES_PER_SOURCE) {
    const url = BASE_URL + '?source=' + source + '&limit=' + PAGE_LIMIT + '&page=' + page;
    let res;
    try {
      res = await fetch(url, { headers: { Authorization: 'Bearer ' + API_KEY } });
    } catch (e) {
      console.error('[' + source + '] сетевая ошибка на странице ' + page + ':', e.message);
      break;
    }
    if (!res.ok) {
      console.error('[' + source + '] страница ' + page + ': HTTP ' + res.status);
      break;
    }
    const data = await res.json();
    const results = Array.isArray(data.results) ? data.results : [];
    if (typeof data.count === 'number') total = data.count;
    if (!results.length) break;

    if (page === 1) {
      console.log('[' + source + '] пример сырого объекта от Carapis:');
      console.log(JSON.stringify(results[0], null, 2));
    }

    items.push.apply(items, results);
    console.log('[' + source + '] получено ' + items.length + ' из ' + (isFinite(total) ? total : '?'));
    page++;
  }
  return items;
}

function normalize(raw, source) {
  const currency = (raw.currency || 'RUB').toUpperCase();
  const rate = FX_TO_RUB[currency] || 1;
  const priceRub = raw.price ? Math.round((raw.price * rate) / 1000) * 1000 : null;
  const fuelKey = (raw.fuel_type || raw.fuelType || '').toString().toLowerCase();
  const engineType = ENGINE_LABEL[fuelKey] || (raw.fuel_type || null);
  const photos = Array.isArray(raw.photos) ? raw.photos.filter(Boolean) : [];

  return {
    id: source + '_' + (raw.id || Math.random().toString(36).slice(2)),
    brand: raw.make || raw.brand || 'Неизвестно',
    model: [raw.model, raw.trim].filter(Boolean).join(' ') || 'Модель не указана',
    year: raw.year || null,
    price: priceRub,
    type: engineType,
    body: raw.body_type || raw.bodyType || raw.body || null,
    img: photos[0] || 'assets/car_zeekr001.jpg',
    mileageKm: typeof raw.mileage === 'number' ? raw.mileage : null,
    power: raw.power ? raw.power + ' л.с.' : null,
    accel: raw.acceleration ? raw.acceleration + ' сек' : null,
    accel0: typeof raw.acceleration === 'number' ? raw.acceleration : null,
    range: raw.range ? raw.range + ' км' : null,
    rangeKm: typeof raw.range === 'number' ? raw.range : null,
    drive: raw.drivetrain || raw.transmission || null,
    options: Array.isArray(raw.options) ? raw.options.slice(0, 6) : [],
    sourceUrl: raw.url || null,
    source: source
  };
}

async function main() {
  let all = [];
  for (const source of SOURCES) {
    try {
      const raw = await fetchSource(source);
      all = all.concat(raw.map(function (r) { return normalize(r, source); }));
    } catch (e) {
      console.error('[' + source + '] ошибка синхронизации:', e.message);
    }
  }

  const before = all.length;
  all = all.filter(function (c) { return c.price && c.brand; });
  console.log('Всего получено: ' + before + ', с ценой и маркой: ' + all.length);

  if (!all.length) {
    console.error('Ни одного пригодного объявления не получено — cars.js не изменён.');
    process.exit(1);
  }

  const outPath = path.join(__dirname, '..', 'cars.js');
  const fileContent =
    '// Каталог автомобилей — автоматически сгенерировано scripts/sync-cars.js из Carapis API\n' +
    '// Последняя синхронизация: ' + new Date().toISOString() + '\n' +
    'const CARS = ' + JSON.stringify(all, null, 2) + ';\n\n' +
    'function formatPrice(n) {\n' +
    "  return 'от ' + n.toLocaleString('ru-RU') + ' ₽';\n" +
    '}\n\n' +
    'function pluralRu(n, one, few, many) {\n' +
    '  const mod10 = Math.abs(n) % 10;\n' +
    '  const mod100 = Math.abs(n) % 100;\n' +
    '  if (mod100 >= 11 && mod100 <= 14) return many;\n' +
    '  if (mod10 === 1) return one;\n' +
    '  if (mod10 >= 2 && mod10 <= 4) return few;\n' +
    '  return many;\n' +
    '}\n';

  fs.writeFileSync(outPath, fileContent, 'utf8');
  console.log('cars.js обновлён: ' + all.length + ' автомобилей.');
}

main().catch(function (e) {
  console.error('Критическая ошибка синхронизации:', e);
  process.exit(1);
});
