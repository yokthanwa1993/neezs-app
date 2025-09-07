# Capacitor Configuration

Capacitor คือ cross-platform native runtime ที่ช่วยให้ web app ทำงานบน iOS และ Android ได้

## ไฟล์ใน Folder นี้:

- `capacitor.config.ts` - การตั้งค่าหลักสำหรับทุกแพลตฟอร์ม
- `capacitor.config.ios.ts` - การตั้งค่าเฉพาะ iOS
- `capacitor.config.android.ts` - การตั้งค่าเฉพาะ Android

## การใช้งาน:

```bash
# Build web app ก่อน
npm run build

# เพิ่ม platform (ครั้งแรกเท่านั้น)
npx cap add ios
npx cap add android

# Sync ไฟล์กับ native projects
npx cap sync

# เปิด IDE สำหรับ development
npx cap open ios
npx cap open android
```

## App ID: `com.neeiz.jobtoday`
App Name: **NEEIZ** - Job marketplace mobile app
