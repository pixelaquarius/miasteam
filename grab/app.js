/* Grab Superapp – Đồ ăn (1.000 quán Google Maps), Xe máy, Ô tô, Giao hàng, Siêu thị, Ưu đãi, GrabPay */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmt = n => Math.round(n).toLocaleString('vi-VN') + 'đ';
const store = { get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }, set: (k, v) => localStorage.setItem(k, JSON.stringify(v)) };

/* ================= DỮ LIỆU THƯƠNG HIỆU & 1.000 QUÁN GOOGLE MAPS ================= */
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

// Bổ sung hệ thống Siêu thị GrabMart (WinMart+, Bách Hóa Xanh, Circle K, FamilyMart, GS25, Co.op Food, Annam Gourmet)
const MART_STORES = [
  { id: 2001, bid: 17, isMart: true, brand: 'WinMart+ Fresh', branch: 'CN Nguyễn Thị Minh Khai', name: 'WinMart+ Fresh - Nguyễn Thị Minh Khai', cat: 'mart', tags: 'Siêu thị · Trái cây · Thịt tươi · Đồ uống', c: '#d62828', ini: 'WM+', aid: 7, logoId: 8, dx: .28, dy: -.22, rate: 4.9, rv: '2.4k+', time: 15, promo: 'Giảm 25k', addr: '124 Nguyễn Thị Minh Khai, Quận 1', hours: '06:00 - 22:30', branchCount: 18,
    menu: [['Thùng 24 lon Nước ngọt Pepsi / Coca 320ml', 195000, 'Ướp lạnh sẵn giao nhanh 15 phút', '🥤'], ['Khay Thịt Ba Rọi Heo CP Tươi 500g', 89000, 'Thịt mát chuẩn VietGAP đóng khay', '🥩'], ['Combo Trái Cây Cắt Sẵn (Xoài, Dưa Hấu, Ổi)', 55000, 'Tươi ngọt gọt sẵn kèm muối tôm', '🍉'], ['Lốc 4 Hộp Sữa Tươi TH True Milk 180ml', 36000, 'Ít đường thơm béo', '🥛'], ['Mì Ly Hảo Hảo Tôm Chua Cay (Lốc 6 ly)', 54000, 'Tiện lợi ăn đêm', '🍜']] },
  { id: 2002, bid: 14, isMart: true, brand: 'Bách Hóa Xanh', branch: 'CN Lê Văn Sỹ', name: 'Bách Hóa Xanh - Lê Văn Sỹ', cat: 'mart', tags: 'Rau củ · Thịt cá · Hàng tiêu dùng', c: '#00863c', ini: 'BHX', aid: 6, logoId: 14, dx: -.52, dy: .45, rate: 4.8, rv: '3.1k+', time: 18, promo: 'Freeship', addr: '286 Lê Văn Sỹ, Quận 3', hours: '06:00 - 21:30', branchCount: 24,
    menu: [['Combo Rau Lẩu Tươi Sạch (Nấm, Cải Thảo, Bắp)', 65000, 'Rửa sạch đóng túi sẵn sàng nấu lẩu', '🥬'], ['Vỉ 10 Trứng Gà Tươi Ba Huân', 32000, 'Trứng gà mới mỗi ngày', '🥚'], ['Bánh Gạo & Snack Khoai Tây Lay’s (Combo 4 gói)', 58000, 'Đồ ăn vặt xem phim', '🍟'], ['Nước Cam Ép Twister 1 Lít', 26000, 'Giàu Vitamin C', '🍊']] },
  { id: 2003, bid: 11, isMart: true, brand: 'Circle K Vietnam 24/7', branch: 'CN Hồ Tùng Mậu', name: 'Circle K 24/7 - Hồ Tùng Mậu', cat: 'mart', tags: 'Cửa hàng tiện lợi 24/7 · Đồ ăn nhanh', c: '#d90429', ini: 'CK', aid: 3, logoId: 11, dx: .19, dy: .31, rate: 4.8, rv: '4.2k+', time: 12, promo: 'Giảm 15k', addr: '68 Hồ Tùng Mậu, Quận 1', hours: '00:00 - 23:59', branchCount: 32,
    menu: [['Mì Trộn Xúc Xích Phô Mai Trứng Ốp La', 39000, 'Đặc sản Circle K làm nóng tại quầy', '🍜'], ['Bánh Bao Xá Xíu & Há Cảo Hấp Nóng', 28000, 'Nóng hổi thơm mềm', '🥟'], ['Trà Chanh Hồng Kông Circle K (Ly lớn)', 22000, 'Đậm vị trà chanh tươi', '🍋'], ['Xúc Xích Đức Nướng & Phô Mai Que', 32000, 'Kèm tương ớt & sốt mayo', '🌭']] },
  { id: 2004, bid: 22, isMart: true, brand: 'FamilyMart', branch: 'CN Pasteur', name: 'FamilyMart - Pasteur', cat: 'mart', tags: 'Lẩu Ly Oden · Cơm nắm Onigiri · 24/7', c: '#006491', ini: 'FM', aid: 8, logoId: 22, dx: -.36, dy: -.29, rate: 4.9, rv: '2.8k+', time: 14, promo: 'Mua 1 tặng 1', addr: '198 Pasteur, Quận 3', hours: '00:00 - 23:59', branchCount: 19,
    menu: [['Lẩu Ly Thái Chua Cay Tôm Viên & Bò Viên', 42000, 'Nước lẩu Tomyum nóng hổi chuẩn FamilyMart', '🍲'], ['Combo 2 Cơm Nắm Onigiri Cá Hồi & Gà Teriyaki', 44000, 'Rong biển giòn rụm', '🍙'], ['Bánh Su Kem Lạnh Hokkaido', 29000, 'Nhân kem sữa tươi mát lạnh', '🧁'], ['Trà Sữa Đóng Chai Kirin Nhật Bản', 25000, 'Ướp lạnh', '🧋']] },
  { id: 2005, bid: 21, isMart: true, brand: 'GS25 Korea Convenience', branch: 'CN Điện Biên Phủ', name: 'GS25 - Điện Biên Phủ', cat: 'mart', tags: 'Đồ Hàn Quốc · Tokbokki · Mì cay', c: '#005596', ini: 'GS25', aid: 7, logoId: 44, dx: .64, dy: .48, rate: 4.8, rv: '1.9k+', time: 17, promo: 'Giảm 20k', addr: '210 Điện Biên Phủ, Quận 3', hours: '00:00 - 23:59', branchCount: 21,
    menu: [['Tokbokki Phô Mai Cay Hàn Quốc Hộp Nóng', 48000, 'Bánh gạo dẻo ngập sốt Gochujang và phô mai', '🍢'], ['Mì Shin Ramyun Nấu Trứng & Xúc Xích', 45000, 'Nóng hổi cay nồng', '🍜'], ['Sữa Chuối Binggrae Hàn Quốc (Lốc 4 hộp)', 92000, 'Nhập khẩu Hàn Quốc', '🥛'], ['Cơm Cuộn Kimbap Bò Bulgogi', 38000, 'Cuộn tươi trong ngày', '🍙']] },
  { id: 2006, bid: 20, isMart: true, brand: 'Annam Gourmet Market', branch: 'CN Hai Bà Trưng', name: 'Annam Gourmet - Hai Bà Trưng', cat: 'mart', tags: 'Thực phẩm nhập khẩu · Phô mai · Bánh Âu', c: '#1b4332', ini: 'AG', aid: 8, logoId: 20, dx: .41, dy: -.44, rate: 4.9, rv: '1.3k+', time: 20, promo: 'Giảm 30k', addr: '16-18 Hai Bà Trưng, Quận 1', hours: '07:00 - 22:00', branchCount: 5,
    menu: [['Set Phô Mai Pháp & Thịt Nguội Charcuterie', 185000, 'Brie, Cheddar, Salami Ý và hạt óc chó', '🧀'], ['Bánh Croissant Bơ Pháp & Pain au Chocolat', 78000, 'Nướng mới tại lò Annam Gourmet', '🥐'], ['Hộp Dâu Tây Hàn Quốc / Nho Mẫu Đơn 500g', 165000, 'Trái cây nhập khẩu tươi ngọt', '🍓'], ['Nước Ép Táo & Cam Nguyên Chất Ép Lạnh', 68000, 'Không đường 500ml', '🧃']] }
];

const BRANDS = window.BRANDS_DATA || [];
const BRAND_MAP = {};
BRANDS.forEach(b => { BRAND_MAP[b.b] = b; });

const R = (window.PLACES_1000 || []).map(row => {
  const br = BRAND_MAP[row[1]] || BRANDS[0];
  const cnt = br.branchCount || 1;
  return {
    id: row[0],
    bid: br.b,
    brand: br.brand,
    branch: row[2],
    name: cnt > 1 ? `${br.brand} - ${row[2]}` : br.brand,
    cat: br.cat,
    tags: br.tags,
    c: br.c,
    ini: br.ini,
    aid: br.aid,
    logoId: br.logoId || (br.b <= 50 ? br.b : ((br.b % 50) + 1)),
    dx: row[3],
    dy: row[4],
    rate: row[5],
    rv: row[6],
    time: row[7],
    promo: row[8],
    addr: row[9],
    hours: br.hours,
    branchCount: cnt,
    isChain: cnt > 1,
    menu: br.menu
  };
});

// Chuỗi thương hiệu lớn (có từ 2 chi nhánh trở lên, số lượng chi nhánh đa dạng từ 2, 3, 4... đến 42 chi nhánh)
const CHAIN_BRANDS = BRANDS.filter(b => b.branchCount > 1).sort((a, b) => b.branchCount - a.branchCount);

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
    'Phần {m0} đầy đặn lắm nha, thịt ướp thấm vị nướng thơm phức, hạt cơm tơi mềm nóng hổi. Quán ở {addr} đóng gói hộp rất sạch sẽ, có kèm đủ canh và đồ chua.',
    'Mình đặt {m1} với {m2} ăn trưa ở văn phòng. Giao nhanh, mở hộp ra vẫn còn bốc khói, nước mắm pha kẹo chua ngọt vừa miệng, rất đáng tiền!',
    'Quán ruột trên Google Maps mỗi khi thèm cơm ngon. Phần {m0} nhiều đồ ăn, canh nóng ngọt nước, sẽ ủng hộ dài dài.'
  ],
  noodle: [
    'Nước dùng của {m0} trong và ngọt xương tự nhiên, không bị gắt bột ngọt. Quán để riêng bánh với nước lèo rất cẩn thận nên về tới nơi vẫn nóng hổi như ăn tại tiệm.',
    'Đặt phần {m1} kèm {m2}, thịt mềm và nhiều, rau sống rửa sạch tươi rói. Quán tại {addr} làm món nhanh, chuẩn vị truyền thống.',
    'Đánh giá 5 sao trên Google Maps không sai chút nào. Tô {m0} siêu chất lượng, thơm nức mũi, đóng gói kỹ không bị đổ nước dùng.'
  ],
  fast: [
    '{m0} với {m1} giao tới vẫn còn giòn rụm nóng hổi. Lớp vỏ chiên vàng ươm không bị ngấy dầu, sốt chấm cho cực kỳ hào phóng.',
    'Mình gọi combo {m0} tại {addr} cho cả nhóm ăn xế. Đồ ăn chuẩn vị, đóng hộp giấy cứng cáp, khoai và bánh đều thơm ngon.',
    'Quán phục vụ rất nhanh. Phần {m2} làm mới hoàn toàn, phô mai béo ngậy thơm phức, cả nhà mình ai cũng khen.'
  ],
  drink: [
    '{m0} pha đúng mức đường đá mình ghi chú, vị trà đậm thơm hậu ngọt chứ không bị gắt sữa. Trân châu dẻo mềm, ép màng nắp ly chắc chắn không bị tràn.',
    'Mê món {m1} với {m2} ở đây cực kỳ. Lớp kem macchiato mặn béo sánh mịn, uống ngụm nào dính ngụm đó. Pha rất đều tay!',
    'Trưa nắng đặt ly {m3} mát lạnh tỉnh cả người. Topping cho nhiều, bao bì túi giữ nhiệt chỉnh chu.'
  ],
  cafe: [
    'Ly {m0} đậm đà thơm nồng mùi cà phê mới xay, hậu vị béo vừa phải. Đặt kèm {m3} nướng giòn thơm bơ ăn sáng là hết sẩy.',
    'Cơ sở {addr} pha {m1} rất hợp gu mình, lớp bọt mịn, đá để riêng nên không bị nhạt. Đóng gói chống tràn 10 điểm!',
    'Mỗi sáng đều đặt {m0} hoặc {m2} ở đây. Hương cà phê chuẩn chỉnh, giao tới vẫn giữ nguyên độ lạnh và lớp foam dày.'
  ],
  snack: [
    '{m0} với {m1} trộn vừa miệng cực kỳ, đầy đủ topping khô bò, trứng cút, hành phi giòn rụm. Ăn vặt buổi chiều cùng hội bạn là số một!',
    'Phần {m2} chiên ráo dầu, xóc sốt mắm tỏi thơm nức mũi. Quán cho nhiều đồ chua ăn kèm không bị ngấy.',
    'Đặt {m0} kèm {m3} lúc tối muộn mà quán vẫn làm nóng hổi, hộp đầy ắp, giá hạt dẻ mà chất lượng quá ổn.'
  ],
  cake: [
    'Bánh {m0} cốt mềm ẩm, lớp kem phô mai mịn tan trong miệng không bị ngọt gắt. Hộp bánh sang trọng kèm muỗng nĩa đầy đủ.',
    'Mình mua {m1} và {m3} làm quà chiều, bánh nướng mới thơm phức mùi bơ Pháp, sốt trứng muối chà bông ngập tràn.',
    'Tiệm bánh quen thuộc trên Google Maps, món {m2} với {m0} lúc nào cũng tươi mới trong ngày, đóng gói cẩn thận không bị xô lệch.'
  ],
  mart: [
    'Đặt {m0} với {m1} trên GrabMart siêu tiện, nhân viên siêu thị tại {addr} chọn toàn đồ tươi mới hạn sử dụng xa, đóng thùng gọn gàng.',
    'Cần gấp {m2} mà lười ra đường, đặt 15 phút là có ngay. Hàng chính hãng mát lạnh, giá bằng mua trực tiếp tại quầy.',
    'Siêu thị đóng gói cẩn thận, phân loại đồ tươi sống và đồ khô riêng biệt. Rất hài lòng!'
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
  ['Nguyễn Văn Hùng', '59X1-123.45', 'Honda Wave Alpha', '4.93', 'Toyota Vios Bạc · 51G-842.19'],
  ['Trần Minh Tuấn', '59P2-678.90', 'Yamaha Sirius', '4.89', 'Mitsubishi Xpander Trắng · 51K-319.05'],
  ['Lê Hoàng Nam', '59H3-246.80', 'Honda Vision', '4.97', 'Hyundai Accent Đen · 51H-667.42'],
  ['Phạm Quốc Bảo', '59C1-135.79', 'Honda Air Blade', '4.91', 'VinFast VF e34 Xanh · 51L-908.11'],
  ['Đặng Quốc Huy', '59T2-458.12', 'Honda Winner X', '4.95', 'Kia Seltos Trắng · 51K-554.78'],
  ['Võ Minh Khang', '59S3-889.04', 'Yamaha Exciter', '4.88', 'Mazda 3 Đỏ · 51H-221.63']
];

const VOUCHERS = {
  GRAB30: ['Giảm 30.000đ cho đơn từ 60K', () => 30000, 'Tất cả quán ăn & GrabMart'],
  FREESHIP: ['Miễn phí giao hàng tối đa 25K', o => o.fee, 'Mọi đơn GrabFood & GrabMart'],
  NEWUSER: ['Giảm 50.000đ ưu đãi bạn mới', () => 50000, 'Áp dụng cho mọi dịch vụ Grab'],
  GRABXE20: ['Giảm 20.000đ chuyến GrabBike / GrabCar', () => 20000, 'Áp dụng khi đặt xe & giao hàng']
};

const img = p => `img/${p}.jpg`;
const im = (p, alt = '') => `<img src="${img(p)}" alt="${alt}" loading="lazy" onerror="this.style.display='none'">`;
const logo = r => {
  const lid = r.logoId || (r.bid <= 50 ? r.bid : ((r.bid % 50) + 1));
  return `<div style="width:100%;height:100%;background:${r.c};color:#fff;font-weight:800;display:flex;align-items:center;justify-content:center;font-size:12px">${r.ini}<img src="img/brands/b${lid}.png" alt="${r.brand}" loading="lazy" onerror="this.style.display='none'"></div>`;
};

/* ================= STATE (LƯU ĐẦY ĐỦ LOCALSTORAGE) ================= */
const state = {
  user: store.get('user', { name: 'Khách', phone: '0900 000 000' }),
  pos: store.get('pos', { lat: 10.7725, lng: 106.6980, addr: 'Chợ Bến Thành, Quận 1' }),
  posHistory: store.get('posHistory', []),
  gpsDone: store.get('gpsDone', false),
  wallet: store.get('wallet', 500000),
  points: store.get('points', 1250),
  lastPay: store.get('lastPay', 'wallet'),
  dnote: store.get('dnote', ''),
  cat: 'all', q: '', chip: 'all', brandFilter: null, pageLimit: 40,
  cart: store.get('cart', null), orders: store.get('orders', []), tab: 'home', voucher: store.get('voucher', null)
};
const save = () => {
  store.set('user', state.user);
  store.set('pos', state.pos);
  store.set('posHistory', state.posHistory);
  store.set('gpsDone', state.gpsDone);
  store.set('orders', state.orders);
  store.set('wallet', state.wallet);
  store.set('cart', state.cart);
  store.set('points', state.points);
  store.set('voucher', state.voucher);
  store.set('lastPay', state.lastPay);
  store.set('dnote', state.dnote);
};
function recordPos(p) {
  state.pos = { ...p, updatedAt: Date.now() };
  state.gpsDone = true;
  state.posHistory = [state.pos, ...state.posHistory.filter(x => x.addr !== p.addr)].slice(0, 6);
  save();
}
// Tự động kiểm tra và đồng bộ các đơn đang chạy trong nền (kể cả khi tắt tab mở lại sau 5-10 phút)
function syncActiveOrders() {
  let changed = false;
  const now = Date.now();
  state.orders.forEach(o => {
    if (o.status === 'active') {
      const P = o.plan || { totalMs: 360000, incidentIdx: 0 };
      const total = P.totalMs || (P.tConfirm + P.tFind1 + P.tCancel1 + P.tFind2 + P.tToShop + P.tKitchen + P.tKitchenDelay + P.tDeliver + P.tFinalIncident);
      if (now - o.t >= total) {
        const isRide = o.svcType === 'bike' || o.svcType === 'car';
        const incList = isRide ? INCIDENTS_RIDE : INCIDENTS_FOOD;
        const inc = incList[(P.incidentIdx || 0) % incList.length];
        o.status = 'cancelled';
        o.cancelReason = inc[0];
        o.cancelDetail = inc[1];
        if (o.pay === 'wallet') state.wallet += o.total;
        state.wallet += 30000;
        changed = true;
      }
    }
  });
  if (changed) save();
}
setInterval(syncActiveOrders, 4000);
const km2lat = km => km / 110.57;
const km2lng = km => km / (111.32 * Math.cos(state.pos.lat * Math.PI / 180));
const rpos = r => [state.pos.lat + km2lat(r.dy), state.pos.lng + km2lng(r.dx)];
const distKm = (a, b) => { const d = Math.PI / 180, x = (b[1] - a[1]) * d * Math.cos((a[0] + b[0]) / 2 * d), y = (b[0] - a[0]) * d; return Math.sqrt(x * x + y * y) * 6371; };
const rdist = r => distKm([state.pos.lat, state.pos.lng], rpos(r)) * 1.25;
const eta = r => r.time + Math.round(rdist(r) * 3);
const byId = id => R.find(x => x.id === id) || MART_STORES.find(x => x.id === id) || R[0];
const siblings = r => (r.isMart ? MART_STORES.filter(x => x.brand === r.brand) : R.filter(x => x.bid === r.bid)).sort((a, b) => rdist(a) - rdist(b));

// Tạo kịch bản thời gian chờ THỰC TẾ 5 - 10 phút (300.000ms - 600.000ms) trước khi tự hủy ẩn ở phút cuối
function makeLongWaitPlan() {
  const totalMs = Math.floor(310000 + Math.random() * 260000); // 5 phút 10 giây -> 9 phút 30 giây
  return {
    totalMs,
    tConfirm: Math.round(totalMs * 0.06),      // ~20-35s: Chờ quán/hệ thống xác nhận
    tFind1: Math.round(totalMs * 0.10),        // ~30-55s: Quét tìm tài xế đợt 1
    tCancel1: Math.round(totalMs * 0.05),      // ~15-30s: Tài xế 1 từ chối vì kẹt xe, đổi tài xế
    tFind2: Math.round(totalMs * 0.08),        // ~25-45s: Ghép tài xế 2 thành công
    tToShop: Math.round(totalMs * 0.18),       // ~60-100s: Tài xế chạy tới quán / điểm đón (dừng đèn đỏ giữa đường)
    tKitchen: Math.round(totalMs * 0.16),      // ~50-90s: Chờ quán làm món / chuẩn bị
    tKitchenDelay: Math.round(totalMs * 0.12), // ~40-70s: Quán báo quá tải đơn giờ cao điểm (+thêm thời gian chờ)
    tDeliver: Math.round(totalMs * 0.19),      // ~60-110s: Tài xế di chuyển tới cách bạn 150m rồi dừng bất thường
    tFinalIncident: Math.round(totalMs * 0.06),// ~20-35s: Báo gián đoạn tín hiệu & tự động hủy đơn hoàn tiền
    stopRatio: +(0.87 + Math.random() * 0.06).toFixed(2),
    incidentIdx: Math.floor(Math.random() * 4)
  };
}

let maps = [], raf = null, ro = null;
const screen = $('#screen');
function killMaps() { if (ro) { ro.disconnect(); ro = null; } cancelAnimationFrame(raf); maps.forEach(m => { try { m.stop(); m.off(); m.remove(); } catch (e) {} }); maps = []; }
function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('on'), 2600); }
function go(fn, ...a) { killMaps(); $$('.ov,.done').forEach(e => e.remove()); fn(...a); screen.scrollTop = 0; }
function tabs(show = true) { $('#tabs').classList.toggle('hide', !show); $$('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === state.tab)); }
$$('#tabs button').forEach(b => b.onclick = () => {
  state.tab = b.dataset.tab;
  go({ home: viewHome, orders: viewOrders, pay: viewPay, msgs: viewMsgs, account: viewAccount }[b.dataset.tab]);
});

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
  L.control.attribution({ prefix: false, position: 'bottomleft' }).addAttribution('© OpenStreetMap · Google Maps').addTo(m);
  maps.push(m); setTimeout(() => { if (maps.includes(m)) m.invalidateSize(); }, 150); return m;
}
const mk = (html, size = 40, anchor) => L.divIcon({ html, className: '', iconSize: [size, size], iconAnchor: anchor || [size / 2, size / 2] });
const shopIcon = r => mk(`<div class="mk shop">${logo(r)}</div>`, 40);
const homeIcon = () => mk('<div class="mk home"><span>🏠</span></div>', 36, [18, 36]);
const pinIcon = (em = '📍', bg = '#1d4ed8') => mk(`<div class="mk home" style="background:${bg}"><span>${em}</span></div>`, 36, [18, 36]);
const riderIcon = (em = '🛵') => mk(`<div class="mk rider">${em}</div>`, 40);

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
      <h2>Bật định vị GPS cho Grab</h2>
      <p>Grab cần xác nhận tọa độ thực tế của bạn để hiển thị đúng <b>${R.length.toLocaleString('vi-VN')} quán ăn, siêu thị & tài xế GrabBike/GrabCar</b> quanh vị trí bạn đứng.</p>
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
    recordPos(tmp);
    try { gm.remove(); } catch {}
    gate.remove();
    toast(`Đã lưu GPS: ${R.length.toLocaleString('vi-VN')} quán quanh bạn`);
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

/* ================= TRANG CHỦ SUPERAPP (TẤT CẢ DỊCH VỤ HOẠT ĐỘNG) ================= */
function vcardTag(r) { return r.promo ? `<span class="badge${r.promo === 'Freeship' ? ' g' : ''}">${r.promo}</span>` : ''; }

function nearestDistinctBrands(limit = 14) {
  const seen = new Set();
  const sorted = [...R].sort((a, b) => rdist(a) - rdist(b));
  const out = [];
  for (const r of sorted) {
    if (!seen.has(r.bid)) {
      seen.add(r.bid);
      out.push(r);
      if (out.length >= limit) break;
    }
  }
  return out;
}

function viewHome() {
  state.tab = 'home'; tabs();
  const nearAll = [...R].sort((a, b) => rdist(a) - rdist(b));
  const nearDistinct = nearestDistinctBrands(12);
  const activeOrders = state.orders.filter(o => o.status === 'active');

  const svc = [
    ['Đồ ăn', '🍔', '#e5f7ec', 'food', 'HOT'],
    ['Xe máy', '🛵', '#e5f7ec', 'bike', ''],
    ['Ô tô', '🚗', '#e6f0ff', 'car', ''],
    ['Siêu thị', '🛒', '#fff0e0', 'mart', 'MỚI'],
    ['Giao hàng', '📦', '#e6f0ff', 'express', ''],
    ['Ưu đãi', '🎟️', '#ffe9e7', 'deals', ''],
    ['GrabPay', '💳', '#eee9ff', 'pay', ''],
    ['Bản đồ', '🗺️', '#e8f5e9', 'map', '']
  ];

  screen.innerHTML = `<div class="hhead"><div class="hrow"><div class="addr" id="chg"><small>📍 Vị trí hiện tại của bạn</small><b>${state.pos.addr} ▾</b></div><div class="avatar" id="avbtn">${state.user.name[0].toUpperCase()}</div></div></div>
  <div class="sbox pull" id="sb">${ICON.search}<span style="color:#666;font-size:14px">Tìm món ăn, quán ăn hoặc địa điểm đến...</span></div>
  <div class="wallet">
    <div id="w1" style="cursor:pointer">Ví GrabPay<b>${fmt(state.wallet)}</b></div>
    <div id="w2" style="cursor:pointer">GrabRewards<b>${state.points.toLocaleString('vi-VN')} điểm</b></div>
    <div id="w3" style="cursor:pointer">Ưu đãi<b>4 mã giảm</b></div>
  </div>
  ${activeOrders.length ? `<div style="margin:12px 16px 0;background:#00693e;color:#fff;border-radius:14px;padding:11px 14px;display:flex;justify-content:space-between;align-items:center;cursor:pointer" id="actbar"><div><b style="font-size:13.5px">🛵 Bạn có ${activeOrders.length} đơn đang xử lý</b><div style="font-size:11.5px;opacity:.9;margin-top:2px">${activeOrders[0].title || byId(activeOrders[0].rid).name}</div></div><span style="background:#fff;color:#00693e;padding:5px 10px;border-radius:12px;font-size:11.5px;font-weight:800">Theo dõi →</span></div>` : ''}
  <div class="grid">${svc.map(s => `<button class="svc" data-s="${s[3]}"><i style="background:${s[2]}">${s[1]}</i>${s[0]}${s[4] ? `<em>${s[4]}</em>` : ''}</button>`).join('')}</div>

  <div class="sw" style="margin-top:10px;padding-bottom:14px">
    <div class="sec">Di chuyển & Giao nhận tức thì<a id="gobike">Đặt xe ngay</a></div>
    <div class="hs">
      <div class="vouch" id="qbike" style="width:205px;cursor:pointer;border-style:solid"><b>🛵 GrabBike · Xe máy</b>Đón tại ${state.pos.addr.split(',')[0]} · Chỉ từ 16.000đ</div>
      <div class="vouch" id="qcar" style="width:205px;cursor:pointer;border-style:solid;border-color:#1d4ed8;background:#eff6ff"><b style="color:#1d4ed8">🚗 GrabCar 4-7 chỗ</b>Di chuyển êm ái, điều hòa mát lạnh</div>
      <div class="vouch" id="qexp" style="width:205px;cursor:pointer;border-style:solid;border-color:#d97706;background:#fffbeb"><b style="color:#b45309">📦 GrabExpress Siêu Tốc</b>Giao giấy tờ, kiện hàng nội thành</div>
      <div class="vouch" id="qmart" style="width:205px;cursor:pointer;border-style:solid;border-color:#e11d48;background:#fff1f2"><b style="color:#be123c">🛒 Đi chợ GrabMart</b>WinMart+, Circle K, Bách Hóa Xanh</div>
    </div>
  </div>

  <div class="sw" style="margin-top:10px;padding-bottom:14px">
    <div class="sec">Chuỗi thương hiệu nổi bật<a id="allb">${R.length.toLocaleString('vi-VN')} quán</a></div>
    <div class="hs">${CHAIN_BRANDS.map(br => {
      const nb = R.find(x => x.bid === br.b) || R[0];
      return `<div class="bcard" data-bid="${br.b}"><div class="blg">${logo(nb)}</div><b>${br.brand}</b><small>${br.branchCount} chi nhánh</small></div>`;
    }).join('')}</div>
  </div>

  <div class="sw" style="margin-top:10px;padding-bottom:6px"><div class="sec" style="padding-top:16px">Chiến dịch ưu đãi hôm nay</div>
  <div class="hs" id="pr">${[
    ['r1', 'Bữa trưa no nê\nGiảm ngay 30K', 'Nhập mã GRAB30 cho mọi quán', nearDistinct[0].id],
    ['r4', 'Trà sữa & Cà phê\nMua 1 tặng 1', 'Phúc Long, Highlands, Koi Thé', (R.find(x => x.bid === 14) || nearAll[0]).id],
    ['r3', 'Gà rán & Pizza\nFreeship 0đ', 'KFC, Jollibee, Pizza 4P’s', (R.find(x => x.bid === 8) || nearAll[0]).id]
  ].map(p => `<div class="promo" data-id="${p[3]}">${im(p[0] + '/cover')}<div><h4>${p[1].replace('\n', '<br>')}</h4><p>${p[2]}</p><span>Đặt ngay</span></div></div>`).join('')}</div>
  <div class="dots" id="dots"><i class="on"></i><i></i><i></i></div></div>

  <div class="sw" style="margin-top:10px;padding-bottom:16px"><div class="sec">Quán ngon gần bạn nhất<a id="all1">Xem ${R.length.toLocaleString('vi-VN')} quán</a></div>
  <div class="hs">${nearAll.slice(0, 12).map(r => `<div class="hcard" data-id="${r.id}"><div class="im" style="background:${r.c}33">${vcardTag(r)}${thumbImg(r)}<span class="timechip">${eta(r)} phút · ${rdist(r).toFixed(1)} km</span></div><b>${r.name}</b><small><span class="star">★</span> ${r.rate} (${r.rv}) · ${r.isChain ? r.branchCount + ' CN' : 'Quán địa phương'}</small></div>`).join('')}</div></div>

  <div class="sec" style="padding-bottom:4px">Đề xuất đa dạng trên Google Maps</div>${nearDistinct.map(rcard).join('')}
  <div style="padding:8px 16px 24px"><button class="btn o" id="all2" style="text-align:center">Khám phá toàn bộ ${R.length.toLocaleString('vi-VN')} quán ăn</button></div>`;

  $('#chg').onclick = () => go(viewPickLoc, () => go(viewHome));
  $('#avbtn').onclick = () => { state.tab = 'account'; go(viewAccount); };
  $('#w1').onclick = () => { state.tab = 'pay'; go(viewPay); };
  $('#w2').onclick = $('#w3').onclick = () => go(viewDeals);
  if ($('#actbar')) $('#actbar').onclick = () => go(viewTrack, activeOrders[0].id);
  $('#sb').onclick = () => { state.brandFilter = null; state.pageLimit = 40; go(viewFood, { focus: true }); };
  $('#all1').onclick = $('#all2').onclick = $('#allb').onclick = () => { state.brandFilter = null; state.pageLimit = 40; go(viewFood, {}); };
  $('#gobike').onclick = $('#qbike').onclick = () => go(viewRide, 'bike');
  $('#qcar').onclick = () => go(viewRide, 'car');
  $('#qexp').onclick = () => go(viewExpress);
  $('#qmart').onclick = () => go(viewMart);

  $$('.svc').forEach(b => b.onclick = () => ({
    food: () => { state.brandFilter = null; state.pageLimit = 40; go(viewFood, {}); },
    bike: () => go(viewRide, 'bike'),
    car: () => go(viewRide, 'car'),
    mart: () => go(viewMart),
    express: () => go(viewExpress),
    deals: () => go(viewDeals),
    pay: () => { state.tab = 'pay'; go(viewPay); },
    map: () => go(viewMapAll)
  }[b.dataset.s])());

  $$('.bcard').forEach(c => c.onclick = () => { state.brandFilter = +c.dataset.bid; state.cat = 'all'; state.chip = 'all'; state.pageLimit = 40; go(viewFood, {}); });
  $$('.promo,.hcard,.rcard').forEach(c => c.onclick = () => go(viewRest, +c.dataset.id));
  const pr = $('#pr'); pr.onscroll = () => { const i = Math.round(pr.scrollLeft / (pr.firstChild.offsetWidth + 12)); $$('#dots i').forEach((d, k) => d.classList.toggle('on', k === i)); };
}

const thumbImg = r => {
  const tid = r.logoId || (r.bid <= 50 ? r.bid : ((r.bid % 50) + 1));
  return `<img src="img/thumbs/t${tid}.jpg" alt="${r.name}" loading="lazy" onerror="this.src='img/r${r.aid}/cover.jpg'">`;
};
const mapPopupHTML = r => `<div class="mpop">
  <div class="mplg">${thumbImg(r)}</div>
  <div class="mpinf">
    <b>${r.name}</b>
    <div class="mpmt"><span class="star">★</span> <b>${r.rate}</b> (${r.rv}) · ${rdist(r).toFixed(1)} km · ~${eta(r)}p</div>
    <div class="mpad">📍 ${r.addr}</div>
    <a href="#" id="pop_${r.id}">Xem quán & đặt món →</a>
  </div>
</div>`;

function rcard(r) {
  const bcnt = r.branchCount || 1;
  const origFee = feeOf(r);
  const isFree = r.promo === 'Freeship' || r.id % 3 === 0;
  const saleFee = isFree ? 'Miễn phí' : fmt(Math.max(1000, origFee - 12000));
  const disc1 = r.promo && r.promo !== 'Freeship' ? r.promo : 'Giảm 17.000đ';
  const minOrd1 = ((r.id % 4) * 15 + 70) + '.000đ';
  const dishes3 = r.menu.slice(0, 3);
  return `<div class="rcard" data-id="${r.id}">
    <div class="rtop">
      <div class="rthumb">${thumbImg(r)}</div>
      <div class="rbody">
        <div class="rtitle">
          ${r.id % 2 === 1 ? '<span class="adtag">Quảng cáo</span>' : ''}
          <div class="nm">${r.name}</div>
          <span class="dots3">⋮</span>
        </div>
        <div class="mt">
          <span><span class="star">★</span> <b style="color:#1f1f1f">${r.rate}</b> (${r.rv})</span>
          <i class="dot"></i><span><b>$$</b><span style="color:#ccc">$$</span></span>
          <i class="dot"></i><span>${r.tags.split('·')[0].trim()}</span>
          ${bcnt > 1 ? `<i class="dot"></i><span style="color:#00863c;font-weight:700">${bcnt} CN</span>` : ''}
        </div>
        <div class="shiprow">
          <span class="free">🛵 ${saleFee}</span>
          <s>${fmt(origFee)}</s>
          <i class="dot"></i><span>${eta(r)} phút trở lên</span>
          <i class="dot"></i><span>${rdist(r).toFixed(1)} km</span>
        </div>
        <div class="vstrip">
          <div class="vpill"><i>Ưu đãi<br>Quán Xịn</i><div><b>${disc1}</b><small>Đơn hàng từ ${minOrd1}</small></div></div>
          <div class="vpill"><i class="org">♾️</i><div><b>Giảm 29.000đ</b><small>Đơn hàng từ 110.000đ</small></div></div>
        </div>
      </div>
    </div>
    <div class="dstrip">
      ${dishes3.map((it, idx) => `<div class="dmini">
        <div class="dpic"><span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:32px">${it[3]}</span>${im('r' + r.aid + '/m' + idx, it[0])}</div>
        <b>${it[1].toLocaleString('vi-VN')}</b>
        <span>${it[0]}</span>
      </div>`).join('')}
    </div>
  </div>`;
}

/* ================= DỊCH VỤ ĐẶT XE GRABBIKE / GRABCAR ================= */
const DEST_PRESETS = [
  ['Sân bay Tân Sơn Nhất (Ga Quốc Nội)', 3.8, 4.2],
  ['Phố đi bộ Nguyễn Huệ, Quận 1', 0.65, -0.45],
  ['Landmark 81 Vinhomes Central Park', 2.9, 1.8],
  ['Bến xe Miền Đông / Ga Metro', 3.4, 2.5],
  ['Crescent Mall Phú Mỹ Hưng, Quận 7', -1.8, -3.6],
  ['Aeon Mall Tân Phú Celadon', -4.2, 2.8],
  ['Chợ Đêm Hồ Thị Kỷ, Quận 10', -1.9, -0.8],
  ['Nhà Văn Hóa Thanh Niên, Quận 1', 0.85, 0.75]
];

function viewRide(mode = 'bike') {
  tabs(false);
  let destIdx = mode === 'car' ? 0 : 1;
  let veh = mode === 'car' ? 'car4' : 'bike';
  let pay = 'wallet';
  let dstPos = [state.pos.lat + km2lat(DEST_PRESETS[destIdx][2]), state.pos.lng + km2lng(DEST_PRESETS[destIdx][1])];
  let dstName = DEST_PRESETS[destIdx][0];

  screen.innerHTML = `<div class="trkwrap">
    <div id="trkmap"></div>
    <button class="ib floatl" id="bk">${ARROW}</button>
    <div class="sheet" style="max-height:66%">
      <div class="grab"></div>
      <div class="rbox">
        <div class="rpin" id="pfrom"><i></i><div style="flex:1;min-width:0"><small style="color:#777;font-size:11px;display:block">Điểm đón hiện tại</small><b style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block">${state.pos.addr}</b></div></div>
        <div class="rpin"><i class="dst"></i><div style="flex:1;min-width:0"><small style="color:#777;font-size:11px;display:block">Điểm đến (chọn nhanh hoặc chạm bản đồ)</small><input id="dstin" value="${dstName}" style="border:0;outline:0;width:100%;font-weight:700;font-size:13.5px;font-family:inherit"></div></div>
        <div style="padding-top:6px">${DEST_PRESETS.map((d, i) => `<span class="dchip ${i === destIdx ? 'on' : ''}" data-di="${i}">${d[0].split(',')[0]}</span>`).join('')}</div>
      </div>
      <div id="vlist"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin:10px 0;font-size:13px">
        <span id="pmbtn" style="font-weight:700;color:#00863c;cursor:pointer">💚 Ví GrabPay (${fmt(state.wallet)}) ▾</span>
        <span style="color:#666">🎟️ Đã áp dụng ưu đãi</span>
      </div>
      <button class="btn" id="bookbtn" style="justify-content:center"></button>
    </div>
  </div>`;

  const m = newMap('trkmap', [state.pos.lat, state.pos.lng], 14);
  const mkFrom = L.marker([state.pos.lat, state.pos.lng], { icon: pinIcon('🙋', '#1d4ed8') }).addTo(m);
  const mkTo = L.marker(dstPos, { icon: pinIcon('🏁', '#ef4b3f'), draggable: true }).addTo(m);
  let routeLine = L.polyline([[state.pos.lat, state.pos.lng], dstPos], { color: '#00b14f', weight: 5 }).addTo(m);
  ro = new ResizeObserver(() => { if (maps.includes(m)) m.invalidateSize(); }); ro.observe($('#trkmap'));

  const calcVehicles = () => {
    const km = Math.max(0.8, distKm([state.pos.lat, state.pos.lng], dstPos) * 1.3);
    const mins = Math.max(4, Math.round(km * 3.5));
    return [
      { id: 'bike', name: 'GrabBike', sub: `${mins} phút · Nhanh chóng, luồn lách tốt`, ic: '🛵', price: Math.round((12000 + km * 4800) / 1000) * 1000 },
      { id: 'bikeplus', name: 'GrabBike Plus', sub: `${mins} phút · Xe tay ga đời mới, tài xế 4.9★`, ic: '🛵', price: Math.round((16000 + km * 5800) / 1000) * 1000 },
      { id: 'car4', name: 'GrabCar 4 chỗ', sub: `${mins + 3} phút · Tiện nghi, che mưa nắng`, ic: '🚗', price: Math.round((28000 + km * 11500) / 1000) * 1000 },
      { id: 'car7', name: 'GrabCar 7 chỗ', sub: `${mins + 4} phút · Rộng rãi cho nhóm & hành lý`, ic: '🚙', price: Math.round((34000 + km * 13800) / 1000) * 1000 }
    ];
  };

  const updateRouteAndUI = async () => {
    const vs = calcVehicles();
    const curV = vs.find(v => v.id === veh) || vs[0];
    const km = Math.max(0.8, distKm([state.pos.lat, state.pos.lng], dstPos) * 1.3);
    $('#vlist').innerHTML = vs.map(v => `<div class="vitem ${v.id === veh ? 'on' : ''}" data-v="${v.id}">
      <div class="vic">${v.ic}</div>
      <div class="vinf"><b>${v.name} <span style="font-weight:500;font-size:11.5px;color:#00863c">· ${km.toFixed(1)} km</span></b><small>${v.sub}</small></div>
      <div class="vpr">${fmt(v.price)}<small>${fmt(v.price + 10000)}</small></div>
    </div>`).join('');
    $$('.vitem').forEach(el => el.onclick = () => { veh = el.dataset.v; updateRouteAndUI(); });
    $('#bookbtn').textContent = `Đặt ${curV.name} · ${fmt(curV.price)}`;

    const pts = await getRoute([state.pos.lat, state.pos.lng], dstPos);
    if (!$('#trkmap')) return;
    routeLine.setLatLngs(pts);
    m.fitBounds([[state.pos.lat, state.pos.lng], dstPos], { padding: [45, 45] });
  };

  updateRouteAndUI();

  m.on('click', async e => {
    dstPos = [e.latlng.lat, e.latlng.lng];
    mkTo.setLatLng(dstPos);
    dstName = await reverseGeocode(dstPos[0], dstPos[1]);
    if ($('#dstin')) $('#dstin').value = dstName;
    $$('.dchip').forEach(c => c.classList.remove('on'));
    updateRouteAndUI();
  });
  mkTo.on('dragend', async () => {
    const p = mkTo.getLatLng();
    dstPos = [p.lat, p.lng];
    dstName = await reverseGeocode(dstPos[0], dstPos[1]);
    if ($('#dstin')) $('#dstin').value = dstName;
    updateRouteAndUI();
  });

  $$('.dchip').forEach(ch => ch.onclick = () => {
    destIdx = +ch.dataset.di;
    $$('.dchip').forEach(x => x.classList.toggle('on', x === ch));
    dstName = DEST_PRESETS[destIdx][0];
    $('#dstin').value = dstName;
    dstPos = [state.pos.lat + km2lat(DEST_PRESETS[destIdx][2]), state.pos.lng + km2lng(DEST_PRESETS[destIdx][1])];
    mkTo.setLatLng(dstPos);
    updateRouteAndUI();
  });

  $('#pmbtn').onclick = () => {
    pay = pay === 'wallet' ? 'cash' : 'wallet';
    $('#pmbtn').textContent = pay === 'wallet' ? `💚 Ví GrabPay (${fmt(state.wallet)}) ▾` : '💵 Tiền mặt ▾';
  };
  $('#pfrom').onclick = () => go(viewPickLoc, () => go(viewRide, mode));
  $('#bk').onclick = () => go(viewHome);

  $('#bookbtn').onclick = () => {
    const vs = calcVehicles();
    const curV = vs.find(v => v.id === veh) || vs[0];
    const finalDst = $('#dstin').value.trim() || dstName;
    if (pay === 'wallet') {
      if (state.wallet < curV.price) return toast('Số dư Ví GrabPay không đủ');
      state.wallet -= curV.price;
    }
    const d1 = DRIVERS[Math.floor(Math.random() * DRIVERS.length)];
    let d2 = DRIVERS[Math.floor(Math.random() * DRIVERS.length)];
    if (d2[0] === d1[0]) d2 = DRIVERS[(DRIVERS.indexOf(d1) + 1) % DRIVERS.length];

    const o = {
      id: 'GR-' + Date.now().toString().slice(-8),
      svcType: curV.id.startsWith('car') ? 'car' : 'bike',
      title: `${curV.name} → ${finalDst}`,
      rid: R[0].id,
      items: [[`Chuyến ${curV.name} (${distKm([state.pos.lat, state.pos.lng], dstPos).toFixed(1)} km)`, 1, curV.price, `Đón: ${state.pos.addr} → Đến: ${finalDst}`]],
      total: curV.price, fee: 0, pay,
      pos: { ...state.pos },
      dstPos, dstName: finalDst,
      t: Date.now(),
      driver1: d1, driver: d2,
      plan: makeLongWaitPlan(),
      status: 'active'
    };
    state.orders.unshift(o); save();
    go(viewTrack, o.id);
  };
}

/* ================= DỊCH VỤ GIAO HÀNG GRABEXPRESS ================= */
function viewExpress() {
  tabs(false);
  let destIdx = 2;
  let svcOpt = 'instant';
  let pay = 'wallet';
  let dstPos = [state.pos.lat + km2lat(DEST_PRESETS[destIdx][2]), state.pos.lng + km2lng(DEST_PRESETS[destIdx][1])];

  screen.innerHTML = `<div class="top"><button class="ib" id="bk">${ARROW}</button><h2>GrabExpress Giao Hàng</h2></div>
  <div id="mp" style="height:190px;position:relative;z-index:0"></div>
  <div class="box">
    <h4>Lộ trình giao nhận</h4>
    <div class="rpin"><i></i><div style="flex:1"><small style="color:#777;font-size:11px;display:block">Người gửi (${state.user.name} · ${state.user.phone})</small><b>${state.pos.addr}</b></div></div>
    <div class="rpin"><i class="dst"></i><div style="flex:1"><small style="color:#777;font-size:11px;display:block">Địa chỉ người nhận (chạm bản đồ hoặc chọn nhanh)</small><input id="exdst" value="${DEST_PRESETS[destIdx][0]}" style="border:0;outline:0;width:100%;font-weight:700;font-size:13.5px;font-family:inherit"></div></div>
    <div style="margin-top:6px">${DEST_PRESETS.slice(0, 5).map((d, i) => `<span class="dchip ${i === destIdx ? 'on' : ''}" data-di="${i}">${d[0].split(',')[0]}</span>`).join('')}</div>
  </div>
  <div class="box">
    <h4>Thông tin người nhận & kiện hàng</h4>
    <div style="display:flex;gap:8px"><input class="fld" id="rname" placeholder="Tên người nhận" value="Anh Minh"><input class="fld" id="rphone" placeholder="Số điện thoại" value="0908 123 456"></div>
    <input class="fld" id="ritem" placeholder="Loại hàng hóa" value="Tài liệu / Hộp quà nhỏ (< 5kg)">
  </div>
  <div class="box">
    <h4>Gói dịch vụ giao</h4>
    <div id="exopts"></div>
  </div>
  <div style="height:90px"></div>
  <div class="cartbar"><button id="exgo"><span>Đặt GrabExpress</span><span id="expr"></span></button></div>`;

  const m = newMap('mp', [state.pos.lat, state.pos.lng], 13);
  L.marker([state.pos.lat, state.pos.lng], { icon: pinIcon('📦', '#1d4ed8') }).addTo(m);
  const mkTo = L.marker(dstPos, { icon: pinIcon('🏁', '#ef4b3f'), draggable: true }).addTo(m);
  const line = L.polyline([[state.pos.lat, state.pos.lng], dstPos], { color: '#d97706', weight: 5 }).addTo(m);

  const updateEx = () => {
    const km = Math.max(1, distKm([state.pos.lat, state.pos.lng], dstPos) * 1.3);
    const p1 = Math.round((15000 + km * 5000) / 1000) * 1000;
    const p2 = Math.round((11000 + km * 3600) / 1000) * 1000;
    const opts = [
      ['instant', '⚡ Siêu Tốc (Instant)', `Giao thẳng trong ${Math.round(15 + km * 4)} phút · Bảo hiểm hàng hóa`, p1],
      ['same2h', '🕒 Tiết Kiệm (2 Giờ)', 'Ghép đơn thông minh, đồng giá tiết kiệm 30%', p2]
    ];
    $('#exopts').innerHTML = opts.map(o => `<div class="opt ${svcOpt === o[0] ? 'on' : ''}" data-o="${o[0]}"><div class="optc"><b>${o[1]}</b><small>${o[2]}</small></div><b>${fmt(o[3])}</b></div>`).join('');
    $$('#exopts .opt').forEach(el => el.onclick = () => { svcOpt = el.dataset.o; updateEx(); });
    const curP = svcOpt === 'instant' ? p1 : p2;
    $('#expr').textContent = fmt(curP);
    line.setLatLngs([[state.pos.lat, state.pos.lng], dstPos]);
    m.fitBounds([[state.pos.lat, state.pos.lng], dstPos], { padding: [30, 30] });
    return curP;
  };
  updateEx();

  $$('.dchip').forEach(ch => ch.onclick = () => {
    destIdx = +ch.dataset.di;
    $$('.dchip').forEach(x => x.classList.toggle('on', x === ch));
    $('#exdst').value = DEST_PRESETS[destIdx][0];
    dstPos = [state.pos.lat + km2lat(DEST_PRESETS[destIdx][2]), state.pos.lng + km2lng(DEST_PRESETS[destIdx][1])];
    mkTo.setLatLng(dstPos);
    updateEx();
  });
  m.on('click', async e => {
    dstPos = [e.latlng.lat, e.latlng.lng]; mkTo.setLatLng(dstPos);
    $('#exdst').value = await reverseGeocode(dstPos[0], dstPos[1]);
    updateEx();
  });

  $('#bk').onclick = () => go(viewHome);
  $('#exgo').onclick = () => {
    const price = updateEx();
    const dstAddr = $('#exdst').value.trim() || 'Điểm nhận hàng';
    const rcv = `${$('#rname').value || 'Người nhận'} (${$('#rphone').value || '0908123456'})`;
    const pkg = $('#ritem').value || 'Kiện hàng tiêu chuẩn';
    const d1 = DRIVERS[Math.floor(Math.random() * DRIVERS.length)];
    let d2 = DRIVERS[Math.floor(Math.random() * DRIVERS.length)];
    if (d2[0] === d1[0]) d2 = DRIVERS[(DRIVERS.indexOf(d1) + 1) % DRIVERS.length];

    const o = {
      id: 'GE-' + Date.now().toString().slice(-8),
      svcType: 'express',
      title: `GrabExpress → ${dstAddr}`,
      rid: R[0].id,
      items: [[`Giao kiện hàng: ${pkg}`, 1, price, `Người nhận: ${rcv} · Giao tới: ${dstAddr}`]],
      total: price, fee: 0, pay,
      pos: { ...state.pos }, dstPos, dstName: dstAddr,
      t: Date.now(), driver1: d1, driver: d2,
      plan: makeLongWaitPlan(),
      status: 'active'
    };
    state.orders.unshift(o); save();
    go(viewTrack, o.id);
  };
}

/* ================= DỊCH VỤ ĐI CHỢ / SIÊU THỊ GRABMART ================= */
function viewMart() {
  tabs(false);
  screen.innerHTML = `<div class="top"><button class="ib" id="bk">${ARROW}</button><h2>GrabMart · Siêu thị & Tiện lợi</h2></div>
  <div style="background:#00693e;color:#fff;padding:14px 16px;font-size:13px"><b>🛒 Đi chợ hộ giao trong 15-20 phút</b><div style="opacity:.9;margin-top:3px">Thực phẩm tươi sống, đồ uống ướp lạnh, cửa hàng tiện lợi 24/7 quanh ${state.pos.addr}</div></div>
  <div id="mlist">${MART_STORES.map(rcard).join('')}</div><div style="height:20px"></div>`;
  $('#bk').onclick = () => go(viewHome);
  $$('.rcard').forEach(c => c.onclick = () => go(viewRest, +c.dataset.id));
}

/* ================= KHO ƯU ĐÃI / THANH TOÁN / TIN NHẮN ================= */
function viewDeals() {
  tabs(false);
  screen.innerHTML = `<div class="top"><button class="ib" id="bk">${ARROW}</button><h2>Kho ưu đãi & GrabRewards</h2></div>
  <div style="background:linear-gradient(135deg,#00b14f,#00693e);color:#fff;padding:18px 16px;display:flex;justify-content:space-between;align-items:center">
    <div><small style="opacity:.9">Hạng Thành Viên Vàng</small><div style="font-size:22px;font-weight:800;margin-top:2px">${state.points.toLocaleString('vi-VN')} điểm</div></div>
    <span style="background:#fff2;padding:6px 12px;border-radius:16px;font-size:12px;font-weight:700">Đổi quà 🎁</span>
  </div>
  <div class="sec">Mã giảm giá sẵn sàng sử dụng</div>
  ${Object.entries(VOUCHERS).map(([code, v]) => `<div class="box" style="margin:8px 12px;border-radius:14px;border:1.5px dashed var(--g);display:flex;justify-content:space-between;align-items:center">
    <div><b style="color:var(--gd);font-size:15px">🎟️ ${code}</b><div style="font-size:13.5px;font-weight:700;margin-top:3px">${v[0]}</div><small style="color:#666">${v[2]} · HSD: Hôm nay</small></div>
    <button class="btn" data-c="${code}" style="width:auto;padding:9px 14px;font-size:12.5px">${state.voucher === code ? 'Đã lưu ✓' : 'Dùng ngay'}</button>
  </div>`).join('')}`;
  $('#bk').onclick = () => go(viewHome);
  $$('[data-c]').forEach(b => b.onclick = () => {
    state.voucher = b.dataset.c;
    toast(`Đã áp dụng mã ${state.voucher} cho đơn tiếp theo!`);
    go(viewFood, {});
  });
}

function viewPay() {
  state.tab = 'pay'; tabs();
  screen.innerHTML = `<div class="top"><h2>Ví GrabPay & Thanh toán</h2></div>
  <div style="margin:12px 16px;background:linear-gradient(135deg,#00b14f,#007a37);color:#fff;border-radius:18px;padding:20px;box-shadow:0 6px 18px #00b14f33">
    <small style="opacity:.9">Số dư Ví GrabPay</small>
    <div style="font-size:28px;font-weight:900;margin:4px 0 14px">${fmt(state.wallet)}</div>
    <div style="display:flex;gap:10px">
      <button class="btn" id="topup" style="background:#fff;color:#00863c;padding:10px;font-size:13.5px;justify-content:center;box-shadow:none">+ Nạp 200.000đ</button>
      <button class="btn" id="qrbtn" style="background:#ffffff24;color:#fff;padding:10px;font-size:13.5px;justify-content:center;box-shadow:none">📷 Quét mã QR</button>
    </div>
  </div>
  <div class="box"><h4>Thẻ & Tài khoản liên kết</h4>
    <div class="opt on"><span class="ic">💚</span><div class="optc"><b>Ví điện tử GrabPay</b><small>Ưu tiên thanh toán & hoàn tiền tức thì</small></div><span class="ra"></span></div>
    <div class="opt"><span class="ic">💳</span><div class="optc"><b>Thẻ Quốc Tế Visa •••• 4242</b><small>Đã xác thực bảo mật 3D-Secure</small></div></div>
  </div>
  <div class="box"><h4>Lịch sử giao dịch gần đây</h4>
    ${state.orders.length ? state.orders.slice(0, 8).map(o => `<div class="row" style="border-bottom:1px solid var(--line);padding:10px 0">
      <div><b>${o.title || byId(o.rid).name}</b><div style="font-size:11.5px;color:#777">${new Date(o.t).toLocaleString('vi-VN')} · ${o.status === 'cancelled' ? 'Đã hoàn tiền + Đền bù 30K' : 'Thanh toán đơn'}</div></div>
      <b style="color:${o.status === 'cancelled' ? '#00863c' : '#1f1f1f'}">${o.status === 'cancelled' ? '+30.000đ' : '-' + fmt(o.total)}</b>
    </div>`).join('') : '<div style="color:#777;font-size:13px;padding:10px 0">Chưa có giao dịch phát sinh</div>'}
  </div>`;
  $('#topup').onclick = () => { state.wallet += 200000; save(); toast('Đã nạp 200.000đ vào Ví GrabPay'); viewPay(); };
  $('#qrbtn').onclick = () => toast('Tính năng quét QR tại quầy đã sẵn sàng');
}

function viewMsgs() {
  state.tab = 'msgs'; tabs();
  const sysMsgs = [
    ['🎁 Tặng bạn mã GRAB30 giảm 30.000đ', 'Áp dụng cho hơn 1.000 quán ăn và trà sữa quanh vị trí GPS của bạn hôm nay.', '10 phút trước'],
    ['🛵 GrabBike & GrabCar giảm 20K', 'Nhập mã GRABXE20 khi đặt xe di chuyển trong nội thành.', '1 giờ trước'],
    ['🛒 Đi chợ GrabMart Freeship 0đ', 'Thực phẩm tươi sống từ WinMart+, Bách Hóa Xanh giao tận cửa trong 15 phút.', 'Hôm nay']
  ];
  screen.innerHTML = `<div class="top"><h2>Tin nhắn & Thông báo</h2></div>
  <div class="box"><h4>Hộp thư tài xế & đơn hàng</h4>
    ${state.orders.length ? state.orders.slice(0, 6).map(o => `<div class="rpin" data-id="${o.id}" style="padding:10px 0">
      <div class="avatar" style="background:#e5f7ec;color:#00863c">${o.driver[0].split(' ').pop()[0]}</div>
      <div style="flex:1;min-width:0"><b>Tài xế ${o.driver[0]} (${o.driver[1]})</b><small style="display:block;color:#666;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${o.status === 'cancelled' ? '⚠️ Đơn đã hủy do sự cố: ' + o.cancelReason : 'Chào bạn, mình đã nhận đơn của bạn nhé!'}</small></div>
      <span style="font-size:11px;color:#00863c;font-weight:700">Xem ›</span>
    </div>`).join('') : '<div style="color:#777;font-size:13px">Chưa có tin nhắn từ tài xế</div>'}
  </div>
  <div class="box"><h4>Thông báo từ Grab</h4>
    ${sysMsgs.map(m => `<div style="padding:10px 0;border-bottom:1px solid var(--line)">
      <div style="display:flex;justify-content:space-between"><b>${m[0]}</b><small style="color:#888">${m[2]}</small></div>
      <div style="font-size:12.5px;color:#555;margin-top:4px">${m[1]}</div>
    </div>`).join('')}
  </div>`;
  $$('[data-id]').forEach(el => el.onclick = () => go(viewTrack, el.dataset.id));
}

/* ================= TRANG ĐỒ ĂN (1.000 QUÁN GOOGLE MAPS) ================= */
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
  if (state.chip === 'local') l = l.filter(r => !r.isChain);
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
    ${[['all', 'Tất cả'], ['near', '📍 Gần tôi <1.5km'], ['local', '🍲 Quán đặc sản 1 cơ sở'], ['deal', '🎟️ Ưu đãi'], ['fast', '⚡ Giao nhanh'], ['top', '★ 4.8+']].map(c => `<button class="chip ${state.chip === c[0] ? 'on' : ''}" data-ch="${c[0]}">${c[1]}</button>`).join('')}
  </div>
  <div id="list"></div><div style="height:20px"></div>`;

  const draw = () => {
    const l = filtered();
    const shown = l.slice(0, state.pageLimit);
    $('#list').innerHTML = l.length
      ? `<div style="padding:10px 16px 2px;font-size:12.5px;color:#555;font-weight:600;display:flex;justify-content:space-between"><span>Tìm thấy <b>${l.length.toLocaleString('vi-VN')}</b> quán trên Google Maps</span><span>Đang hiện ${shown.length}</span></div>` +
        shown.map(rcard).join('') +
        (shown.length < l.length ? `<div style="padding:10px 16px"><button class="btn o" id="more" style="text-align:center">Tải thêm quán (${shown.length}/${l.length.toLocaleString('vi-VN')})</button></div>` : '')
      : '<div class="empty"><div class="big">🔍</div><h4>Không tìm thấy quán phù hợp</h4>Thử từ khoá hoặc bộ lọc khác nhé</div>';
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
  screen.innerHTML = `<div id="trkmap"></div><button class="ib floatl" id="bk">${ARROW}</button><div style="position:absolute;top:14px;left:58px;right:14px;z-index:1000;background:#fff;border-radius:20px;padding:8px 14px;font-size:12.5px;font-weight:700;box-shadow:0 2px 8px #0003">🗺️ ${list.length.toLocaleString('vi-VN')} quán Google Maps quanh bạn</div>`;
  const m = newMap('trkmap', [state.pos.lat, state.pos.lng], 14, { preferCanvas: true });
  L.marker([state.pos.lat, state.pos.lng], { icon: homeIcon(), zIndexOffset: 2000 }).addTo(m);
  list.slice(0, 120).forEach(r => {
    const mkr = L.marker(rpos(r), { icon: shopIcon(r) }).addTo(m);
    mkr.bindPopup(mapPopupHTML(r));
    mkr.on('popupopen', () => { const a = $('#pop_' + r.id); if (a) a.onclick = e => { e.preventDefault(); go(viewRest, r.id); }; });
  });
  list.slice(120).forEach(r => {
    const cm = L.circleMarker(rpos(r), { radius: 6, fillColor: r.c, color: '#fff', weight: 1.5, fillOpacity: 0.9 }).addTo(m);
    cm.bindPopup(mapPopupHTML(r));
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
  $('#ok').onclick = () => { recordPos(tmp); toast('Đã lưu vị trí GPS vào máy'); back(); };
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
    ${sibs.length > 1
      ? `<div class="brpick" id="brs"><span>🏪 Chi nhánh: <b>${r.branch}</b> (${r.addr})</span><b>Đổi (${sibs.length} CN) ▾</b></div>`
      : `<div class="brpick" style="cursor:default;background:#f8f9fa;border-color:#e5e7eb"><span>📍 Địa chỉ duy nhất: <b>${r.addr}</b></span><b style="color:#666">1 cơ sở</b></div>`}
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

  <div class="box" style="margin-top:10px"><h4>Vị trí trên Google Maps ${sibs.length > 1 ? `(${sibs.length} chi nhánh)` : ''}</h4><div style="font-size:13px;color:#555;margin-bottom:8px">📍 ${r.addr} · Mở cửa ${r.hours}</div><div id="mp" style="height:180px;border-radius:12px;overflow:hidden;position:relative;z-index:0"></div></div><div style="height:90px"></div><div class="cartbar" id="cb"></div>`;

  const m = newMap('mp', rpos(r), 15, { scrollWheelZoom: false });
  sibs.forEach(sb => {
    const mkr = L.marker(rpos(sb), { icon: shopIcon(sb), opacity: sb.id === r.id ? 1 : 0.65 }).addTo(m);
    mkr.bindPopup(mapPopupHTML(sb));
    mkr.on('popupopen', () => { const a = $('#pop_' + sb.id); if (a) a.onclick = e => { e.preventDefault(); go(viewRest, sb.id); }; });
  });
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

  if ($('#brs')) $('#brs').onclick = () => branchSheet(r, sibs);
  $$('#mt button').forEach(b => b.onclick = () => {
    $$('#mt button').forEach(x => x.classList.toggle('on', x === b));
    const t = $('#' + b.dataset.k);
    if (t) screen.scrollTo({ top: t.offsetTop - 50, behavior: 'smooth' });
  });
  $('#bk').onclick = () => go(r.isMart ? viewMart : viewFood, {});
  $('#mp1').onclick = () => screen.scrollTo({ top: screen.scrollHeight, behavior: 'smooth' });
}

function branchSheet(cur, sibs) {
  const ov = document.createElement('div'); ov.className = 'ov';
  ov.innerHTML = `<div class="bs"><div class="bd">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><h3>Hệ thống ${sibs.length} chi nhánh ${cur.brand}</h3><button class="ib" id="x" style="box-shadow:none;background:#f1f1f1">${ICON.x}</button></div>
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
    <div class="box"><h4>Cơ sở cung cấp</h4><div style="font-size:13.5px;font-weight:700">${r.name}</div><div style="font-size:12px;color:#666;margin-top:2px">📍 ${r.addr} · Cách bạn ${rdist(r).toFixed(1)} km · Dự kiến ${eta(r)}-${eta(r) + 10} phút</div></div>
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

      const o = {
        id: (r.isMart ? 'GM-' : 'GF-') + Date.now().toString().slice(-8),
        svcType: r.isMart ? 'mart' : 'food',
        title: r.name,
        rid: r.id,
        items: Object.entries(c.items).map(([i, l]) => [r.menu[i][0], l.q, r.menu[i][1], l.note]),
        total: t.total, fee: t.fee, pay, dnote: $('#dn').value,
        pos: { ...state.pos }, t: Date.now(),
        driver1: d1, driver: d2,
        plan: makeLongWaitPlan(),
        status: 'active'
      };
      state.orders.unshift(o); state.cart = null; state.voucher = null; state.dnote = ''; save(); go(viewTrack, o.id);
    };
  };
  render();
}

/* ================= THEO DÕI ĐƠN & CHUYẾN XE (CHỜ 5-10 PHÚT -> HỦY ẨN PHÚT CHÓT) ================= */
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

const INCIDENTS_FOOD = [
  ['Sự cố phương tiện trên đường giao', 'Tài xế báo xe bị thủng lốp đột xuất cách điểm giao ~150m và không thể tiếp tục hành trình.'],
  ['Sự cố va chạm giao thông nhẹ', 'Tài xế gặp va quệt giao thông tại ngã tư gần bạn, phần đồ ăn/hàng hóa bị hư hỏng không đảm bảo chất lượng.'],
  ['Khu vực giao hàng bị phong tỏa / cấm đường', 'Tuyến đường vào vị trí của bạn đang rào chắn đột xuất và mất kết nối GPS với tài xế quá thời gian quy định.'],
  ['Tài xế gặp sự cố khẩn cấp trên đường', 'Đối tác tài xế báo sự cố sức khỏe đột xuất khi sắp tới điểm giao và hệ thống đã tự động thu hồi đơn hàng.']
];

const INCIDENTS_RIDE = [
  ['Tài xế gặp sự cố phương tiện trước điểm đón', 'Xe của tài xế bị hỏng lốp/động cơ đột xuất cách điểm đón ~120m và không thể tiếp tục đón khách.'],
  ['Tuyến đường vào điểm đón bị kẹt cứng / cấm đường', 'Đoạn đường trước điểm đón của bạn đang phân luồng khẩn cấp, tài xế không thể tiếp cận sau thời gian chờ.'],
  ['Gián đoạn kết nối định vị với phương tiện', 'Hệ thống mất tín hiệu GPS với tài xế khi xe đang rẽ vào điểm đón và đã tự động hủy chuyến để bảo vệ bạn.'],
  ['Tài xế báo sự cố khẩn cấp ngoài ý muốn', 'Đối tác tài xế gặp va quệt nhẹ trên đường tới đón bạn nên hệ thống đã tự động hủy chuyến và hoàn tiền.']
];

function viewTrack(id) {
  tabs(false);
  const o = state.orders.find(x => x.id === id);
  if (!o) return go(viewOrders);
  const isRide = o.svcType === 'bike' || o.svcType === 'car';
  const isExp = o.svcType === 'express';
  const r = byId(o.rid);
  const U = [o.pos.lat, o.pos.lng];
  const S = isRide || isExp ? (o.dstPos || [U[0] + km2lat(1.4), U[1] + km2lng(1.2)]) : rpos(r);
  const D1 = o.driver1 || o.driver, D2 = o.driver;
  const P = o.plan || makeLongWaitPlan();
  const incList = isRide ? INCIDENTS_RIDE : INCIDENTS_FOOD;
  const inc = incList[P.incidentIdx % incList.length];
  const start = [U[0] + km2lat(1.1), U[1] - km2lng(.9)];
  const stages = isRide
    ? ['Gửi yêu cầu', 'Tìm tài xế', 'Đã nhận chuyến', 'Đang tới đón', 'Sắp tới điểm đón']
    : ['Xác nhận', 'Tìm tài xế', 'Đến điểm lấy', isExp ? 'Nhận kiện hàng' : 'Chuẩn bị món', 'Đang giao'];

  screen.innerHTML = `<div class="trkwrap"><div id="trkmap"></div><button class="ib floatl" id="bk">${ARROW}</button><button class="ib floatr" id="fl">${ICON.loc}</button>
  <div class="sheet"><div class="grab"></div><div class="eta" id="eta">Đang kết nối hệ thống...</div><div class="sb" id="sub"></div>
  <div class="bar" id="bar">${stages.map(() => '<i></i>').join('')}</div>
  <div id="evbox"></div>
  <div id="drv"></div><div id="chat"></div>
  <button class="sumbtn" id="sm"><span>🧾 ${o.title || r.name}</span><span>${fmt(o.total)} ▾</span></button><div id="sml" style="display:none;padding:8px 4px;font-size:13px"></div>
  <div style="font-size:11.5px;color:#777;margin:10px 0 0;text-align:center">Mã đơn ${o.id} · ${{ cash: 'Tiền mặt', wallet: 'GrabPay', card: 'Visa •••• 4242' }[o.pay]}</div>
  <button class="btn o" id="cx" style="margin-top:10px;text-align:center;border-color:#ddd;color:#666">Huỷ ${isRide ? 'chuyến xe' : 'đơn hàng'}</button></div></div>`;

  $('#bk').onclick = () => { state.tab = 'orders'; go(viewOrders); };
  $('#sml').innerHTML = o.items.map(i => `<div class="row"><span>${i[1]}x ${i[0]}</span><span>${fmt(i[1] * i[2])}</span></div>${i[3] ? `<div style="font-size:11.5px;color:#777">${i[3]}</div>` : ''}`).join('');
  $('#sm').onclick = () => { const s = $('#sml'); s.style.display = s.style.display === 'none' ? 'block' : 'none'; };

  const m = newMap('trkmap', U, 14); let follow = false;
  if (isRide || isExp) {
    L.marker(U, { icon: pinIcon('🙋', '#1d4ed8') }).addTo(m);
    L.marker(S, { icon: pinIcon('🏁', '#ef4b3f') }).addTo(m);
  } else {
    L.marker(S, { icon: shopIcon(r) }).addTo(m);
    L.marker(U, { icon: homeIcon() }).addTo(m);
  }
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
    const vehDesc = o.svcType === 'car' ? (drv[4] || 'Toyota Vios · 51G-842.19') : `${drv[2]} · <span class="plate">${drv[1]}</span>`;
    $('#drv').innerHTML = `<div class="drv"><div class="av">${drv[0].split(' ').pop()[0]}</div><div class="d"><b>${drv[0]}</b>${vehDesc} · <span class="star">★</span> ${drv[3]}</div><button class="rb" id="call">${ICON.phone}</button><button class="rb" id="msg">${ICON.chat}</button></div>`;
    $('#call').onclick = () => toast('📞 Đang đổ chuông tới tài xế ' + drv[0] + '…');
    $('#msg').onclick = () => {
      const c = $('#chat'); if (c.innerHTML) { c.innerHTML = ''; return; }
      if (!o.chatLogs) o.chatLogs = [['drv', `Chào bạn, mình là ${drv[0].split(' ').pop()}, mình đã nhận yêu cầu của bạn rồi nhé!`]];
      const drawChat = () => {
        if (!$('#ms')) return;
        $('#ms').innerHTML = o.chatLogs.map(m => `<p class="${m[0] === 'me' ? 'me' : ''}">${m[1]}</p>`).join('');
        $('#ms').scrollTop = 1e5;
      };
      c.innerHTML = `<div class="chatb"><div class="msgs" id="ms"></div><form id="cf"><input id="ci" placeholder="Nhắn tin cho tài xế..." autocomplete="off"><button>Gửi</button></form></div>`;
      drawChat();
      $('#cf').onsubmit = e => {
        e.preventDefault(); const v = $('#ci').value.trim(); if (!v) return;
        o.chatLogs.push(['me', v]); save(); drawChat(); $('#ci').value = '';
        const replies = ['Ok bạn ơi, đường đang hơi đông xíu bạn đợi mình vài phút nha 👍', 'Mình ghi nhận rồi nhé, tới nơi mình gọi bạn ngay!', 'Mình đang cố chạy nhanh nhất có thể đây ạ, bạn yên tâm nhé!'];
        setTimeout(() => {
          o.chatLogs.push(['drv', replies[Math.floor(Math.random() * replies.length)]]);
          save(); drawChat();
        }, 1600);
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
      <h2 style="margin-top:16px;font-size:20px;color:#b91c1c">${isRide ? 'Chuyến xe đã bị hủy đột xuất' : 'Đơn hàng đã bị hủy đột xuất'}</h2>
      <p style="color:#444;margin-top:8px;font-size:13.5px;line-height:1.45"><b>Lý do: ${inc[0]}</b><br>${inc[1]}</p>
      <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:14px;padding:12px 14px;margin:14px 0;text-align:left;width:100%;font-size:12.5px;color:#7f1d1d">
        <div>• Mã giao dịch: <b>${o.id}</b> (${o.title || r.name})</div>
        <div style="margin-top:4px">• Hoàn tiền: <b>${o.pay === 'wallet' ? 'Đã hoàn ' + fmt(o.total) + ' về Ví GrabPay' : 'Không thu phí (' + fmt(o.total) + ')'}</b></div>
        <div style="margin-top:4px;color:#00863c">• Đền bù sự cố chờ lâu: <b>+30.000đ</b> đã cộng vào Ví GrabPay</div>
      </div>
      <div style="display:flex;gap:8px;width:100%">
        <button class="btn o" id="dn1" style="flex:1;justify-content:center">Xem lịch sử</button>
        <button class="btn" id="dn2" style="flex:1;justify-content:center">Về trang chủ</button>
      </div>`;
    $('#app').appendChild(d);
    $('#dn1').onclick = () => { d.remove(); state.tab = 'orders'; go(viewOrders, 'his'); };
    $('#dn2').onclick = () => { d.remove(); state.tab = 'home'; go(viewHome); };
  };

  $('#cx').onclick = () => {
    if (!confirm('Bạn chắc chắn muốn huỷ yêu cầu này?')) return;
    o.status = 'cancelled'; o.cancelReason = 'Khách hàng chủ động yêu cầu huỷ';
    if (o.pay === 'wallet') state.wallet += o.total;
    save(); toast('Đã huỷ thành công'); state.tab = 'orders'; go(viewOrders, 'his');
  };

  if (o.status !== 'active') {
    setStage(4, o.status === 'done' ? 'Đã hoàn tất' : 'Đã bị huỷ', o.cancelReason || (o.title || r.name), 'err');
    if (o.cancelDetail) setEv(`⚠️ ${o.cancelDetail}`, 'err');
    showDrv(D2); $('#cx').remove();
    return;
  }

  (async () => {
    const vehEmoji = o.svcType === 'car' ? '🚗' : '🛵';
    const ptShop = isRide || isExp ? U : S;
    const ptDest = isRide || isExp ? S : U;
    const [r1, r2] = await Promise.all([getRoute(start, ptShop), getRoute(ptShop, ptDest)]);
    if (!$('#trkmap')) return;
    L.polyline(r1, { color: '#9aa0a6', weight: 4, dashArray: '4 8' }).addTo(m);
    const poly2 = L.polyline(r2, { color: '#00b14f', weight: 6, opacity: .9 }).addTo(m);
    const dm = L.marker(start, { icon: riderIcon(vehEmoji), zIndexOffset: 1000, opacity: 0 }).addTo(m);

    // Kịch bản 9 chặng dựa trên thời gian thực tế đã trôi qua từ lúc bấm đặt (o.t), tổng 5 - 10 phút
    const ph = isRide ? [
      { d: P.tConfirm, f: () => { setStage(0, 'Đang gửi yêu cầu đặt xe…', `Đang kiểm tra mật độ phương tiện quanh ${o.pos.addr}`); setEv('⏳ Giờ cao điểm, hệ thống đang ưu tiên điều phối xe cho bạn...'); } },
      { d: P.tFind1, f: p => { setStage(1, 'Đang tìm tài xế quanh bạn…', `Đã gửi tín hiệu tới ${4 + Math.floor(p * 8)} tài xế trong bán kính 2km`); if (p > 0.55) setEv(`🔍 Tài xế ${D1[0]} đang xem cuốc xe của bạn...`); } },
      { d: P.tCancel1, f: () => { setStage(1, 'Đang chuyển sang tài xế khác…', `Tài xế ${D1[0]} đang kẹt đường một chiều, hệ thống đang ghép tài xế mới`, 'warn'); setEv(`⚠️ Tài xế ${D1[0]} không kịp quay đầu. Đang tự động điều phối tài xế gần hơn...`, 'warn'); } },
      { d: P.tFind2, f: p => { if (p < 0.4) setStage(1, 'Mở rộng bán kính tìm xe 3km…', 'Đang kết nối với tài xế ưu tiên'); else { dm.setOpacity(1); showDrv(D2); setStage(2, 'Tài xế đã nhận chuyến!', `${D2[0]} đang xuất phát tới đón bạn`); setEv(`✅ Tài xế ${D2[0]} đã nhận cuốc xe và bắt đầu di chuyển`); } } },
      { d: P.tToShop + P.tKitchen, f: p => { showDrv(D2); dm.setOpacity(1); const mins = Math.max(3, Math.ceil((1 - p * 0.5) * 9)); const q = along(r1, p * 0.55); dm.setLatLng(q); if (follow) m.panTo(q, { animate: false }); setStage(3, `Tài xế đang tới điểm đón · ~${mins} phút`, `${D2[0]} đang di chuyển về phía ${o.pos.addr}`); setEv(`${vehEmoji} Tài xế đang trên đường tới đón bạn`); } },
      { d: P.tKitchenDelay, f: p => { const q = along(r1, 0.55 + p * 0.08); dm.setLatLng(q); setStage(3, 'Tài xế đang kẹt đèn đỏ ngã tư · ~5 phút', 'Giao thông hướng về điểm đón đang ùn ứ nhẹ, mong bạn thông cảm', 'warn'); setEv('🚦 Tài xế báo đang chờ qua nút giao đông xe, thời gian đón dự kiến cộng thêm 3 phút...', 'warn'); } },
      { d: P.tDeliver, f: p => { if ($('#cx')) $('#cx').remove(); const moveP = Math.min(P.stopRatio, 0.63 + p * (P.stopRatio - 0.63)); const q = along(r1, moveP); dm.setLatLng(q); if (follow) m.panTo(q, { animate: false }); if (p < 0.75) { const rem = Math.max(1, Math.ceil((1 - p) * 4)); setStage(4, `Tài xế sắp tới điểm đón · ~${rem} phút`, `Xe chỉ còn cách bạn khoảng ${Math.round((1 - moveP) * 1400)}m`); setEv(`📍 Hãy chuẩn bị ra điểm đón tại ${o.pos.addr}`); } else { setStage(4, 'Xe đang dừng cách điểm đón ~120m…', 'Tài xế đang dừng khẩn cấp trước khi rẽ vào chỗ bạn', 'warn'); setEv('⚠️ Phương tiện đang dừng lâu bất thường cách điểm đón ~120m...', 'warn'); } } },
      { d: P.tFinalIncident, f: p => { dm.setLatLng(along(r1, P.stopRatio)); poly2.setStyle({ color: '#ef4b3f', dashArray: '6 8' }); if (p < 0.5) { setStage(4, 'Gián đoạn tín hiệu từ phương tiện…', `Tổng đài Grab đang liên hệ khẩn với tài xế ${D2[0]}`, 'err'); setEv(`🚨 Phát hiện sự cố phương tiện cách bạn ~120m. Đang xác minh...`, 'err'); } else { setStage(4, 'Sự cố phương tiện ngoài ý muốn…', `${inc[0]} — đang hủy chuyến & hoàn tiền tự động`, 'err'); setEv(`🚨 ${inc[1]}`, 'err'); } } }
    ] : [
      { d: P.tConfirm, f: () => { setStage(0, 'Chờ xác nhận đơn hàng…', `${o.title || r.name} đang kiểm tra đơn của bạn`); setEv('⏳ Giờ cao điểm nên quá trình xác nhận đơn mất thêm ít phút...'); } },
      { d: P.tFind1, f: p => { setStage(1, 'Đang tìm tài xế quanh điểm lấy…', `Đã phát tín hiệu tới ${3 + Math.floor(p * 7)} tài xế trong bán kính 1.8km`); if (p > 0.6) setEv(`🔍 Tài xế ${D1[0]} (${D1[1]}) đang xem yêu cầu đơn hàng...`); } },
      { d: P.tCancel1, f: () => { setStage(1, 'Đang điều phối tài xế khác…', `Tài xế ${D1[0]} vừa từ chối do kẹt xe, hệ thống đang ưu tiên tìm tài xế mới`, 'warn'); setEv(`⚠️ Tài xế ${D1[0]} không thể nhận đơn. Đang tự động chuyển sang tài xế gần nhất...`, 'warn'); } },
      { d: P.tFind2, f: p => { if (p < 0.45) setStage(1, 'Đang mở rộng phạm vi tìm…', 'Tăng bán kính tìm kiếm lên 2.8km ưu tiên đơn của bạn'); else { dm.setOpacity(1); showDrv(D2); setStage(1, 'Đã tìm thấy tài xế!', `${D2[0]} (${D2[2]} · ${D2[1]}) đã nhận đơn`); setEv(`✅ Tài xế ${D2[0]} đã nhận đơn và bắt đầu di chuyển tới điểm lấy hàng`); } } },
      { d: P.tToShop, f: p => { showDrv(D2); dm.setOpacity(1); const mins = Math.max(2, Math.ceil((1 - p) * 7)); const stuck = p > 0.45 && p < 0.72; const effP = stuck ? 0.45 + (p - 0.45) * 0.25 : (p >= 0.72 ? 0.5175 + (p - 0.72) * (0.4825 / 0.28) : p); dm.setLatLng(along(r1, effP)); setStage(2, `Tài xế đang đến điểm lấy · ~${mins} phút`, `${D2[0]} đang trên đường tới ${isExp ? o.pos.addr : r.addr}`); if (stuck) setEv('🚦 Tài xế đang dừng chờ đèn đỏ / kẹt xe nhẹ trên đường di chuyển...', 'warn'); else setEv(`🛵 Tài xế ${D2[0]} đang di chuyển tới điểm lấy hàng`); } },
      { d: P.tKitchen, f: p => { dm.setLatLng(ptShop); const mins = Math.max(5, Math.ceil((1 - p * 0.5) * 12)); setStage(3, `${isExp ? 'Tài xế đang nhận & kiểm tra kiện hàng' : 'Quán đang chuẩn bị món'} · ~${mins} phút`, `Tài xế ${D2[0]} đã tới nơi và đang đợi bàn giao`); setEv(isExp ? '📦 Đang đóng gói và xác nhận biên nhận giao hàng...' : '🍳 Bếp đang chế biến món ăn nóng hổi cho bạn...'); } },
      { d: P.tKitchenDelay, f: p => { dm.setLatLng(ptShop); const extra = 7 + Math.ceil((1 - p) * 6); setStage(3, `Thời gian chuẩn bị lâu hơn dự kiến · ~${extra} phút`, 'Điểm lấy đang quá tải đơn giờ cao điểm, tài xế vẫn đang chờ tại quầy', 'warn'); setEv(`⏳ Lượng đơn tại quầy tăng đột biến (+6 phút chờ). Tài xế ${D2[0]} đang giục giúp bạn.`, 'warn'); } },
      { d: P.tDeliver, f: p => { if ($('#cx')) $('#cx').remove(); const moveP = Math.min(P.stopRatio, p * P.stopRatio * 1.08); const q = along(r2, moveP); dm.setLatLng(q); if (follow) m.panTo(q, { animate: false }); if (p < 0.78) { const rem = Math.max(2, Math.ceil((1 - p) * 11)); setStage(4, `Tài xế đang giao đến bạn · ~${rem} phút`, `${D2[0]} đang chạy dọc lộ trình về phía ${o.dstName || o.pos.addr}`); setEv(`📦 Đã lên xe! Tài xế còn cách điểm giao khoảng ${(rdist(r) * (1 - moveP)).toFixed(2)} km.`); } else { setStage(4, 'Tài xế đang dừng gần điểm giao · ~4 phút', 'Tín hiệu di chuyển của tài xế đang chậm lại cách bạn ~150m', 'warn'); setEv('⚠️ Tài xế đang dừng lâu bất thường ở khúc cua gần bạn, hệ thống đang kiểm tra...', 'warn'); } } },
      { d: P.tFinalIncident, f: p => { const q = along(r2, P.stopRatio); dm.setLatLng(q); poly2.setStyle({ color: '#ef4b3f', dashArray: '6 8' }); if (p < 0.55) { setStage(4, 'Gián đoạn tín hiệu từ tài xế…', `Đang liên hệ khẩn với tài xế ${D2[0]} để xác minh tình trạng đơn`, 'err'); setEv(`🚨 Phát hiện sự cố trên lộ trình giao hàng cách bạn ~150m. Tổng đài Grab đang kết nối với ${D2[0]}...`, 'err'); } else { setStage(4, 'Sự cố giao hàng ngoài ý muốn…', `${inc[0]} — đang xử lý hoàn tiền tự động`, 'err'); setEv(`🚨 ${inc[1]}`, 'err'); } } }
    ];

    // Tính tiến độ theo thời gian thực (Date.now() - o.t) để dù người dùng chuyển tab rồi quay lại vẫn đúng số phút đã đợi (5-10 phút)
    const tick = () => {
      if (!$('#trkmap')) return;
      let elapsed = Date.now() - o.t;
      let acc = 0, found = false;
      for (let i = 0; i < ph.length; i++) {
        if (elapsed < acc + ph[i].d) {
          const p = Math.max(0, Math.min(1, (elapsed - acc) / ph[i].d));
          ph[i].f(p);
          found = true;
          break;
        }
        acc += ph[i].d;
      }
      if (!found) return triggerAutoCancel();
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
      return `<div class="ord" data-id="${o.id}"><div class="h">${im('r' + r.aid + '/cover')}<div><b>${o.title || r.name}</b><small>${new Date(o.t).toLocaleString('vi-VN')}</small><small>${o.items.map(i => i[1] + 'x ' + i[0]).join(', ')}</small>${o.cancelReason ? `<small style="color:#b91c1c;font-weight:600">Lý do: ${o.cancelReason}</small>` : ''}</div><span class="st ${stt[1]}">${stt[0]}</span></div>
      <div style="display:flex;justify-content:space-between;margin-top:10px;font-size:13.5px"><span style="color:#666">Tổng cộng</span><b>${fmt(o.total)}</b></div>${o.status !== 'active' && (!o.svcType || o.svcType === 'food' || o.svcType === 'mart') ? `<div class="ft"><button class="btn o" data-re="${o.id}">Đặt lại đơn này</button></div>` : ''}</div>`;
    }).join('')
      : `<div class="empty"><div class="big">🧾</div><h4>${sub === 'now' ? 'Chưa có hoạt động nào đang diễn ra' : 'Chưa có lịch sử hoạt động'}</h4>Đặt đồ ăn, đi chợ hoặc gọi xe ngay trên trang chủ!</div>`);
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
  screen.innerHTML = `<div class="prof"><div class="avatar">${state.user.name[0].toUpperCase()}</div><div><b style="font-size:19px">${state.user.name}</b><br><span style="opacity:.9;font-size:13px">${state.user.phone} · Thành viên Vàng</span></div></div>
  <div class="wallet" style="margin-top:-1px;border-radius:0"><div id="gopay" style="cursor:pointer">Ví GrabPay<b>${fmt(state.wallet)}</b></div><div id="tp" style="color:var(--g);font-weight:700;display:flex;align-items:center;justify-content:center;cursor:pointer">+ Nạp 100.000đ</div></div>
  <div class="box" style="margin-top:10px">
    <h4>💾 Dữ liệu GPS & Đơn hàng đã lưu trên máy</h4>
    <div style="font-size:12.5px;color:#444;line-height:1.6">
      <div>• Tọa độ GPS hiện tại: <b>${state.pos.lat.toFixed(5)}, ${state.pos.lng.toFixed(5)}</b></div>
      <div>• Địa chỉ: <b>${state.pos.addr}</b></div>
      <div>• Tổng đơn & chuyến đã lưu: <b>${state.orders.length} đơn</b> (${state.orders.filter(x => x.status === 'active').length} đang xử lý)</div>
      <div>• Giỏ hàng đang lưu: <b>${state.cart ? Object.values(state.cart.items).reduce((a, b) => a + b.q, 0) + ' món' : 'Trống'}</b></div>
    </div>
    ${state.posHistory.length > 1 ? `<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--line);font-size:12px;color:#666"><b>Lịch sử vị trí GPS gần đây:</b>${state.posHistory.map((p, idx) => `<div style="margin-top:3px;cursor:pointer;color:${idx === 0 ? '#00863c' : '#555'}" data-hp="${idx}">📍 ${p.addr} (${p.lat.toFixed(4)}, ${p.lng.toFixed(4)})</div>`).join('')}</div>` : ''}
  </div>
  <div class="menu" style="margin-top:10px">
    <div class="m" id="e1"><span>✏️ Chỉnh sửa thông tin cá nhân</span><span>›</span></div>
    <div class="m" id="e2"><span>📍 Đổi vị trí GPS trên bản đồ</span><span>›</span></div>
    <div class="m" id="egps"><span>📡 Bật lại màn hình quét GPS từ đầu</span><span>›</span></div>
    <div class="m" id="edeal"><span>🎟️ Kho ưu đãi & GrabRewards</span><span style="color:#ef4b3f;font-weight:700">4 mã</span></div>
    <div class="m" id="e3"><span>🗑️ Xoá lịch sử đơn hàng</span><span>›</span></div>
  </div>`;
  $('#e1').onclick = () => { const n = prompt('Tên của bạn:', state.user.name); if (n) { state.user.name = n; const p = prompt('Số điện thoại:', state.user.phone); if (p) state.user.phone = p; save(); viewAccount(); } };
  $('#e2').onclick = () => go(viewPickLoc, () => go(viewAccount));
  $('#egps').onclick = () => { state.gpsDone = false; save(); checkMandatoryGps(); };
  $('#edeal').onclick = () => go(viewDeals);
  $('#gopay').onclick = () => { state.tab = 'pay'; go(viewPay); };
  $('#tp').onclick = () => { state.wallet += 100000; save(); toast('Đã nạp 100.000đ vào GrabPay'); viewAccount(); };
  $('#e3').onclick = () => { if (confirm('Xoá toàn bộ lịch sử hoạt động?')) { state.orders = []; save(); toast('Đã xoá lịch sử'); viewAccount(); } };
  $$('[data-hp]').forEach(el => el.onclick = () => {
    const p = state.posHistory[+el.dataset.hp];
    if (p) { recordPos(p); toast('Đã chuyển về vị trí GPS đã lưu'); viewAccount(); }
  });
}

syncActiveOrders();
viewHome();
setTimeout(() => {
  const s = $('#splash');
  if (s) { s.style.opacity = 0; setTimeout(() => s.remove(), 400); }
  checkMandatoryGps();
}, 750);
