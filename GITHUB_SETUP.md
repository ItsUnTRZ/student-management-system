# 🚀 คู่มือการสร้าง GitHub Repository

## 📋 ขั้นตอนการสร้าง Repository ใหม่

### 1. ไปที่ GitHub
1. เปิดเบราว์เซอร์ไปที่ [GitHub.com](https://github.com)
2. เข้าสู่ระบบด้วยบัญชี GitHub ของคุณ

### 2. สร้าง Repository ใหม่
1. คลิกปุ่ม **"New"** หรือ **"+"** ที่มุมขวาบน
2. เลือก **"New repository"**

### 3. ตั้งค่า Repository
```
Repository name: student-management-system
Description: ระบบจัดการนักศึกษา (Student Management System) - Next.js 15, TypeScript, Tailwind CSS, Firebase
Visibility: Public (สำหรับการส่งงานอาจารย์)
```

### 4. ตั้งค่าเพิ่มเติม
- ✅ **Add a README file** (ไม่ต้องเลือก เพราะเรามีแล้ว)
- ✅ **Add .gitignore** (ไม่ต้องเลือก เพราะเรามีแล้ว)
- ✅ **Choose a license** (ไม่ต้องเลือก)

### 5. สร้าง Repository
1. คลิก **"Create repository"**
2. GitHub จะแสดงหน้าต่างคำแนะนำ

## 🔗 เชื่อมต่อกับ Local Repository

### 1. เพิ่ม Remote Origin
```bash
git remote add origin https://github.com/itsuntrz/student-management-system.git
```

### 2. ตั้งค่า Branch หลัก
```bash
git branch -M main
```

### 3. Push ไปยัง GitHub
```bash
git push -u origin main
```

## 📝 อัปเดต README.md

### 1. แก้ไข URL ใน README.md
```bash
# เปิดไฟล์ README.md
# แก้ไข YOUR_USERNAME เป็น username จริงของคุณ
```

### 2. แก้ไข URL ใน SETUP_GUIDE.md
```bash
# เปิดไฟล์ SETUP_GUIDE.md
# แก้ไข YOUR_USERNAME เป็น username จริงของคุณ
```

### 3. แก้ไข URL ใน CONTRIBUTING.md
```bash
# เปิดไฟล์ CONTRIBUTING.md
# แก้ไข YOUR_USERNAME เป็น username จริงของคุณ
```

## 🎯 ตั้งค่า Repository

### 1. ตั้งค่า Description
- ไปที่ Settings > General
- แก้ไข Description: `ระบบจัดการนักศึกษา (Student Management System) - Next.js 15, TypeScript, Tailwind CSS, Firebase`

### 2. ตั้งค่า Topics
- ไปที่ Settings > General
- เพิ่ม Topics: `nextjs`, `typescript`, `tailwindcss`, `firebase`, `student-management`, `education`

### 3. ตั้งค่า Website
- ไปที่ Settings > General
- แก้ไข Website: `https://your-username.github.io/student-management-system`

## 📋 ไฟล์ที่ต้องอัปเดต

### 1. README.md
```markdown
git clone https://github.com/YOUR_USERNAME/student-management-system.git
```

### 2. SETUP_GUIDE.md
```markdown
git clone https://github.com/YOUR_USERNAME/student-management-system.git
```

### 3. CONTRIBUTING.md
```markdown
git clone https://github.com/YOUR_USERNAME/student-management-system.git
```

## 🚀 การแชร์ให้เพื่อน

### 1. ส่ง Link Repository
```
https://github.com/YOUR_USERNAME/student-management-system
```

### 2. คำแนะนำสำหรับเพื่อน
```
1. ไปที่ GitHub Repository
2. คลิก "Code" > "Download ZIP"
3. หรือใช้ Git: git clone https://github.com/YOUR_USERNAME/student-management-system.git
4. ดูคู่มือใน README.md
```

## 📞 การขอความช่วยเหลือ

หากมีปัญหาหรือข้อสงสัย สามารถติดต่อได้ที่:
- GitHub Issues
- Email: [your-email@example.com]
- Line: [your-line-id]

---

**สร้างโดย**: [ชื่อของคุณ]  
**วันที่**: [วันที่สร้าง]  
**เวอร์ชัน**: 1.0.0
