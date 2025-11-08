# Hướng dẫn sửa lỗi 404 trên Vercel

## Vấn đề
Tất cả requests trả về 404, không thể truy cập ứng dụng.

## Giải pháp

### 1. Kiểm tra Root Directory trong Vercel Settings

1. Vào Vercel Dashboard → Project Settings → General
2. Tìm phần **Root Directory**
3. Đảm bảo Root Directory được set là: `web-frontend`
   - Nếu để trống hoặc sai, Vercel sẽ không tìm thấy `vercel.json` và `package.json`

### 2. Kiểm tra Build Settings

1. Vào Vercel Dashboard → Project Settings → General
2. Kiểm tra các settings sau:
   - **Framework Preset**: Vite (hoặc Other)
   - **Build Command**: `npm run build` (hoặc để trống, Vercel sẽ tự detect)
   - **Output Directory**: `dist` (hoặc để trống, Vercel sẽ tự detect)
   - **Install Command**: `npm install` (hoặc để trống)

### 3. Kiểm tra Environment Variables

1. Vào Vercel Dashboard → Project Settings → Environment Variables
2. Đảm bảo có các biến sau (nếu cần):
   - `VITE_API_BASE_URL`: URL của backend API

### 4. Kiểm tra file vercel.json

File `vercel.json` đã được cập nhật với rewrite rule đơn giản hơn:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 5. Redeploy

Sau khi kiểm tra và sửa settings:
1. Vào Vercel Dashboard → Deployments
2. Click vào deployment mới nhất
3. Click "Redeploy" hoặc push code mới lên Git

### 6. Kiểm tra Build Logs

1. Vào Vercel Dashboard → Deployments
2. Click vào deployment
3. Xem tab "Build Logs" để đảm bảo build thành công
4. Kiểm tra xem có file `index.html` trong `dist/` không

## Lưu ý quan trọng

- **Root Directory** phải là `web-frontend` (không phải `Front-end/hoc_onl/web-frontend`)
- Nếu repo root là `web-frontend`, thì Root Directory để trống hoặc `.`
- File `vercel.json` phải ở root của project (cùng cấp với `package.json`)

## Test local build

Để test xem build có hoạt động không:
```bash
cd web-frontend
npm run build
ls -la dist/
```

Phải thấy file `index.html` và folder `assets/` trong `dist/`.

