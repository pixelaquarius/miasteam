<div align="center">

# L.ASY Studio

**Không gian công cụ nội bộ cho sáng tạo nội dung, xử lý hình ảnh & đánh giá hiệu suất KOL**

[![Deploy L.ASY Studio to GitHub Pages](https://github.com/pixelaquarius/miasteam/actions/workflows/pages.yml/badge.svg)](https://github.com/pixelaquarius/miasteam/actions/workflows/pages.yml)
[![Static Site](https://img.shields.io/badge/Architecture-100%25%20Client--Side-B93829?style=flat-square)](https://pages.github.com/)
[![Tết Đinh Mùi](https://img.shields.io/badge/Nghỉ%20Tết%202027-04%2F02%2F2027-C58B2A?style=flat-square)](./tetlasy/index.html)

</div>

---

## Tổng quan (Overview)

**L.ASY Studio** là bộ công cụ web tĩnh (100% HTML/CSS/JavaScript thuần phía client, không cần backend hay database) được thiết kế phục vụ vận hành và sáng tạo hằng ngày cho team, triển khai tự động qua **GitHub Pages**.

## Danh sách công cụ

| Công cụ | Đường dẫn | Mô tả |
| :--- | :--- | :--- |
| **Tết L.ASY 2027** | [`tetlasy/index.html`](./tetlasy/index.html) | Đếm ngược lịch nghỉ Tết Nhà nước Đinh Mùi (**04/02/2027 – 28 tháng Chạp**, nghỉ 7 ngày tới 10/02/2027), mô phỏng lắc ống xăm **3D Motion** với 24 kịch bản quẻ thực tế, **Cày Cuốc** và **Nghỉ Việc**. |
| **Ghép Ảnh Lưới** | [`ghepanh/index.html`](./ghepanh/index.html) | Ghép nhiều ảnh thành lưới vuông 3–6 cột bằng HTML5 Canvas, giữ nguyên tỷ lệ ảnh gốc (fit-in, không cắt góc), tùy chỉnh màu nền/khoảng cách và xuất ảnh chất lượng cao. |
| **KOL Performance Auditor** | [`checkkol/index.html`](./checkkol/index.html) | Phân tích dữ liệu Kalodata DOM/HTML, chấm điểm tương thích theo Short-Video / Livestream track, đối chiếu Top 20 Vietnam Beauty Brands, lưu lịch sử & so sánh Before/After. |

## Cấu trúc thư mục

```text
.
├── .github/
│   └── workflows/
│       └── pages.yml       # CI/CD tự động deploy lên GitHub Pages
├── checkkol/
│   └── index.html          # KOL Compatibility & Performance Auditor
├── ghepanh/
│   └── index.html          # Công cụ ghép ảnh lưới nguyên bản
├── tetlasy/
│   └── index.html          # Đếm ngược Tết Đinh Mùi 2027 & Bóc Quẻ
├── index.html              # Trang chủ L.ASY Studio Hub
└── README.md
```

## Chạy thử trên máy (Local Preview)

Vì toàn bộ dự án là static site thuần, bạn có thể mở trực tiếp `index.html` hoặc chạy một local server bất kỳ:

```bash
# Sử dụng Python 3
python3 -m http.server 8080

# Hoặc sử dụng Node.js
npx serve .
```

Sau đó truy cập `http://localhost:8080` trên trình duyệt.

## Triển khai (GitHub Pages Deployment)

Dự án tự động build và deploy lên **GitHub Pages** mỗi khi có commit được push lên nhánh `main` thông qua workflow [`.github/workflows/pages.yml`](./.github/workflows/pages.yml).

> **Lưu ý cấu hình lần đầu trên GitHub:** Vào **Settings → Pages → Build and deployment → Source** và chọn **GitHub Actions**.
