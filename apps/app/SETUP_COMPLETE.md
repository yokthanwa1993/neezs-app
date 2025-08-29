# Deployment Setup Complete

## แก้ไขที่ทำไปแล้ว

### 1. GitHub Actions Workflow (`.github/workflows/deploy-app.yml`)
- ✅ อัปเดต checkout action เป็น v4
- ✅ เพิ่มการ setup pnpm
- ✅ เปลี่ยนจาก npm เป็น pnpm
- ✅ เพิ่มการ build ก่อน deploy

### 2. CapRover Configuration (`captain-definition`)
- ✅ แก้ไข `branchToDeploy` จาก `master` เป็น `main`
- ✅ ลบ `startCommand` ออกเพราะใช้ Nginx ใน Dockerfile

### 3. Docker Configuration
- ✅ ปรับปรุง `Dockerfile` ให้ใช้ pnpm
- ✅ เพิ่ม `--frozen-lockfile` flag
- ✅ สร้าง `.dockerignore` เพื่อลดขนาด context

### 4. Nginx Configuration (`nginx.conf`)
- ✅ เพิ่ม security headers
- ✅ ปรับปรุง cache headers
- ✅ เพิ่ม gzip compression
- ✅ รองรับ font files

### 5. Project Configuration
- ✅ อัปเดต `.gitignore` ให้ครบถ้วน
- ✅ แก้ไข scripts ใน `package.json` ให้ใช้ pnpm
- ✅ อัปเดต `README.md` ให้มีข้อมูลครบถ้วน

## การ Deploy

### วิธีที่ 1: GitHub Actions (อัตโนมัติ)
- Push ไปยัง branch `main`
- ระบบจะ build และ deploy อัตโนมัติ

### วิธีที่ 2: Manual Deploy
```bash
cd app
pnpm install
pnpm run build
caprover deploy
```

## Environment Variables ที่จำเป็น

ตรวจสอบว่าได้ตั้งค่า environment variables ใน CapRover แล้ว:
- `CAPROVER_SERVER`
- `CAPROVER_APP_TOKEN`
- `VITE_LINE_LIFF_ID`
- `LINE_CHANNEL_ID`
- `LINE_CHANNEL_SECRET`
- `JWT_SECRET`
- `VITE_API_URL`
- `FIREBASE_SERVICE_ACCOUNT_BASE64`

## การทดสอบ

1. Push code ไปยัง GitHub
2. ตรวจสอบ GitHub Actions workflow
3. ตรวจสอบ deployment ใน CapRover dashboard
4. ทดสอบการเข้าถึง application

## Troubleshooting

### หาก deployment ล้มเหลว:
1. ตรวจสอบ GitHub Actions logs
2. ตรวจสอบ CapRover logs
3. ตรวจสอบ environment variables
4. ตรวจสอบ Docker build logs

### หาก build ล้มเหลว:
1. ทดสอบ build ในเครื่อง local: `pnpm run build`
2. ตรวจสอบ TypeScript errors
3. ตรวจสอบ dependencies

## หมายเหตุ

- ใช้ pnpm เป็น package manager
- ใช้ Nginx เป็น web server
- รองรับ SPA routing
- มี security headers และ compression
- ใช้ multi-stage Docker build 