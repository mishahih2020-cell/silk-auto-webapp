// Синхронизация каталога с реальными данными через Apify (che168, dongchedi, encar).
// Запускается через GitHub Actions вручную (кнопка "Run workflow" в разделе Actions,
// либо через кнопку в админке приложения) или из командной строки:
//   APIFY_API_TOKEN=... node scripts/sync-cars.js
//
// Требует Node 18+ (используется глобальный fetch).
//
// Почему Apify, а не Carapis: у Carapis документированный эндпоинт api.carapis.com/v2
// на практике отдаёт заглушку "nothing here yet" — API не работает. Каждый из трёх
// акторов Apify ниже проверен вручную реальным тестовым запуском и вернул настоящие
// данные (см. историю чата от 29 сентября 2026).

const fs = require('fs');
const path = require('path');

const APIFY_TOKEN = process.env.APIFY_API_TOKEN;
if (!APIFY_TOKEN) {
  console.error('Ошибка: переменная окружения APIFY_API_TOKEN не задана.');
  process.exit(1);
}

const APIFY_BASE = 'https://api.apify.com/v2';

// Приблизительные курсы к рублю на дату написания скрипта (сентябрь 2026).
// Грубая оценка для отображения цены — перед продакшеном стоит брать курс
// из актуального источника (например, ЦБ РФ) на момент синхронизации.
const FX_TO_RUB = { CNY: 12.5, KRW: 0.061, RUB: 1, USD: 95 };

// Китайские названия брендов (с dongchedi/che168) -> латиница, для читаемости в UI.
const CN_BRAND = {
  '奔驰': 'Mercedes-Benz', '宝马': 'BMW', '大众': 'Volkswagen', '奥迪': 'Audi',
  '小米汽车': 'Xiaomi Auto', '特斯拉': 'Tesla', '本田': 'Honda', '丰田': 'Toyota',
  '吉利汽车': 'Geely', '坦克': 'Tank', '路虎': 'Land Rover', '比亚迪': 'BYD',
  '红旗': 'Hongqi', '理想汽车': 'Li Auto', '雷克萨斯': 'Lexus', '凯迪拉克': 'Cadillac',
  '保时捷': 'Porsche', '蔚来': 'NIO', '极氪': 'Zeekr', '小鹏汽车': 'Xpeng',
  '现代': 'Hyundai', '沃尔沃': 'Volvo', '福特': 'Ford', '日产': 'Nissan',
  '广汽传祺': 'GAC Trumpchi', '别克': 'Buick', '长安': 'Changan', '腾势': 'Denza',
  '奇瑞': 'Chery', '北京越野': 'Beijing Offroad', '方程豹': 'Fangchengbao',
  '哈弗': 'Haval', '零跑汽车': 'Leapmotor', '五菱汽车': 'Wuling', '广汽本田': 'GAC Honda',
  '广汽丰田': 'GAC Toyota'
};
// Корейские названия брендов (с encar) -> латиница.
const KR_BRAND = {
  '현대': 'Hyundai', '기아': 'Kia', '제네시스': 'Genesis', '쉐보레': 'Chevrolet',
  '쌍용': 'KG Mobility', 'KG모빌리티': 'KG Mobility', '벤츠': 'Mercedes-Benz',
  '아우디': 'Audi', '지프': 'Jeep', '랜드로버': 'Land Rover', '포르쉐': 'Porsche',
  '렉서스': 'Lexus', '볼보': 'Volvo', '토요타': 'Toyota', '혼다': 'Honda',
  '닛산': 'Nissan', '폭스바겐': 'Volkswagen', '미니': 'MINI', 'BMW': 'BMW'
};

async function apifyRunSync(actorId, input, maxTimeMs) {
  const url = APIFY_BASE + '/acts/' + actorId + '/run-sync-get-dataset-items?token=' + APIFY_TOKEN;
  const controller = new AbortController();
  const timer = setTimeout(function () { controller.abort(); }, maxTimeMs || 110000);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      signal: controller.signal
    });
    if (!res.ok) {
      const text = await res.text();
      console.error('[' + actorId + '] HTTP ' + res.status + ': ' + text.slice(0, 300));
      return [];
    }
    return await res.json();
  } catch (e) {
    console.error('[' + actorId + '] ошибка запроса:', e.message);
    return [];
  } finally {
    clearTimeout(timer);
  }
}

// ---------- che168 ----------
const CHE168_SEARCHES = [
  { url: 'https://www.che168.com/china/dazhong/gaoerfu/', brand: 'Volkswagen', model: 'Golf' },
  { url: 'https://www.che168.com/beijing/baoma/x5/', brand: 'BMW', model: 'X5' }
];

// Фото с che168 (autoimg.cn) отдают HTTP 403, если Referer запроса — не сам che168
// (проверено вручную 29.09.2026). dongchedi и encar так не делают, там прокси не нужен.
// images.weserv.nl — бесплатный публичный прокси без регистрации: сам ходит за
// картинкой без нашего Referer, из-за чего блокировка не срабатывает.
function proxyImage(url) {
  if (!url) return null;
  return 'https://images.weserv.nl/?url=' + encodeURIComponent(url.replace(/^https?:\/\//, ''));
}

async function fetchChe168() {
  const out = [];
  for (const s of CHE168_SEARCHES) {
    console.log('[che168] запрос: ' + s.brand + ' ' + s.model);
    const items = await apifyRunSync('zen-studio~che168-car-scraper', {
      searchUrl: s.url, maxResults: 25, enrichPhone: false
    });
    console.log('[che168] ' + s.brand + ' ' + s.model + ': получено ' + items.length);
    for (const raw of items) {
      if (!raw || !raw.infoid) continue;
      const priceCny = typeof raw.price === 'number' ? raw.price * 10000 : null;
      out.push({
        id: 'che168_' + raw.infoid,
        brand: s.brand,
        model: (raw.carname || s.model).replace(new RegExp('^' + s.model, 'i'), '').trim() || s.model,
        year: raw.firstregyear ? parseInt(raw.firstregyear, 10) : null,
        price: priceCny ? Math.round((priceCny * FX_TO_RUB.CNY) / 1000) * 1000 : null,
        type: raw.isnewenergy ? 'Электро' : 'Бензин',
        body: null,
        img: proxyImage(raw.imageurl),
        mileageKm: typeof raw.mileage === 'number' ? Math.round(raw.mileage * 10000) : null,
        power: null, accel: null, accel0: null, range: null, rangeKm: null, drive: null,
        options: [], source: 'che168', sourceUrl: null
      });
    }
  }
  return out;
}

// ---------- dongchedi ----------
async function fetchDongchedi() {
  console.log('[dongchedi] запрос: новые модели (newCars)');
  const items = await apifyRunSync('crawlerbros~dongchedi-scraper', { mode: 'newCars', maxItems: 40 });
  console.log('[dongchedi] получено ' + items.length);
  const out = [];
  for (const raw of items) {
    if (!raw || !raw.carName) continue;
    const priceCny = typeof raw.priceMin === 'number' ? raw.priceMin * 10000 : null;
    out.push({
      id: 'dongchedi_' + (raw.seriesId || raw.carName),
      brand: CN_BRAND[raw.brandName] || raw.brandName || 'Неизвестно',
      model: raw.carName,
      year: raw.releaseDate ? parseInt(String(raw.releaseDate).slice(0, 4), 10) : null,
      price: priceCny ? Math.round((priceCny * FX_TO_RUB.CNY) / 1000) * 1000 : null,
      type: raw.energyType === 'ev' ? 'Электро' : (raw.energyType === 'phev' || raw.energyType === 'hybrid' ? 'Гибрид' : 'Бензин'),
      body: null,
      img: raw.imageUrl || null,
      mileageKm: null,
      power: null, accel: null, accel0: null, range: null, rangeKm: null, drive: null,
      options: [], source: 'dongchedi', sourceUrl: raw.articleUrl || null
    });
  }
  return out;
}

// ---------- encar ----------
// Encar блокирует дата-центровые IP Apify — нужен актор с резидентным прокси
// по умолчанию (skcho/encar-car-collector), иначе запрос падает с HTTP 404.
function encarFuelType(raw) {
  if (raw === '디젤') return 'Дизель';
  if (raw === '가솔린' || raw === '휘발유') return 'Бензин';
  if (raw === '전기') return 'Электро';
  if (raw === '하이브리드') return 'Гибрид';
  return 'Бензин';
}
async function fetchEncar() {
  const out = [];
  for (const carType of ['kor', 'for']) {
    console.log('[encar] запрос: ' + (carType === 'kor' ? 'домашние бренды' : 'импортные бренды'));
    const items = await apifyRunSync('skcho~encar-car-collector', {
      carType: carType, taxonomyDepth: 'manufacturer',
      maxTotalListings: 40, maxListingsPerGroup: 8,
      collectDetail: false, collectRecord: false, collectInspection: false, writeMarkdown: false
    }, 150000);
    const cars = items.filter(function (r) { return r && r.recordType === 'encarListing'; });
    console.log('[encar] ' + carType + ': получено ' + cars.length);
    for (const raw of cars) {
      const priceKrw = typeof raw.priceManwon === 'number' ? raw.priceManwon * 10000 : null;
      out.push({
        id: 'encar_' + raw.vehicleId,
        brand: KR_BRAND[raw.listingManufacturer] || raw.listingManufacturer || 'Неизвестно',
        model: [raw.listingModel, raw.badge].filter(Boolean).join(' '),
        year: raw.formYear ? parseInt(raw.formYear, 10) : null,
        price: priceKrw ? Math.round((priceKrw * FX_TO_RUB.KRW) / 1000) * 1000 : null,
        type: encarFuelType(raw.fuelType),
        body: null,
        img: raw.thumbnailUrl || null,
        mileageKm: typeof raw.mileage === 'number' ? raw.mileage : null,
        power: null, accel: null, accel0: null, range: null, rangeKm: null, drive: null,
        options: [], source: 'encar', sourceUrl: raw.detailUrl || null
      });
    }
  }
  return out;
}

async function main() {
  let all = [];
  for (const fn of [fetchChe168, fetchDongchedi, fetchEncar]) {
    try {
      const part = await fn();
      all = all.concat(part);
    } catch (e) {
      console.error('Ошибка источника:', e.message);
    }
  }

  const before = all.length;
  all = all.filter(function (c) { return c.price && c.brand && c.brand !== 'Неизвестно'; });
  console.log('Всего получено: ' + before + ', с ценой и брендом: ' + all.length);

  if (!all.length) {
    console.error('Ни одного пригодного объявления не получено — cars.js не изменён.');
    process.exit(1);
  }

  const outPath = path.join(__dirname, '..', 'cars.js');
  const fileContent =
    '// Каталог автомобилей — автоматически сгенерировано scripts/sync-cars.js через Apify\n' +
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
