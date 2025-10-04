# Firestore Index Deployment Guide

## การติดตั้ง Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

## การ Deploy Indexes
```bash
# Deploy indexes เท่านั้น
firebase deploy --only firestore:indexes

# Deploy ทั้งโปรเจค
firebase deploy
```

## การตรวจสอบ Indexes
```bash
# ดู indexes ปัจจุบัน
firebase firestore:indexes

# ลบ indexes ที่ไม่ใช้
firebase firestore:indexes:delete
```

## Composite Indexes ที่จำเป็น

### Students Collection
1. **major + name** - สำหรับกรองตามสาขาและเรียงตามชื่อ
2. **year + name** - สำหรับกรองตามปีและเรียงตามชื่อ  
3. **status + name** - สำหรับกรองตามสถานะและเรียงตามชื่อ
4. **major + year + name** - สำหรับกรองตามสาขาและปี
5. **major + status + name** - สำหรับกรองตามสาขาและสถานะ
6. **year + status + name** - สำหรับกรองตามปีและสถานะ
7. **major + year + status + name** - สำหรับกรองครบทุกเงื่อนไข

### Enrollments Collection  
1. **studentId + term (desc)** - สำหรับดึงรายการลงทะเบียนของนักศึกษาเรียงตามเทอม

## การแก้ไขปัญหา Index Error

หากพบ error `failed-precondition` ให้:

1. คัดลอก URL จาก error message
2. เปิด URL ใน browser เพื่อสร้าง index
3. หรือใช้คำสั่ง `firebase deploy --only firestore:indexes`

## การเพิ่มประสิทธิภาพ

- ใช้ client-side filtering สำหรับ search เพื่อหลีกเลี่ยง index ที่ซับซ้อน
- จำกัดจำนวน where clauses ที่ใช้ร่วมกับ orderBy
- ใช้ pagination ด้วย limit() และ startAfter()