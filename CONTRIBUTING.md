# 🤝 คู่มือการมีส่วนร่วม

## 📋 ข้อมูลโปรเจค
- **ชื่อโปรเจค**: ระบบจัดการนักศึกษา (Student Management System)
- **วัตถุประสงค์**: สำหรับการส่งงานอาจารย์และเรียนรู้เท่านั้น
- **เทคโนโลยี**: Next.js 15, TypeScript, Tailwind CSS, Firebase

## 🚀 วิธีเริ่มต้น

### 1. Fork Repository
1. ไปที่ [GitHub Repository](https://github.com/YOUR_USERNAME/student-management-system)
2. คลิกปุ่ม "Fork" ที่มุมขวาบน
3. เลือก account ที่ต้องการ fork ไป

### 2. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/student-management-system.git
cd student-management-system
```

### 3. ติดตั้ง Dependencies
```bash
npm install
```

### 4. ตั้งค่า Environment Variables
```bash
# คัดลอกไฟล์ตัวอย่าง
cp env.local.example .env.local

# แก้ไขไฟล์ .env.local ด้วยค่าจริงจาก Firebase Console
```

### 5. รันโปรเจค
```bash
npm run dev
```

## 📝 วิธีส่ง Pull Request

### 1. สร้าง Branch ใหม่
```bash
git checkout -b feature/your-feature-name
```

### 2. Commit การเปลี่ยนแปลง
```bash
git add .
git commit -m "Add: คำอธิบายการเปลี่ยนแปลง"
```

### 3. Push ไปยัง Fork
```bash
git push origin feature/your-feature-name
```

### 4. สร้าง Pull Request
1. ไปที่ GitHub Repository
2. คลิก "Compare & pull request"
3. ใส่รายละเอียดการเปลี่ยนแปลง
4. คลิก "Create pull request"

## 📋 ข้อกำหนดการส่ง Pull Request

### ✅ ต้องทำ
- [ ] ใช้ TypeScript อย่างถูกต้อง
- [ ] ใช้ Tailwind CSS สำหรับ styling
- [ ] ใช้ functional components และ hooks
- [ ] เขียน comment เป็นภาษาไทย
- [ ] ทดสอบการทำงานก่อนส่ง
- [ ] อัปเดต README.md หากจำเป็น

### ❌ ห้ามทำ
- [ ] เปลี่ยนโครงสร้างโปรเจคโดยไม่จำเป็น
- [ ] ใช้ class components
- [ ] เขียน comment เป็นภาษาอังกฤษ
- [ ] ลบไฟล์สำคัญ
- [ ] เปลี่ยนชื่อไฟล์โดยไม่จำเป็น

## 🎯 ตัวอย่างการ Commit Message

```bash
# เพิ่มฟีเจอร์ใหม่
git commit -m "Add: เพิ่มฟีเจอร์ค้นหานักศึกษา"

# แก้ไขบัค
git commit -m "Fix: แก้ไขปัญหาการแสดงผลตาราง"

# ปรับปรุง UI
git commit -m "Update: ปรับปรุง UI ของหน้า login"

# ลบฟีเจอร์
git commit -m "Remove: ลบฟีเจอร์ที่ไม่ใช้"
```

## 🔧 การแก้ไขปัญหาที่พบบ่อย

### ปัญหา: "Module not found"
```bash
# ลบ node_modules และติดตั้งใหม่
rm -rf node_modules package-lock.json
npm install
```

### ปัญหา: "Firebase configuration error"
```bash
# ตรวจสอบไฟล์ .env.local
cat .env.local
```

### ปัญหา: "TypeScript error"
```bash
# ตรวจสอบ TypeScript
npm run build
```

## 📞 การขอความช่วยเหลือ

หากมีปัญหาหรือข้อสงสัย สามารถติดต่อได้ที่:
- GitHub Issues
- Email: [your-email@example.com]
- Line: [your-line-id]

## 📄 License

โปรเจคนี้เป็น open source และใช้สำหรับการเรียนการสอนเท่านั้น

---

**สร้างโดย**: [ชื่อของคุณ]  
**วันที่**: [วันที่สร้าง]  
**เวอร์ชัน**: 1.0.0
