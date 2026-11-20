/* Grab (mô phỏng) – 50 thương hiệu lớn, 1.000 chi nhánh Google Maps, đánh giá & định vị GPS */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmt = n => n.toLocaleString('vi-VN') + 'đ';
const store = { get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }, set: (k, v) => localStorage.setItem(k, JSON.stringify(v)) };

/* ================= DỮ LIỆU 50 THƯƠNG HIỆU & 1.000 QUÁN GOOGLE MAPS ================= */
const CATS = [
  ['all', 'Tất cả', 'r1/cover'],
  ['rice', 'Cơm', 'r1/cover'],
  ['noodle', 'Bún · Phở', 'r6/cover'],
  ['fast', 'Gà · Pizza', 'r3/cover'],
  ['drink', 'Trà sữa', 'r4/cover'],
  ['cafe', 'Cà phê', 'r5/cover'],
  ['snack', 'Ăn vặt', 'r7/cover'],
  ['cake', 'Bánh ngọt', 'r8/cover']
];

const BRANDS = window.BRANDS_DATA || [];
const BRAND_MAP = {};
BRANDS.forEach(b => { b.branchCount = 0; BRAND_MAP[b.b] = b; });

const R = (window.PLACES_1000 || []).map(row => {
  const br = BRAND_MAP[row[1]] || BRANDS[0];
  br.branchCount++;
  return {
    id: row[0],
    bid: br.b,
    brand: br.brand,
    branch: row[2],
    name: `${br.brand} - ${row[2]}`,
    cat: br.cat,
    tags: br.tags,
    c: br.c,
    ini: br.ini,
    aid: br.aid,
    dx: row[3],
    dy: row[4],
    rate: row[5],
    rv: row[6],
    time: row[7],
    promo: row[8],
    addr: row[9],
    hours: br.hours,
    menu: br.menu
  };
});

// Kho phản hồi khách hàng thực tế theo đúng món ăn trên Google Maps & GrabFood
const REVIEWERS = [
  ['Nguyễn Minh Anh', 'Local Guide · 48 đánh giá', '#00863c'],
  ['Trần Hoàng Phúc', 'Local Guide · 112 đánh giá', '#1d4ed8'],
  ['Lê Thu Thảo', '26 đánh giá trên Google', '#be185d'],
  ['Phạm Quốc Tuấn', 'Local Guide · 85 đánh giá', '#b45309'],
  ['Võ Ngọc Hân', '39 đánh giá trên Google', '#6d28d9'],
  ['Đặng Gia Huy', 'Local Guide · 164 đánh giá', '#0f766e'],
  ['Bùi Thanh Trúc', '52 đánh giá trên Google', '#c2410c'],
  ['Hoàng Tuấn Kiệt', 'Local Guide · 91 đánh giá', '#374151'],
  ['Ngô Bảo Châu', '64 đánh giá trên Google', '#b91c1c'],
  ['Đỗ Quang Vinh', 'Local Guide · 203 đánh giá', '#4338ca']
];

const REVIEW_TPL = {
  rice: [
    'Phần {m0} đầy đặn lắm nha, thịt ướp thấm vị nướng thơm phức, hạt cơm tơi mềm nóng hổi. Chi nhánh {addr} đóng gói hộp rất sạch sẽ, có kèm đủ canh và đồ chua.',
    'Mình đặt {m1} với {m2} ăn trưa ở văn phòng. Giao nhanh, mở hộp ra vẫn còn bốc khói, nước mắm pha kẹo chua ngọt vừa miệng, rất đáng tiền!',
    'Quán ruột trên Google Maps mỗi khi thèm cơm ngon. Phần {m0} nhiều đồ ăn, canh nóng ngọt nước, sẽ ủng hộ chi nhánh {branch} dài dài.'
  ],
  noodle: [
    'Nước dùng của {m0} trong và ngọt xương tự nhiên, không bị gắt bột ngọt. Quán để riêng bánh với nước lèo rất cẩn thận nên về tới nơi vẫn nóng hổi như ăn tại tiệm.',
    'Đặt phần {m1} kèm {m2}, thịt mềm và nhiều, rau sống rửa sạch tươi rói. Chi nhánh {addr} làm món nhanh, chuẩn vị truyền thống.',
    'Đánh giá 5 sao trên Google Maps không sai chút nào. Tô {m0} siêu chất lượng, thơm nức mũi, đóng gói kỹ không bị đổ một giọt nước dùng.'
  ],
  fast: [
    '{m0} với {m1} giao tới vẫn còn giòn rụm nóng hổi. Lớp vỏ chiên vàng ươm không bị ngấy dầu, sốt chấm cho cực kỳ hào phóng.',
    'Mình gọi combo {m0} ở chi nhánh {branch} cho cả nhóm ăn xế. Đồ ăn chuẩn vị chuỗi lớn, đóng hộp giấy cứng cáp, khoai và bánh đều thơm ngon.',
    'Chi nhánh {addr} phục vụ rất nhanh. Phần {m2} làm mới hoàn toàn, phô mai béo ngậy thơm phức, cả nhà mình ai cũng khen.'
  ],
  drink: [
    '{m0} pha đúng mức đường đá mình ghi chú, vị trà đậm thơm hậu ngọt chứ không bị gắt sữa. Trân châu dẻo mềm, ép màng nắp ly chắc chắn không bị tràn.',
    'Mê món {m1} với {m2} của hãng này cực kỳ. Lớp kem macchiato mặn béo sánh mịn, uống ngụm nào dính ngụm đó. Chi nhánh {branch} pha rất đều tay!',
    'Trưa nắng đặt ly {m3} mát lạnh tỉnh cả người. Topping cho nhiều, bao bì túi giữ nhiệt chỉnh chu.'
  ],
  cafe: [
    'Ly {m0} đậm đà thơm nồng mùi cà phê mới xay, hậu vị béo vừa phải. Đặt kèm {m3} nướng giòn thơm bơ ăn sáng là hết sẩy.',
    'Chi nhánh {addr} pha {m1} rất hợp gu mình, lớp bọt mịn, đá để riêng nên không bị nhạt. Đóng gói chống tràn 10 điểm!',
    'Mỗi sáng đều đặt {m0} hoặc {m2} ở đây. Hương cà phê chuẩn chỉnh, giao tới vẫn giữ nguyên độ lạnh và lớp foam dày.'
  ],
  snack: [
    '{m0} với {m1} trộn vừa miệng cực kỳ, đầy đủ topping khô bò, trứng cút, hành phi giòn rụm. Ăn vặt buổi chiều cùng hội bạn là số một!',
    'Phần {m2} chiên ráo dầu, xóc sốt mắm tỏi thơm nức mũi. Chi nhánh {branch} cho nhiều đồ chua ăn kèm không bị ngấy.',
    'Đặt {m0} kèm {m3} lúc tối muộn mà quán vẫn làm nóng hổi, hộp đầy ắp, giá hạt dẻ mà chất lượng quá ổn.'
  ],
  cake: [
    'Bánh {m0} cốt mềm ẩm, lớp kem phô mai mịn tan trong miệng không bị ngọt gắt. Hộp bánh của chi nhánh {branch} sang trọng kèm muỗng nĩa đầy đủ.',
    'Mình mua {m1} và {m3} làm quà chiều, bánh nướng mới thơm phức mùi bơ Pháp, sốt trứng muối chà bông ngập tràn.',
    'Tiệm bánh quen thuộc trên Google Maps, món {m2} với {m0} lúc nào cũng tươi mới trong ngày, đóng gói cẩn thận không bị xô lệch.'
  ]
};

function getReviewsFor(r) {
  const tpls = REVIEW_TPL[r.cat] || REVIEW_TPL.rice;
  const m = r.menu;
  return [0, 1, 2].map(k => {
    const u = REVIEWERS[(r.id * 3 + k * 2) % REVIEWERS.length];
    const dish = m[k % m.length][0];
    const txt = tpls[k % tpls.length]
      .replace('{m0}', m[0][0])
      .replace('{m1}', m[1 % m.length][0])
      .replace('{m2}', m[2 % m.length][0])
      .replace('{m3}', m[3 % m.length][0])
      .replace('{addr}', r.addr)
      .replace('{branch}', r.branch);
    const daysAgo = ((r.id + k * 5) % 14) + 1;
    return {
      user: u[0],
      badge: u[1],
      color: u[2],
      stars: k === 2 && r.rate < 4.7 ? 4 : 5,
      time: daysAgo === 1 ? 'Hôm qua trên Google Maps' : `${daysAgo} ngày trước trên Google Maps`,
      dish,
      dishIdx: k % m.length,
      text: txt
    };
  });
}

const DRIVERS = [
  ['Nguyễn Văn Hùng', '59X1-123.45', 'Honda Wave Alpha', '4.93'],
  ['Trần Minh Tuấn', '59P2-678.90', 'Yamaha Sirius', '4.89'],
  ['Lê Hoàng Nam', '59H3-246.80', 'Honda Vision', '4.97'],
  ['Phạm Quốc Bảo', '59C1-135.79', 'Honda Air Blade', '4.91'],
  ['Đặng Quốc Huy', '59T2-458.12', 'Honda Winner X', '4.95'],
  ['Võ Minh Khang', '59S3-889.04', 'Yamaha Exciter', '4.88']
];

const VOUCHERS = {
  GRAB30: ['Giảm 30.000đ', () => 30000],
  FREESHIP: ['Miễn phí giao hàng', o => o.fee],
  NEWUSER: ['Giảm 50.000đ đơn đầu', () => 50000]
};

const img = p => `img/${p}.jpg`;
const im = (p, alt = '') => `<img src="${img(p)}" alt="${alt}" loading="lazy" onerror="this.style.display='none'">`;
// Logo chính thức tải từ Google Favicon API cho cả 50 thương hiệu (img/brands/b{bid}.png)
const logo = r => `<div style="width:100%;height:100%;background:${r.c};color:#fff;font-weight:800;display:flex;align-items:center;justify-content:center;font-size:12px">${r.ini}<img src="img/brands/b${r.bid}.png" alt="${r.brand}" loading="lazy" onerror="this.style.display='none'"></div>`;

/* ================= STATE ================= */
const state = {
  user: store.get('user', { name: 'Khách', phone: '0900 000 000' }),
  pos: store.get('pos', { lat: 10.7725, lng: 106.6980, addr: 'Chợ Bến Thành, Quận 1' }),
  gpsDone: store.get('gpsDone', false),
  wallet: store.get('wallet', 500000),
  cat: 'all', q: '', chip: 'all', brandFilter: null, pageLimit: 40,
  cart: store.get('cart', null), orders: store.get('orders', []), tab: 'home', voucher: null
};
const save = () => { store.set('orders', state.orders); store.set('wallet', state.wallet); store.set('cart', state.cart); };
const km2lat = km => km / 110.57;
const km2lng = km => km / (111.32 * Math.cos(state.pos.lat * Math.PI / 180));
const rpos = r => [state.pos.lat + km2lat(r.dy), state.pos.lng + km2lng(r.dx)];
const distKm = (a, b) => { const d = Math.PI / 180, x = (b[1] - a[1]) * d * Math.cos((a[0] + b[0]) / 2 * d), y = (b[0] - a[0]) * d; return Math.sqrt(x * x + y * y) * 6371; };
const rdist = r => distKm([state.pos.lat, state.pos.lng], rpos(r)) * 1.25;
const eta = r => r.time + Math.round(rdist(r) * 3);
const byId = id => R.find(x => x.id === id) || R[0];
const siblings = r => R.filter(x => x.bid === r.bid).sort((a, b) => rdist(a) - rdist(b));

let maps = [], raf = null, ro = null;
const screen = $('#screen');
function killMaps() { if (ro) { ro.disconnect(); ro = null; } cancelAnimationFrame(raf); maps.forEach(m => { try { m.stop(); m.off(); m.remove(); } catch (e) {} }); maps = []; }
function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('on'), 2600); }
function go(fn, ...a) { killMaps(); $$('.ov,.done').forEach(e => e.remove()); fn(...a); screen.scrollTop = 0; }
function tabs(show = true) { $('#tabs').classList.toggle('hide', !show); $$('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === state.tab)); }
$$('#tabs button').forEach(b => b.onclick = () => { state.tab = b.dataset.tab; go({ home: viewHome, orders: viewOrders, account: viewAccount }[b.dataset.tab]); });

const ARROW = '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>';
const ICON = {
  phone: '<svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>',
  chat: '<svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1.1-4.6A8 8 0 1 1 21 12z"/></svg>',
  x: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>',
  loc: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><circle cx="12" cy="12" r="8"/></svg>'
};

/* ================= BẢN ĐỒ ================= */
function newMap(id, center, zoom = 15, opt = {}) {
  const m = L.map(id, { zoomControl: false, attributionControl: false, tap: true, ...opt }).setView(center, zoom);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(m);
  if (opt.zoomBtn !== false) L.control.zoom({ position: 'bottomright', zoomInText: '+', zoomOutText: '−' }).addTo(m);
  L.control.attribution({ prefix: false, position: 'bottomleft' }).addAttribution('© OpenStreetMap · Google Maps Data').addTo(m);
  maps.push(m); setTimeout(() => { if (maps.includes(m)) m.invalidateSize(); }, 150); return m;
}
const mk = (html, size = 40, anchor) => L.divIcon({ html, className: '', iconSize: [size, size], iconAnchor: anchor || [size / 2, size / 2] });
const shopIcon = r => mk(`<div class="mk shop">${logo(r)}</div>`, 40);
const homeIcon = () => mk('<div class="mk home"><span>🏠</span></div>', 36, [18, 36]);
const riderIcon = () => mk('<div class="mk rider">🛵</div>', 40);

async function reverseGeocode(lat, lng) {
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=vi`);
    const j = await r.json();
    return (j.display_name || '').split(',').slice(0, 3).join(',').trim() || 'Vị trí hiện tại của bạn';
  } catch {
    return `Vị trí ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}

/* ================= BẮT BUỘC ĐỊNH VỊ GPS LẦN ĐẦU ================= */
function checkMandatoryGps() {
  if (state.gpsDone) return;
  const gate = document.createElement('div');
  gate.className = 'gpsgate';
  gate.innerHTML = `
    <div>
      <div class="art">📍</div>
      <h2>Bật định vị để nạp 1.000 quán quanh bạn</h2>
      <p>GrabFood cần xác nhận tọa độ GPS để tải danh sách <b>${R.length.toLocaleString('vi-VN')} quán & chi nhánh Google Maps</b> kèm đánh giá thực tế gần bạn nhất.</p>
      <div id="gmap"></div>
      <div class="gaddr" id="gad">📍 ${state.pos.addr}</div>
      <div style="font-size:11.5px;color:#777">Bấm "Lấy GPS hiện tại" hoặc kéo ghim đỏ trên bản đồ tới vị trí của bạn</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px">
      <button class="btn" id="gbtn" style="justify-content:center;gap:8px">📡 Lấy vị trí GPS hiện tại</button>
      <button class="btn o" id="gok" style="justify-content:center">Xác nhận vị trí này (${R.length.toLocaleString('vi-VN')} quán)</button>
    </div>`;
  $('#app').appendChild(gate);

  let tmp = { ...state.pos };
  const gm = L.map('gmap', { zoomControl: false, attributionControl: false }).setView([tmp.lat, tmp.lng], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(gm);
  const gmk = L.marker([tmp.lat, tmp.lng], { icon: homeIcon(), draggable: true }).addTo(gm);
  setTimeout(() => gm.invalidateSize(), 180);

  const updatePin = async (lat, lng) => {
    tmp.lat = lat; tmp.lng = lng;
    gmk.setLatLng([lat, lng]); gm.setView([lat, lng], 16);
    $('#gad').textContent = '📍 Đang dò địa chỉ quanh bạn...';
    tmp.addr = await reverseGeocode(lat, lng);
    if ($('#gad')) $('#gad').textContent = '📍 ' + tmp.addr;
  };
  gm.on('click', e => updatePin(e.latlng.lat, e.latlng.lng));
  gmk.on('dragend', () => { const p = gmk.getLatLng(); updatePin(p.lat, p.lng); });

  const finishGps = () => {
    state.pos = tmp; state.gpsDone = true;
    store.set('pos', tmp); store.set('gpsDone', true);
    try { gm.remove(); } catch {}
    gate.remove();
    toast(`Đã nạp ${R.length.toLocaleString('vi-VN')} quán quanh vị trí của bạn`);
    go(viewHome);
  };

  $('#gbtn').onclick = () => {
    $('#gbtn').textContent = '⏳ Đang kết nối vệ tinh GPS...';
    if (!navigator.geolocation) {
      toast('Trình duyệt không hỗ trợ GPS, hãy chạm bản đồ rồi bấm Xác nhận');
      $('#gbtn').textContent = '📡 Lấy vị trí GPS hiện tại';
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async p => {
        await updatePin(p.coords.latitude, p.coords.longitude);
        finishGps();
      },
      () => {
        toast('Không lấy được quyền GPS tự động — hãy kéo ghim và bấm Xác nhận bên dưới');
        $('#gbtn').textContent = '📡 Thử lấy GPS lại';
      },
      { enableHighAccuracy: true, timeout: 7000 }
    );
  };
  $('#gok').onclick = finishGps;
}

/* ================= TRANG CHỦ ================= */
function vcardTag(r) { return r.promo ? `<span class="badge${r.promo === 'Freeship' ? ' g' : ''}">${r.promo}</span>` : ''; }

function nearestPerBrand() {
  return BRANDS.map(br => R.filter(x => x.bid === br.b).sort((a, b) => rdist(a) - rdist(b))[0]).filter(Boolean).sort((a, b) => rdist(a) - rdist(b));
}

function viewHome() {
  state.tab = 'home'; tabs();
  const nearAll = [...R].sort((a, b) => rdist(a) - rdist(b));
  const nearBrands = nearestPerBrand();
  const svc = [['Đồ ăn', '🍔', '#e5f7ec', 'food'], ['Siêu thị', '🛒', '#fff0e0', 'soon'], ['Giao hàng', '📦', '#e6f0ff', 'soon'], ['Xe máy', '🛵', '#e5f7ec', 'soon'], ['Ô tô', '🚗', '#e6f0ff', 'soon'], ['Ưu đãi', '🎟️', '#ffe9e7', 'deal'], ['GrabPay', '💳', '#eee9ff', 'pay'], ['Bản đồ', '🗺️', '#e8f5e9', 'map']];

  screen.innerHTML = `<div class="hhead"><div class="hrow"><div class="addr" id="chg"><small>📍 Giao đến (${R.length.toLocaleString('vi-VN')} quán quanh đây)</small><b>${state.pos.addr} ▾</b></div><div class="avatar">${state.user.name[0].toUpperCase()}</div></div></div>
  <div class="sbox pull" id="sb">${ICON.search}<span style="color:#666;font-size:14px">Tìm trong 1.000 quán: Phúc Long, KFC, Phở...</span></div>
  <div class="wallet"><div>GrabPay<b>${fmt(state.wallet)}</b></div><div>GrabRewards<b>1.250 điểm</b></div><div>Ưu đãi<b>3 mã</b></div></div>
  <div class="grid">${svc.map(s => `<button class="svc" data-s="${s[3]}"><i style="background:${s[2]}">${s[1]}</i>${s[0]}${s[3] === 'food' ? '<em>HOT</em>' : ''}</button>`).join('')}</div>

  <div class="sw" style="margin-top:10px;padding-bottom:14px">
    <div class="sec">50 Thương hiệu chính hãng<a id="allb">${R.length.toLocaleString('vi-VN')} chi nhánh</a></div>
    <div class="hs">${BRANDS.map(br => {
      const nb = R.find(x => x.bid === br.b);
      return `<div class="bcard" data-bid="${br.b}"><div class="blg">${logo(nb)}</div><b>${br.brand}</b><small>${br.branchCount} chi nhánh</small></div>`;
    }).join('')}</div>
  </div>

  <div class="sw" style="margin-top:10px;padding-bottom:6px"><div class="sec" style="padding-top:16px">Ưu đãi độc quyền hôm nay</div>
  <div class="hs" id="pr">${[
    ['r1', 'Phúc Lộc Thọ\ngiảm 20K', 'Cho đơn cơm tấm từ 55K', nearBrands[0].id],
    ['r4', 'Phúc Long & KOI\nMua 1 tặng 1', 'Trà sữa đậm vị giao nhanh', (R.find(x => x.bid === 14) || nearAll[0]).id],
    ['r3', 'KFC · McDonald’s\nFreeship 0đ', 'Nhập mã FREESHIP ngay', (R.find(x => x.bid === 8) || nearAll[0]).id]
  ].map(p => `<div class="promo" data-id="${p[3]}">${im(p[0] + '/cover')}<div><h4>${p[1].replace('\n', '<br>')}</h4><p>${p[2]}</p><span>Đặt ngay</span></div></div>`).join('')}</div>
  <div class="dots" id="dots"><i class="on"></i><i></i><i></i></div></div>

  <div class="sw" style="margin-top:10px;padding-bottom:16px"><div class="sec">Quán gần bạn nhất trên Google Maps<a id="all1">Xem ${R.length.toLocaleString('vi-VN')} quán</a></div>
  <div class="hs">${nearAll.slice(0, 12).map(r => `<div class="hcard" data-id="${r.id}"><div class="im" style="background:${r.c}33">${vcardTag(r)}${im('r' + r.aid + '/cover')}<span class="timechip">${eta(r)} phút · ${rdist(r).toFixed(1)} km</span></div><b>${r.name}</b><small><span class="star">★</span> ${r.rate} (${r.rv}) · ${BRAND_MAP[r.bid].branchCount} CN</small></div>`).join('')}</div></div>

  <div class="sec" style="padding-bottom:4px">Đề xuất nổi bật quanh đây</div>${nearBrands.slice(0, 12).map(rcard).join('')}
  <div style="padding:8px 16px 24px"><button class="btn o" id="all2" style="text-align:center">Xem danh sách đầy đủ ${R.length.toLocaleString('vi-VN')} quán ăn</button></div>`;

  $('#chg').onclick = () => go(viewPickLoc, () => go(viewHome));
  $('#sb').onclick = () => { state.brandFilter = null; state.pageLimit = 40; go(viewFood, { focus: true }); };
  $('#all1').onclick = $('#all2').onclick = $('#allb').onclick = () => { state.brandFilter = null; state.pageLimit = 40; go(viewFood, {}); };
  $$('.svc').forEach(b => b.onclick = () => ({
    food: () => { state.brandFilter = null; state.pageLimit = 40; go(viewFood, {}); },
    deal: () => { state.brandFilter = null; state.chip = 'deal'; state.pageLimit = 40; go(viewFood, {}); },
    map: () => go(viewMapAll),
    pay: () => toast('Ví GrabPay: ' + fmt(state.wallet)),
    soon: () => toast('Dịch vụ đang bảo trì khu vực này')
  }[b.dataset.s])());
  $$('.bcard').forEach(c => c.onclick = () => { state.brandFilter = +c.dataset.bid; state.cat = 'all'; state.chip = 'all'; state.pageLimit = 40; go(viewFood, {}); });
  $$('.promo,.hcard,.rcard').forEach(c => c.onclick = () => go(viewRest, +c.dataset.id));
  const pr = $('#pr'); pr.onscroll = () => { const i = Math.round(pr.scrollLeft / (pr.firstChild.offsetWidth + 12)); $$('#dots i').forEach((d, k) => d.classList.toggle('on', k === i)); };
}

function rcard(r) {
  const bcnt = BRAND_MAP[r.bid]?.branchCount || 20;
  const topRv = getReviewsFor(r)[0];
  return `<div class="rcard" data-id="${r.id}"><div class="im" style="background:${r.c}33">${vcardTag(r)}<span class="partner">✓ Google Maps</span>${im('r' + r.aid + '/cover')}<span class="timechip">${eta(r)} phút · ${rdist(r).toFixed(1)} km</span></div>
  <div class="bd"><div class="lg">${logo(r)}</div><div class="nm">${r.name}</div><div class="br">📍 ${r.addr} · Hệ thống ${bcnt} chi nhánh</div>
  <div class="mt"><span><span class="star">★</span> <b style="color:#1f1f1f">${r.rate}</b> (${r.rv} đánh giá)</span><i class="dot"></i><span>${r.tags}</span></div>
  <div style="font-size:11.5px;color:#555;background:#f7f8f9;border-radius:8px;padding:5px 8px;margin-top:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">💬 <b>${topRv.user}:</b> "${topRv.text}"</div>
  ${r.promo ? `<span class="vtag">🎟️ ${r.promo === 'Freeship' ? 'Miễn phí giao hàng' : r.promo === 'Mua 1 tặng 1' ? 'Mua 1 tặng 1 (tối đa 30k)' : r.promo + ' cho đơn hôm nay'}</span>` : ''}</div></div>`;
}

/* ================= TRANG ĐỒ ĂN (1.000 QUÁN) ================= */
function filtered() {
  const q = state.q.toLowerCase();
  let l = R.filter(r =>
    (!state.brandFilter || r.bid === state.brandFilter) &&
    (state.cat === 'all' || r.cat === state.cat) &&
    (!q || r.name.toLowerCase().includes(q) || r.addr.toLowerCase().includes(q) || r.tags.toLowerCase().includes(q) || r.menu.some(m => m[0].toLowerCase().includes(q)))
  );
  if (state.chip === 'deal') l = l.filter(r => r.promo);
  if (state.chip === 'fast') l = l.filter(r => eta(r) <= 22);
  if (state.chip === 'top') l = l.filter(r => r.rate >= 4.8);
  if (state.chip === 'near') l = l.filter(r => rdist(r) <= 1.5);
  return l.sort((a, b) => rdist(a) - rdist(b));
}

function viewFood(o = {}) {
  state.tab = 'home'; tabs();
  const brObj = state.brandFilter ? BRAND_MAP[state.brandFilter] : null;
  screen.innerHTML = `<div class="top"><button class="ib" id="bk">${ARROW}</button><div class="sbox" style="margin:0;flex:1;box-shadow:none;background:#f1f1f1;padding:9px 14px">${ICON.search}<input id="q" placeholder="Tìm trong ${R.length.toLocaleString('vi-VN')} quán, tên đường, món ăn..." value="${state.q}"></div></div>
  <div class="cgrid">${CATS.map(c => `<button class="cat ${state.cat === c[0] ? 'on' : ''}" data-c="${c[0]}"><div class="ci">${im(c[2])}</div>${c[1]}</button>`).join('')}</div>
  <div class="chips">
    <button class="chip" id="mapb">🗺️ Bản đồ (${R.length.toLocaleString('vi-VN')})</button>
    ${brObj ? `<button class="chip on" id="clrb">🏪 ${brObj.brand} (${brObj.branchCount} CN) ✕</button>` : ''}
    ${[['all', 'Tất cả'], ['near', '📍 Gần tôi <1.5km'], ['deal', '🎟️ Ưu đãi'], ['fast', '⚡ Giao nhanh'], ['top', '★ 4.8+']].map(c => `<button class="chip ${state.chip === c[0] ? 'on' : ''}" data-ch="${c[0]}">${c[1]}</button>`).join('')}
  </div>
  <div id="list"></div><div style="height:20px"></div>`;

  const draw = () => {
    const l = filtered();
    const shown = l.slice(0, state.pageLimit);
    $('#list').innerHTML = l.length
      ? `<div style="padding:10px 16px 2px;font-size:12.5px;color:#555;font-weight:600;display:flex;justify-content:space-between"><span>Tìm thấy <b>${l.length.toLocaleString('vi-VN')}</b> quán trên Google Maps</span><span>Đang hiện ${shown.length}</span></div>` +
        shown.map(rcard).join('') +
        (shown.length < l.length ? `<div style="padding:10px 16px"><button class="btn o" id="more" style="text-align:center">Tải thêm quán (${shown.length}/${l.length.toLocaleString('vi-VN')})</button></div>` : '')
      : '<div class="empty"><div class="big">🔍</div><h4>Không tìm thấy chi nhánh</h4>Thử từ khoá hoặc bộ lọc khác nhé</div>';
    $$('.rcard').forEach(c => c.onclick = () => go(viewRest, +c.dataset.id));
    if ($('#more')) $('#more').onclick = () => { state.pageLimit += 60; draw(); };
  };
  draw();

  $('#q').oninput = e => { state.q = e.target.value; state.pageLimit = 40; draw(); }; if (o.focus) $('#q').focus();
  $$('.cat').forEach(b => b.onclick = () => { state.cat = b.dataset.c; state.brandFilter = null; state.pageLimit = 40; go(viewFood, {}); });
  $$('[data-ch]').forEach(b => b.onclick = () => { state.chip = b.dataset.ch; state.pageLimit = 40; go(viewFood, {}); });
  if ($('#clrb')) $('#clrb').onclick = () => { state.brandFilter = null; go(viewFood, {}); };
  $('#mapb').onclick = () => go(viewMapAll);
  $('#bk').onclick = () => { state.q = ''; state.cat = 'all'; state.chip = 'all'; state.brandFilter = null; go(viewHome); };
}

function viewMapAll() {
  tabs(false);
  const list = filtered();
  // Hiển thị tối đa 250 ghim logo gần nhất hoặc toàn bộ 1.000 điểm tròn nhanh để bản đồ mượt
  screen.innerHTML = `<div id="trkmap"></div><button class="ib floatl" id="bk">${ARROW}</button><div style="position:absolute;top:14px;left:58px;right:14px;z-index:1000;background:#fff;border-radius:20px;padding:8px 14px;font-size:12.5px;font-weight:700;box-shadow:0 2px 8px #0003">🗺️ ${list.length.toLocaleString('vi-VN')} quán Google Maps quanh bạn</div>`;
  const m = newMap('trkmap', [state.pos.lat, state.pos.lng], 14, { preferCanvas: true });
  L.marker([state.pos.lat, state.pos.lng], { icon: homeIcon(), zIndexOffset: 2000 }).addTo(m);
  list.slice(0, 120).forEach(r => {
    const mkr = L.marker(rpos(r), { icon: shopIcon(r) }).addTo(m);
    mkr.bindPopup(`<b>${r.name}</b><br><span style="font-size:12px;color:#666">📍 ${r.addr} · ★ ${r.rate} (${r.rv}) · ${rdist(r).toFixed(1)} km</span><br><a href="#" id="pop_${r.id}" style="color:#00b14f;font-weight:700">Xem thực đơn & đánh giá →</a>`);
    mkr.on('popupopen', () => { const a = $('#pop_' + r.id); if (a) a.onclick = e => { e.preventDefault(); go(viewRest, r.id); }; });
  });
  list.slice(120).forEach(r => {
    const cm = L.circleMarker(rpos(r), { radius: 6, fillColor: r.c, color: '#fff', weight: 1.5, fillOpacity: 0.9 }).addTo(m);
    cm.bindPopup(`<b>${r.name}</b><br><span style="font-size:12px;color:#666">📍 ${r.addr} · ★ ${r.rate} (${r.rv}) · ${rdist(r).toFixed(1)} km</span><br><a href="#" id="pop_${r.id}" style="color:#00b14f;font-weight:700">Xem thực đơn & đánh giá →</a>`);
    cm.on('popupopen', () => { const a = $('#pop_' + r.id); if (a) a.onclick = e => { e.preventDefault(); go(viewRest, r.id); }; });
  });
  $('#bk').onclick = () => go(viewFood, {});
}

function viewPickLoc(back) {
  tabs(false);
  screen.innerHTML = `<div class="top"><button class="ib" id="bk">${ARROW}</button><h2>Chọn điểm giao hàng</h2></div>
  <div id="mp" style="position:absolute;top:57px;left:0;right:0;bottom:170px"></div>
  <div style="position:absolute;left:0;right:0;bottom:0;background:#fff;padding:14px 16px;border-radius:20px 20px 0 0;box-shadow:0 -4px 16px #0002;z-index:1000;height:170px">
  <div id="ad" style="font-weight:700;font-size:14.5px;min-height:22px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">📍 ${state.pos.addr}</div><div style="font-size:12px;color:#777;margin:4px 0 12px">Chạm vào bản đồ hoặc kéo ghim để định vị lại ${R.length.toLocaleString('vi-VN')} quán quanh bạn</div>
  <div style="display:flex;gap:8px"><button class="btn o" id="gps" style="width:auto;padding:13px 16px">${ICON.loc.replace('<svg', '<svg width="20" height="20" style="stroke:#00b14f;fill:none;stroke-width:2"')}</button><button class="btn" id="ok" style="justify-content:center">Xác nhận vị trí</button></div></div>`;
  const m = newMap('mp', [state.pos.lat, state.pos.lng], 16);
  let tmp = { ...state.pos };
  const mkr = L.marker([tmp.lat, tmp.lng], { icon: homeIcon(), draggable: true }).addTo(m);
  const set = async (lat, lng) => {
    tmp.lat = lat; tmp.lng = lng; mkr.setLatLng([lat, lng]);
    if ($('#ad')) $('#ad').textContent = '📍 Đang xác định địa chỉ...';
    tmp.addr = await reverseGeocode(lat, lng);
    if ($('#ad')) $('#ad').textContent = '📍 ' + tmp.addr;
  };
  m.on('click', e => set(e.latlng.lat, e.latlng.lng));
  mkr.on('dragend', () => { const p = mkr.getLatLng(); set(p.lat, p.lng); });
  $('#gps').onclick = () => navigator.geolocation ? navigator.geolocation.getCurrentPosition(p => { m.setView([p.coords.latitude, p.coords.longitude], 16); set(p.coords.latitude, p.coords.longitude); }, () => toast('Không lấy được vị trí GPS'), { timeout: 8000 }) : toast('Thiết bị không hỗ trợ GPS');
  $('#ok').onclick = () => { state.pos = tmp; state.gpsDone = true; store.set('pos', tmp); store.set('gpsDone', true); toast('Đã cập nhật vị trí giao hàng'); back(); };
  $('#bk').onclick = () => go(back);
}

/* ================= QUÁN + CHI NHÁNH + PHẢN HỒI GOOGLE MAPS + GIỎ HÀNG ================= */
const cartInfo = () => { const c = state.cart; if (!c) return { n: 0, sum: 0 }; const r = byId(c.rid); let n = 0, sum = 0; for (const [i, l] of Object.entries(c.items)) { n += l.q; sum += r.menu[i][1] * l.q; } return { n, sum }; };

function viewRest(id) {
  tabs(false);
  const r = byId(id);
  const sibs = siblings(r);
  const revs = getReviewsFor(r);
  const half = Math.ceil(r.menu.length / 2);
  const secs = [
    ['Món bán chạy nhất', r.menu.slice(0, half), 0],
    [r.cat === 'drink' || r.cat === 'cafe' ? 'Đồ uống & Bánh dùng kèm' : 'Món ăn kèm & Giải khát', r.menu.slice(half), half]
  ].filter(s => s[1].length);

  screen.innerHTML = `<div class="cover" style="background:${r.c}">${im('r' + r.aid + '/cover')}<button class="ib" id="bk" style="left:12px">${ARROW}</button><button class="ib" id="mp1" style="right:12px">🗺️</button></div>
  <div class="rinfo">
    <div style="display:flex;gap:12px;align-items:center">
      <div style="width:48px;height:48px;border-radius:12px;overflow:hidden;border:1.5px solid #eee;flex:none">${logo(r)}</div>
      <div style="flex:1;min-width:0"><h1>${r.name}</h1><div class="mt"><span><span class="star">★</span> <b>${r.rate}</b> (${r.rv} đánh giá Google Maps)</span><i class="dot"></i><span>${r.tags}</span></div></div>
    </div>
    <div class="row2"><div>Khoảng cách<b>${rdist(r).toFixed(1)} km</b></div><div>Giao trong<b>${eta(r)}-${eta(r) + 8} phút</b></div><div>Phí giao<b>${r.promo === 'Freeship' ? 'Miễn phí' : fmt(feeOf(r))}</b></div></div>
    <div class="brpick" id="brs"><span>🏪 Chi nhánh: <b>${r.branch}</b> (${r.addr})</span><b>Đổi (${sibs.length} CN) ▾</b></div>
  </div>
  ${r.promo ? `<div class="sw hs" style="padding:4px 16px 14px;overflow-x:auto"><div class="vouch"><b>🎟️ ${r.promo}</b>Áp dụng tự động khi thanh toán · HSD hôm nay</div><div class="vouch"><b>🎟️ GRAB30</b>Giảm 30.000đ — nhập mã khi thanh toán</div></div>` : ''}
  <div class="mtabs" id="mt">${secs.map((s, k) => `<button data-k="sec${k}" class="${k ? '' : 'on'}">${s[0]}</button>`).join('')}<button data-k="rvsec">★ Đánh giá (${r.rv})</button></div>
  <div id="menu"></div>

  <div id="rvsec" style="margin-top:10px;background:#fff">
    <div class="mhead" style="display:flex;justify-content:space-between;align-items:center;padding-bottom:10px;border-bottom:1px solid var(--line)">
      <span>Đánh giá thực tế từ Google Maps</span>
      <span style="font-size:14px;color:#00863c"><span class="star">★</span> ${r.rate}/5 (${r.rv})</span>
    </div>
    ${revs.map(rv => `<div class="rvcard">
      <div class="rvh">
        <div class="rvav" style="background:${rv.color}">${rv.user[0]}</div>
        <div class="rvu"><b>${rv.user}</b><small>${rv.badge} · ${rv.time}</small></div>
        <div style="color:#f5a623;font-size:13px;font-weight:700">${'★'.repeat(rv.stars)}</div>
      </div>
      <div class="rvtxt">${rv.text}</div>
      <div class="rvdish">🍽️ Đã đặt: ${rv.dish}</div>
      <div class="rvpics">${im('r' + r.aid + '/m' + rv.dishIdx)}${im('r' + r.aid + '/cover')}</div>
    </div>`).join('')}
  </div>

  <div class="box" style="margin-top:10px"><h4>Vị trí trên Google Maps (${sibs.length} chi nhánh)</h4><div style="font-size:13px;color:#555;margin-bottom:8px">📍 ${r.addr} · Mở cửa ${r.hours}</div><div id="mp" style="height:180px;border-radius:12px;overflow:hidden;position:relative;z-index:0"></div></div><div style="height:90px"></div><div class="cartbar" id="cb"></div>`;

  const m = newMap('mp', rpos(r), 15, { scrollWheelZoom: false });
  sibs.forEach(sb => L.marker(rpos(sb), { icon: shopIcon(sb), opacity: sb.id === r.id ? 1 : 0.65 }).addTo(m));
  L.marker([state.pos.lat, state.pos.lng], { icon: homeIcon() }).addTo(m);
  m.fitBounds([rpos(r), [state.pos.lat, state.pos.lng]], { padding: [36, 36] });

  const draw = () => {
    const mine = state.cart && state.cart.rid === id ? state.cart.items : {};
    $('#menu').innerHTML = secs.map((s, k) => `<div id="sec${k}"><div class="mhead">${s[0]}</div>${s[1].map((it, j) => {
      const i = s[2] + j, q = mine[i]?.q || 0;
      return `<div class="item" data-i="${i}"><div class="t"><b>${it[0]}</b><p>${it[2]}</p><div class="pr">${fmt(it[1])}</div></div><div class="pic"><span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:38px;background:${r.c}22;border-radius:12px">${it[3]}</span>${im('r' + r.aid + '/m' + i)}<span class="add">${q || '+'}</span></div></div>`;
    }).join('')}</div>`).join('');
    $$('.item').forEach(e => e.onclick = () => itemSheet(r, +e.dataset.i, draw));
    const { n, sum } = state.cart && state.cart.rid === id ? cartInfo() : { n: 0, sum: 0 };
    $('#cb').innerHTML = n ? `<button id="gc"><span><span class="cn">${n}</span>Xem giỏ hàng</span><span>${fmt(sum)}</span></button>` : '';
    if (n) $('#gc').onclick = () => go(viewCheckout);
  };
  draw();

  $('#brs').onclick = () => branchSheet(r, sibs);
  $$('#mt button').forEach(b => b.onclick = () => {
    $$('#mt button').forEach(x => x.classList.toggle('on', x === b));
    const t = $('#' + b.dataset.k);
    if (t) screen.scrollTo({ top: t.offsetTop - 50, behavior: 'smooth' });
  });
  $('#bk').onclick = () => go(viewFood, {});
  $('#mp1').onclick = () => screen.scrollTo({ top: screen.scrollHeight, behavior: 'smooth' });
}

function branchSheet(cur, sibs) {
  const ov = document.createElement('div'); ov.className = 'ov';
  ov.innerHTML = `<div class="bs"><div class="bd">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><h3>${sibs.length} Chi nhánh ${cur.brand}</h3><button class="ib" id="x" style="box-shadow:none;background:#f1f1f1">${ICON.x}</button></div>
    ${sibs.map(sb => `<div class="opt ${sb.id === cur.id ? 'on' : ''}" data-id="${sb.id}">
      <div class="optc"><b>${sb.branch} ${sb.promo ? `<span style="color:#ef4b3f;font-size:11px">(${sb.promo})</span>` : ''}</b><small>📍 ${sb.addr} · ★ ${sb.rate} (${sb.rv}) · ${rdist(sb).toFixed(1)} km (~${eta(sb)} phút)</small></div>
      <span class="ra"></span>
    </div>`).join('')}
  </div></div>`;
  $('#app').appendChild(ov);
  $('#x').onclick = () => ov.remove();
  ov.onclick = e => { if (e.target === ov) ov.remove(); };
  $$('[data-id]', ov).forEach(el => el.onclick = () => {
    const nid = +el.dataset.id;
    if (state.cart && state.cart.rid === cur.id) { state.cart.rid = nid; save(); }
    ov.remove();
    go(viewRest, nid);
  });
}

function itemSheet(r, i, after) {
  const it = r.menu[i];
  if (state.cart && state.cart.rid !== r.id) {
    if (byId(state.cart.rid).bid === r.bid) {
      state.cart.rid = r.id;
    } else {
      if (!confirm(`Giỏ hàng đang có món của "${byId(state.cart.rid).name}". Xoá giỏ cũ và tạo giỏ mới?`)) return;
      state.cart = null;
    }
  }
  const cur = state.cart?.items[i];
  let q = cur?.q || 1;
  const ov = document.createElement('div'); ov.className = 'ov';
  ov.innerHTML = `<div class="bs"><div class="hero" style="background:${r.c}33"><span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:84px">${it[3]}</span>${im('r' + r.aid + '/m' + i)}<button class="ib" id="x">${ICON.x}</button></div>
  <div class="bd"><h3>${it[0]}</h3><div class="price">${fmt(it[1])}</div><div style="font-size:13px;color:#666">${it[2]}</div><textarea id="nt" rows="2" placeholder="Ghi chú cho quán (ví dụ: ít đá, không hành, xin thêm tương ớt...)">${cur?.note || ''}</textarea>
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
    <div class="box"><h4>Giao đến <a id="chg">Thay đổi</a></h4><div style="font-weight:700">📍 ${state.pos.addr}</div><div style="font-size:12.5px;color:#777;margin-top:4px">${state.user.name} · ${state.user.phone}</div><input class="fld" id="dn" placeholder="Ghi chú cho tài xế (số tầng, gửi bảo vệ...)" value="${state.dnote || ''}"></div>
    <div class="box"><h4>Chi nhánh giao</h4><div style="font-size:13.5px;font-weight:700">${r.name}</div><div style="font-size:12px;color:#666;margin-top:2px">📍 ${r.addr} · Cách bạn ${rdist(r).toFixed(1)} km · Dự kiến ${eta(r)}-${eta(r) + 10} phút</div></div>
    <div class="box"><h4>Món đã chọn <a id="add">Thêm món</a></h4>${Object.entries(c.items).map(([i, l]) => `<div class="qrow"><span class="q">${l.q}x</span><div style="flex:1"><div>${r.menu[i][0]}</div>${l.note ? `<small style="color:#888">${l.note}</small>` : ''}</div><span>${fmt(r.menu[i][1] * l.q)}</span></div>`).join('')}</div>
    <div class="box"><h4>Phương thức thanh toán</h4>${[['cash', '💵', 'Tiền mặt', 'Thanh toán trực tiếp cho tài xế'], ['wallet', '💚', 'Ví GrabPay', 'Số dư ' + fmt(state.wallet)], ['card', '💳', 'Visa •••• 4242', 'Thẻ quốc tế liên kết']].map(p => `<div class="opt ${pay === p[0] ? 'on' : ''}" data-p="${p[0]}"><span class="ic">${p[1]}</span><div class="optc"><b>${p[2]}</b><small>${p[3]}</small></div><span class="ra"></span></div>`).join('')}</div>
    <div class="box"><h4>Ưu đãi</h4>${r.promo ? `<div class="row"><span>🎟️ ${r.promo}</span><span class="d">Đã áp dụng</span></div>` : ''}<div style="display:flex;gap:8px"><input class="fld" id="vc" style="margin:0" placeholder="Nhập mã (GRAB30, FREESHIP, NEWUSER)" value="${vcode || ''}"><button class="btn o" id="va" style="width:auto;padding:0 18px;box-shadow:none">Áp dụng</button></div>${vcode ? `<div style="color:#00863c;font-size:12.5px;margin-top:8px">✓ ${VOUCHERS[vcode][0]}</div>` : ''}</div>
    <div class="box"><h4>Chi tiết thanh toán</h4><div class="row"><span>Tạm tính</span><span>${fmt(sub)}</span></div><div class="row"><span>Phí giao hàng (${rdist(r).toFixed(1)} km)</span><span>${t.fee ? fmt(t.fee) : 'Miễn phí'}</span></div><div class="row"><span>Phí dịch vụ & nền tảng</span><span>${fmt(t.svc)}</span></div>
    ${t.disc ? `<div class="row"><span>Khuyến mãi quán</span><span class="d">-${fmt(t.disc)}</span></div>` : ''}${t.vd ? `<div class="row"><span>Mã ${vcode}</span><span class="d">-${fmt(t.vd)}</span></div>` : ''}<div class="row tot"><span>Tổng thanh toán</span><span>${fmt(t.total)}</span></div></div>
    <div style="height:90px"></div><div class="cartbar"><button id="go"><span>Đặt đơn giao ngay</span><span>${fmt(t.total)}</span></button></div>`;
    $('#bk').onclick = () => go(viewRest, r.id); $('#add').onclick = () => go(viewRest, r.id);
    $('#chg').onclick = () => go(viewPickLoc, () => go(viewCheckout));
    $$('[data-p]').forEach(e => e.onclick = () => { state.dnote = $('#dn').value; pay = state.lastPay = e.dataset.p; render(); });
    $('#va').onclick = () => { state.dnote = $('#dn').value; const v = $('#vc').value.trim().toUpperCase(); if (!v) { vcode = state.voucher = null; render(); return; } if (VOUCHERS[v]) { vcode = state.voucher = v; toast('Áp dụng mã thành công'); render(); } else toast('Mã không hợp lệ hoặc đã hết hạn'); };
    $('#go').onclick = () => {
      if (pay === 'wallet') { if (state.wallet < t.total) return toast('Số dư GrabPay không đủ'); state.wallet -= t.total; }
      const d1 = DRIVERS[Math.floor(Math.random() * DRIVERS.length)];
      let d2 = DRIVERS[Math.floor(Math.random() * DRIVERS.length)];
      if (d2[0] === d1[0]) d2 = DRIVERS[(DRIVERS.indexOf(d1) + 1) % DRIVERS.length];
      const rnd = (a, b) => Math.floor(a + Math.random() * (b - a));
      const plan = {
        tConfirm: rnd(3500, 6000),
        tFind1: rnd(7000, 12000),
        tCancel1: rnd(3500, 5500),
        tFind2: rnd(6000, 10000),
        tToShop: rnd(14000, 20000),
        tKitchen: rnd(12000, 18000),
        tKitchenDelay: rnd(9000, 14000),
        tDeliver: rnd(20000, 28000),
        tFinalIncident: rnd(8000, 12000),
        stopRatio: +(0.86 + Math.random() * 0.07).toFixed(2),
        incidentIdx: Math.floor(Math.random() * 4)
      };
      const o = {
        id: 'GF-' + Date.now().toString().slice(-8),
        rid: r.id,
        items: Object.entries(c.items).map(([i, l]) => [r.menu[i][0], l.q, r.menu[i][1], l.note]),
        total: t.total, fee: t.fee, pay, dnote: $('#dn').value,
        pos: { ...state.pos }, t: Date.now(),
        driver1: d1, driver: d2, plan, status: 'active'
      };
      state.orders.unshift(o); state.cart = null; state.voucher = null; state.dnote = ''; save(); go(viewTrack, o.id);
    };
  };
  render();
}

/* ================= THEO DÕI ĐƠN (KỊCH BẢN BẤT NGỜ & HỦY PHÚT CUỐI ẨN) ================= */
async function getRoute(a, b) {
  try {
    const ctl = new AbortController(); setTimeout(() => ctl.abort(), 3500);
    const r = await fetch(`https://router.project-osrm.org/route/v1/driving/${a[1]},${a[0]};${b[1]},${b[0]}?overview=full&geometries=geojson`, { signal: ctl.signal });
    const j = await r.json(); return j.routes[0].geometry.coordinates.map(p => [p[1], p[0]]);
  } catch { return [a, b]; }
}
function along(line, t) {
  const seg = []; let tot = 0; for (let i = 1; i < line.length; i++) { const d = distKm(line[i - 1], line[i]); seg.push(d); tot += d; }
  let target = Math.max(0, Math.min(1, t)) * tot;
  for (let i = 0; i < seg.length; i++) {
    if (target <= seg[i] || i === seg.length - 1) {
      const f = seg[i] ? Math.min(1, target / seg[i]) : 1;
      return [line[i][0] + (line[i + 1][0] - line[i][0]) * f, line[i][1] + (line[i + 1][1] - line[i][1]) * f];
    }
    target -= seg[i];
  }
  return line[line.length - 1];
}

const INCIDENTS = [
  ['Sự cố phương tiện trên đường giao', 'Tài xế báo xe bị thủng lốp đột xuất cách điểm giao ~150m và không thể tiếp tục di chuyển.'],
  ['Sự cố va chạm giao thông nhẹ', 'Tài xế gặp va quệt giao thông tại ngã tư gần bạn, hộp đồ ăn bị đổ hỏng không đảm bảo chất lượng.'],
  ['Khu vực giao hàng bị phong tỏa / cấm đường', 'Đoạn đường vào vị trí của bạn đang rào chắn đột xuất và mất kết nối GPS với tài xế quá thời gian quy định.'],
  ['Tài xế gặp sự cố sức khỏe đột xuất', 'Đối tác tài xế báo sự cố khẩn cấp trên đường giao và hệ thống đã tự động thu hồi đơn hàng.']
];

const STAGES = ['Xác nhận', 'Tìm tài xế', 'Đến quán', 'Làm món', 'Giao hàng'];

function viewTrack(id) {
  tabs(false);
  const o = state.orders.find(x => x.id === id);
  if (!o) return go(viewOrders);
  const r = byId(o.rid), U = [o.pos.lat, o.pos.lng], S = rpos(r);
  const D1 = o.driver1 || o.driver, D2 = o.driver;
  const P = o.plan || { tConfirm: 4000, tFind1: 8000, tCancel1: 4000, tFind2: 7000, tToShop: 15000, tKitchen: 14000, tKitchenDelay: 10000, tDeliver: 22000, tFinalIncident: 9000, stopRatio: 0.89, incidentIdx: 0 };
  const inc = INCIDENTS[P.incidentIdx % INCIDENTS.length];
  const start = [S[0] + km2lat(.85), S[1] - km2lng(.65)];

  screen.innerHTML = `<div class="trkwrap"><div id="trkmap"></div><button class="ib floatl" id="bk">${ARROW}</button><button class="ib floatr" id="fl">${ICON.loc}</button>
  <div class="sheet"><div class="grab"></div><div class="eta" id="eta">Đang kết nối quán...</div><div class="sb" id="sub"></div>
  <div class="bar" id="bar">${STAGES.map(() => '<i></i>').join('')}</div>
  <div id="evbox"></div>
  <div id="drv"></div><div id="chat"></div>
  <button class="sumbtn" id="sm"><span>🧾 ${o.items.reduce((a, i) => a + i[1], 0)} món · ${r.name}</span><span>${fmt(o.total)} ▾</span></button><div id="sml" style="display:none;padding:8px 4px;font-size:13px"></div>
  <div style="font-size:11.5px;color:#777;margin:10px 0 0;text-align:center">Mã đơn ${o.id} · ${{ cash: 'Tiền mặt', wallet: 'GrabPay', card: 'Visa •••• 4242' }[o.pay]}</div>
  <button class="btn o" id="cx" style="margin-top:10px;text-align:center;border-color:#ddd;color:#666">Huỷ đơn hàng</button></div></div>`;

  $('#bk').onclick = () => { state.tab = 'orders'; go(viewOrders); };
  $('#sml').innerHTML = o.items.map(i => `<div class="row"><span>${i[1]}x ${i[0]}</span><span>${fmt(i[1] * i[2])}</span></div>`).join('');
  $('#sm').onclick = () => { const s = $('#sml'); s.style.display = s.style.display === 'none' ? 'block' : 'none'; };

  const m = newMap('trkmap', S, 14); let follow = false;
  L.marker(S, { icon: shopIcon(r) }).addTo(m);
  L.marker(U, { icon: homeIcon() }).addTo(m);
  m.fitBounds([S, U], { padding: [55, 55] });
  ro = new ResizeObserver(() => { if (maps.includes(m)) m.invalidateSize(); }); ro.observe($('#trkmap'));
  m.on('dragstart zoomstart', () => follow = false);
  $('#fl').onclick = () => { follow = true; m.fitBounds([S, U], { padding: [55, 55] }); };

  const setStage = (i, e, s, tone = '') => {
    $$('#bar i').forEach((b, k) => {
      b.className = k <= i ? (tone || 'on') : '';
      if (k === i) b.classList.add('cur');
    });
    $('#eta').textContent = e;
    $('#sub').textContent = s || '';
  };
  const setEv = (txt, cls = '') => {
    const eb = $('#evbox');
    if (!eb) return;
    eb.innerHTML = txt ? `<div class="evlog ${cls}">${txt}</div>` : '';
  };

  let curDrv = null;
  const showDrv = drv => {
    if (curDrv === drv[0]) return;
    curDrv = drv[0];
    $('#drv').innerHTML = `<div class="drv"><div class="av">${drv[0].split(' ').pop()[0]}</div><div class="d"><b>${drv[0]}</b>${drv[2]} · <span class="plate">${drv[1]}</span> · <span class="star">★</span> ${drv[3]}</div><button class="rb" id="call">${ICON.phone}</button><button class="rb" id="msg">${ICON.chat}</button></div>`;
    $('#call').onclick = () => toast('📞 Đang đổ chuông tới ' + drv[0] + '…');
    $('#msg').onclick = () => {
      const c = $('#chat'); if (c.innerHTML) { c.innerHTML = ''; return; }
      c.innerHTML = `<div class="chatb"><div class="msgs" id="ms"><p>Chào bạn, mình là ${drv[0].split(' ').pop()}, mình đã nhận đơn ở ${r.branch} nhé!</p></div><form id="cf"><input id="ci" placeholder="Nhắn tin cho tài xế..." autocomplete="off"><button>Gửi</button></form></div>`;
      $('#cf').onsubmit = e => {
        e.preventDefault(); const v = $('#ci').value.trim(); if (!v) return;
        $('#ms').innerHTML += `<p class="me">${v}</p>`; $('#ci').value = '';
        const replies = ['Ok bạn ơi, quán đang đông xíu bạn chờ mình nha 👍', 'Mình ghi nhận rồi nhé, có gì mình gọi bạn!', 'Đường hơi kẹt xe chút nhưng mình đang cố chạy nhanh nhất ạ 🛵'];
        setTimeout(() => { if ($('#ms')) { $('#ms').innerHTML += `<p>${replies[Math.floor(Math.random() * replies.length)]}</p>`; $('#ms').scrollTop = 1e5; } }, 1600);
      };
    };
  };

  const triggerAutoCancel = () => {
    if (o.status === 'cancelled') return;
    o.status = 'cancelled';
    o.cancelReason = inc[0];
    o.cancelDetail = inc[1];
    if (o.pay === 'wallet') state.wallet += o.total;
    state.wallet += 30000;
    save();

    const d = document.createElement('div'); d.className = 'done';
    d.innerHTML = `
      <div class="ok err">✕</div>
      <h2 style="margin-top:16px;font-size:20px;color:#b91c1c">Đơn hàng đã bị hủy đột xuất</h2>
      <p style="color:#444;margin-top:8px;font-size:13.5px;line-height:1.45"><b>Lý do: ${inc[0]}</b><br>${inc[1]}</p>
      <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:14px;padding:12px 14px;margin:14px 0;text-align:left;width:100%;font-size:12.5px;color:#7f1d1d">
        <div>• Mã đơn: <b>${o.id}</b> (${r.name})</div>
        <div style="margin-top:4px">• Hoàn tiền đơn hàng: <b>${o.pay === 'wallet' ? 'Đã hoàn ' + fmt(o.total) + ' về Ví GrabPay' : 'Không thu tiền (' + fmt(o.total) + ')'}</b></div>
        <div style="margin-top:4px;color:#00863c">• Đền bù sự cố: <b>+30.000đ</b> đã cộng vào Ví GrabPay của bạn</div>
      </div>
      <div style="display:flex;gap:8px;width:100%">
        <button class="btn o" id="dn1" style="flex:1;justify-content:center">Về trang chủ</button>
        <button class="btn" id="dn2" style="flex:1;justify-content:center">Đặt lại quán khác</button>
      </div>`;
    $('#app').appendChild(d);
    $('#dn1').onclick = () => { d.remove(); state.tab = 'orders'; go(viewOrders, 'his'); };
    $('#dn2').onclick = () => { d.remove(); state.tab = 'home'; go(viewFood, {}); };
  };

  $('#cx').onclick = () => {
    if (!confirm('Bạn chắc chắn muốn huỷ đơn hàng này?')) return;
    o.status = 'cancelled'; o.cancelReason = 'Khách hàng yêu cầu huỷ đơn';
    if (o.pay === 'wallet') state.wallet += o.total;
    save(); toast('Đã huỷ đơn hàng'); state.tab = 'orders'; go(viewOrders, 'his');
  };

  if (o.status !== 'active') {
    setStage(4, o.status === 'done' ? 'Đã giao thành công' : 'Đơn hàng đã bị huỷ', o.cancelReason || r.name, 'err');
    if (o.cancelDetail) setEv(`⚠️ ${o.cancelDetail}`, 'err');
    showDrv(D2); $('#cx').remove();
    return;
  }

  (async () => {
    setStage(0, 'Đang gửi đơn tới quán…', `Chờ ${r.name} xác nhận món của bạn`);
    const [r1, r2] = await Promise.all([getRoute(start, S), getRoute(S, U)]);
    if (!$('#trkmap')) return;
    L.polyline(r1, { color: '#9aa0a6', weight: 4, dashArray: '4 8' }).addTo(m);
    const poly2 = L.polyline(r2, { color: '#00b14f', weight: 6, opacity: .9 }).addTo(m);
    const dm = L.marker(start, { icon: riderIcon(), zIndexOffset: 1000, opacity: 0 }).addTo(m);

    const ph = [
      {
        d: P.tConfirm,
        f: () => {
          setStage(0, 'Chờ quán xác nhận đơn…', `${r.name} đang kiểm tra nguyên liệu`);
          setEv('⏳ Quán đang giờ cao điểm nên xác nhận hơi lâu một chút...');
        }
      },
      {
        d: P.tFind1,
        f: p => {
          setStage(1, 'Đang tìm tài xế quanh quán…', `Đã phát tín hiệu tới ${3 + Math.floor(p * 6)} tài xế trong bán kính 1.5km`);
          if (p > 0.6) setEv(`🔍 Tài xế ${D1[0]} (${D1[1]}) đang xem yêu cầu đơn hàng...`);
        }
      },
      {
        d: P.tCancel1,
        f: () => {
          setStage(1, 'Đang điều phối tài xế khác…', `Tài xế ${D1[0]} vừa từ chối do kẹt xe, hệ thống đang ưu tiên tìm tài xế mới`, 'warn');
          setEv(`⚠️ Tài xế ${D1[0]} không thể nhận đơn. Đang tự động chuyển sang tài xế gần nhất...`, 'warn');
        }
      },
      {
        d: P.tFind2,
        f: p => {
          if (p < 0.45) {
            setStage(1, 'Đang mở rộng phạm vi tìm…', 'Tăng bán kính tìm kiếm lên 2.5km ưu tiên đơn của bạn');
          } else {
            dm.setOpacity(1);
            showDrv(D2);
            setStage(1, 'Đã tìm thấy tài xế!', `${D2[0]} (${D2[2]} · ${D2[1]}) đã nhận đơn`);
            setEv(`✅ Tài xế ${D2[0]} đã nhận đơn và bắt đầu di chuyển tới ${r.branch}`);
          }
        }
      },
      {
        d: P.tToShop,
        f: p => {
          showDrv(D2); dm.setOpacity(1);
          const mins = Math.max(2, Math.ceil((1 - p) * 6));
          const stuck = p > 0.45 && p < 0.72;
          const effP = stuck ? 0.45 + (p - 0.45) * 0.25 : (p >= 0.72 ? 0.5175 + (p - 0.72) * (0.4825 / 0.28) : p);
          dm.setLatLng(along(r1, effP));
          setStage(2, `Tài xế đang đến quán · ~${mins} phút`, `${D2[0]} đang trên đường tới ${r.addr}`);
          if (stuck) setEv('🚦 Tài xế đang dừng chờ đèn đỏ / kẹt xe nhẹ trên đường tới quán...', 'warn');
          else setEv(`🛵 Tài xế ${D2[0]} đang di chuyển tới quán`);
        }
      },
      {
        d: P.tKitchen,
        f: p => {
          dm.setLatLng(S);
          const mins = Math.max(5, Math.ceil((1 - p * 0.5) * 11));
          setStage(3, `Quán đang chuẩn bị món · ~${mins} phút`, `Tài xế ${D2[0]} đã tới quán và đang đợi lấy đồ`);
          setEv('🍳 Bếp đang chế biến món ăn nóng cho bạn...');
        }
      },
      {
        d: P.tKitchenDelay,
        f: p => {
          dm.setLatLng(S);
          const extra = 8 + Math.ceil((1 - p) * 6);
          setStage(3, `Thời gian chuẩn bị lâu hơn dự kiến · ~${extra} phút`, 'Quán đang quá tải đơn giờ cao điểm, tài xế vẫn đang chờ tại quầy', 'warn');
          setEv(`⏳ Quán báo cáo lượng đơn tăng đột biến (+6 phút chờ). Tài xế ${D2[0]} đang giục bếp giúp bạn.`, 'warn');
        }
      },
      {
        d: P.tDeliver,
        f: p => {
          if ($('#cx')) $('#cx').remove();
          const moveP = Math.min(P.stopRatio, p * P.stopRatio * 1.08);
          const q = along(r2, moveP);
          dm.setLatLng(q);
          if (follow) m.panTo(q, { animate: false });
          if (p < 0.78) {
            const rem = Math.max(2, Math.ceil((1 - p) * 10));
            setStage(4, `Tài xế đang giao đến bạn · ~${rem} phút`, `${D2[0]} đã lấy món và đang chạy về phía ${o.pos.addr}`);
            setEv(`📦 Đồ ăn đã lên xe! Tài xế cách bạn khoảng ${(rdist(r) * (1 - moveP)).toFixed(2)} km.`);
          } else {
            setStage(4, 'Tài xế đang dừng gần điểm giao · ~4 phút', 'Tín hiệu di chuyển của tài xế đang chậm lại cách bạn ~150m', 'warn');
            setEv('⚠️ Tài xế đang dừng lâu bất thường ở khúc cua gần bạn, hệ thống đang kiểm tra...', 'warn');
          }
        }
      },
      {
        d: P.tFinalIncident,
        f: p => {
          const q = along(r2, P.stopRatio);
          dm.setLatLng(q);
          poly2.setStyle({ color: '#ef4b3f', dashArray: '6 8' });
          if (p < 0.55) {
            setStage(4, 'Gián đoạn tín hiệu từ tài xế…', `Đang liên hệ khẩn với tài xế ${D2[0]} để xác minh tình trạng đơn`, 'err');
            setEv(`🚨 Phát hiện sự cố trên lộ trình giao hàng cách bạn ~150m. Tổng đài Grab đang kết nối với ${D2[0]}...`, 'err');
          } else {
            setStage(4, 'Sự cố giao hàng ngoài ý muốn…', `${inc[0]} — đang xử lý hoàn tiền tự động`, 'err');
            setEv(`🚨 ${inc[1]}`, 'err');
          }
        }
      }
    ];

    let pi = 0, t0 = performance.now();
    const tick = now => {
      if (!$('#trkmap')) return;
      const p = Math.min(1, (now - t0) / ph[pi].d);
      ph[pi].f(p);
      if (p >= 1) {
        pi++; t0 = now;
        if (pi >= ph.length) return triggerAutoCancel();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  })();
}

/* ================= HOẠT ĐỘNG / TÀI KHOẢN ================= */
function viewOrders(sub = 'now') {
  state.tab = 'orders'; tabs();
  const list = state.orders.filter(o => sub === 'now' ? o.status === 'active' : o.status !== 'active');
  screen.innerHTML = `<div class="top"><h2>Hoạt động</h2></div><div class="otab"><button data-s="now" class="${sub === 'now' ? 'on' : ''}">Đang diễn ra (${state.orders.filter(x => x.status === 'active').length})</button><button data-s="his" class="${sub === 'his' ? 'on' : ''}">Lịch sử (${state.orders.filter(x => x.status !== 'active').length})</button></div>` +
    (list.length ? list.map(o => {
      const r = byId(o.rid);
      const stt = o.status === 'active' ? ['Đang xử lý', 'p'] : o.status === 'done' ? ['Hoàn tất', ''] : ['Đã huỷ', 'c'];
      return `<div class="ord" data-id="${o.id}"><div class="h">${im('r' + r.aid + '/cover')}<div><b>${r.name}</b><small>${new Date(o.t).toLocaleString('vi-VN')}</small><small>${o.items.map(i => i[1] + 'x ' + i[0]).join(', ')}</small>${o.cancelReason ? `<small style="color:#b91c1c;font-weight:600">Lý do: ${o.cancelReason}</small>` : ''}</div><span class="st ${stt[1]}">${stt[0]}</span></div>
      <div style="display:flex;justify-content:space-between;margin-top:10px;font-size:13.5px"><span style="color:#666">Tổng đơn</span><b>${fmt(o.total)}</b></div>${o.status !== 'active' ? `<div class="ft"><button class="btn o" data-re="${o.id}">Đặt lại đơn này</button></div>` : ''}</div>`;
    }).join('')
      : `<div class="empty"><div class="big">🧾</div><h4>${sub === 'now' ? 'Chưa có đơn nào đang giao' : 'Chưa có lịch sử đơn hàng'}</h4>Chọn món từ ${R.length.toLocaleString('vi-VN')} quán quanh bạn ngay thôi!</div>`);
  $$('.otab button').forEach(b => b.onclick = () => viewOrders(b.dataset.s));
  $$('.ord').forEach(e => e.onclick = ev => { if (ev.target.dataset.re) return; go(viewTrack, e.dataset.id); });
  $$('[data-re]').forEach(b => b.onclick = () => {
    const o = state.orders.find(x => x.id === b.dataset.re), r = byId(o.rid);
    state.cart = { rid: r.id, items: {} };
    o.items.forEach(it => { const i = r.menu.findIndex(m => m[0] === it[0]); if (i >= 0) state.cart.items[i] = { q: it[1], note: it[3] || '' }; });
    save(); go(viewCheckout);
  });
}

function viewAccount() {
  state.tab = 'account'; tabs();
  screen.innerHTML = `<div class="prof"><div class="avatar">${state.user.name[0].toUpperCase()}</div><div><b style="font-size:19px">${state.user.name}</b><br><span style="opacity:.9;font-size:13px">${state.user.phone}</span></div></div>
  <div class="wallet" style="margin-top:-1px;border-radius:0"><div>GrabPay<b>${fmt(state.wallet)}</b></div><div id="tp" style="color:var(--g);font-weight:700;display:flex;align-items:center;justify-content:center;cursor:pointer">+ Nạp 100.000đ</div></div>
  <div class="menu" style="margin-top:10px">
    <div class="m" id="e1"><span>✏️ Chỉnh sửa thông tin nhận hàng</span><span>›</span></div>
    <div class="m" id="e2"><span>📍 Đổi vị trí GPS giao hàng (${state.pos.addr.slice(0, 22)}…)</span><span>›</span></div>
    <div class="m" id="egps"><span>📡 Định vị lại GPS từ đầu</span><span>›</span></div>
    <div class="m"><span>🎟️ Kho ưu đãi của tôi</span><span style="color:#ef4b3f;font-weight:700">3 mã</span></div>
    <div class="m" id="e3"><span>🗑️ Xoá lịch sử đơn hàng</span><span>›</span></div>
  </div>`;
  $('#e1').onclick = () => { const n = prompt('Tên của bạn:', state.user.name); if (n) { state.user.name = n; const p = prompt('Số điện thoại:', state.user.phone); if (p) state.user.phone = p; store.set('user', state.user); viewAccount(); } };
  $('#e2').onclick = () => go(viewPickLoc, () => go(viewAccount));
  $('#egps').onclick = () => { state.gpsDone = false; store.set('gpsDone', false); checkMandatoryGps(); };
  $('#tp').onclick = () => { state.wallet += 100000; save(); toast('Đã nạp 100.000đ vào GrabPay'); viewAccount(); };
  $('#e3').onclick = () => { if (confirm('Xoá toàn bộ lịch sử đơn hàng?')) { state.orders = []; save(); toast('Đã xoá lịch sử'); } };
}

viewHome();
setTimeout(() => {
  const s = $('#splash');
  if (s) { s.style.opacity = 0; setTimeout(() => s.remove(), 400); }
  checkMandatoryGps();
}, 750);
