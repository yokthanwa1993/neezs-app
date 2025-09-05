# 📱 LINE Login System Documentation

## 🗂️ ไฟล์และหน้าที่

### 1. **LiffContext.tsx** - Core Context
```typescript
- จัดการ LIFF SDK state (isLiffReady, isLiffLoading)
- initializeLiffForRole(role: 'seeker' | 'employer')
- ดูแล window.liff object
```

### 2. **LineLogin.tsx** - Main Login Component  
```typescript
- แสดงปุ่ม "Login with LINE"
- จัดการ login flow สำหรับ web browser
- Auto-detect ถ้าอยู่ใน LIFF browser
- รองรับทั้ง seeker และ employer role
```

### 3. **LiffHandler.tsx** - LIFF Authentication
```typescript
- จัดการ authentication ใน LINE browser
- Auto-redirect หลังจาก login สำเร็จ
- Handle deep linking จาก LINE
```

### 4. **LineCallback.tsx** - OAuth Callback
```typescript
- รับ callback จาก LINE OAuth
- ดึง LIFF profile และ access token
- ส่งข้อมูลไป backend เพื่อ verify
- สร้าง Firebase custom token
```

### 5. **AuthContext.tsx** - User State Management
```typescript
- เก็บ user state ทั้งแอป
- จัดการ Firebase authentication
- setUser() หลังจาก login สำเร็จ
```

## 🔄 Login Flow Details

### A. Web Browser Login
1. User เปิดแอปใน web browser
2. เห็นหน้า LineLogin.tsx
3. กดปุ่ม "Login with LINE"
4. เปิด LINE OAuth window
5. User login ใน LINE
6. Redirect กลับมา LineCallback.tsx
7. ดึง token และสร้าง Firebase user

### B. LINE Browser Login (LIFF)
1. User เปิดแอปใน LINE browser
2. LiffHandler.tsx จัดการ auto-login
3. ตรวจสอบ LIFF.isLoggedIn()
4. ถ้า login แล้ว → auto authenticate
5. ถ้ายังไม่ login → ขอให้ login ใน LINE
6. ดึง LIFF profile และสร้าง Firebase user

### C. Role-based Navigation
- **Seeker**: `/seeker/home`
- **Employer**: `/employer/home`

## 🛣️ Routes ที่เกี่ยวข้อง

```typescript
// App.tsx routes
<Route path="/callback" element={<LineCallback />} />
<Route path="/seeker/auth" element={<LiffHandler role="seeker" />} />
<Route path="/employer/auth" element={<LiffHandler role="employer" />} />
```

## 🔧 Configuration

### LIFF IDs (ใน LiffContext.tsx)
- **Seeker**: `2006450081-jWkKY0Gj`
- **Employer**: `2006450081-VoX8avP2`

### Backend Integration
- **Endpoint**: `/api/auth/line-login`
- **Method**: POST
- **Body**: `{ liffToken, role, profile }`
- **Response**: `{ firebaseToken }`

## 🚨 Error Handling

- LIFF SDK load failure
- Network connection issues  
- Invalid LIFF token
- Firebase authentication errors
- Backend verification errors

## 🧪 Testing Scenarios

1. **Web Login**: ทดสอบใน regular browser
2. **LIFF Login**: ทดสอบใน LINE app browser
3. **Role Switching**: ทดสอบ seeker/employer
4. **Deep Linking**: ทดสอบ direct URLs
5. **Error Cases**: ทดสอบ network failures
