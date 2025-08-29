# LINE Login Debug Information

## ปัญหาที่พบ
- Error: `https://access.line.me/oauth2/v2.1/error400?error=Bad%20Request&error_description=invalid%20url.%20channelId%3D2007840854%2C%20redirectUriString%3Dhttps%3A%2F%2Fneeiz.lslly.com%2Fcallback`

## การแก้ไขที่ทำแล้ว

### 1. แก้ไข URL ให้ถูกต้อง
- **App URL**: `https://neeiz-app.lslly.com` (ไม่ใช่ neeiz.lslly.com)
- **API URL**: `https://neeiz-api.lslly.com`
- **Redirect URI**: `https://neeiz-app.lslly.com/callback`

### 2. ย้าย hardcoded URLs ไปใส่ใน Environment Variables
- ลบ fallback URLs ออกจากโค้ด
- เพิ่ม error handling สำหรับ missing env vars

### 3. Environment Variables ที่ใช้
```
VITE_LINE_LIFF_ID=2007840854-rKv5DGlD
VITE_LINE_REDIRECT_URI=https://neeiz-app.lslly.com/callback
VITE_API_URL=https://neeiz-api.lslly.com
VITE_APP_URL=https://neeiz-app.lslly.com
LINE_CHANNEL_ID=2007840854
LINE_CHANNEL_SECRET=c4b22d61540901e5a7338d6f3c8c1547
```

## สิ่งที่ต้องเช็คใน LINE Developer Console

### 1. LIFF App Settings
- **LIFF ID**: `2007840854-rKv5DGlD`
- **Endpoint URL**: `https://neeiz-app.lslly.com`
- **Scope**: `profile openid email`

### 2. Channel Settings
- **Channel ID**: `2007840854`
- **Callback URL**: `https://neeiz-app.lslly.com/callback`

### 3. Web App Settings
- **Web app URL**: `https://neeiz-app.lslly.com`
- **Additional domains**: อาจต้องเพิ่ม `neeiz-app.lslly.com`

## วิธีการ Debug

### 1. เช็ค Console Logs
```javascript
// ใน browser console
localStorage.getItem('liff_id_token')
localStorage.getItem('liff_user_id')
window.liff.isLoggedIn()
```

### 2. เช็ค Network Tab
- ดู request ไป `/api/auth/line`
- เช็ค response status และ error message

### 3. เช็ค LIFF Initialization
```javascript
// ใน browser console
window.liff.getOS()
window.liff.getVersion()
window.liff.isInClient()
```

## ขั้นตอนการแก้ไขใน LINE Developer Console

1. เข้า [LINE Developers Console](https://developers.line.biz/)
2. เลือก Channel ที่ใช้ (Channel ID: 2007840854)
3. ไป LIFF tab
4. แก้ไข LIFF App:
   - **Endpoint URL**: `https://neeiz-app.lslly.com`
   - **Scope**: `profile openid email`
5. ไป Channel settings
6. เพิ่ม **Web app URL**: `https://neeiz-app.lslly.com`
7. เพิ่ม **Additional domains**: `neeiz-app.lslly.com`

## การทดสอบ

1. Clear browser cache และ localStorage
2. ไป `https://neeiz-app.lslly.com/login`
3. กดปุ่ม "เข้าสู่ระบบด้วย LINE"
4. ดู console logs และ network requests