# Blood Donation Support System – **Frontend**

> **Repository này chỉ chứa mã nguồn giao diện (React + TypeScript + Tailwind CSS) của dự án BDSS.**
> Mọi tài nguyên liên quan tới **Backend** và **Database** nằm ở repo khác.

---

## 📚 Mục lục

1. [Giới thiệu](#giới-thiệu)
2. [Công nghệ](#công-nghệ)
3. [Demo nhanh](#demo-nhanh)
4. [Cài đặt](#cài-đặt)
5. [Biến môi trường](#biến-môi-trường)
6. [Scripts NPM](#scripts-npm)
7. [Cấu trúc thư mục](#cấu-trúc-thư-mục)
8. [Đóng góp](#đóng-góp)
9. [Giấy phép](#giấy-phép)

---

## Giới thiệu

Frontend cung cấp giao diện web tương tác cho người hiến máu, nhân viên y tế và quản trị viên:

* Đặt lịch hiến máu, xem lịch sử
* Quản lý yêu cầu hiến máu khẩn cấp
* Thống kê nhóm máu & tương thích
* Đăng nhập + JWT
* Hiệu ứng **Framer Motion**, responsive **Tailwind**

## Công nghệ

| Danh mục      | Phiên bản/Thư viện |
| ------------- | ------------------ |
| React         | 18.x               |
| TypeScript    | 5.x                |
| Vite          | 5.x                |
| Tailwind CSS  | 3.x                |
| React Router  | 6.x                |
| Axios         | ^1.x               |
| Framer Motion | ^11.x              |


### 🎥 GIF Preview

<p align="center">
  <img src="docs/demo.gif" alt="Demo giao diện BDSS" width="800"/>
</p>

> **Tự tạo GIF demo:**
>
> 1. Dùng **ScreenToGif** (Windows) hoặc **Kap** (macOS) quay 15‑20 s thao tác nổi bật.
> 2. Lưu file thành `docs/demo.gif`.
> 3. `git add docs/demo.gif && git commit -m "chore: add demo gif" && git push`.

---

## Cài đặt

```bash
# 1. Clone repo
$ git clone https://github.com/<org>/bdss-frontend.git
$ cd bdss-frontend

# 2. Cài dependencies
$ npm install        # hoặc pnpm install / yarn

# 3. Chạy dev server
$ npm run dev        # mặc định http://localhost:5173
```

Để build bản production:

```bash
$ npm run build      # Kết quả ra thư mục dist/
```

Triển khai sản phẩm tĩnh (`dist/`) lên Vercel, Netlify hoặc Nginx tuỳ nhu cầu.

## Biến môi trường

Tạo file `.env` ở gốc dự án:

```env
# URL của backend API
VITE_API_URL=http://localhost:0000/api



## Scripts NPM

| Lệnh              | Mô tả                                     |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Khởi chạy Vite dev server (hot reload)    |
| `npm run build`   | Build production                          |
| `npm run preview` | Xem thử bản build                         |
| `npm run lint`    | Kiểm tra eslint                           |
| `npm test`        | Unit tests (Jest + React Testing Library) |

## Cấu trúc thư mục

```
bdss-frontend/
├── public/               # Asset tĩnh
├── src/
│   ├── components/       # Component chia sẻ
│   ├── hooks/            # Custom hooks
│   ├── pages/            # Trang chính (routing)
│   ├── services/         # Hàm gọi API (Axios instances)
│   ├── router/           # Cấu hình React Router v6
│   ├── assets/           # Hình ảnh, icon nội bộ
│   └── styles/           # File Tailwind & CSS tùy chỉnh
├── tests/                # (Tuỳ chọn) test e2e / unit
├── vite.config.ts        # Cấu hình Vite
└── tailwind.config.ts    # Cấu hình Tailwind CSS
```

## Đóng góp

1. Fork → tạo nhánh `feat/<tên>`
2. Commit theo [Conventional Commits](https://www.conventionalcommits.org/)
3. Mở Pull Request, mô tả thay đổi, kèm screenshot/test
4. Đạt CI ✅ & được review là merge 🚀

## Giấy phép

Phát hành dưới giấy phép MIT – xem tệp [LICENSE](LICENSE).
