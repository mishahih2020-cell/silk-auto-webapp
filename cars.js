// Каталог автомобилей — единый источник данных для всех экранов
const CARS = [
  {
    id: 'su7', brand: 'Xiaomi', model: 'SU7 Ultra', year: 2025, price: 9500000,
    type: 'Электро', body: 'Седан', img: 'assets/car_su7.jpg',
    power: '1548 л.с.', accel: '1.98 сек', range: '620 км', drive: 'Полный (AWD)',
    options: ['Карбоновый кузов', 'Спортивные ковши', 'ADAS 2 уровня', 'Аудио 25 динамиков', 'Керамические тормоза']
  },
  {
    id: 'zeekr001', brand: 'Zeekr', model: '001', year: 2025, price: 4950000,
    type: 'Электро', body: 'Лифтбэк', img: 'assets/car_zeekr001.jpg',
    power: '544 л.с.', accel: '3.8 сек', range: '620 км', drive: 'Полный (AWD)',
    options: ['Панорамная крыша', 'Массаж сидений', 'ADAS 2 уровня', 'Аудио 21 динамик', 'Электропривод дверей']
  },
  {
    id: 'et7', brand: 'NIO', model: 'ET7', year: 2024, price: 6200000,
    type: 'Электро', body: 'Седан', img: 'assets/car_nio_et7.jpg',
    power: '653 л.с.', accel: '3.9 сек', range: '700 км', drive: 'Полный (AWD)',
    options: ['Пневмоподвеска', 'Массаж сидений', 'ADAS NAD', 'Аудио 23 динамика', 'Лидар']
  },
  {
    id: 'han', brand: 'BYD', model: 'Han EV', year: 2024, price: 3950000,
    type: 'Электро', body: 'Седан', img: 'assets/car_byd_han.jpg',
    power: '517 л.с.', accel: '3.9 сек', range: '715 км', drive: 'Полный (AWD)',
    options: ['Панорамная крыша', 'Вращающийся экран', 'ADAS 1 уровня', 'Аудио 12 динамиков', 'Беспроводная зарядка']
  },
  {
    id: 'l9', brand: 'Li Auto', model: 'L9', year: 2025, price: 6800000,
    type: 'Гибрид', body: 'Кроссовер', img: 'assets/car_li_l9.jpg',
    power: '449 л.с.', accel: '5.3 сек', range: '1315 км на баке', drive: 'Полный (AWD)',
    options: ['6 мест', 'Пневмоподвеска', 'ADAS 2 уровня', 'Аудио 21 динамик', 'Холодильник во 2 ряду']
  }
];

function formatPrice(n) {
  return 'от ' + n.toLocaleString('ru-RU') + ' ₽';
}
