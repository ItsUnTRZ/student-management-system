# 🚀 คู่มือการตั้งค่าระบบจัดการนักศึกษา

## 📋 ข้อมูลโปรเจค
- **ชื่อโปรเจค**: ระบบจัดการนักศึกษา (Student Management System)
- **เทคโนโลยี**: Next.js 15, TypeScript, Tailwind CSS, Firebase
- **วัตถุประสงค์**: สำหรับการส่งงานอาจารย์และเรียนรู้เท่านั้น

## 🎯 วิธีใช้งาน (สำหรับเพื่อนที่โคลนโปรเจค)

### 1. โคลนโปรเจค
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

# แก้ไขไฟล์ .env.local ด้วยค่าจริงจาก Firebase Console ของคุณ
```

### 4. ตั้งค่า Firebase Project

#### 4.1 สร้าง Firebase Project
1. ไปที่ [Firebase Console](https://console.firebase.google.com/)
2. คลิก "Add project"
3. ตั้งชื่อโปรเจค (เช่น: `student-management-yourname`)
4. เลือก "Enable Google Analytics" (optional)
5. คลิก "Create project"

#### 4.2 ตั้งค่า Authentication
1. ใน Firebase Console ไปที่ "Authentication"
2. คลิก "Get started"
3. ไปที่แท็บ "Sign-in method"
4. เปิดใช้งาน "Email/Password"
5. คลิก "Save"

#### 4.3 ตั้งค่า Firestore Database
1. ใน Firebase Console ไปที่ "Firestore Database"
2. คลิก "Create database"
3. เลือก "Start in test mode" (สำหรับการทดสอบ)
4. เลือก location (เลือกที่ใกล้ที่สุด)
5. คลิก "Done"

#### 4.4 ตั้งค่า Web App
1. ใน Firebase Console ไปที่ "Project settings" (⚙️)
2. เลื่อนลงไปที่ "Your apps"
3. คลิก "Add app" > "Web" (</>)
4. ตั้งชื่อ app (เช่น: `student-management-web`)
5. คลิก "Register app"
6. คัดลอกค่า config ที่ได้มา

#### 4.5 แก้ไขไฟล์ .env.local
```bash
# เปิดไฟล์ .env.local และแก้ไขค่าต่อไปนี้
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 5. รันโปรเจค
```bash
# รันในโหมด development
npm run dev

# เปิดเบราว์เซอร์ไปที่ http://localhost:3000
```

### 6. ตั้งค่าข้อมูลเริ่มต้น (Optional)
```bash
# รัน seed script เพื่อเพิ่มข้อมูลตัวอย่าง
npm run seed
```

## 🔧 การแก้ไขปัญหาที่พบบ่อย

### ปัญหา: "Firebase: Error (auth/invalid-api-key)"
**วิธีแก้**: ตรวจสอบว่าไฟล์ `.env.local` มีค่าถูกต้องและชื่อตัวแปรถูกต้อง

### ปัญหา: "Firebase: Error (auth/configuration-not-found)"
**วิธีแก้**: ตรวจสอบว่า Firebase project มี Authentication เปิดใช้งานแล้ว

### ปัญหา: "Firebase: Error (firestore/permission-denied)"
**วิธีแก้**: ตรวจสอบว่า Firestore rules ถูกตั้งค่าเป็น test mode หรือแก้ไข rules

### ปัญหา: "Module not found"
**วิธีแก้**: รัน `npm install` อีกครั้ง

## 📁 โครงสร้างไฟล์สำคัญ

```
my-app/
├── .env.local                 # ไฟล์ environment variables
├── env.local.example          # ไฟล์ตัวอย่าง environment variables
├── firestore.rules           # Firestore security rules
├── src/
│   ├── app/                  # Next.js App Router pages
│   ├── components/           # React components
│   ├── lib/                  # Firebase configuration และ utilities
│   └── types/                # TypeScript type definitions
└── scripts/                  # Seed scripts
```

## 🎨 ฟีเจอร์ที่มีในระบบ

1. **ระบบ Authentication** - เข้าสู่ระบบ/ลงทะเบียน
2. **จัดการนักศึกษา** - เพิ่ม/แก้ไข/ลบ/ค้นหานักศึกษา
3. **จัดการเกรด** - บันทึกและคำนวณเกรด
4. **จัดการการลงทะเบียน** - จัดการรายวิชา
5. **ใบแสดงผลการเรียน** - ดูประวัติการเรียน
6. **รายงานสถิติ** - ดูสถิติต่างๆ
7. **จัดการผู้ใช้** - จัดการผู้ใช้ในระบบ
8. **ตั้งค่าระบบ** - ตั้งค่าต่างๆ

## 🚨 หมายเหตุสำคัญ

- **โปรเจคนี้สำหรับการส่งงานอาจารย์เท่านั้น**
- **ไม่ควรใช้ในระบบ production จริง**
- **ข้อมูลทั้งหมดเป็นข้อมูลตัวอย่าง**
- **Firebase project ที่สร้างขึ้นควรลบหลังจากส่งงานแล้ว**

## 📞 การขอความช่วยเหลือ

หากมีปัญหาหรือข้อสงสัย สามารถติดต่อได้ที่:
- GitHub Issues
- Email: [your-email@example.com]
- Line: [your-line-id]

---

**สร้างโดย**: [ชื่อของคุณ]  
**วันที่**: [วันที่สร้าง]  
**เวอร์ชัน**: 1.0.0
