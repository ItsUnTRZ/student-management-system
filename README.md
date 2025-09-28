# ระบบจัดการนักศึกษา (Student Management System)

ระบบจัดการข้อมูลนักศึกษาและผลการเรียนที่พัฒนาด้วย Next.js, Firebase และ Tailwind CSS

## 🚀 คุณสมบัติหลัก

- **ระบบ Authentication** - เข้าสู่ระบบด้วย Firebase Auth
- **จัดการนักศึกษา** - CRUD operations สำหรับข้อมูลนักศึกษา
- **จัดการเกรด** - บันทึกและคำนวณเกรดเฉลี่ย
- **ใบแสดงผลการเรียน** - สร้างและดูใบแสดงผลการเรียน
- **รายงานสถิติ** - แสดงสถิติและรายงานต่างๆ
- **ระบบสิทธิ์** - แยกสิทธิ์ Admin และ Staff

## 📋 หน้าต่างๆ ในระบบ (11 หน้า)

1. **หน้าเข้าสู่ระบบ** (`/login`)
2. **หน้าลงทะเบียน** (`/register`)
3. **รายชื่อนักศึกษา** (`/students`)
4. **ค้นหานักศึกษา** (`/students/search`)
5. **รายละเอียดนักศึกษา** (`/students/[id]`)
6. **จัดการเกรด** (`/grades`)
7. **จัดการการลงทะเบียน** (`/enrollments`)
8. **ใบแสดงผลการเรียน** (`/transcripts`)
9. **รายงานสถิติ** (`/reports`)
10. **จัดการผู้ใช้** (`/users`)
11. **ตั้งค่าระบบ** (`/settings`)

## 🛠 เทคโนโลยีที่ใช้

- **Next.js 15** - React Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **Firebase Auth** - Authentication
- **Cloud Firestore** - Database

## 🎯 วัตถุประสงค์

โปรเจคนี้เป็นระบบจัดการนักศึกษาสำหรับการพัฒนาและเรียนรู้เท่านั้น ไม่ได้ออกแบบสำหรับการ deploy ไปยัง production server

## 🚀 การติดตั้งและรัน

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/student-management-system.git
cd student-management-system
```

### 2. ติดตั้ง Dependencies
```bash
npm install
```

### 3. ตั้งค่า Environment Variables
```bash
# คัดลอกไฟล์ตัวอย่าง
cp env.local.example .env.local

# แก้ไขไฟล์ .env.local ด้วยค่าจริงจาก Firebase Console
# หรือใช้ค่าตัวอย่างที่ให้มาได้เลย (สำหรับการทดสอบ)
```

### 4. ตั้งค่า Firebase
1. สร้าง Firebase Project
2. เปิดใช้งาน Authentication (Email/Password)
3. เปิดใช้งาน Firestore Database
4. ตั้งค่า Security Rules จากไฟล์ `firestore.rules`

**ดูคู่มือการตั้งค่าละเอียดได้ที่ [SETUP_GUIDE.md](./SETUP_GUIDE.md)**

### 5. รัน Development Server
```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

### 6. ตั้งค่าข้อมูลเริ่มต้น (Optional)
```bash
# รัน seed script เพื่อเพิ่มข้อมูลตัวอย่าง
npm run seed
```

## ⚡ เริ่มต้นใช้งานได้ทันที

หากต้องการทดสอบระบบทันที:

1. **ใช้ค่าตัวอย่าง**: ไฟล์ `env.local.example` มีค่าตัวอย่างที่พร้อมใช้งาน
2. **สร้าง Firebase Project**: ตามคู่มือใน SETUP_GUIDE.md
3. **แก้ไขไฟล์ .env.local**: ใส่ค่าจริงจาก Firebase Console
4. **รัน `npm run dev`**: เริ่มใช้งานได้เลย!



## 📁 โครงสร้างโปรเจค

```
src/
├── app/                 # Next.js App Router
├── components/          # React Components
│   ├── ui/             # UI Components
│   ├── layout/         # Layout Components
│   └── students/       # Student Components
├── contexts/           # React Contexts
├── lib/                # Utilities and Services
│   ├── __tests__/      # Test files
│   ├── firebase.ts     # Firebase config
│   ├── auth.ts         # Auth service
│   ├── firestore.ts    # Firestore service
│   └── gpaCalculator.ts # GPA calculation
└── types/              # TypeScript types
```

## 🔐 ระบบความปลอดภัย

- Firebase Security Rules (เปิดให้ใช้งานได้ทั้งหมด)
- Form Validation
- Input Sanitization

## 📊 ข้อมูลและโครงสร้าง

### Collections ใน Firestore
- **users** - ข้อมูลผู้ใช้ในระบบ
- **students** - ข้อมูลนักศึกษา
- **courses** - ข้อมูลรายวิชา
- **enrollments** - ข้อมูลการลงทะเบียนเรียน

## 🎨 UI/UX Features

- Responsive Design
- Modern UI with Tailwind CSS
- Loading States
- Error Handling
- Form Validation

## 🚀 Performance

- Code Splitting
- Image Optimization
- Firebase Caching
- Bundle Analysis

## 🐛 การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

1. **Firebase Connection Error**
   - ตรวจสอบ Firebase config
   - ตรวจสอบ API keys ใน .env.local

2. **Build Error**
   - ลบ node_modules และติดตั้งใหม่
   - ตรวจสอบ TypeScript errors

3. **Authentication Error**
   - ตรวจสอบ Firebase Auth settings
   - ตรวจสอบ Authorized domains

## 📝 การพัฒนาต่อ

### การเพิ่มฟีเจอร์ใหม่
1. สร้าง Component ใหม่
2. เพิ่ม Type definitions
3. เพิ่ม Service functions
4. เพิ่ม Tests
5. อัปเดต Firestore rules

## 📄 License

MIT License

## 👥 ผู้พัฒนา

- **Developer**: [ชื่อผู้พัฒนา]
- **Email**: [email@example.com]

---

**หมายเหตุ**: ระบบนี้พัฒนาสำหรับการศึกษาและใช้งานจริง สามารถปรับแต่งและพัฒนาต่อได้ตามความต้องการ