# VNR

Frontend atlas lịch sử Đảng và cách mạng Việt Nam. Repo này chỉ chịu trách nhiệm public UI và bản đồ; CMS/API nằm ở `vnr-be`.

## Chạy cục bộ

```bash
npm install
npm run dev
```

Frontend mặc định gọi backend ở `http://localhost:3001`. Có thể đổi qua biến môi trường `VNR_BE_URL`.

## Chạy cùng backend

1. Khởi động `vnr-be` trên cổng `3001`
2. Khởi động `VNR` trên cổng `3000`
3. Nếu backend không chạy, frontend sẽ hiện lỗi kết nối rõ ràng thay vì màn hình trắng

## Công nghệ chính

- Next.js
- MapLibre GL
- TypeScript
