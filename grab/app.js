/* Grab (mô phỏng) – vận hành đặt đồ & định vị GPS trực tiếp */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmt = n => n.toLocaleString('vi-VN') + 'đ';
const store = { get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }, set: (k, v) => localStorage.setItem(k, JSON.stringify(v)) };

/* ================= DỮ LIỆU THƯƠNG HIỆU & CHI NHÁNH ================= */
const CATS = [
  ['all', 'Tất cả', 'r1/cover'],
  ['rice', 'Cơm', 'r1/cover'],
  ['noodle', 'Bún · Phở', 'r6/cover'],
  ['fast', 'Gà · Burger', 'r3/cover'],
  ['drink', 'Trà sữa', 'r4/cover'],
  ['cafe', 'Cà phê', 'r5/cover'],
  ['snack', 'Ăn vặt', 'r7/cover'],
  ['cake', 'Bánh ngọt', 'r8/cover']
];

// 20 thương hiệu lớn + quán đặc trưng, mỗi thương hiệu có nhiều chi nhánh phân bổ quanh GPS người dùng
const BRANDS = [
  { b: 1, brand: 'Cơm Tấm Phúc Lộc Thọ', cat: 'rice', tags: 'Cơm tấm · Món Việt', c: '#d96b1f', ini: 'PLT', aid: 1, hours: '06:00 - 22:00',
    menu: [['Cơm sườn bì chả đặc biệt', 55000, 'Sườn nướng than hoa, bì thính, chả trứng hấp, mỡ hành', '🍚'], ['Cơm sườn nướng trứng ốp la', 49000, 'Sườn cốt lết nướng mật ong, trứng ốp la lòng đào', '🍳'], ['Cơm đùi gà nướng ngũ vị', 52000, 'Đùi gà góc tư nướng da giòn, đồ chua', '🍗'], ['Canh khổ qua nhồi thịt', 18000, 'Khổ qua hầm thịt bằm, nước dùng ngọt thanh', '🥣'], ['Trà tắc xí muội', 15000, 'Ly lớn 500ml mát lạnh', '🧊']],
    branches: [['CN Nguyễn Trãi', .28, .22, 4.8, '3.2k+', 14, 'Giảm 20k', '236 Nguyễn Trãi'], ['CN Cách Mạng Tháng 8', -.65, .48, 4.7, '1.9k+', 18, 'Freeship', '142 Cách Mạng Tháng 8'], ['CN Điện Biên Phủ', 1.15, -.4, 4.8, '2.4k+', 22, 'Giảm 15k', '389 Điện Biên Phủ'], ['CN Phan Xích Long', -.35, 1.35, 4.6, '950+', 25, '', '188 Phan Xích Long']] },

  { b: 2, brand: 'Cơm Tấm Cali', cat: 'rice', tags: 'Cơm tấm · Chuỗi lớn', c: '#b85d19', ini: 'CL', aid: 1, hours: '06:30 - 22:30',
    menu: [['Cơm tấm sườn non nướng', 68000, 'Sườn non ướp sốt Cali đặc trưng, dưa góp', '🍖'], ['Cơm tấm ba rọi nướng', 58000, 'Ba rọi rút sườn nướng cháy cạnh, trứng kho', '🥓'], ['Cơm gà nướng sả ớt', 59000, 'Gà phi lê nướng sả, kim chi cải thảo', '🍗'], ['Canh rong biển thịt bằm', 20000, 'Rong biển Hàn Quốc nấu thịt nạc', '🥣'], ['Sâm bổ lượng', 28000, 'Nhãn nhục, hạt sen, táo đỏ, phổ tai', '🍧']],
    branches: [['CN Lê Lợi', -.32, -.28, 4.7, '2.1k+', 15, 'Giảm 25k', '82 Lê Lợi'], ['CN Võ Văn Tần', .72, .55, 4.6, '1.4k+', 19, 'Freeship', '215 Võ Văn Tần'], ['CN Nguyễn Thị Minh Khai', -.95, -.52, 4.7, '1.1k+', 23, 'Giảm 15%', '310 Nguyễn Thị Minh Khai']] },

  { b: 3, brand: 'Cơm Gà Hải Nam Singapore', cat: 'rice', tags: 'Cơm gà · Món Á', c: '#d9a400', ini: 'HN', aid: 9, hours: '09:30 - 21:30',
    menu: [['Cơm gà xối mỡ da giòn', 55000, 'Đùi gà xối mỡ giòn rụm, cơm nấu nước luộc gà thơm béo', '🍗'], ['Cơm gà Hải Nam luộc', 58000, 'Gà ta luộc mềm mọng, sốt gừng hành & tương ớt Singapore', '🍚'], ['Gỏi gà xé phay bắp cải', 45000, 'Gà xé, bắp cải tím, rau răm, hành phi, đậu phộng', '🥗']],
    branches: [['CN Trần Hưng Đạo', .48, -.35, 4.8, '1.8k+', 16, 'Giảm 20k', '55 Trần Hưng Đạo'], ['CN Hai Bà Trưng', -.85, .62, 4.7, '1.2k+', 21, 'Freeship', '174 Hai Bà Trưng'], ['CN Lê Văn Sỹ', 1.4, .85, 4.6, '880+', 27, '', '295 Lê Văn Sỹ']] },

  { b: 4, brand: 'Phở Hòa Pasteur', cat: 'noodle', tags: 'Phở bò · Gia truyền', c: '#b3261e', ini: 'PH', aid: 2, hours: '05:30 - 22:00',
    menu: [['Phở bò tái lăn', 65000, 'Bò tái mềm, bánh phở tươi, nước dùng ninh xương bò 14 giờ', '🍜'], ['Phở tái nạm bò viên', 68000, 'Thịt nạm giòn, bò viên gân, hành hoa', '🍲'], ['Phở đặc biệt thập cẩm', 79000, 'Tái, nạm, gầu, gân, sách, bò viên', '🥩'], ['Quẩy giòn Hà Nội', 10000, 'Quẩy nóng giòn (dĩa 3 cái)', '🥖'], ['Trà chanh giã tay', 18000, 'Chanh tươi Quảng Đông thơm mát', '🍋']],
    branches: [['CN Pasteur', -.24, .38, 4.9, '4.5k+', 14, 'Freeship', '260C Pasteur'], ['CN Lý Tự Trọng', .58, -.42, 4.7, '1.6k+', 18, 'Giảm 20k', '45 Lý Tự Trọng'], ['CN Nguyễn Đình Chiểu', -1.05, .3, 4.8, '2.0k+', 22, '', '192 Nguyễn Đình Chiểu']] },

  { b: 5, brand: 'Phở Thìn Bờ Hồ 13 Lò Đúc', cat: 'noodle', tags: 'Phở Bắc · Tái lăn', c: '#8f1d14', ini: 'PT', aid: 2, hours: '06:00 - 21:30',
    menu: [['Phở tái lăn truyền thống', 70000, 'Thịt bò xào tỏi gừng lửa lớn, ngập hành lá chuẩn vị Lò Đúc', '🍜'], ['Phở tái gầu giòn', 72000, 'Gầu bò vàng giòn béo ngậy, nước dùng đậm đà', '🍲'], ['Phở bò sốt vang', 75000, 'Bò hầm rượu vang đỏ và ngũ vị hương mềm rục', '🥩'], ['Quẩy nóng giòn', 10000, 'Phần 3 chiếc', '🥖'], ['Trà đá thảo mộc', 10000, 'Trà sâm dứa mát lành', '🧊']],
    branches: [['CN Quận 1', .42, .52, 4.8, '2.3k+', 17, 'Giảm 15k', '110 Lê Thánh Tôn'], ['CN Thảo Điền', 1.65, -.75, 4.7, '1.1k+', 28, 'Freeship', '34 Xuân Thủy'], ['CN Bình Thạnh', -.78, 1.15, 4.6, '920+', 24, 'Giảm 10%', '68 Nguyễn Gia Trí']] },

  { b: 6, brand: 'Bún Chả Hương Liên', cat: 'noodle', tags: 'Bún chả · Đặc sản Hà Nội', c: '#2e7d32', ini: 'HL', aid: 6, hours: '09:30 - 21:00',
    menu: [['Bún chả Hà Nội truyền thống', 55000, 'Chả viên, chả miếng nướng than hoa, đu đủ xanh, rau sống', '🍲'], ['Combo Bún chả Obama', 75000, 'Phần bún chả đầy đủ + 1 nem hải sản + 1 trà sấu', '🥩'], ['Nem cua bể rán giòn (3 cái)', 38000, 'Nem vuông nhân thịt cua, miến, mộc nhĩ', '🥟'], ['Nước sấu ngâm đường phèn', 18000, 'Sấu giòn chua ngọt giải nhiệt', '🧃']],
    branches: [['CN Hai Bà Trưng', -.42, -.18, 4.8, '2.7k+', 16, 'Giảm 15k', '66 Hai Bà Trưng'], ['CN Phan Đình Phùng', .92, .68, 4.7, '1.3k+', 21, 'Freeship', '145 Phan Đình Phùng'], ['CN Hoàng Hoa Thám', -1.3, -.85, 4.6, '790+', 26, 'Giảm 10%', '22 Hoàng Hoa Thám']] },

  { b: 7, brand: 'Bún Bò Huế Đông Ba', cat: 'noodle', tags: 'Bún bò · Chuẩn vị Huế', c: '#c44536', ini: 'ĐB', aid: 6, hours: '06:00 - 21:30',
    menu: [['Bún bò tái nạm chả cua', 58000, 'Nước lèo mắm ruốc sả thơm nồng, chả cua Huế tươi', '🍲'], ['Bún bò đặc biệt giò heo', 69000, 'Giò heo rút xương, bắp bò, gân bò, chả Huế', '🥩'], ['Chả cây Huế (4 cây)', 28000, 'Chả heo gói lá chuối thơm tiêu hạt', '🥟'], ['Nước sâm bông cúc', 15000, 'Nấu nhà thanh mát', '🧃']],
    branches: [['CN Nguyễn Thị Diệu', .22, -.55, 4.7, '1.9k+', 15, 'Freeship', '38 Nguyễn Thị Diệu'], ['CN Sư Vạn Hạnh', -.88, -.68, 4.8, '2.2k+', 20, 'Giảm 20k', '412 Sư Vạn Hạnh'], ['CN Bạch Đằng', 1.25, .42, 4.6, '980+', 24, '', '156 Bạch Đằng']] },

  { b: 8, brand: 'KFC Vietnam', cat: 'fast', tags: 'Gà rán · Burger · Quốc tế', c: '#d62828', ini: 'KFC', aid: 3, hours: '09:00 - 22:30',
    menu: [['Combo Gà Rán Giòn Cay (2 miếng)', 79000, '2 miếng gà giòn cay + 1 khoai tây chiên vừa + 1 Pepsi', '🍗'], ['Burger Zinger Gà Giòn', 54000, 'Phi lê đùi gà giòn cay, xà lách, sốt mayo', '🥪'], ['Khoai tây chiên lắc phô mai', 32000, 'Khoai chiên vàng giòn rắc bột phô mai', '🍟'], ['Gà rán truyền thống (3 miếng)', 99000, 'Công thức 11 loại thảo mộc & gia vị', '🍗'], ['Pepsi mát lạnh', 17000, 'Ly lớn 500ml', '🥤']],
    branches: [['CN Nguyễn Thái Học', .35, -.15, 4.7, '5.1k+', 16, 'Giảm 30k', '140 Nguyễn Thái Học'], ['CN Diamond Lê Duẩn', -.48, .55, 4.8, '3.8k+', 18, 'Freeship', '34 Lê Duẩn'], ['CN NowZone Nguyễn Văn Cừ', -1.1, -.45, 4.6, '2.9k+', 23, 'Mua 1 tặng 1', '235 Nguyễn Văn Cừ'], ['CN Cao Thắng', .75, -.88, 4.7, '2.2k+', 21, 'Giảm 20k', '92 Cao Thắng']] },

  { b: 9, brand: 'Lotteria', cat: 'fast', tags: 'Gà sốt · Burger Hàn Quốc', c: '#e63946', ini: 'LT', aid: 3, hours: '08:30 - 22:30',
    menu: [['Burger Bulgogi Bò Teriyaki', 52000, 'Bò nướng sốt Bulgogi Hàn Quốc đậm đà', '🍔'], ['Burger Tôm Thượng Hạng', 54000, 'Nhân tôm tươi nguyên miếng chiên xù giòn', '🥪'], ['Khoai tây lắc vị hành', 35000, 'Đặc sản khoai lắc Lotteria kèm túi lắc', '🍟'], ['Gà sốt H&S đậu phộng (3 miếng)', 98000, 'Gà rán phủ sốt cay ngọt Hàn Quốc', '🍗'], ['7Up chanh tươi', 17000, 'Ly 500ml', '🥤']],
    branches: [['CN Đinh Tiên Hoàng', .62, .45, 4.6, '3.1k+', 17, 'Mua 1 tặng 1', '12 Đinh Tiên Hoàng'], ['CN Nguyễn Trãi Q5', -.92, -.75, 4.7, '2.5k+', 22, 'Freeship', '382 Nguyễn Trãi'], ['CN Cộng Hòa', -1.5, 1.05, 4.5, '1.7k+', 29, 'Giảm 25k', '108 Cộng Hòa']] },

  { b: 10, brand: 'Jollibee', cat: 'fast', tags: 'Gà Giòn Vui Vẻ · Mì Ý', c: '#c1121f', ini: 'JB', aid: 3, hours: '09:00 - 22:00',
    menu: [['Combo Gà Giòn Vui Vẻ + Mì Ý', 65000, '1 miếng gà giòn + 1 mì Ý sốt bò bằm + 1 nước ngọt', '🍗'], ['Burger Gà Giòn Sốt Cay', 45000, 'Gà phi lê chiên giòn, sốt cay ngọt', '🍔'], ['Khoai tây chiên lớn', 28000, 'Kèm tương cà chua ngọt', '🍟'], ['Gà Sốt Cay (3 miếng)', 95000, 'Gà giòn phủ sốt cay đậm vị', '🍗'], ['Mirinda Cam', 15000, 'Ly vừa', '🥤']],
    branches: [['CN Trần Hưng Đạo', -.28, -.62, 4.8, '4.2k+', 15, 'Giảm 20k', '355 Trần Hưng Đạo'], ['CN Phan Đăng Lưu', .88, 1.05, 4.7, '2.6k+', 23, 'Freeship', '114 Phan Đăng Lưu'], ['CN Ba Tháng Hai', -1.25, .25, 4.7, '3.0k+', 24, 'Giảm 15k', '210 Đường 3/2']] },

  { b: 11, brand: "McDonald's", cat: 'fast', tags: 'Burger Mỹ · Drive-thru', c: '#d90429', ini: 'McD', aid: 3, hours: '00:00 - 23:59',
    menu: [['Big Mac Burger 2 lớp bò', 79000, '2 lớp bò Úc 100%, phô mai cheddar, sốt Big Mac bí truyền', '🍔'], ['McChicken Burger gà giòn', 55000, 'Thịt gà xay chiên giòn, xà lách thái sợi', '🥪'], ['Khoai tây chiên Pháp (L)', 39000, 'Khoai tây cắt sợi chiên vàng chuẩn McDonald’s', '🍟'], ['Gà rán McCrispy (3 miếng)', 105000, 'Gà giòn rụm mọng nước bên trong', '🍗'], ['Coca-Cola Zero', 20000, 'Ly lớn', '🥤']],
    branches: [['CN Đa Kao Điện Biên Phủ', .55, .65, 4.8, '5.4k+', 17, 'Giảm 30k', '2-6 Bis Điện Biên Phủ'], ['CN Bến Thành', -.15, -.15, 4.7, '4.8k+', 12, 'Freeship', '2 Công Trường Quách Thị Trang'], ['CN Phú Mỹ Hưng', 1.55, -1.2, 4.8, '3.1k+', 28, 'Giảm 20k', '801 Nguyễn Văn Linh']] },

  { b: 12, brand: 'The Pizza Company', cat: 'fast', tags: 'Pizza · Mì Ý · Sườn nướng', c: '#00643b', ini: 'TPC', aid: 10, hours: '10:00 - 22:00',
    menu: [['Pizza Hải Sản Pesto Xanh (S)', 139000, 'Tôm, mực, thanh cua, sốt pesto húng tây & phô mai Mozzarella', '🍕'], ['Pizza Phô Mai Bốn Vị (S)', 119000, 'Mozzarella, Cheddar, Parmesan và Cream Cheese béo ngậy', '🧀'], ['Mì Ý Bò Bằm Sốt Cà Chua', 79000, 'Sốt Bolognese bò Úc bằm hầm cà chua tươi', '🍝']],
    branches: [['CN Nguyễn Thị Minh Khai', .38, .35, 4.7, '2.4k+', 22, 'Mua 1 tặng 1', '180 Nguyễn Thị Minh Khai'], ['CN Nguyễn Tri Phương', -.95, -.42, 4.6, '1.8k+', 25, 'Giảm 30k', '306 Nguyễn Tri Phương'], ['CN Phan Xích Long', .72, 1.25, 4.7, '1.5k+', 27, 'Freeship', '122 Phan Xích Long']] },

  { b: 13, brand: 'Pizza 4P’s', cat: 'fast', tags: 'Pizza thủ công · Phô mai tươi', c: '#264653', ini: '4Ps', aid: 10, hours: '10:00 - 22:30',
    menu: [['Pizza Hải Sản Sốt Kem Cà Chua', 185000, 'Tôm sú, mực tươi, phô mai Burrata nhà làm', '🍕'], ['Pizza 4 Cheese Mật Ong', 168000, '4 loại phô mai thủ công dùng kèm mật ong rừng', '🧀'], ['Mì Ý Cua Sốt Kem Cà Chua', 155000, 'Thịt cua tươi gỡ tay và sốt kem Ricotta', '🍝']],
    branches: [['CN Bến Thành', -.2, .22, 4.9, '6.2k+', 20, 'Giảm 30k', '8 Thủ Khoa Huân'], ['CN Hai Bà Trưng', .65, .75, 4.9, '4.7k+', 24, '', '151B Hai Bà Trưng'], ['CN Saigon Centre', .18, -.32, 4.8, '3.9k+', 18, 'Freeship', '65 Lê Lợi']] },

  { b: 14, brand: 'Phúc Long Coffee & Tea', cat: 'drink', tags: 'Trà đậm vị · Cà phê', c: '#00693e', ini: 'PL', aid: 4, hours: '07:00 - 22:30',
    menu: [['Trà Sữa Phúc Long Trân Châu', 50000, 'Trà ô long ủ đậm vị pha sữa thơm béo, trân châu dai', '🧋'], ['Hồng Trà Đác Cam (Size L)', 65000, 'Hồng trà truyền thống kết hợp hạt đác rim dứa & cam tươi', '🍵'], ['Matcha Đá Xay Kem Tươi', 60000, 'Bột trà xanh Nhật Bản xay cùng sữa và lớp whipping cream', '🥤'], ['Trà Đào Đá Xay Phúc Long', 58000, 'Trà đào trứ danh kèm miếng đào giòn', '🍑']],
    branches: [['CN Mạc Thị Bưởi', .25, -.2, 4.9, '7.5k+', 12, 'Giảm 20k', '63 Mạc Thị Bưởi'], ['CN Ngô Đức Kế', -.38, -.32, 4.8, '5.9k+', 14, 'Freeship', '42 Ngô Đức Kế'], ['CN Cộng Hòa', -1.45, .8, 4.7, '3.4k+', 26, 'Giảm 15k', '18 Cộng Hòa'], ['CN Phan Xích Long', .58, 1.15, 4.8, '4.1k+', 21, 'Mua 1 tặng 1', '212 Phan Xích Long']] },

  { b: 15, brand: 'Koi Thé Vietnam', cat: 'drink', tags: 'Trà sữa Hoàng Kim · Macchiato', c: '#b07d2b', ini: 'KOI', aid: 4, hours: '09:00 - 22:30',
    menu: [['Trà Sữa Trân Châu Hoàng Kim', 56000, 'Trân châu sợi vàng óng dẻo thơm độc quyền của KOI', '🧋'], ['Hồng Trà Macchiato (M)', 49000, 'Lớp kem sữa sánh mịn ngọt dịu bên trên hồng trà Assam', '🍵'], ['Matcha Latte Macchiato', 59000, 'Matcha Uji Nhật Bản hòa quyện kem Macchiato', '🥤'], ['Lục Trà Đào Hoàng Kim', 54000, 'Lục trà lài thanh mát kèm trân châu hoàng kim', '🍑']],
    branches: [['CN Ngô Đức Kế', .3, -.28, 4.9, '5.2k+', 13, 'Giảm 15k', '76 Ngô Đức Kế'], ['CN Pasteur', -.45, .48, 4.8, '3.7k+', 16, 'Freeship', '238 Pasteur'], ['CN Cao Thắng', -.82, -.55, 4.8, '2.9k+', 20, '', '102 Cao Thắng']] },

  { b: 16, brand: 'Gong Cha', cat: 'drink', tags: 'Trà sữa Đài Loan · Kem sữa', c: '#a4161a', ini: 'GC', aid: 4, hours: '08:30 - 22:00',
    menu: [['Trà Sữa Trân Châu Đen', 47000, 'Hồng trà sữa Đài Loan chuẩn vị kèm trân châu đen', '🧋'], ['Trà Alisan Kem Sữa', 51000, 'Trà núi cao Alisan phủ lớp milk foam mặn béo đặc trưng', '🍵'], ['Matcha Đá Xay Đậu Đỏ', 58000, 'Matcha đá xay kết hợp đậu đỏ hầm mềm', '🥤'], ['Trà Đào Cam Sả Gong Cha', 52000, 'Trà đen ủ lạnh, đào vàng và cam tươi', '🍑']],
    branches: [['CN Hồ Tùng Mậu', .18, -.38, 4.8, '4.0k+', 13, 'Mua 1 tặng 1', '83 Hồ Tùng Mậu'], ['CN Nguyễn Đình Chiểu', -.68, .25, 4.7, '2.6k+', 18, 'Freeship', '160 Nguyễn Đình Chiểu'], ['CN Phan Văn Trị', 1.35, 1.1, 4.7, '1.8k+', 26, 'Giảm 20k', '320 Phan Văn Trị']] },

  { b: 17, brand: 'Highlands Coffee', cat: 'cafe', tags: 'Phin Sữa Đá · Trà Sen Vàng', c: '#9e2a2b', ini: 'HC', aid: 5, hours: '06:30 - 23:00',
    menu: [['Phin Sữa Đá Đậm Đà', 35000, 'Cà phê Robusta rang xay pha phin truyền thống Việt Nam', '☕'], ['Bạc Xỉu Đá Highlands', 35000, 'Sữa đặc béo ngậy hòa chút cà phê phin thơm nồng', '🥛'], ['Freeze Trà Xanh / Cappuccino', 55000, 'Đá xay mát lạnh kèm thạch và kem tươi', '☕'], ['Bánh Mì Que / Croissant Bơ', 25000, 'Nướng nóng giòn tại quầy', '🥐']],
    branches: [['CN Nhà Thờ Đức Bà', .15, .32, 4.8, '8.1k+', 11, 'Giảm 15k', '1 Công Xã Paris'], ['CN Hàm Nghi', .35, -.45, 4.7, '5.4k+', 14, 'Freeship', '96 Hàm Nghi'], ['CN Điện Biên Phủ', -.75, .72, 4.8, '4.3k+', 19, 'Mua 1 tặng 1', '245 Điện Biên Phủ'], ['CN Nguyễn Văn Trỗi', -1.2, 1.2, 4.7, '3.0k+', 25, 'Giảm 20k', '115 Nguyễn Văn Trỗi']] },

  { b: 18, brand: 'The Coffee House', cat: 'cafe', tags: 'Cà phê · CloudFee · Trà trái cây', c: '#d97706', ini: 'TCH', aid: 5, hours: '07:00 - 22:30',
    menu: [['Cà Phê Sữa Đá Sài Gòn', 39000, '100% hạt cà phê Cầu Đất & Đắk Lắk đậm vị', '☕'], ['CloudFee Hạnh Nhân Nướng', 49000, 'Bạc xỉu kem bọt mịn phủ hạnh nhân lát nướng', '🥛'], ['Cappuccino Nóng / Đá', 55000, 'Espresso Arabica Cầu Đất và sữa tươi đánh bọt', '☕'], ['Croissant Bơ Pháp Trứng Muối', 39000, 'Bánh sừng bò ngàn lớp nhân sốt trứng muối tan chảy', '🥐']],
    branches: [['CN Võ Văn Tần', -.3, .25, 4.8, '6.0k+', 13, 'Giảm 20k', '86 Võ Văn Tần'], ['CN Hai Bà Trưng', .52, .48, 4.7, '4.2k+', 16, 'Freeship', '141 Hai Bà Trưng'], ['CN Cách Mạng Tháng 8', -.95, -.25, 4.8, '3.5k+', 21, 'Giảm 15%', '315 Cách Mạng Tháng 8'], ['CN Sư Vạn Hạnh', -1.35, -.82, 4.7, '2.7k+', 26, '', '520 Sư Vạn Hạnh']] },

  { b: 19, brand: 'Ăn Vặt Cô Tư Sài Gòn', cat: 'snack', tags: 'Ăn vặt · Bánh tráng · Xiên que', c: '#e91e8c', ini: 'CT', aid: 7, hours: '13:00 - 22:30',
    menu: [['Bánh tráng trộn thập cẩm đặc biệt', 28000, 'Khô bò đen, khô mực, trứng cút, xoài bào, sốt bò sa tế', '🥗'], ['Combo Xiên que chiên giòn (8 xiên)', 45000, 'Hồ lô, phô mai que, xúc xích Đức, tôm surimi', '🍢'], ['Cá viên chiên nước mắm tỏi ớt', 35000, 'Cá viên, bò viên xóc mắm đường kẹo kèm đậu bắp', '🍡'], ['Bắp xào bơ tép hành phi', 25000, 'Bắp nếp dẻo xào bơ Pháp và ruốc sấy giòn', '🌽']],
    branches: [['CN Võ Văn Tần', .45, .28, 4.6, '2.1k+', 15, 'Freeship', '101 Võ Văn Tần'], ['CN Hồ Thị Kỷ', -.72, -.58, 4.7, '3.3k+', 19, 'Giảm 15k', '52 Hồ Thị Kỷ'], ['CN Vạn Kiếp', .85, .95, 4.6, '1.8k+', 23, '', '190 Vạn Kiếp']] },

  { b: 20, brand: 'Tous Les Jours Bakery', cat: 'cake', tags: 'Bánh ngọt · Bánh kem Hàn Quốc', c: '#1b4332', ini: 'TLJ', aid: 8, hours: '07:00 - 22:00',
    menu: [['Tiramisu Mascarpone Ý', 55000, 'Cốt bánh thấm cà phê Espresso và kem phô mai Mascarpone', '🍰'], ['Hộp Bánh Su Kem Sữa Tươi (4 cái)', 42000, 'Vỏ su mềm dai ngập nhân kem vani mát lạnh', '🧁'], ['Cookie Socola Hạt Óc Chó', 32000, 'Bánh quy bơ Pháp giòn xốp nhiều chip socola Bỉ', '🍪'], ['Bông Lan Trứng Muối Chà Bông', 58000, 'Bánh bông lan mềm phủ sốt phô mai và trứng muối', '🍞']],
    branches: [['CN Hai Bà Trưng', .28, .42, 4.8, '3.6k+', 15, 'Giảm 20k', '180 Hai Bà Trưng'], ['CN Nguyễn Thị Minh Khai', -.58, -.35, 4.8, '2.4k+', 18, 'Freeship', '59 Nguyễn Thị Minh Khai'], ['CN Lê Văn Sỹ', -.98, .88, 4.7, '1.9k+', 23, 'Giảm 12k', '302 Lê Văn Sỹ']] }
];

// Trải phẳng toàn bộ chi nhánh thành danh sách quán R (64 chi nhánh)
const R = [];
let _rid = 1;
BRANDS.forEach(br => {
  br.branches.forEach((bn, idx) => {
    R.push({
      id: _rid++,
      bid: br.b,
      brand: br.brand,
      branch: bn[0],
      name: `${br.brand} - ${bn[0]}`,
      cat: br.cat,
      tags: br.tags,
      c: br.c,
      ini: br.ini,
      aid: br.aid,
      dx: bn[1],
      dy: bn[2],
      rate: bn[3],
      rv: bn[4],
      time: bn[5],
      promo: bn[6],
      addr: bn[7],
      hours: br.hours,
      branchCount: br.branches.length,
      branchIdx: idx,
      menu: br.menu
    });
  });
});

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
const logo = r => `<div style="width:100%;height:100%;background:${r.c};color:#fff;font-weight:800;display:flex;align-items:center;justify-content:center;font-size:13px">${r.ini}${im('r' + r.aid + '/logo')}</div>`;

/* ================= STATE ================= */
const state = {
  user: store.get('user', { name: 'Khách', phone: '0900 000 000' }),
  pos: store.get('pos', { lat: 10.7725, lng: 106.6980, addr: 'Chợ Bến Thành, Quận 1' }),
  gpsDone: store.get('gpsDone', false),
  wallet: store.get('wallet', 500000),
  cat: 'all', q: '', chip: 'all', brandFilter: null,
  cart: store.get('cart', null), orders: store.get('orders', []), tab: 'home', voucher: null
};
const save = () => { store.set('orders', state.orders); store.set('wallet', state.wallet); store.set('cart', state.cart); };
const km2lat = km => km / 110.57;
const km2lng = km => km / (111.32 * Math.cos(state.pos.lat * Math.PI / 180));
const rpos = r => [state.pos.lat + km2lat(r.dy), state.pos.lng + km2lng(r.dx)];
const distKm = (a, b) => { const d = Math.PI / 180, x = (b[1] - a[1]) * d * Math.cos((a[0] + b[0]) / 2 * d), y = (b[0] - a[0]) * d; return Math.sqrt(x * x + y * y) * 6371; };
const rdist = r => distKm([state.pos.lat, state.pos.lng], rpos(r)) * 1.28;
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
  L.control.attribution({ prefix: false, position: 'bottomleft' }).addAttribution('© OpenStreetMap').addTo(m);
  maps.push(m); setTimeout(() => { if (maps.includes(m)) m.invalidateSize(); }, 150); return m;
}
const mk = (html, size = 40, anchor) => L.divIcon({ html, className: '', iconSize: [size, size], iconAnchor: anchor || [size / 2, size / 2] });
const shopIcon = r => mk(`<div class="mk shop">${logo(r)}</div>`, 40);
const meIcon = () => mk('<div class="mk me"></div>', 20);
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
      <h2>Bật định vị để tìm quán quanh bạn</h2>
      <p>GrabFood cần xác nhận vị trí GPS của bạn để hiển thị hơn <b>${R.length} chi nhánh</b> quán ăn chính xác nhất trong bán kính 2km.</p>
      <div id="gmap"></div>
      <div class="gaddr" id="gad">📍 ${state.pos.addr}</div>
      <div style="font-size:11.5px;color:#777">Bấm "Lấy GPS hiện tại" hoặc kéo ghim đỏ trên bản đồ tới đúng chỗ bạn đang đứng</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px">
      <button class="btn" id="gbtn" style="justify-content:center;gap:8px">📡 Lấy vị trí GPS hiện tại</button>
      <button class="btn o" id="gok" style="justify-content:center">Xác nhận vị trí trên bản đồ (${R.length} quán)</button>
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
    toast(`Đã định vị: ${R.length} chi nhánh quanh bạn`);
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

// Chọn chi nhánh gần nhất của mỗi thương hiệu để hiển thị nổi bật
function nearestPerBrand() {
  return BRANDS.map(br => R.filter(x => x.bid === br.b).sort((a, b) => rdist(a) - rdist(b))[0]).sort((a, b) => rdist(a) - rdist(b));
}

function viewHome() {
  state.tab = 'home'; tabs();
  const nearAll = [...R].sort((a, b) => rdist(a) - rdist(b));
  const nearBrands = nearestPerBrand();
  const svc = [['Đồ ăn', '🍔', '#e5f7ec', 'food'], ['Siêu thị', '🛒', '#fff0e0', 'soon'], ['Giao hàng', '📦', '#e6f0ff', 'soon'], ['Xe máy', '🛵', '#e5f7ec', 'soon'], ['Ô tô', '🚗', '#e6f0ff', 'soon'], ['Ưu đãi', '🎟️', '#ffe9e7', 'deal'], ['GrabPay', '💳', '#eee9ff', 'pay'], ['Bản đồ', '🗺️', '#e8f5e9', 'map']];

  screen.innerHTML = `<div class="hhead"><div class="hrow"><div class="addr" id="chg"><small>📍 Giao đến (${R.length} quán quanh đây)</small><b>${state.pos.addr} ▾</b></div><div class="avatar">${state.user.name[0].toUpperCase()}</div></div></div>
  <div class="sbox pull" id="sb">${ICON.search}<span style="color:#666;font-size:14px">Tìm Phúc Long, KFC, Phở Hòa, Cơm tấm...</span></div>
  <div class="wallet"><div>GrabPay<b>${fmt(state.wallet)}</b></div><div>GrabRewards<b>1.250 điểm</b></div><div>Ưu đãi<b>3 mã</b></div></div>
  <div class="grid">${svc.map(s => `<button class="svc" data-s="${s[3]}"><i style="background:${s[2]}">${s[1]}</i>${s[0]}${s[3] === 'food' ? '<em>HOT</em>' : ''}</button>`).join('')}</div>

  <div class="sw" style="margin-top:10px;padding-bottom:14px">
    <div class="sec">Chuỗi thương hiệu nổi tiếng<a id="allb">64 chi nhánh</a></div>
    <div class="hs">${BRANDS.map(br => {
      const nb = R.filter(x => x.bid === br.b).sort((a, b) => rdist(a) - rdist(b))[0];
      return `<div class="bcard" data-bid="${br.b}"><div class="blg">${logo(nb)}</div><b>${br.brand}</b><small>${br.branches.length} chi nhánh</small></div>`;
    }).join('')}</div>
  </div>

  <div class="sw" style="margin-top:10px;padding-bottom:6px"><div class="sec" style="padding-top:16px">Ưu đãi độc quyền hôm nay</div>
  <div class="hs" id="pr">${[
    ['r1', 'Phúc Lộc Thọ\ngiảm 20K', 'Cho đơn cơm tấm từ 55K', nearBrands[0].id],
    ['r4', 'Phúc Long & KOI\nMua 1 tặng 1', 'Trà sữa đậm vị giao nhanh', R.find(x => x.bid === 14).id],
    ['r3', 'KFC · McDonald’s\nFreeship 0đ', 'Nhập mã FREESHIP ngay', R.find(x => x.bid === 8).id]
  ].map(p => `<div class="promo" data-id="${p[3]}">${im(p[0] + '/cover')}<div><h4>${p[1].replace('\n', '<br>')}</h4><p>${p[2]}</p><span>Đặt ngay</span></div></div>`).join('')}</div>
  <div class="dots" id="dots"><i class="on"></i><i></i><i></i></div></div>

  <div class="sw" style="margin-top:10px;padding-bottom:16px"><div class="sec">Chi nhánh gần bạn nhất<a id="all1">Xem tất cả (${R.length})</a></div>
  <div class="hs">${nearAll.slice(0, 10).map(r => `<div class="hcard" data-id="${r.id}"><div class="im" style="background:${r.c}33">${vcardTag(r)}${im('r' + r.aid + '/cover')}<span class="timechip">${eta(r)} phút · ${rdist(r).toFixed(1)} km</span></div><b>${r.name}</b><small><span class="star">★</span> ${r.rate} (${r.rv}) · ${r.branchCount} CN</small></div>`).join('')}</div></div>

  <div class="sec" style="padding-bottom:4px">Quán ngon nổi bật quanh đây</div>${nearBrands.slice(0, 10).map(rcard).join('')}
  <div style="padding:8px 16px 24px"><button class="btn o" id="all2" style="text-align:center">Khám phá toàn bộ ${R.length} quán & chi nhánh</button></div>`;

  $('#chg').onclick = () => go(viewPickLoc, () => go(viewHome));
  $('#sb').onclick = () => { state.brandFilter = null; go(viewFood, { focus: true }); };
  $('#all1').onclick = $('#all2').onclick = $('#allb').onclick = () => { state.brandFilter = null; go(viewFood, {}); };
  $$('.svc').forEach(b => b.onclick = () => ({
    food: () => { state.brandFilter = null; go(viewFood, {}); },
    deal: () => { state.brandFilter = null; state.chip = 'deal'; go(viewFood, {}); },
    map: () => go(viewMapAll),
    pay: () => toast('Ví GrabPay: ' + fmt(state.wallet)),
    soon: () => toast('Dịch vụ đang bảo trì khu vực này')
  }[b.dataset.s])());
  $$('.bcard').forEach(c => c.onclick = () => { state.brandFilter = +c.dataset.bid; state.cat = 'all'; state.chip = 'all'; go(viewFood, {}); });
  $$('.promo,.hcard,.rcard').forEach(c => c.onclick = () => go(viewRest, +c.dataset.id));
  const pr = $('#pr'); pr.onscroll = () => { const i = Math.round(pr.scrollLeft / (pr.firstChild.offsetWidth + 12)); $$('#dots i').forEach((d, k) => d.classList.toggle('on', k === i)); };
}

function rcard(r) {
  return `<div class="rcard" data-id="${r.id}"><div class="im" style="background:${r.c}33">${vcardTag(r)}<span class="partner">✓ Đối tác</span>${im('r' + r.aid + '/cover')}<span class="timechip">${eta(r)} phút · ${rdist(r).toFixed(1)} km</span></div>
  <div class="bd"><div class="lg">${logo(r)}</div><div class="nm">${r.name}</div><div class="br">📍 ${r.addr} · Hệ thống ${r.branchCount} chi nhánh</div>
  <div class="mt"><span><span class="star">★</span> <b style="color:#1f1f1f">${r.rate}</b> (${r.rv})</span><i class="dot"></i><span>${r.tags}</span></div>
  ${r.promo ? `<span class="vtag">🎟️ ${r.promo === 'Freeship' ? 'Miễn phí giao hàng' : r.promo === 'Mua 1 tặng 1' ? 'Mua 1 tặng 1 (tối đa 30k)' : r.promo + ' cho đơn hôm nay'}</span>` : ''}</div></div>`;
}

/* ================= TRANG ĐỒ ĂN ================= */
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
  if (state.chip === 'near') l = l.filter(r => rdist(r) <= 1.2);
  return l.sort((a, b) => rdist(a) - rdist(b));
}

function viewFood(o = {}) {
  state.tab = 'home'; tabs();
  const brObj = state.brandFilter ? BRANDS.find(x => x.b === state.brandFilter) : null;
  screen.innerHTML = `<div class="top"><button class="ib" id="bk">${ARROW}</button><div class="sbox" style="margin:0;flex:1;box-shadow:none;background:#f1f1f1;padding:9px 14px">${ICON.search}<input id="q" placeholder="Tìm trong ${R.length} chi nhánh & món ăn..." value="${state.q}"></div></div>
  <div class="cgrid">${CATS.map(c => `<button class="cat ${state.cat === c[0] ? 'on' : ''}" data-c="${c[0]}"><div class="ci">${im(c[2])}</div>${c[1]}</button>`).join('')}</div>
  <div class="chips">
    <button class="chip" id="mapb">🗺️ Bản đồ (${R.length})</button>
    ${brObj ? `<button class="chip on" id="clrb">🏪 ${brObj.brand} (${brObj.branches.length} CN) ✕</button>` : ''}
    ${[['all', 'Tất cả'], ['near', '📍 Gần tôi <1.2km'], ['deal', '🎟️ Ưu đãi'], ['fast', '⚡ Giao nhanh'], ['top', '★ 4.8+']].map(c => `<button class="chip ${state.chip === c[0] ? 'on' : ''}" data-ch="${c[0]}">${c[1]}</button>`).join('')}
  </div>
  <div id="list"></div><div style="height:20px"></div>`;
  const draw = () => {
    const l = filtered();
    $('#list').innerHTML = l.length ? `<div style="padding:10px 16px 2px;font-size:12.5px;color:#666;font-weight:600">Hiển thị ${l.length} chi nhánh gần ${state.pos.addr}</div>` + l.map(rcard).join('') : '<div class="empty"><div class="big">🔍</div><h4>Không tìm thấy chi nhánh</h4>Thử từ khoá hoặc bộ lọc khác nhé</div>';
    $$('.rcard').forEach(c => c.onclick = () => go(viewRest, +c.dataset.id));
  };
  draw();
  $('#q').oninput = e => { state.q = e.target.value; draw(); }; if (o.focus) $('#q').focus();
  $$('.cat').forEach(b => b.onclick = () => { state.cat = b.dataset.c; state.brandFilter = null; go(viewFood, {}); });
  $$('[data-ch]').forEach(b => b.onclick = () => { state.chip = b.dataset.ch; go(viewFood, {}); });
  if ($('#clrb')) $('#clrb').onclick = () => { state.brandFilter = null; go(viewFood, {}); };
  $('#mapb').onclick = () => go(viewMapAll);
  $('#bk').onclick = () => { state.q = ''; state.cat = 'all'; state.chip = 'all'; state.brandFilter = null; go(viewHome); };
}

function viewMapAll() {
  tabs(false);
  const list = filtered();
  screen.innerHTML = `<div id="trkmap"></div><button class="ib floatl" id="bk">${ARROW}</button><div style="position:absolute;top:14px;left:58px;right:14px;z-index:1000;background:#fff;border-radius:20px;padding:8px 14px;font-size:12.5px;font-weight:700;box-shadow:0 2px 8px #0003">🗺️ ${list.length} chi nhánh quanh ${state.pos.addr}</div>`;
  const m = newMap('trkmap', [state.pos.lat, state.pos.lng], 14);
  L.marker([state.pos.lat, state.pos.lng], { icon: homeIcon() }).addTo(m);
  list.forEach(r => {
    const mkr = L.marker(rpos(r), { icon: shopIcon(r) }).addTo(m);
    mkr.bindPopup(`<b>${r.name}</b><br><span style="font-size:12px;color:#666">${r.addr} · ${rdist(r).toFixed(1)} km</span><br><a href="#" id="pop_${r.id}" style="color:#00b14f;font-weight:700">Xem thực đơn →</a>`);
    mkr.on('popupopen', () => { const a = $('#pop_' + r.id); if (a) a.onclick = e => { e.preventDefault(); go(viewRest, r.id); }; });
  });
  $('#bk').onclick = () => go(viewFood, {});
}

function viewPickLoc(back) {
  tabs(false);
  screen.innerHTML = `<div class="top"><button class="ib" id="bk">${ARROW}</button><h2>Chọn điểm giao hàng</h2></div>
  <div id="mp" style="position:absolute;top:57px;left:0;right:0;bottom:170px"></div>
  <div style="position:absolute;left:0;right:0;bottom:0;background:#fff;padding:14px 16px;border-radius:20px 20px 0 0;box-shadow:0 -4px 16px #0002;z-index:1000;height:170px">
  <div id="ad" style="font-weight:700;font-size:14.5px;min-height:22px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">📍 ${state.pos.addr}</div><div style="font-size:12px;color:#777;margin:4px 0 12px">Chạm vào bản đồ hoặc kéo ghim để dời toàn bộ ${R.length} quán quanh bạn</div>
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

/* ================= QUÁN + CHI NHÁNH + GIỎ HÀNG ================= */
const cartInfo = () => { const c = state.cart; if (!c) return { n: 0, sum: 0 }; const r = byId(c.rid); let n = 0, sum = 0; for (const [i, l] of Object.entries(c.items)) { n += l.q; sum += r.menu[i][1] * l.q; } return { n, sum }; };

function viewRest(id) {
  tabs(false);
  const r = byId(id);
  const sibs = siblings(r);
  const half = Math.ceil(r.menu.length / 2);
  const secs = [['Món bán chạy nhất', r.menu.slice(0, half), 0], [r.cat === 'drink' || r.cat === 'cafe' ? 'Đồ uống & Topping' : 'Món ăn kèm & Giải khát', r.menu.slice(half), half]].filter(s => s[1].length);

  screen.innerHTML = `<div class="cover" style="background:${r.c}">${im('r' + r.aid + '/cover')}<button class="ib" id="bk" style="left:12px">${ARROW}</button><button class="ib" id="mp1" style="right:12px">🗺️</button></div>
  <div class="rinfo"><h1>${r.name}</h1><div class="mt"><span><span class="star">★</span> <b>${r.rate}</b> (${r.rv} đánh giá)</span><i class="dot"></i><span>${r.tags}</span></div>
  <div class="row2"><div>Khoảng cách<b>${rdist(r).toFixed(1)} km</b></div><div>Giao trong<b>${eta(r)}-${eta(r) + 8} phút</b></div><div>Phí giao<b>${r.promo === 'Freeship' ? 'Miễn phí' : fmt(feeOf(r))}</b></div></div>
  <div class="brpick" id="brs"><span>🏪 Đang chọn: <b>${r.branch}</b> (${r.addr})</span><b>Đổi (${sibs.length} CN) ▾</b></div></div>
  ${r.promo ? `<div class="sw hs" style="padding:4px 16px 14px;overflow-x:auto"><div class="vouch"><b>🎟️ ${r.promo}</b>Áp dụng tự động khi thanh toán · HSD hôm nay</div><div class="vouch"><b>🎟️ GRAB30</b>Giảm 30.000đ — nhập mã khi thanh toán</div></div>` : ''}
  <div class="mtabs" id="mt">${secs.map((s, k) => `<button data-k="${k}" class="${k ? '' : 'on'}">${s[0]}</button>`).join('')}</div><div id="menu"></div>
  <div class="box" style="margin-top:10px"><h4>Vị trí chi nhánh</h4><div style="font-size:13px;color:#555;margin-bottom:8px">📍 ${r.addr} · Mở cửa ${r.hours}</div><div id="mp" style="height:170px;border-radius:12px;overflow:hidden;position:relative;z-index:0"></div></div><div style="height:90px"></div><div class="cartbar" id="cb"></div>`;

  const m = newMap('mp', rpos(r), 15, { scrollWheelZoom: false });
  sibs.forEach(sb => L.marker(rpos(sb), { icon: shopIcon(sb), opacity: sb.id === r.id ? 1 : 0.6 }).addTo(m));
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
  $$('#mt button').forEach(b => b.onclick = () => { $$('#mt button').forEach(x => x.classList.toggle('on', x === b)); const t = $('#sec' + b.dataset.k); screen.scrollTo({ top: t.offsetTop - 50, behavior: 'smooth' }); });
  $('#bk').onclick = () => go(viewFood, {});
  $('#mp1').onclick = () => screen.scrollTo({ top: screen.scrollHeight, behavior: 'smooth' });
}

function branchSheet(cur, sibs) {
  const ov = document.createElement('div'); ov.className = 'ov';
  ov.innerHTML = `<div class="bs"><div class="bd">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><h3>Hệ thống ${cur.brand}</h3><button class="ib" id="x" style="box-shadow:none;background:#f1f1f1">${ICON.x}</button></div>
    ${sibs.map(sb => `<div class="opt ${sb.id === cur.id ? 'on' : ''}" data-id="${sb.id}">
      <div class="optc"><b>${sb.branch} ${sb.promo ? `<span style="color:#ef4b3f;font-size:11px">(${sb.promo})</span>` : ''}</b><small>📍 ${sb.addr} · ${rdist(sb).toFixed(1)} km · ~${eta(sb)} phút</small></div>
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
      // Tạo kế hoạch thời gian ngẫu nhiên & bất ngờ cho từng đơn (khoảng 75 - 115 giây)
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
    state.wallet += 30000; // Tặng bù 30k voucher hoàn tiền vào ví
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

    // Kịch bản nhiều bước có sự cố bất ngờ, chờ lâu và hủy ở chặng cuối
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
          // Tài xế đi tới ~88% quãng đường (sát điểm giao) rồi chững lại
          const moveP = Math.min(P.stopRatio, p * P.stopRatio * 1.08);
          const q = along(r2, moveP);
          dm.setLatLng(q);
          if (follow) m.panTo(q, { animate: false });
          if (p < 0.78) {
            const rem = Math.max(2, Math.ceil((1 - p) * 10));
            setStage(4, `Tài xế đang giao đến bạn · ~${rem} phút`, `${D2[0]} đã lấy món và đang chạy về phía ${o.pos.addr}`);
            setEv(`📦 Đồ ăn đã lên xe! Tài xế cách bạn khoảng ${(rdist(r) * (1 - moveP)).toFixed(2)} km.`);
          } else {
            // Đột ngột tăng lại thời gian khi gần tới nơi
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
      : `<div class="empty"><div class="big">🧾</div><h4>${sub === 'now' ? 'Chưa có đơn nào đang giao' : 'Chưa có lịch sử đơn hàng'}</h4>Chọn món từ ${R.length} chi nhánh quanh bạn ngay thôi!</div>`);
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
