# @neezs/ui

UI Component Library สำหรับระบบ NEEZS

## 📁 โครงสร้าง

```
src/
├── components/
│   ├── ui/           # Base UI Components (Button, Input, Card, etc.)
│   ├── shared/       # Shared Components (Layout, Navigation, etc.)
│   ├── seeker/       # Seeker-specific Components
│   ├── employer/     # Employer-specific Components
│   └── index.ts      # Main export file
├── lib/
│   └── utils.ts      # Utility functions
└── index.ts          # Package entry point
```

## 🚀 การใช้งาน

### ติดตั้ง

```bash
pnpm add @neezs/ui
```

### Import Components

```tsx
import { Button, Card, Badge } from '@neezs/ui';
import { SeekerBottomNavigation, EmployerBottomNavigation } from '@neezs/ui';

function MyComponent() {
  return (
    <Card>
      <Button variant="primary">Click me</Button>
      <Badge variant="success">New</Badge>
    </Card>
  );
}
```

## 🛠️ Development

### Build

```bash
pnpm build
```

### Watch Mode (สำหรับ development)

```bash
pnpm dev
```

### Type Check

```bash
pnpm type-check
```

## 📋 Components

### Base UI Components
- `Button` - ปุ่มพื้นฐาน
- `Card` - การ์ดคอนเทนเนอร์
- `Input` - ช่องใส่ข้อมูล
- `Avatar` - รูปโปรไฟล์
- `Badge` - ป้ายสถานะ
- `Tabs` - แท็บสำหรับสลับหน้า

### Shared Components
- `AppLayout` - เลย์เอาต์หลักของแอป
- `LineLogin` - ปุ่มเข้าสู่ระบบ LINE
- `SearchView` - หน้าค้นหา

### Seeker Components
- `SeekerBottomNavigation` - เมนูด้านล่างสำหรับ Seeker
- `SeekerJobFeed` - ฟีดงานสำหรับ Seeker

### Employer Components
- `EmployerBottomNavigation` - เมนูด้านล่างสำหรับ Employer
- `EmployerAddJobForm` - ฟอร์มเพิ่มงาน

## 🤝 สำหรับทีม UI Developer

1. **ทำงานใน packages/ui เป็นหลัก**
2. **ใช้ Storybook** เพื่อ preview components (จะเพิ่มในอนาคต)
3. **อย่าแก้ไขไฟล์ใน apps/** เว้นแต่จำเป็น
4. **ทดสอบ components** ก่อน export

## 📝 การเพิ่ม Component ใหม่

1. สร้างไฟล์ใน `src/components/[category]/`
2. Export ใน `src/index.ts`
3. ทดสอบใน apps/app
4. อัปเดต README นี้
