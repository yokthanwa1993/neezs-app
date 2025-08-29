# Gig Marketplace Backend Server

Backend API server สำหรับ Gig Marketplace ที่รองรับ LINE Login

## การติดตั้ง

```bash
cd server
npm install
```

## การตั้งค่า Environment Variables

สร้างไฟล์ `.env` และเพิ่มค่าต่อไปนี้:

```
LINE_CHANNEL_ID=your_line_channel_id
LINE_CHANNEL_SECRET=your_line_channel_secret
JWT_SECRET=your_jwt_secret_key
PORT=3001
```

## การรันเซิร์ฟเวอร์

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/line` - ยืนยัน LINE ID Token และสร้าง JWT
- `GET /api/user/profile` - ดูข้อมูลผู้ใช้ (ต้อง authenticate)

### Health Check
- `GET /api/health` - ตรวจสอบสถานะเซิร์ฟเวอร์

## การใช้งาน

1. ผู้ใช้เข้าสู่ระบบผ่าน LINE LIFF
2. Frontend ส่ง ID Token มาที่ `/api/auth/line`
3. Server ยืนยัน Token กับ LINE และสร้าง JWT
4. Frontend ใช้ JWT สำหรับ API calls อื่นๆ