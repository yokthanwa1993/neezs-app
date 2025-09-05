# NEEZS UI Development Guide

สำหรับ UI Developer ที่ดูแลส่วน Components และ Design System

## 🚀 เริ่มต้น Development

### 1. Setup Environment
```bash
cd packages/ui
pnpm install
```

### 2. Development Modes

#### Mode 1: Component Playground (แนะนำ)
```bash
pnpm playground
# เปิด http://localhost:3001
```
- ทดสอบ components แยกต่างหาก
- ไม่ต้องกังวลเรื่อง business logic
- Focus แค่ UI/UX

#### Mode 2: Watch Build Mode
```bash
pnpm dev
# Auto rebuild เมื่อแก้ไข components
```

#### Mode 3: Test ใน Main App
```bash
# Terminal 1: UI Package watch
cd packages/ui && pnpm dev

# Terminal 2: Main App
cd apps/app && pnpm dev
```

## 📁 โครงสร้างที่ต้องดูแล

```
packages/ui/src/
├── components/
│   ├── ui/           → Basic components (Button, Input, Card)
│   ├── shared/       → Shared app components
│   ├── seeker/       → Job seeker specific
│   └── employer/     → Employer specific
├── lib/
│   └── utils.ts      → Utility functions
└── types/
    └── index.ts      → TypeScript types
```

## 🎨 Design Guidelines

### Colors (Tailwind)
- Primary: `blue-600` 
- Success: `green-500` (LINE style)
- Danger: `red-600`
- Gray: `gray-100` to `gray-900`

### Typography
- Headings: `font-semibold` or `font-bold`
- Body: `font-normal`
- Small text: `text-sm text-gray-600`

### Spacing
- Standard padding: `p-4`
- Card spacing: `p-6`
- Button padding: `px-4 py-2`

## 📱 Platform Considerations

### LINE Mini App
- Use LINE green: `#06C755`
- Compact design
- Touch-friendly buttons (min 44px)

### Mobile Apps
- Native feel
- Respect safe areas
- Smooth animations

### Web
- Responsive design
- Hover states
- Keyboard navigation

## 🔧 Available Tools

### Imports ที่ใช้ได้
```tsx
import { cn } from '../lib/utils';           // Class name utility
import { Button } from './ui/button';        // Basic components
import { Card } from './ui/card';
// ... other components
```

### Example Component
```tsx
import React from 'react';
import { cn } from '../lib/utils';

interface JobCardProps {
  title: string;
  company: string;
  salary: string;
  className?: string;
}

export function JobCard({ title, company, salary, className }: JobCardProps) {
  return (
    <div className={cn(
      "bg-white border border-gray-200 rounded-lg p-6 shadow-sm",
      className
    )}>
      <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
      <p className="text-gray-600 mt-1">{company}</p>
      <div className="flex justify-between items-center mt-4">
        <span className="text-green-600 font-medium">{salary}</span>
        <Button size="sm">Apply</Button>
      </div>
    </div>
  );
}
```

## ✅ Checklist ก่อน Submit

- [ ] ทดสอบใน Playground
- [ ] Responsive design (mobile/desktop)
- [ ] Dark mode support (ถ้ามี)
- [ ] Accessibility (keyboard navigation)
- [ ] Performance (ไม่ใช้ inline styles)

## 🤝 Collaboration

### การ Sync กับ Main Developer
1. UI Developer: พัฒนาใน `packages/ui`
2. Main Developer: ใช้ผ่าน `@neezs/ui` import
3. การ Review: สร้าง PR สำหรับ UI changes

### Communication
- แจ้งเมื่อมี breaking changes
- Document component props ให้ชัดเจน
- ใช้ TypeScript interfaces

---

Happy coding! 🎨✨
