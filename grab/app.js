/* Grab (mô phỏng) – đặt đồ giả lập */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmt = n => n.toLocaleString('vi-VN') + 'đ';
const store = { get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }, set: (k, v) => localStorage.setItem(k, JSON.stringify(v)) };

/* ================= DỮ LIỆU ================= */
const CATS = [['all', 'Tất cả', 'r1/cover'], ['rice', 'Cơm', 'r1/cover'], ['noodle', 'Bún · Phở', 'r6/cover'], ['fast', 'Đồ ăn nhanh', 'r3/cover'], ['drink', 'Trà sữa', 'r4/cover'], ['cafe', 'Cà phê', 'r5/cover'], ['snack', 'Ăn vặt', 'r7/cover'], ['cake', 'Bánh ngọt', 'r8/cover']];
// dx,dy: lệch (km) so với vị trí người dùng. menu: [tên, giá, mô tả, emoji dự phòng]
const R = [
  { id: 1, name: 'Cơm Tấm Sài Gòn Bà Ba', cat: 'rice', tags: 'Cơm tấm · Món Việt', c: '#e8821e', ini: 'BB', dx: .35, dy: .25, rate: 4.8, rv: '2k+', time: 15, promo: 'Giảm 20k', addr: '12 Nguyễn Trãi', hours: '06:00 - 22:00',
    menu: [['Cơm sườn bì chả', 45000, 'Sườn nướng than hoa, bì, chả trứng, mỡ hành, đồ chua', '🍚'], ['Cơm sườn trứng ốp la', 42000, 'Sườn cốt lết nướng, trứng ốp la, nước mắm chua ngọt', '🍳'], ['Cơm gà nướng', 48000, 'Đùi gà nướng sả mật ong, dưa leo, cà chua', '🍗'], ['Canh khổ qua nhồi thịt', 15000, 'Khổ qua hầm thịt bằm, hành ngò', '🥣'], ['Trà đá', 5000, 'Ly lớn', '🧊']] },
  { id: 2, name: 'Phở Hà Nội Gia Truyền', cat: 'noodle', tags: 'Phở · Món Bắc', c: '#b3261e', ini: 'PH', dx: -.5, dy: .4, rate: 4.7, rv: '1k+', time: 20, promo: 'Freeship', addr: '45 Lý Tự Trọng', hours: '05:30 - 21:30',
    menu: [['Phở tái', 55000, 'Bò tái mềm, bánh phở tươi, nước dùng ninh xương 12 giờ', '🍜'], ['Phở bò viên', 52000, 'Bò viên dai giòn, hành lá, rau thơm', '🍲'], ['Phở đặc biệt', 69000, 'Tái, nạm, gân, gầu, bò viên', '🥩'], ['Quẩy giòn', 8000, 'Ăn kèm phở (2 cái)', '🥖'], ['Trà chanh', 15000, 'Trà chanh tươi mát lạnh', '🍋']] },
  { id: 3, name: 'Burger House', cat: 'fast', tags: 'Burger · Đồ ăn nhanh', c: '#d62828', ini: 'BH', dx: .8, dy: -.3, rate: 4.5, rv: '800+', time: 25, promo: 'Mua 1 tặng 1', addr: '88 Lê Lợi', hours: '09:00 - 23:00',
    menu: [['Burger bò phô mai', 59000, 'Bò nướng 120g, phô mai cheddar, rau tươi, sốt đặc biệt', '🍔'], ['Burger gà giòn', 49000, 'Gà tẩm bột chiên giòn, xà lách, sốt mayo', '🥪'], ['Khoai tây chiên', 29000, 'Phần lớn, kèm tương cà', '🍟'], ['Gà rán 3 miếng', 69000, 'Gà giòn cay hoặc không cay', '🍗'], ['Nước ngọt có gas', 15000, 'Ly 500ml', '🥤']] },
  { id: 4, name: 'Trà Sữa Mây Hồng', cat: 'drink', tags: 'Trà sữa · Đồ uống', c: '#e75480', ini: 'MH', dx: -.3, dy: -.6, rate: 4.9, rv: '3k+', time: 12, promo: 'Giảm 15k', addr: '7 Pasteur', hours: '08:00 - 22:30',
    menu: [['Trà sữa trân châu', 39000, 'Trà sữa truyền thống, trân châu đen dẻo', '🧋'], ['Hồng trà macchiato', 42000, 'Hồng trà đậm vị, lớp kem cheese mặn béo', '🍵'], ['Matcha đá xay', 49000, 'Matcha Nhật, sữa tươi, kem tươi', '🥤'], ['Trà đào cam sả', 45000, 'Đào miếng, cam vàng, sả thơm', '🍑']] },
  { id: 5, name: 'The Coffee Corner', cat: 'cafe', tags: 'Cà phê · Bánh', c: '#5b3a29', ini: 'CC', dx: .15, dy: .7, rate: 4.6, rv: '1k+', time: 14, promo: '', addr: '23 Đồng Khởi', hours: '07:00 - 22:00',
    menu: [['Cà phê sữa đá', 29000, 'Cà phê phin truyền thống, sữa đặc', '☕'], ['Bạc xỉu', 32000, 'Nhiều sữa, ít cà phê', '🥛'], ['Cappuccino', 45000, 'Espresso, sữa nóng đánh bọt', '☕'], ['Croissant bơ', 35000, 'Bánh sừng bò bơ Pháp nướng giòn', '🥐']] },
  { id: 6, name: 'Bún Chả Hương Liên', cat: 'noodle', tags: 'Bún chả · Món Bắc', c: '#2e7d32', ini: 'HL', dx: -.9, dy: -.1, rate: 4.7, rv: '1.5k+', time: 22, promo: 'Giảm 10%', addr: '66 Hai Bà Trưng', hours: '10:00 - 21:00',
    menu: [['Bún chả thường', 50000, 'Chả viên, chả miếng nướng than, bún, rau sống', '🍲'], ['Bún chả đặc biệt', 65000, 'Thêm chả và nem', '🥩'], ['Nem rán (3 cái)', 30000, 'Nem rán giòn, nhân thịt miến mộc nhĩ', '🥟'], ['Nước sấu', 15000, 'Sấu ngâm đường phèn', '🧃']] },
  { id: 7, name: 'Ăn Vặt Cô Tư', cat: 'snack', tags: 'Ăn vặt · Đường phố', c: '#e91e8c', ini: 'CT', dx: .6, dy: .55, rate: 4.4, rv: '600+', time: 18, promo: 'Freeship', addr: '101 Võ Văn Tần', hours: '14:00 - 22:00',
    menu: [['Bánh tráng trộn', 20000, 'Bánh tráng, xoài, khô bò, trứng cút, rau răm', '🥗'], ['Xiên que mix', 25000, 'Xúc xích, bò viên, phô mai que', '🍢'], ['Cá viên chiên', 22000, 'Cá viên chiên giòn, tương ớt', '🍡'], ['Bắp xào', 18000, 'Bắp, bơ, tép khô, hành phi', '🌽']] },
  { id: 8, name: 'Sweet Bakery', cat: 'cake', tags: 'Bánh ngọt · Tráng miệng', c: '#7b5ea7', ini: 'SB', dx: -.6, dy: .8, rate: 4.8, rv: '900+', time: 20, promo: 'Giảm 12k', addr: '5 Nguyễn Huệ', hours: '08:00 - 21:00',
    menu: [['Tiramisu', 45000, 'Mềm mịn vị cà phê, phủ bột cacao', '🍰'], ['Bánh su kem', 25000, 'Vỏ giòn, nhân kem vani (2 cái)', '🧁'], ['Cookie socola', 20000, 'Cookie mềm nhiều chip socola', '🍪'], ['Bông lan trứng muối', 38000, 'Bông lan cuộn, sốt trứng muối, chà bông', '🍞']] },
  { id: 9, name: 'Cơm Gà Hải Nam', cat: 'rice', tags: 'Cơm gà · Món Hoa', c: '#d9a400', ini: 'HN', dx: 1, dy: .1, rate: 4.6, rv: '700+', time: 24, promo: '', addr: '39 Cách Mạng Tháng 8', hours: '10:00 - 21:30',
    menu: [['Cơm gà xối mỡ', 49000, 'Da gà giòn rụm, cơm nấu nước luộc gà', '🍗'], ['Cơm gà luộc', 47000, 'Gà ta luộc, gừng, nước mắm gừng', '🍚'], ['Gỏi gà', 35000, 'Gà xé, bắp cải, rau răm, đậu phộng', '🥗']] },
  { id: 10, name: 'Pizza Napoli', cat: 'fast', tags: 'Pizza · Món Ý', c: '#c0392b', ini: 'PN', dx: -1.1, dy: .3, rate: 4.5, rv: '500+', time: 30, promo: 'Giảm 30k', addr: '15 Trần Hưng Đạo', hours: '10:00 - 22:00',
    menu: [['Pizza hải sản (S)', 99000, 'Tôm, mực, nghêu, phô mai mozzarella', '🍕'], ['Pizza phô mai (S)', 89000, '4 loại phô mai Ý', '🧀'], ['Mì Ý bò bằm', 65000, 'Sốt cà chua bò bằm, phô mai parmesan', '🍝']] }
];
const DRIVERS = [['Nguyễn Văn Hùng', '59X1-123.45', 'Honda Wave Alpha', '4.93'], ['Trần Minh Tuấn', '59P2-678.90', 'Yamaha Sirius', '4.89'], ['Lê Hoàng Nam', '59H3-246.80', 'Honda Vision', '4.97'], ['Phạm Quốc Bảo', '59C1-135.79', 'Honda Air Blade', '4.91']];
const VOUCHERS = { GRAB30: ['Giảm 30.000đ', o => 30000], FREESHIP: ['Miễn phí giao hàng', o => o.fee], NEWUSER: ['Giảm 50.000đ đơn đầu', o => 50000] };
const img = (p) => `img/${p}.jpg`;
const im = (p, alt = '') => `<img src="${img(p)}" alt="${alt}" loading="lazy" onerror="this.style.display='none'">`;
const logo = r => `<div style="width:100%;height:100%;background:${r.c};color:#fff;font-weight:800;display:flex;align-items:center;justify-content:center;font-size:15px">${r.ini}${im('r' + r.id + '/logo')}</div>`;

/* ================= STATE ================= */
const state = {
  user: store.get('user', { name: 'Khách', phone: '0900 000 000' }),
  pos: store.get('pos', { lat: 10.7725, lng: 106.6980, addr: 'Chợ Bến Thành, Quận 1' }),
  wallet: store.get('wallet', 500000),
  cat: 'all', q: '', chip: 'all', cart: store.get('cart', null), orders: store.get('orders', []), tab: 'home', voucher: null
};
const save = () => { store.set('orders', state.orders); store.set('wallet', state.wallet); store.set('cart', state.cart); };
const km2lat = km => km / 110.57;
const km2lng = km => km / (111.32 * Math.cos(state.pos.lat * Math.PI / 180));
const rpos = r => [state.pos.lat + km2lat(r.dy), state.pos.lng + km2lng(r.dx)];
const distKm = (a, b) => { const d = Math.PI / 180, x = (b[1] - a[1]) * d * Math.cos((a[0] + b[0]) / 2 * d), y = (b[0] - a[0]) * d; return Math.sqrt(x * x + y * y) * 6371; };
const rdist = r => distKm([state.pos.lat, state.pos.lng], rpos(r)) * 1.3;
const eta = r => r.time + Math.round(rdist(r) * 3);
const byId = id => R.find(x => x.id === id);

let maps = [], raf = null;
const screen = $('#screen');
let ro = null;
function killMaps() { if (ro) { ro.disconnect(); ro = null; } cancelAnimationFrame(raf); maps.forEach(m => { try { m.stop(); m.off(); m.remove(); } catch (e) {} }); maps = []; }
function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('on'), 2200); }
function go(fn, ...a) { killMaps(); $$('.ov,.done').forEach(e => e.remove()); fn(...a); screen.scrollTop = 0; }
function tabs(show = true) { $('#tabs').classList.toggle('hide', !show); $$('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === state.tab)); }
$$('#tabs button').forEach(b => b.onclick = () => { state.tab = b.dataset.tab; go({ home: viewHome, orders: viewOrders, account: viewAccount }[b.dataset.tab]); });
const ARROW = '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>';
const ICON = { phone: '<svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>', chat: '<svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1.1-4.6A8 8 0 1 1 21 12z"/></svg>', x: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>', search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>', loc: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><circle cx="12" cy="12" r="8"/></svg>' };

/* ================= BẢN ĐỒ ================= */
function newMap(id, center, zoom = 15, opt = {}) {
  const m = L.map(id, { zoomControl: false, attributionControl: false, tap: true, ...opt }).setView(center, zoom);
  const osm = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  L.tileLayer(osm, { maxZoom: 19 }).addTo(m);
  if (opt.zoomBtn !== false) L.control.zoom({ position: 'bottomright', zoomInText: '+', zoomOutText: '−' }).addTo(m);
  L.control.attribution({ prefix: false, position: 'bottomleft' }).addAttribution('© OpenStreetMap').addTo(m);
  maps.push(m); setTimeout(() => { if (maps.includes(m)) m.invalidateSize(); }, 150); return m;
}
const mk = (html, size = 44, anchor) => L.divIcon({ html, className: '', iconSize: [size, size], iconAnchor: anchor || [size / 2, size / 2] });
const shopIcon = r => mk(`<div class="mk shop">${logo(r)}</div>`);
const meIcon = () => mk('<div class="mk me"></div>', 20);
const homeIcon = () => mk('<div class="mk home"><span>🏠</span></div>', 38, [19, 38]);
const riderIcon = () => mk('<div class="mk rider">🛵</div>', 42);

/* ================= TRANG CHỦ ================= */
function vcardTag(r) { return r.promo ? `<span class="badge${r.promo === 'Freeship' ? ' g' : ''}">${r.promo}</span>` : ''; }
function viewHome() {
  state.tab = 'home'; tabs();
  const near = [...R].sort((a, b) => rdist(a) - rdist(b));
  const svc = [['Đồ ăn', '🍔', '#e5f7ec', 'food'], ['Siêu thị', '🛒', '#fff0e0', 'soon'], ['Giao hàng', '📦', '#e6f0ff', 'soon'], ['Xe máy', '🛵', '#e5f7ec', 'soon'], ['Ô tô', '🚗', '#e6f0ff', 'soon'], ['Ưu đãi', '🎟️', '#ffe9e7', 'deal'], ['GrabPay', '💳', '#eee9ff', 'pay'], ['Thêm', '⋯', '#f0f0f0', 'soon']];
  screen.innerHTML = `<div class="hhead"><div class="hrow"><div class="addr" id="chg"><small>Giao đến</small><b>${state.pos.addr} ▾</b></div><div class="avatar">${state.user.name[0].toUpperCase()}</div></div></div>
  <div class="sbox pull" id="sb">${ICON.search}<span style="color:#888;font-size:14px">Bạn muốn ăn gì hôm nay?</span></div>
  <div class="wallet"><div>GrabPay<b>${fmt(state.wallet)}</b></div><div>GrabRewards<b>1.250 điểm</b></div><div>Ưu đãi<b>3 mã</b></div></div>
  <div class="grid">${svc.map(s => `<button class="svc" data-s="${s[3]}"><i style="background:${s[2]}">${s[1]}</i>${s[0]}${s[3] === 'food' ? '<em>HOT</em>' : ''}</button>`).join('')}</div>
  <div class="sw" style="margin-top:10px;padding-bottom:6px"><div class="sec" style="padding-top:16px">Dành cho bạn</div>
  <div class="hs" id="pr">${[['r1', 'Cơm tấm\ngiảm 20K', 'Cho đơn từ 60K', 1], ['r4', 'Trà sữa\nMua 1 tặng 1', 'Hôm nay duy nhất', 4], ['r3', 'Freeship\nmọi burger', 'Dùng mã FREESHIP', 3]].map(p => `<div class="promo" data-id="${p[3]}">${im(p[0] + '/cover')}<div><h4>${p[1].replace('\n', '<br>')}</h4><p>${p[2]}</p><span>Đặt ngay</span></div></div>`).join('')}</div>
  <div class="dots" id="dots"><i class="on"></i><i></i><i></i></div></div>
  <div class="sw" style="margin-top:10px;padding-bottom:16px"><div class="sec">Quán ngon gần bạn<a id="all1">Xem tất cả</a></div>
  <div class="hs">${near.slice(0, 6).map(r => `<div class="hcard" data-id="${r.id}"><div class="im" style="background:${r.c}33">${vcardTag(r)}${im('r' + r.id + '/cover')}<span class="timechip">${eta(r)} phút</span></div><b>${r.name}</b><small><span class="star">★</span> ${r.rate} · ${rdist(r).toFixed(1)} km</small></div>`).join('')}</div></div>
  <div class="sec" style="padding-bottom:6px">Đang được yêu thích</div>${near.slice(0, 4).map(rcard).join('')}
  <div style="padding:6px 16px 24px"><button class="btn o" id="all2" style="text-align:center">Xem thêm quán ăn</button></div>`;
  $('#chg').onclick = () => go(viewPickLoc, () => go(viewHome));
  $('#sb').onclick = () => go(viewFood, { focus: true });
  $('#all1').onclick = $('#all2').onclick = () => go(viewFood, {});
  $$('.svc').forEach(b => b.onclick = () => ({ food: () => go(viewFood, {}), deal: () => { state.chip = 'deal'; go(viewFood, {}); }, pay: () => toast('Ví GrabPay: ' + fmt(state.wallet)), soon: () => toast('Dịch vụ sắp ra mắt') }[b.dataset.s])());
  $$('.promo,.hcard,.rcard').forEach(c => c.onclick = () => go(viewRest, +c.dataset.id));
  const pr = $('#pr'); pr.onscroll = () => { const i = Math.round(pr.scrollLeft / (pr.firstChild.offsetWidth + 12)); $$('#dots i').forEach((d, k) => d.classList.toggle('on', k === i)); };
}
function rcard(r) {
  return `<div class="rcard" data-id="${r.id}"><div class="im" style="background:${r.c}33">${vcardTag(r)}${im('r' + r.id + '/cover')}<span class="timechip">${eta(r)} phút · ${rdist(r).toFixed(1)} km</span></div>
  <div class="bd"><div class="lg">${logo(r)}</div><div class="nm">${r.name}</div><div class="mt"><span><span class="star">★</span> <b style="color:#1f1f1f">${r.rate}</b> (${r.rv})</span><i class="dot"></i><span>${r.tags}</span></div>
  ${r.promo ? `<span class="vtag">🎟️ ${r.promo === 'Freeship' ? 'Miễn phí giao hàng' : r.promo === 'Mua 1 tặng 1' ? 'Mua 1 tặng 1 (tối đa 30k)' : r.promo + ' cho đơn đầu'}</span>` : ''}</div></div>`;
}

/* ================= TRANG ĐỒ ĂN ================= */
function filtered() {
  const q = state.q.toLowerCase();
  let l = R.filter(r => (state.cat === 'all' || r.cat === state.cat) && (!q || r.name.toLowerCase().includes(q) || r.tags.toLowerCase().includes(q) || r.menu.some(m => m[0].toLowerCase().includes(q))));
  if (state.chip === 'deal') l = l.filter(r => r.promo); if (state.chip === 'fast') l = l.filter(r => eta(r) <= 25); if (state.chip === 'top') l = l.filter(r => r.rate >= 4.7);
  return l.sort((a, b) => rdist(a) - rdist(b));
}
function viewFood(o = {}) {
  state.tab = 'home'; tabs();
  screen.innerHTML = `<div class="top"><button class="ib" id="bk">${ARROW}</button><div class="sbox" style="margin:0;flex:1;box-shadow:none;background:#f1f1f1;padding:9px 14px">${ICON.search}<input id="q" placeholder="Tìm quán hoặc món ăn" value="${state.q}"></div></div>
  <div class="cgrid">${CATS.map(c => `<button class="cat ${state.cat === c[0] ? 'on' : ''}" data-c="${c[0]}"><div class="ci">${im(c[2])}</div>${c[1]}</button>`).join('')}</div>
  <div class="chips"><button class="chip" id="mapb">🗺️ Bản đồ</button>${[['all', 'Tất cả'], ['deal', '🎟️ Ưu đãi'], ['fast', '⚡ Giao nhanh'], ['top', '★ Đánh giá 4.7+']].map(c => `<button class="chip ${state.chip === c[0] ? 'on' : ''}" data-ch="${c[0]}">${c[1]}</button>`).join('')}</div>
  <div id="list"></div><div style="height:20px"></div>`;
  const draw = () => { const l = filtered(); $('#list').innerHTML = l.length ? l.map(rcard).join('') : '<div class="empty"><div class="big">🔍</div><h4>Không tìm thấy kết quả</h4>Thử từ khoá hoặc bộ lọc khác nhé</div>'; $$('.rcard').forEach(c => c.onclick = () => go(viewRest, +c.dataset.id)); };
  draw();
  $('#q').oninput = e => { state.q = e.target.value; draw(); }; if (o.focus) $('#q').focus();
  $$('.cat').forEach(b => b.onclick = () => { state.cat = b.dataset.c; go(viewFood, {}); });
  $$('[data-ch]').forEach(b => b.onclick = () => { state.chip = b.dataset.ch; go(viewFood, {}); });
  $('#mapb').onclick = () => go(viewMapAll);
  $('#bk').onclick = () => { state.q = ''; state.cat = 'all'; state.chip = 'all'; go(viewHome); };
}
function viewMapAll() {
  tabs(false);
  screen.innerHTML = `<div id="trkmap"></div><button class="ib floatl" id="bk">${ARROW}</button>`;
  const m = newMap('trkmap', [state.pos.lat, state.pos.lng], 15);
  L.marker([state.pos.lat, state.pos.lng], { icon: meIcon() }).addTo(m);
  filtered().forEach(r => L.marker(rpos(r), { icon: shopIcon(r) }).addTo(m).on('click', () => go(viewRest, r.id)));
  $('#bk').onclick = () => go(viewFood, {});
}
function viewPickLoc(back) {
  tabs(false);
  screen.innerHTML = `<div class="top"><button class="ib" id="bk">${ARROW}</button><h2>Chọn điểm giao hàng</h2></div>
  <div id="mp" style="position:absolute;top:57px;left:0;right:0;bottom:170px"></div>
  <div style="position:absolute;left:0;right:0;bottom:0;background:#fff;padding:14px 16px;border-radius:20px 20px 0 0;box-shadow:0 -4px 16px #0002;z-index:1000;height:170px">
  <div id="ad" style="font-weight:700;font-size:15px;min-height:22px">📍 ${state.pos.addr}</div><div style="font-size:12px;color:#777;margin:4px 0 12px">Chạm vào bản đồ hoặc kéo ghim để chọn vị trí chính xác</div>
  <div style="display:flex;gap:8px"><button class="btn o" id="gps" style="width:auto;padding:13px 16px">${ICON.loc.replace('<svg', '<svg width="20" height="20" style="stroke:#00b14f;fill:none;stroke-width:2"')}</button><button class="btn" id="ok" style="justify-content:center">Xác nhận</button></div></div>`;
  const m = newMap('mp', [state.pos.lat, state.pos.lng], 16);
  let tmp = { ...state.pos };
  const mkr = L.marker([tmp.lat, tmp.lng], { icon: homeIcon(), draggable: true }).addTo(m);
  const rev = async () => {
    $('#ad').textContent = '📍 Đang xác định địa chỉ...';
    try { const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${tmp.lat}&lon=${tmp.lng}&accept-language=vi`); const j = await r.json(); tmp.addr = (j.display_name || '').split(',').slice(0, 3).join(',') || 'Vị trí đã chọn'; }
    catch { tmp.addr = `Vị trí ${tmp.lat.toFixed(4)}, ${tmp.lng.toFixed(4)}`; }
    if ($('#ad')) $('#ad').textContent = '📍 ' + tmp.addr;
  };
  const set = (lat, lng) => { tmp.lat = lat; tmp.lng = lng; mkr.setLatLng([lat, lng]); rev(); };
  m.on('click', e => set(e.latlng.lat, e.latlng.lng)); mkr.on('dragend', () => { const p = mkr.getLatLng(); set(p.lat, p.lng); });
  $('#gps').onclick = () => navigator.geolocation ? navigator.geolocation.getCurrentPosition(p => { m.setView([p.coords.latitude, p.coords.longitude], 16); set(p.coords.latitude, p.coords.longitude); }, () => toast('Không lấy được vị trí GPS'), { timeout: 8000 }) : toast('Thiết bị không hỗ trợ GPS');
  $('#ok').onclick = () => { state.pos = tmp; store.set('pos', tmp); toast('Đã cập nhật địa chỉ giao hàng'); back(); };
  $('#bk').onclick = () => go(back);
}

/* ================= QUÁN + GIỎ HÀNG ================= */
const cartInfo = () => { const c = state.cart; if (!c) return { n: 0, sum: 0 }; const r = byId(c.rid); let n = 0, sum = 0; for (const [i, l] of Object.entries(c.items)) { n += l.q; sum += r.menu[i][1] * l.q; } return { n, sum }; };
function viewRest(id, scrollTo) {
  tabs(false);
  const r = byId(id);
  const half = Math.ceil(r.menu.length / 2);
  const secs = [['Bán chạy', r.menu.slice(0, half), 0], [r.cat === 'drink' || r.cat === 'cafe' ? 'Khác' : 'Món ăn kèm & đồ uống', r.menu.slice(half), half]].filter(s => s[1].length);
  screen.innerHTML = `<div class="cover" style="background:${r.c}">${im('r' + id + '/cover')}<button class="ib" id="bk" style="left:12px">${ARROW}</button><button class="ib" id="mp1" style="right:12px">🗺️</button></div>
  <div class="rinfo"><h1>${r.name}</h1><div class="mt"><span><span class="star">★</span> <b>${r.rate}</b> (${r.rv} đánh giá)</span><i class="dot"></i><span>${r.tags}</span></div>
  <div class="row2"><div>Khoảng cách<b>${rdist(r).toFixed(1)} km</b></div><div>Giao trong<b>${eta(r)}-${eta(r) + 8} phút</b></div><div>Phí giao<b>${r.promo === 'Freeship' ? 'Miễn phí' : fmt(feeOf(r))}</b></div></div></div>
  ${r.promo ? `<div class="sw hs" style="padding:4px 16px 14px;overflow-x:auto"><div class="vouch"><b>🎟️ ${r.promo}</b>Áp dụng tự động khi thanh toán · HSD hôm nay</div><div class="vouch"><b>🎟️ GRAB30</b>Giảm 30.000đ — nhập mã khi thanh toán</div></div>` : ''}
  <div class="mtabs" id="mt">${secs.map((s, k) => `<button data-k="${k}" class="${k ? '' : 'on'}">${s[0]}</button>`).join('')}</div><div id="menu"></div>
  <div class="box" style="margin-top:10px"><h4>Vị trí quán</h4><div style="font-size:13px;color:#555;margin-bottom:8px">${r.addr}, TP.HCM · Mở cửa ${r.hours}</div><div id="mp" style="height:170px;border-radius:12px;overflow:hidden;position:relative;z-index:0"></div></div><div style="height:90px"></div><div class="cartbar" id="cb"></div>`;
  const m = newMap('mp', rpos(r), 15, { scrollWheelZoom: false });
  L.marker(rpos(r), { icon: shopIcon(r) }).addTo(m); L.marker([state.pos.lat, state.pos.lng], { icon: meIcon() }).addTo(m);
  m.fitBounds([rpos(r), [state.pos.lat, state.pos.lng]], { padding: [40, 40] });
  const draw = () => {
    const mine = state.cart && state.cart.rid === id ? state.cart.items : {};
    $('#menu').innerHTML = secs.map((s, k) => `<div id="sec${k}"><div class="mhead">${s[0]}</div>${s[1].map((it, j) => { const i = s[2] + j, q = mine[i]?.q || 0; return `<div class="item" data-i="${i}"><div class="t"><b>${it[0]}</b><p>${it[2]}</p><div class="pr">${fmt(it[1])}</div></div><div class="pic"><span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:40px;background:${r.c}22;border-radius:12px">${it[3]}</span>${im('r' + id + '/m' + i)}<span class="add">${q || '+'}</span></div></div>`; }).join('')}</div>`).join('');
    $$('.item').forEach(e => e.onclick = () => itemSheet(r, +e.dataset.i, draw));
    const { n, sum } = state.cart && state.cart.rid === id ? cartInfo() : { n: 0, sum: 0 };
    $('#cb').innerHTML = n ? `<button id="gc"><span><span class="cn">${n}</span>Xem giỏ hàng</span><span>${fmt(sum)}</span></button>` : '';
    if (n) $('#gc').onclick = () => go(viewCheckout);
  };
  draw();
  $$('#mt button').forEach(b => b.onclick = () => { $$('#mt button').forEach(x => x.classList.toggle('on', x === b)); const t = $('#sec' + b.dataset.k); screen.scrollTo({ top: t.offsetTop - 50, behavior: 'smooth' }); });
  $('#bk').onclick = () => go(viewFood, {});
  $('#mp1').onclick = () => { screen.scrollTo({ top: screen.scrollHeight, behavior: 'smooth' }); };
}
function itemSheet(r, i, after) {
  const it = r.menu[i];
  if (state.cart && state.cart.rid !== r.id) {
    if (!confirm(`Giỏ hàng đang có món của "${byId(state.cart.rid).name}". Xoá giỏ cũ và bắt đầu giỏ mới?`)) return;
    state.cart = null;
  }
  const cur = state.cart?.items[i];
  let q = cur?.q || 1;
  const ov = document.createElement('div'); ov.className = 'ov';
  ov.innerHTML = `<div class="bs"><div class="hero" style="background:${r.c}33"><span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:90px">${it[3]}</span>${im('r' + r.id + '/m' + i)}<button class="ib" id="x">${ICON.x}</button></div>
  <div class="bd"><h3>${it[0]}</h3><div class="price">${fmt(it[1])}</div><div style="font-size:13px;color:#666">${it[2]}</div><textarea id="nt" rows="2" placeholder="Ghi chú cho quán (ví dụ: ít cay, không hành...)">${cur?.note || ''}</textarea>
  <div class="stepper"><button id="mi">−</button><b id="qq">${q}</b><button id="pl">+</button></div><button class="btn" id="ok" style="display:flex;justify-content:space-between"><span id="lb"></span><span id="tt"></span></button></div></div>`;
  $('#app').appendChild(ov);
  const upd = () => { $('#qq').textContent = q; $('#tt').textContent = q ? fmt(it[1] * q) : ''; $('#lb').textContent = q ? (cur ? 'Cập nhật giỏ hàng' : 'Thêm vào giỏ hàng') : 'Xoá khỏi giỏ hàng'; };
  upd();
  $('#mi').onclick = () => { if (q > (cur ? 0 : 1)) q--; upd(); }; $('#pl').onclick = () => { q++; upd(); };
  $('#x').onclick = () => ov.remove(); ov.onclick = e => { if (e.target === ov) ov.remove(); };
  $('#ok').onclick = () => {
    if (!state.cart) state.cart = { rid: r.id, items: {} };
    if (q === 0) delete state.cart.items[i]; else state.cart.items[i] = { q, note: $('#nt').value };
    if (!Object.keys(state.cart.items).length) state.cart = null;
    save(); ov.remove(); after();
  };
}
const feeOf = r => 12000 + Math.round(rdist(r) * 2000 / 1000) * 1000;
function calc(r, sub, vcode) {
  const fee = r.promo === 'Freeship' ? 0 : feeOf(r), svc = 3000;
  let disc = 0; const pm = r.promo.match(/Giảm (\d+)k/), pp = r.promo.match(/Giảm (\d+)%/);
  if (pm) disc = +pm[1] * 1000; if (pp) disc = Math.round(sub * pp[1] / 100); if (r.promo === 'Mua 1 tặng 1') disc = Math.min(30000, Math.round(sub * .3));
  let vd = 0; if (vcode && VOUCHERS[vcode]) vd = Math.min(VOUCHERS[vcode][1]({ fee }), sub + fee);
  return { fee, svc, disc, vd, total: Math.max(0, sub + fee + svc - disc - vd) };
}
function viewCheckout() {
  tabs(false);
  const c = state.cart; if (!c) return go(viewHome);
  const r = byId(c.rid), { sum: sub } = cartInfo();
  let pay = state.lastPay || 'cash', vcode = state.voucher;
  const render = () => {
    const t = calc(r, sub, vcode);
    screen.innerHTML = `<div class="top"><button class="ib" id="bk">${ARROW}</button><h2>Xác nhận đơn hàng</h2></div>
    <div class="box"><h4>Giao đến <a id="chg">Thay đổi</a></h4><div style="font-weight:700">📍 ${state.pos.addr}</div><div style="font-size:12.5px;color:#777;margin-top:4px">${state.user.name} · ${state.user.phone}</div><input class="fld" id="dn" placeholder="Ghi chú cho tài xế (số tầng, cổng...)" value="${state.dnote || ''}"></div>
    <div class="box"><h4>Thời gian giao</h4><div class="opt on"><span class="ic">⚡</span><div class="optc"><b>Giao ngay</b><small>${eta(r)}-${eta(r) + 8} phút · ${rdist(r).toFixed(1)} km</small></div><span class="ra"></span></div></div>
    <div class="box"><h4>${r.name} <a id="add">Thêm món</a></h4>${Object.entries(c.items).map(([i, l]) => `<div class="qrow"><span class="q">${l.q}x</span><div style="flex:1"><div>${r.menu[i][0]}</div>${l.note ? `<small style="color:#888">${l.note}</small>` : ''}</div><span>${fmt(r.menu[i][1] * l.q)}</span></div>`).join('')}</div>
    <div class="box"><h4>Phương thức thanh toán</h4>${[['cash', '💵', 'Tiền mặt', 'Trả cho tài xế'], ['wallet', '💚', 'GrabPay', 'Số dư ' + fmt(state.wallet)], ['card', '💳', 'Visa •••• 4242', 'Thẻ ghi nợ']].map(p => `<div class="opt ${pay === p[0] ? 'on' : ''}" data-p="${p[0]}"><span class="ic">${p[1]}</span><div class="optc"><b>${p[2]}</b><small>${p[3]}</small></div><span class="ra"></span></div>`).join('')}</div>
    <div class="box"><h4>Ưu đãi</h4>${r.promo ? `<div class="row"><span>🎟️ ${r.promo}</span><span class="d">Đã áp dụng</span></div>` : ''}<div style="display:flex;gap:8px"><input class="fld" id="vc" style="margin:0" placeholder="Nhập mã (GRAB30, FREESHIP, NEWUSER)" value="${vcode || ''}"><button class="btn o" id="va" style="width:auto;padding:0 18px;box-shadow:none">Áp dụng</button></div>${vcode ? `<div style="color:#00863c;font-size:12.5px;margin-top:8px">✓ ${VOUCHERS[vcode][0]}</div>` : ''}</div>
    <div class="box"><h4>Chi tiết thanh toán</h4><div class="row"><span>Tạm tính</span><span>${fmt(sub)}</span></div><div class="row"><span>Phí giao hàng</span><span>${t.fee ? fmt(t.fee) : 'Miễn phí'}</span></div><div class="row"><span>Phí dịch vụ</span><span>${fmt(t.svc)}</span></div>
    ${t.disc ? `<div class="row"><span>Khuyến mãi quán</span><span class="d">-${fmt(t.disc)}</span></div>` : ''}${t.vd ? `<div class="row"><span>Mã ${vcode}</span><span class="d">-${fmt(t.vd)}</span></div>` : ''}<div class="row tot"><span>Tổng cộng</span><span>${fmt(t.total)}</span></div></div>
    <div style="height:90px"></div><div class="cartbar"><button id="go"><span>Đặt đơn</span><span>${fmt(t.total)}</span></button></div>`;
    $('#bk').onclick = () => go(viewRest, r.id); $('#add').onclick = () => go(viewRest, r.id);
    $('#chg').onclick = () => go(viewPickLoc, () => go(viewCheckout));
    $$('[data-p]').forEach(e => e.onclick = () => { state.dnote = $('#dn').value; pay = state.lastPay = e.dataset.p; render(); });
    $('#va').onclick = () => { state.dnote = $('#dn').value; const v = $('#vc').value.trim().toUpperCase(); if (!v) { vcode = state.voucher = null; render(); return; } if (VOUCHERS[v]) { vcode = state.voucher = v; toast('Áp dụng mã thành công'); render(); } else toast('Mã không hợp lệ hoặc đã hết hạn'); };
    $('#go').onclick = () => {
      if (pay === 'wallet') { if (state.wallet < t.total) return toast('Số dư GrabPay không đủ'); state.wallet -= t.total; }
      const o = { id: 'GF-' + Date.now().toString().slice(-8), rid: r.id, items: Object.entries(c.items).map(([i, l]) => [r.menu[i][0], l.q, r.menu[i][1], l.note]), total: t.total, fee: t.fee, pay, dnote: $('#dn').value, pos: { ...state.pos }, t: Date.now(), driver: DRIVERS[Math.floor(Math.random() * DRIVERS.length)], status: 'active' };
      state.orders.unshift(o); state.cart = null; state.voucher = null; state.dnote = ''; save(); go(viewTrack, o.id);
    };
  };
  render();
}

/* ================= THEO DÕI ĐƠN ================= */
async function getRoute(a, b) {
  try { const ctl = new AbortController(); setTimeout(() => ctl.abort(), 3500); const r = await fetch(`https://router.project-osrm.org/route/v1/driving/${a[1]},${a[0]};${b[1]},${b[0]}?overview=full&geometries=geojson`, { signal: ctl.signal }); const j = await r.json(); return j.routes[0].geometry.coordinates.map(p => [p[1], p[0]]); }
  catch { return [a, b]; }
}
function along(line, t) {
  const seg = []; let tot = 0; for (let i = 1; i < line.length; i++) { const d = distKm(line[i - 1], line[i]); seg.push(d); tot += d; }
  let target = t * tot; for (let i = 0; i < seg.length; i++) { if (target <= seg[i] || i === seg.length - 1) { const f = seg[i] ? Math.min(1, target / seg[i]) : 1; return [line[i][0] + (line[i + 1][0] - line[i][0]) * f, line[i][1] + (line[i + 1][1] - line[i][1]) * f]; } target -= seg[i]; }
  return line[line.length - 1];
}
const STAGES = ['Đã nhận đơn', 'Đang tìm tài xế', 'Tài xế đến quán', 'Quán chuẩn bị món', 'Đang giao hàng'];
function viewTrack(id) {
  tabs(false);
  const o = state.orders.find(x => x.id === id), r = byId(o.rid), U = [o.pos.lat, o.pos.lng], S = rpos(r), D = o.driver;
  const start = [S[0] + km2lat(.9), S[1] - km2lng(.7)];
  screen.innerHTML = `<div class="trkwrap"><div id="trkmap"></div><button class="ib floatl" id="bk">${ARROW}</button><button class="ib floatr" id="fl">${ICON.loc}</button>
  <div class="sheet"><div class="grab"></div><div class="eta" id="eta">Đang xử lý...</div><div class="sb" id="sub"></div><div class="bar" id="bar">${STAGES.map(() => '<i></i>').join('')}</div><div id="drv"></div><div id="chat"></div>
  <button class="sumbtn" id="sm"><span>🧾 ${o.items.reduce((a, i) => a + i[1], 0)} món · ${r.name}</span><span>${fmt(o.total)} ▾</span></button><div id="sml" style="display:none;padding:8px 4px;font-size:13px"></div>
  <div style="font-size:11.5px;color:#999;margin:10px 0 0;text-align:center">Mã đơn ${o.id} · ${{ cash: 'Tiền mặt', wallet: 'GrabPay', card: 'Visa •••• 4242' }[o.pay]}</div><button class="btn o" id="cx" style="margin-top:10px;text-align:center;border-color:#ddd;color:#888">Huỷ đơn</button></div></div>`;
  $('#bk').onclick = () => { state.tab = 'orders'; go(viewOrders); };
  $('#sml').innerHTML = o.items.map(i => `<div class="row"><span>${i[1]}x ${i[0]}</span><span>${fmt(i[1] * i[2])}</span></div>`).join('');
  $('#sm').onclick = () => { const s = $('#sml'); s.style.display = s.style.display === 'none' ? 'block' : 'none'; };
  const m = newMap('trkmap', S, 14); let follow = false;
  L.marker(S, { icon: shopIcon(r) }).addTo(m); L.marker(U, { icon: homeIcon() }).addTo(m);
  m.fitBounds([S, U], { padding: [60, 60] });
  ro = new ResizeObserver(() => { if (maps.includes(m)) m.invalidateSize(); }); ro.observe($('#trkmap'));
  m.on('dragstart zoomstart', () => follow = false);
  $('#fl').onclick = () => { follow = true; };
  const setStage = (i, e, s) => { $$('#bar i').forEach((b, k) => { b.className = k <= i ? 'on' : ''; if (k === i) b.classList.add('cur'); }); $('#eta').textContent = e; $('#sub').textContent = s || ''; };
  const showDrv = () => {
    $('#drv').innerHTML = `<div class="drv"><div class="av" style="display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;color:#00863c">${D[0].split(' ').pop()[0]}</div><div class="d"><b>${D[0]}</b>${D[2]} · <span class="plate">${D[1]}</span> · <span class="star">★</span> ${D[3]}</div><button class="rb" id="call">${ICON.phone}</button><button class="rb" id="msg">${ICON.chat}</button></div>`;
    $('#call').onclick = () => toast('📞 Đang gọi ' + D[0] + '…');
    $('#msg').onclick = () => {
      const c = $('#chat'); if (c.innerHTML) { c.innerHTML = ''; return; }
      c.innerHTML = `<div class="chatb"><div class="msgs" id="ms"><p>Chào bạn, mình là ${D[0].split(' ').pop()}, tài xế của bạn nhé!</p></div><form id="cf"><input id="ci" placeholder="Nhắn tin cho tài xế" autocomplete="off"><button>Gửi</button></form></div>`;
      $('#cf').onsubmit = e => { e.preventDefault(); const v = $('#ci').value.trim(); if (!v) return; $('#ms').innerHTML += `<p class="me">${v}</p>`; $('#ci').value = ''; setTimeout(() => { if ($('#ms')) { $('#ms').innerHTML += '<p>Ok bạn nhé, mình có lưu ý rồi 👍</p>'; $('#ms').scrollTop = 1e5; } }, 1400); };
    };
  };
  const finish = () => {
    o.status = 'done'; save();
    const d = document.createElement('div'); d.className = 'done';
    d.innerHTML = `<div class="ok">✓</div><h2 style="margin-top:18px;font-size:22px">Giao hàng thành công!</h2><p style="color:#666;margin-top:6px;font-size:14px">Chúc bạn ngon miệng 🍽️<br>Bạn thấy tài xế ${D[0]} thế nào?</p><div class="stars" id="st">${[1, 2, 3, 4, 5].map(i => `<span data-i="${i}" class="on">★</span>`).join('')}</div><button class="btn" id="dn" style="margin-top:14px;text-align:center">Hoàn tất</button>`;
    $('#app').appendChild(d);
    $$('#st span').forEach(s => s.onclick = () => $$('#st span').forEach(x => x.classList.toggle('on', +x.dataset.i <= +s.dataset.i)));
    $('#dn').onclick = () => { d.remove(); state.tab = 'orders'; go(viewOrders); toast('Cảm ơn bạn đã đánh giá!'); };
  };
  $('#cx').onclick = () => { if (!confirm('Bạn chắc chắn muốn huỷ đơn?')) return; o.status = 'cancelled'; if (o.pay === 'wallet') state.wallet += o.total; save(); toast('Đã huỷ đơn' + (o.pay === 'wallet' ? ' · hoàn tiền vào GrabPay' : '')); state.tab = 'orders'; go(viewOrders); };
  if (o.status !== 'active') { setStage(4, o.status === 'done' ? 'Đã giao thành công' : 'Đơn đã huỷ', r.name); showDrv(); $('#cx').remove(); return; }
  (async () => {
    setStage(1, 'Đang tìm tài xế…', 'Chờ chút nhé, chúng tôi đang kết nối tài xế gần bạn');
    const [r1, r2] = await Promise.all([getRoute(start, S), getRoute(S, U)]);
    if (!$('#trkmap')) return;
    L.polyline(r1, { color: '#9aa0a6', weight: 4, dashArray: '2 8' }).addTo(m); L.polyline(r2, { color: '#00b14f', weight: 6, opacity: .9 }).addTo(m);
    const dm = L.marker(start, { icon: riderIcon(), zIndexOffset: 1000 }).addTo(m);
    const mins = (p, tot) => Math.max(1, Math.ceil((1 - p) * tot));
    const dl = Math.max(4, Math.round(rdist(r) * 3 + 3));
    const ph = [
      { d: 3500, f: () => setStage(1, 'Đang tìm tài xế…', 'Chờ chút nhé, chúng tôi đang kết nối tài xế gần bạn') },
      { d: 9000, f: p => { if (!$('#call')) { $('#cx').textContent = 'Huỷ đơn'; showDrv(); } setStage(2, `Tài xế đến quán · ${mins(p, 4)} phút`, `${D[0]} đang đến ${r.name}`); dm.setLatLng(along(r1, p)); } },
      { d: 4500, f: p => { dm.setLatLng(S); setStage(3, `Quán đang chuẩn bị · ${mins(p, 5)} phút`, 'Món của bạn sắp xong rồi'); } },
      { d: 17000, f: p => { if ($('#cx')) $('#cx').remove(); setStage(4, `Đang giao · ${mins(p, dl)} phút`, `${D[0]} đang trên đường đến bạn`); const q = along(r2, p); dm.setLatLng(q); if (follow) m.panTo(q, { animate: false }); } }
    ];
    let pi = 0, t0 = performance.now();
    const tick = now => {
      if (!$('#trkmap')) return;
      const p = Math.min(1, (now - t0) / ph[pi].d); ph[pi].f(p);
      if (p >= 1) { pi++; t0 = now; if (pi >= ph.length) return finish(); }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  })();
}

/* ================= HOẠT ĐỘNG / TÀI KHOẢN ================= */
function viewOrders(sub = 'now') {
  state.tab = 'orders'; tabs();
  const list = state.orders.filter(o => sub === 'now' ? o.status === 'active' : o.status !== 'active');
  screen.innerHTML = `<div class="top"><h2>Hoạt động</h2></div><div class="otab"><button data-s="now" class="${sub === 'now' ? 'on' : ''}">Đang diễn ra</button><button data-s="his" class="${sub === 'his' ? 'on' : ''}">Lịch sử</button></div>` +
    (list.length ? list.map(o => { const r = byId(o.rid); const stt = o.status === 'active' ? ['Đang giao', 'p'] : o.status === 'done' ? ['Hoàn tất', ''] : ['Đã huỷ', 'p']; return `<div class="ord" data-id="${o.id}"><div class="h">${im('r' + r.id + '/cover')}<div><b>${r.name}</b><small>${new Date(o.t).toLocaleString('vi-VN')}</small><small>${o.items.map(i => i[1] + 'x ' + i[0]).join(', ')}</small></div><span class="st ${stt[1]}">${stt[0]}</span></div>
    <div style="display:flex;justify-content:space-between;margin-top:10px;font-size:14px"><span style="color:#777">Tổng cộng</span><b>${fmt(o.total)}</b></div>${o.status !== 'active' ? `<div class="ft"><button class="btn o" data-re="${o.id}">Đặt lại</button></div>` : ''}</div>`; }).join('')
      : `<div class="empty"><div class="big">🧾</div><h4>${sub === 'now' ? 'Chưa có đơn nào đang diễn ra' : 'Chưa có lịch sử đơn hàng'}</h4>Đặt món yêu thích ngay thôi!</div>`);
  $$('.otab button').forEach(b => b.onclick = () => viewOrders(b.dataset.s));
  $$('.ord').forEach(e => e.onclick = ev => { if (ev.target.dataset.re) return; go(viewTrack, e.dataset.id); });
  $$('[data-re]').forEach(b => b.onclick = () => { const o = state.orders.find(x => x.id === b.dataset.re), r = byId(o.rid); state.cart = { rid: r.id, items: {} }; o.items.forEach(it => { const i = r.menu.findIndex(m => m[0] === it[0]); if (i >= 0) state.cart.items[i] = { q: it[1], note: it[3] || '' }; }); save(); go(viewCheckout); });
}
function viewAccount() {
  state.tab = 'account'; tabs();
  screen.innerHTML = `<div class="prof"><div class="avatar">${state.user.name[0].toUpperCase()}</div><div><b style="font-size:19px">${state.user.name}</b><br><span style="opacity:.9;font-size:13px">${state.user.phone}</span></div></div>
  <div class="wallet" style="margin-top:-1px;border-radius:0"><div>GrabPay<b>${fmt(state.wallet)}</b></div><div id="tp" style="color:var(--g);font-weight:700;display:flex;align-items:center;justify-content:center;cursor:pointer">+ Nạp tiền</div></div>
  <div class="menu" style="margin-top:10px"><div class="m" id="e1"><span>✏️ Chỉnh sửa thông tin</span><span>›</span></div><div class="m" id="e2"><span>📍 Địa chỉ giao hàng</span><span>›</span></div><div class="m"><span>🎟️ Ưu đãi của tôi</span><span style="color:#ef4b3f;font-weight:700">3</span></div><div class="m"><span>💳 Phương thức thanh toán</span><span>›</span></div><div class="m"><span>🔔 Thông báo</span><span>›</span></div><div class="m" id="e3"><span>🗑️ Xoá lịch sử đơn hàng</span><span>›</span></div></div>
  <p style="text-align:center;color:#999;font-size:12px;padding:20px 30px">Ứng dụng mô phỏng giao diện Grab — đơn hàng, thanh toán và tài xế đều là giả lập.</p>`;
  $('#e1').onclick = () => { const n = prompt('Tên của bạn:', state.user.name); if (n) { state.user.name = n; const p = prompt('Số điện thoại:', state.user.phone); if (p) state.user.phone = p; store.set('user', state.user); viewAccount(); } };
  $('#e2').onclick = () => go(viewPickLoc, () => go(viewAccount));
  $('#tp').onclick = () => { state.wallet += 100000; save(); toast('Đã nạp 100.000đ vào GrabPay'); viewAccount(); };
  $('#e3').onclick = () => { if (confirm('Xoá toàn bộ lịch sử đơn hàng?')) { state.orders = []; save(); toast('Đã xoá'); } };
}

viewHome();
setTimeout(() => { const s = $('#splash'); s.style.opacity = 0; setTimeout(() => s.remove(), 400); }, 900);
