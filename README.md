# NEEZS - แพลตฟอร์มหางานยุคใหม่

🚀 **แพลตฟอร์มหางานที่สร้างด้วยสถาปัตยกรรมระดับโลก**

NEEZS เป็นแพลตฟอร์มหางานที่เชื่อมต่อผู้หางานกับนายจ้าง ด้วยโค้ดเบสเดียวที่สามารถใช้งานได้หลายแพลตฟอร์ม: เว็บไซต์, LINE Mini App, iOS และ Android

---

## 🎯 **ภาพรวมโปรเจค**

### **NEEZS คืออะไร?**
NEEZS เป็น **แพลตฟอร์มหางานแบบ JobToday** ที่:
- 👔 **นายจ้าง** สามารถลงประกาศงาน จัดการการจ้างงาน และหาพนักงาน
- 💼 **ผู้หางาน** สามารถดูงาน สมัครงาน และจัดการการทำงาน
- 📱 **Multi-Platform** ใช้งานได้ทั้งเว็บ มือถือ และระบบ LINE

### **โมเดลธุรกิจ**
- **แพลตฟอร์ม B2B2C** เชื่อมต่อนายจ้างและผู้หางาน
- **รายได้จากค่าคอมมิชชั่น** เมื่อมีการจ้างงานสำเร็จ
- **โมเดล Freemium** มีฟีเจอร์พรีเมียมสำหรับนายจ้าง
- **บูรณาการ LINE** เพื่อเจาะตลาดไทย

---

## 🏗️ **สถาปัตยกรรมโปรเจค**

### **โครงสร้าง Monorepo**
```
NEEZS/
├── apps/                           # แอปพลิเคชั่นหลัก
│   ├── web/                        # เว็บไซต์ Next.js
│   │   ├── src/
│   │   │   ├── app/                # App Router (Next.js 13+)
│   │   │   ├── components/         # คอมโพเนนต์เฉพาะเว็บ
│   │   │   ├── lib/                # ยูทิลิตี้และการตั้งค่า
│   │   │   └── styles/             # สไตล์ CSS
│   │   ├── public/                 # ไฟล์สาธารณะ
│   │   └── package.json
│   └── app/                        # แอป Multi-Platform
│       ├── src/
│       │   ├── components/         # คอมโพเนนต์ React
│       │   │   ├── layouts/        # เลย์เอาต์หลัก
│       │   │   ├── pages/          # หน้าต่างๆ ของแอป
│       │   │   ├── features/       # ฟีเจอร์เฉพาะ
│       │   │   └── shared/         # คอมโพเนนต์ที่ใช้ร่วม
│       │   ├── hooks/              # Custom React Hooks
│       │   ├── stores/             # State Management
│       │   ├── services/           # API Services
│       │   ├── types/              # Type Definitions
│       │   ├── utils/              # Helper Functions
│       │   ├── styles/             # Global Styles
│       │   ├── assets/             # รูปภาพ ไอคอน
│       │   ├── config/             # การตั้งค่าแอป
│       │   └── App.tsx             # Root Component
│       ├── public/                 # ไฟล์สาธารณะ
│       ├── ios/                    # โปรเจค iOS (Capacitor)
│       ├── android/                # โปรเจค Android (Capacitor)
│       ├── dist/                   # ผลลัพธ์การ build
│       ├── capacitor.config.ts     # การตั้งค่า Capacitor
│       ├── capacitor.config.ios.ts # การตั้งค่า iOS
│       ├── capacitor.config.android.ts # การตั้งค่า Android
│       └── package.json
├── packages/                       # แพ็กเกจที่ใช้ร่วม
│   ├── ui/                         # ระบบ Design System
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── ui/             # คอมโพเนนต์พื้นฐาน
│   │   │   │   │   ├── button.tsx
│   │   │   │   │   ├── card.tsx
│   │   │   │   │   ├── form.tsx
│   │   │   │   │   ├── input.tsx
│   │   │   │   │   ├── modal.tsx
│   │   │   │   │   └── ...
│   │   │   │   ├── shared/         # คอมโพเนนต์ร่วม
│   │   │   │   │   ├── navigation.tsx
│   │   │   │   │   ├── header.tsx
│   │   │   │   │   ├── footer.tsx
│   │   │   │   │   ├── loading.tsx
│   │   │   │   │   └── ...
│   │   │   │   ├── seeker/         # คอมโพเนนต์ผู้หางาน
│   │   │   │   │   ├── job-card.tsx
│   │   │   │   │   ├── job-list.tsx
│   │   │   │   │   ├── application-form.tsx
│   │   │   │   │   ├── profile-form.tsx
│   │   │   │   │   └── ...
│   │   │   │   └── employer/       # คอมโพเนนต์นายจ้าง
│   │   │   │       ├── job-form.tsx
│   │   │   │       ├── candidate-list.tsx
│   │   │   │       ├── dashboard.tsx
│   │   │   │       ├── analytics.tsx
│   │   │   │       └── ...
│   │   │   ├── lib/                # ยูทิลิตี้ UI
│   │   │   ├── styles/             # สไตล์ CSS
│   │   │   └── index.ts            # Export หลัก
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── core/                       # Platform Abstraction
│   │   ├── src/
│   │   │   ├── platform/           # การจัดการแพลตฟอร์ม
│   │   │   │   ├── detector.ts     # ตรวจจับแพลตฟอร์ม
│   │   │   │   ├── line.ts         # LINE LIFF integration
│   │   │   │   ├── mobile.ts       # Capacitor features
│   │   │   │   └── web.ts          # Web features
│   │   │   ├── storage/            # ระบบจัดเก็บข้อมูล
│   │   │   ├── navigation/         # การนำทาง
│   │   │   ├── notifications/      # การแจ้งเตือน
│   │   │   └── auth/               # ระบบยืนยันตัวตน
│   │   └── package.json
│   ├── api-client/                 # API Integration Layer
│   │   ├── src/
│   │   │   ├── clients/            # HTTP Clients
│   │   │   ├── types/              # API Types
│   │   │   ├── queries/            # React Query hooks
│   │   │   └── mutations/          # Mutation hooks
│   │   └── package.json
│   └── shared-types/               # Type Definitions
│       ├── src/
│       │   ├── user.ts
│       │   ├── job.ts
│       │   ├── application.ts
│       │   └── ...
│       └── package.json
├── functions/                      # Firebase Functions (Backend)
│   ├── src/
│   │   ├── routes/                 # API Routes
│   │   │   ├── auth.ts             # Authentication API
│   │   │   ├── jobs.ts             # Jobs API
│   │   │   ├── users.ts            # Users API
│   │   │   ├── applications.ts     # Applications API
│   │   │   └── ...
│   │   ├── middleware/             # Express Middleware
│   │   ├── services/               # Business Logic
│   │   ├── models/                 # Data Models
│   │   ├── utils/                  # Helper Functions
│   │   ├── config/                 # Configuration
│   │   ├── app.ts                  # Express App
│   │   ├── server.ts               # Server Setup
│   │   ├── firebase.ts             # Firebase Config
│   │   └── index.ts                # Entry Point
│   ├── lib/                        # Compiled JavaScript
│   └── package.json
├── ecosystem.config.json           # PM2 Production Config
├── pm2.sh                          # PM2 Deployment Script
├── pnpm-workspace.yaml             # pnpm Workspace Config
├── package.json                    # Root Package
└── README.md                       # เอกสารนี้
```

### **แผนการ Deploy**
- 🌐 **เว็บแอปพลิเคชั่น** - ประสบการณ์เบราว์เซอร์แบบดั้งเดิม
- 📱 **LINE Mini App** - บูรณาการกับระบบ LINE (ตลาดไทย)
- 📱 **แอป iOS** - แอปพลิเคชั่น native ผ่าน App Store
- 🤖 **แอป Android** - แอปพลิเคชั่น native ผ่าน Play Store

---

## � **โครงสร้างแอปพลิเคชั่น**

### **หน้าต่างๆ ของแอป (App Structure)**

#### **สำหรับผู้หางาน (Job Seeker)**
```
src/components/pages/seeker/
├── auth/
│   ├── LoginPage.tsx               # หน้าเข้าสู่ระบบ
│   ├── RegisterPage.tsx            # หน้าสมัครสมาชิก
│   └── ForgotPasswordPage.tsx      # หน้าลืมรหัสผ่าน
├── onboarding/
│   ├── WelcomePage.tsx             # หน้าต้อนรับ
│   ├── ProfileSetupPage.tsx        # หน้าตั้งค่าโปรไฟล์
│   └── PreferencesPage.tsx         # หน้าตั้งค่าการหางาน
├── dashboard/
│   ├── DashboardPage.tsx           # หน้าแดชบอร์ด
│   ├── RecentJobsPage.tsx          # งานล่าสุด
│   └── RecommendationsPage.tsx     # งานแนะนำ
├── jobs/
│   ├── JobSearchPage.tsx           # หน้าค้นหางาน
│   ├── JobDetailPage.tsx           # หน้ารายละเอียดงาน
│   ├── JobFiltersPage.tsx          # หน้าตัวกรองงาน
│   └── SavedJobsPage.tsx           # งานที่บันทึกไว้
├── applications/
│   ├── ApplicationsPage.tsx        # หน้ารายการใบสมัคร
│   ├── ApplicationDetailPage.tsx   # รายละเอียดใบสมัคร
│   └── ApplicationHistoryPage.tsx  # ประวัติการสมัคร
├── profile/
│   ├── ProfilePage.tsx             # หน้าโปรไฟล์
│   ├── EditProfilePage.tsx         # แก้ไขโปรไฟล์
│   ├── ResumeBuilderPage.tsx       # สร้างเรซูเม่
│   └── SkillsPage.tsx              # จัดการทักษะ
├── messages/
│   ├── MessagesPage.tsx            # หน้าข้อความ
│   ├── ChatPage.tsx                # หน้าแชท
│   └── NotificationsPage.tsx       # หน้าการแจ้งเตือน
└── settings/
    ├── SettingsPage.tsx            # หน้าการตั้งค่า
    ├── PrivacyPage.tsx             # การตั้งค่าความเป็นส่วนตัว
    └── NotificationSettingsPage.tsx # ตั้งค่าการแจ้งเตือน
```

#### **สำหรับนายจ้าง (Employer)**
```
src/components/pages/employer/
├── auth/
│   ├── LoginPage.tsx               # หน้าเข้าสู่ระบบ
│   ├── RegisterPage.tsx            # หน้าสมัครสมาชิก
│   └── CompanyVerificationPage.tsx # หน้ายืนยันบริษัท
├── onboarding/
│   ├── WelcomePage.tsx             # หน้าต้อนรับ
│   ├── CompanySetupPage.tsx        # หน้าตั้งค่าบริษัท
│   └── PlanSelectionPage.tsx       # หน้าเลือกแพ็กเกจ
├── dashboard/
│   ├── DashboardPage.tsx           # หน้าแดชบอร์ด
│   ├── AnalyticsPage.tsx           # หน้าวิเคราะห์ข้อมูล
│   └── ReportsPage.tsx             # หน้ารายงาน
├── jobs/
│   ├── JobListPage.tsx             # รายการงานที่ลง
│   ├── CreateJobPage.tsx           # หน้าสร้างงาน
│   ├── EditJobPage.tsx             # หน้าแก้ไขงาน
│   └── JobPerformancePage.tsx      # ประสิทธิภาพงาน
├── candidates/
│   ├── CandidatesPage.tsx          # หน้าผู้สมัคร
│   ├── CandidateDetailPage.tsx     # รายละเอียดผู้สมัคร
│   ├── CandidateSearchPage.tsx     # ค้นหาผู้สมัคร
│   └── ShortlistPage.tsx           # รายชื่อผู้ผ่านการคัดเลือก
├── applications/
│   ├── ApplicationsPage.tsx        # หน้าใบสมัคร
│   ├── ApplicationReviewPage.tsx   # หน้าตรวจสอบใบสมัคร
│   └── InterviewSchedulePage.tsx   # นัดหมายสัมภาษณ์
├── messages/
│   ├── MessagesPage.tsx            # หน้าข้อความ
│   ├── ChatPage.tsx                # หน้าแชท
│   └── NotificationsPage.tsx       # หน้าการแจ้งเตือน
├── company/
│   ├── CompanyProfilePage.tsx      # โปรไฟล์บริษัท
│   ├── EditCompanyPage.tsx         # แก้ไขข้อมูลบริษัท
│   └── TeamManagementPage.tsx      # จัดการทีม
└── billing/
    ├── BillingPage.tsx             # หน้าการเรียกเก็บเงิน
    ├── PaymentMethodsPage.tsx      # วิธีการชำระเงิน
    └── InvoicesPage.tsx            # ใบแจ้งหนี้
```

### **Navigation Structure (โครงสร้างการนำทาง)**

#### **Bottom Navigation (สำหรับ Mobile)**
```
ผู้หางาน:
- 🏠 หน้าหลัก (Dashboard)
- 🔍 ค้นหา (Job Search)
- 💼 ใบสมัคร (Applications)
- 💬 ข้อความ (Messages)
- 👤 โปรไฟล์ (Profile)

นายจ้าง:
- 📊 แดชบอร์ด (Dashboard)
- 📝 จัดการงาน (Jobs)
- 👥 ผู้สมัคร (Candidates)
- 💬 ข้อความ (Messages)
- 🏢 บริษัท (Company)
```

#### **Side Menu (สำหรับ Web/Desktop)**
```
ผู้หางาน:
- หน้าหลัก
- ค้นหางาน
  ├── ค้นหาทั่วไป
  ├── งานแนะนำ
  └── งานที่บันทึก
- ใบสมัครงาน
  ├── ใบสมัครปัจจุบัน
  ├── ประวัติการสมัคร
  └── สถานะการสมัคร
- โปรไฟล์
  ├── ข้อมูลส่วนตัว
  ├── เรซูเม่
  ├── ทักษะ
  └── ประสบการณ์
- การตั้งค่า
  ├── การแจ้งเตือน
  ├── ความเป็นส่วนตัว
  └── ความปลอดภัย

นายจ้าง:
- แดชบอร์ด
- จัดการงาน
  ├── สร้างงานใหม่
  ├── งานที่เปิดอยู่
  ├── งานปิดแล้ว
  └── ร่างงาน
- จัดการผู้สมัคร
  ├── ใบสมัครใหม่
  ├── กำลังพิจารณา
  ├── ผ่านการคัดเลือก
  └── ไม่ผ่านการคัดเลือก
- วิเคราะห์ข้อมูล
  ├── ประสิทธิภาพงาน
  ├── ข้อมูลผู้สมัคร
  └── รายงานการจ้างงาน
- จัดการบริษัท
  ├── ข้อมูลบริษัท
  ├── จัดการทีม
  └── การเรียกเก็บเงิน
```

## 🛠️ **เทคโนโลยีที่ใช้**

### **Frontend**
- **React 18** - ไลบรารี UI สมัยใหม่พร้อม hooks
- **TypeScript** - การพัฒนาแบบ type-safe
- **Vite** - เครื่องมือ build ที่รวดเร็ว
- **Tailwind CSS** - การจัดสไตล์แบบ utility-first
- **React Router** - การนำทางฝั่ง client
- **React Hook Form** - การจัดการฟอร์ม
- **Tanstack Query** - การจัดการ server state

### **Mobile**
- **Capacitor** - เชื่อมต่อเว็บกับ native
- **iOS** - การ deploy แบบ native iOS
- **Android** - การ deploy แบบ native Android
- **LINE LIFF** - LINE Front-end Framework

### **Backend**
- **Firebase Functions** - backend แบบ serverless
- **Express.js** - web framework
- **Firebase Auth** - ระบบยืนยันตัวตน
- **Firestore** - ฐานข้อมูล NoSQL
- **Firebase Storage** - ระบบจัดเก็บไฟล์

### **เครื่องมือพัฒนา**
- **pnpm Workspaces** - การจัดการ monorepo
- **ESLint** - การตรวจสอบโค้ด
- **Prettier** - การจัดรูปแบบโค้ด
- **PM2** - การจัดการ process ใน production

---

## 🚀 **การเริ่มต้นใช้งาน**

### **ความต้องการระบบ**
- **Node.js** 18+ 
- **pnpm** 8+
- **Git**
- **VS Code** (แนะนำ)

### **การติดตั้ง**
```bash
# Clone repository
git clone https://github.com/yokthanwa1993/NEEZS.git
cd NEEZS

# ติดตั้ง dependencies (ทุกแพ็กเกจ)
pnpm install

# ตั้งค่า environment variables
cp apps/app/.env.example apps/app/.env
cp functions/.env.example functions/.env
```

### **คำสั่งการพัฒนา**

#### **การพัฒนาเว็บ**
```bash
# เริ่ม web application
cd apps/web && pnpm dev
# → http://localhost:3000

# เริ่ม main app (LINE + Mobile)
cd apps/app && pnpm dev  
# → http://localhost:5000
```

#### **การพัฒนา UI**
```bash
# เริ่ม UI package ในโหมด watch
cd packages/ui && pnpm dev

# Build UI package
cd packages/ui && pnpm build
```

#### **การพัฒนา Backend**
```bash
# เริ่ม Firebase Functions
cd functions && pnpm dev

# Deploy functions
cd functions && pnpm deploy
```

#### **การพัฒนา Mobile**
```bash
cd apps/app

# เริ่มต้นโปรเจค mobile (ครั้งแรก)
pnpm cap:init:ios
pnpm cap:init:android

# Build และเปิด iOS
pnpm mobile:ios

# Build และเปิด Android
pnpm mobile:android
```

---

## 📱 **ฟีเจอร์เฉพาะแต่ละแพลตฟอร์ม**

### **เว็บแอปพลิเคชั่น**
- 🖥️ ประสบการณ์ desktop แบบเต็มรูปแบบ
- 📊 แดชบอร์ดวิเคราะห์ข้อมูลขั้นสูง
- 💼 เครื่องมือนายจ้างที่ครอบคลุม
- 🔍 การค้นหาและกรองขั้นสูง

### **LINE Mini App**
- 🟢 การเข้าสู่ระบบผ่าน LINE
- 📱 อินเทอร์เฟซที่ปรับให้เหมาะกับมือถือ
- 💬 ระบบแจ้งเตือนผ่าน LINE
- 🇹🇭ุ่มเน้นตลาดไทย

### **แอป iOS/Android**
- 📲 การแจ้งเตือนแบบ push
- 📷 การบูรณาการกล้อง
- 🔔 การแจ้งเตือนแบบ local
- 📍 บริการตำแหน่งที่ตั้ง
- 🔒 การยืนยันตัวตนด้วยลายนิ้วมือ

---

## 👥 **การทำงานเป็นทีม**

### **ขั้นตอนการพัฒนา**

#### **สำหรับ UI Developer**
```bash
# ทำงานใน UI package
cd packages/ui

# เริ่มโหมด watch
pnpm dev

# แก้ไขคอมโพเนนต์
src/components/ui/          # คอมโพเนนต์พื้นฐาน
src/components/shared/      # คอมโพเนนต์ที่ใช้ร่วม
src/components/seeker/      # คอมโพเนนต์ผู้หางาน
src/components/employer/    # คอมโพเนนต์นายจ้าง

# ทดสอบใน main app
# → Main app จะอัปเดตอัตโนมัติเมื่อ UI เปลี่ยน
```

#### **สำหรับ Backend Developer**
```bash
# ทำงานใน functions
cd functions

# เริ่มการพัฒนา
pnpm dev

# Deploy ไปยัง staging
pnpm deploy:staging

# Deploy ไปยัง production  
pnpm deploy:prod
```

#### **สำหรับ Mobile Developer**
```bash
# เน้นฟีเจอร์เฉพาะแพลตฟอร์ม
cd apps/app

# ทดสอบบน iOS
pnpm mobile:ios

# ทดสอบบน Android
pnpm mobile:android

# เพิ่มปลั๊กอิน native
pnpm add @capacitor/camera
```

### **Git Workflow**
- **Main branch** - โค้ดที่พร้อม production
- **Feature branches** - `feature/job-search`, `feature/payment-integration`
- **UI branches** - `ui/design-system`, `ui/mobile-optimization`
- **Platform branches** - `mobile/ios-features`, `mobile/android-features`

---

## 🎨 **ระบบ Design System**

### **ไลบรารีคอมโพเนนต์ (`packages/ui`)**
```
src/components/
├── ui/                     # Design System พื้นฐาน
│   ├── button.tsx          # ปุ่มหลากหลายแบบ
│   ├── card.tsx            # เลย์เอาต์การ์ด
│   ├── form.tsx            # คอมโพเนนต์ฟอร์ม
│   ├── input.tsx           # ช่องป้อนข้อมูล
│   ├── modal.tsx           # หน้าต่างป๊อปอัป
│   ├── badge.tsx           # ป้ายสถานะ
│   ├── avatar.tsx          # รูปโปรไฟล์
│   ├── tabs.tsx            # แท็บการนำทาง
│   ├── accordion.tsx       # กล่องยุบขยาย
│   ├── table.tsx           # ตารางข้อมูล
│   ├── pagination.tsx      # การแบ่งหน้า
│   ├── toast.tsx           # การแจ้งเตือนแบบเลื่อน
│   ├── tooltip.tsx         # คำแนะนำเครื่องมือ
│   ├── dropdown.tsx        # เมนูดรอปดาวน์
│   ├── calendar.tsx        # ปฏิทิน
│   ├── slider.tsx          # แถบเลื่อน
│   ├── switch.tsx          # สวิตช์เปิด/ปิด
│   ├── checkbox.tsx        # กล่องกาเครื่องหมาย
│   ├── radio.tsx           # ปุ่มตัวเลือก
│   ├── select.tsx          # กล่องเลือก
│   ├── textarea.tsx        # พื้นที่ข้อความ
│   ├── skeleton.tsx        # โครงแสดงขณะโหลด
│   ├── spinner.tsx         # ไอคอนหมุน
│   ├── progress.tsx        # แถบความคืบหน้า
│   └── ...
├── shared/                 # คอมโพเนนต์แอปพลิเคชั่น
│   ├── navigation.tsx      # ระบบการนำทาง
│   ├── header.tsx          # ส่วนหัวหน้า
│   ├── footer.tsx          # ส่วนท้ายหน้า
│   ├── sidebar.tsx         # แถบข้าง
│   ├── breadcrumb.tsx      # เส้นทางหน้า
│   ├── search-bar.tsx      # แถบค้นหา
│   ├── filter-panel.tsx    # แผงตัวกรอง
│   ├── loading.tsx         # หน้าจอโหลด
│   ├── error-boundary.tsx  # จัดการข้อผิดพลาด
│   ├── empty-state.tsx     # สถานะว่างเปล่า
│   ├── confirmation-modal.tsx # ป๊อปอัปยืนยัน
│   └── ...
├── seeker/                 # เฉพาะผู้หางาน
│   ├── job-card.tsx        # การ์ดงาน
│   ├── job-list.tsx        # รายการงาน
│   ├── job-filters.tsx     # ตัวกรองงาน
│   ├── application-form.tsx # ฟอร์มสมัครงาน
│   ├── application-card.tsx # การ์ดใบสมัคร
│   ├── profile-form.tsx    # ฟอร์มโปรไฟล์
│   ├── resume-builder.tsx  # สร้างเรซูเม่
│   ├── skill-selector.tsx  # เลือกทักษะ
│   ├── experience-form.tsx # ฟอร์มประสบการณ์
│   ├── education-form.tsx  # ฟอร์มการศึกษา
│   ├── salary-range.tsx    # ช่วงเงินเดือน
│   ├── job-alert-form.tsx  # ฟอร์มแจ้งเตือนงาน
│   └── ...
└── employer/               # เฉพาะนายจ้าง
    ├── job-form.tsx        # ฟอร์มสร้างงาน
    ├── job-preview.tsx     # ดูตัวอย่างงาน
    ├── candidate-card.tsx  # การ์ดผู้สมัคร
    ├── candidate-list.tsx  # รายการผู้สมัคร
    ├── application-review.tsx # ตรวจสอบใบสมัคร
    ├── interview-scheduler.tsx # นัดหมายสัมภาษณ์
    ├── company-form.tsx    # ฟอร์มข้อมูลบริษัท
    ├── team-management.tsx # จัดการทีม
    ├── analytics-chart.tsx # กราฟวิเคราะห์
    ├── performance-metrics.tsx # เมตริกประสิทธิภาพ
    ├── billing-summary.tsx # สรุปการเรียกเก็บเงิน
    ├── payment-form.tsx    # ฟอร์มชำระเงิน
    ├── subscription-plan.tsx # แพ็กเกจสมาชิก
    └── ...
```

### **Design Tokens**
- **สี** - สีแบรนด์, สีความหมาย
- **ตัวอักษร** - ฟอนต์, ขนาด, น้ำหนัก  
- **ระยะห่าง** - สเกลระยะห่างที่สม่ำเสมอ
- **เงา** - ระบบความสูง
- **Breakpoints** - จุดตอบสนองการออกแบบ

---

## 🔧 **การตั้งค่า**

### **Environment Variables**

#### **Frontend (`apps/app/.env`)**
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_LIFF_ID=your_line_liff_id
VITE_API_BASE_URL=https://your-api.com
```

#### **Backend (`functions/.env`)**
```env
FIREBASE_PROJECT_ID=your_project_id
LINE_CHANNEL_SECRET=your_line_secret
GOOGLE_MAPS_API_KEY=your_maps_key
STRIPE_SECRET_KEY=your_stripe_key
```

### **การตั้งค่าแพลตฟอร์ม**

#### **Capacitor iOS (`capacitor.config.ios.ts`)**
```typescript
{
  appId: 'com.neeiz.jobtoday',
  appName: 'NEEIZ',
  ios: {
    scheme: 'NEEIZ'
  }
}
```

#### **Capacitor Android (`capacitor.config.android.ts`)**
```typescript
{
  appId: 'com.neeiz.jobtoday',
  appName: 'NEEIZ',
  android: {
    allowMixedContent: true
  }
}
```

---

## 🚀 **การ Deploy**

### **การ Deploy Production**

#### **เว็บแอปพลิเคชั่น**
```bash
# Build web app
cd apps/web && pnpm build

# Deploy ไปยัง Vercel/Netlify
pnpm deploy
```

#### **แอปพลิเคชั่นมือถือ**
```bash
cd apps/app

# iOS App Store
pnpm mobile:ios
# → เปิด Xcode → Archive → อัปโหลดไปยัง App Store

# Google Play Store  
pnpm mobile:android
# → เปิด Android Studio → Build → อัปโหลดไปยัง Play Console
```

#### **บริการ Backend**
```bash
# Deploy Firebase Functions
cd functions && pnpm deploy

# ใช้ PM2 (ทางเลือก)
pm2 start ecosystem.config.json
```

### **CI/CD Pipeline**
- **GitHub Actions** - การทดสอบและ deploy อัตโนมัติ
- **Firebase Hosting** - การโฮสต์เว็บแอปพลิเคชั่น
- **Firebase Functions** - การ deploy backend แบบ serverless
- **App Store Connect** - การแจกจ่ายแอป iOS
- **Google Play Console** - การแจกจ่ายแอป Android

---

## 📊 **ฟีเจอร์ของโปรเจค**

### **สำหรับผู้หางาน**
- 🔍 **ค้นหางาน** - การกรองและค้นหาขั้นสูง
- 📝 **จัดการโปรไฟล์** - โปรไฟล์มืออาชีพที่สมบูรณ์  
- 💼 **ติดตามใบสมัคร** - ติดตามสถานะการสมัครงาน
- 💰 **ข้อมูลเงินเดือน** - ข้อมูลเงินเดือนในตลาด
- 🎯 **แนะนำงาน** - การจับคู่งานด้วย AI
- 📱 **การแจ้งเตือนมือถือ** - แจ้งเตือนงานแบบ real-time

### **สำหรับนายจ้าง**
- 📢 **ลงประกาศงาน** - สร้างและจัดการงานอย่างง่าย
- 👥 **จัดการผู้สมัคร** - ระบบตรวจสอบใบสมัคร
- 💬 **เครื่องมือสื่อสาร** - ระบบแชทในแอป
- 📊 **แดชบอร์ดวิเคราะห์** - เมตริกประสิทธิภาพการจ้างงาน
- 🎯 **ค้นหาผู้สมัคร** - การหาผู้สมัครเชิงรุก
- 💳 **บูรณาการการชำระเงิน** - ค่าธรรมเนียมลงงานและการชำระเงิน

### **ฟีเจอร์แพลตฟอร์ม**
- 🔐 **ระบบยืนยันตัวตน** - เข้าสู่ระบบที่ปลอดภัยหลายแบบ
- 🌍 **รองรับหลายภาษา** - รองรับหลายภาษา
- 📱 **การออกแบบตอบสนอง** - ใช้งานได้ทุกอุปกรณ์
- ⚡ **ประสิทธิภาพ** - การโหลดและการโต้ตอบที่เหมาะสม
- 🔔 **การแจ้งเตือน Real-time** - อัปเดตทันที
- 🛡️ **ความปลอดภัย** - การปกป้องข้อมูลและความเป็นส่วนตัว

---

## 🤝 **การมีส่วนร่วม**

### **แนวทางการพัฒนา**
1. **ปฏิบัติตาม TypeScript** - โค้ดทั้งหมดต้อง type-safe
2. **Component-First** - สร้างคอมโพเนนต์ที่ใช้ซ้ำได้
3. **Mobile-First** - ออกแบบสำหรับมือถือ เสริมสำหรับ desktop
4. **Test Coverage** - รักษาระดับการทดสอบที่สูง
5. **เอกสารประกอบ** - จัดทำเอกสาร public APIs ทั้งหมด

### **สไตล์โค้ด**
- **ESLint** - ปฏิบัติตามกฎ linting
- **Prettier** - การจัดรูปแบบโค้ดที่สม่ำเสมอ  
- **Conventional Commits** - ข้อความ commit ที่มีโครงสร้าง
- **PR Reviews** - การเปลี่ยนแปลงทั้งหมดต้องได้รับการตรวจสอบ

### **กลยุทธ์การแตกสาขา**
```bash
main                    # สาขา Production
├── develop            # สาขาการพัฒนา  
├── feature/*          # สาขาฟีเจอร์
├── ui/*              # สาขา UI/Design
├── mobile/*          # สาขาเฉพาะมือถือ
└── hotfix/*          # แก้ไขด่วน Production
```

---

## 📄 **ลิขสิทธิ์**

โปรเจคนี้เป็นซอฟต์แวร์ที่มีลิขสิทธิ์ สงวนลิขสิทธิ์ทั้งหมด

---

## 📞 **การสนับสนุนและติดต่อ**

- **หัวหน้าโปรเจค**: [ชื่อของคุณ]
- **Repository**: https://github.com/yokthanwa1993/NEEZS
- **Issues**: GitHub Issues
- **เอกสารประกอบ**: โฟลเดอร์ `/docs`

---

## 🎯 **แผนงานการพัฒนา**

### **ช่วงที่ 1** ✅
- [x] สถาปัตยกรรมแพลตฟอร์มหลัก
- [x] การลงงานและค้นหางานพื้นฐาน
- [x] การ deploy หลายแพลตฟอร์ม
- [x] รากฐานระบบ design system

### **ช่วงที่ 2** 🚧
- [ ] อัลกอริทึมการค้นหาขั้นสูง
- [ ] บูรณาการการชำระเงิน
- [ ] ระบบแชท real-time
- [ ] การปรับปรุงแอปมือถือ

### **ช่วงที่ 3** 📋
- [ ] การจับคู่งานด้วย AI
- [ ] บูรณาการสัมภาษณ์วิดีโอ
- [ ] การวิเคราะห์ข้อมูลขั้นสูง
- [ ] ตลาด API

---

**สร้างด้วย ❤️ โดยใช้สถาปัตยกรรมระดับโลกและเทคโนโลยีสมัยใหม่**

*NEEZS - เชื่อมต่อความสามารถกับโอกาสทุกแพลตฟอร์ม* 🚀
