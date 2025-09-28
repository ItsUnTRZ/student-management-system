// Firestore Seed Script
// ไฟล์นี้ใช้สำหรับเพิ่มข้อมูลตัวอย่างลงใน Firestore

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // ต้องสร้างไฟล์นี้จาก Firebase Console

// เริ่มต้น Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID || 'your-project-id'
});

const db = admin.firestore();

// ข้อมูลตัวอย่างสำหรับนักศึกษา
const sampleStudents = [
  {
    studentId: 'ST001',
    name: 'สมชาย ใจดี',
    dob: new Date('2000-01-15'),
    major: 'วิทยาการคอมพิวเตอร์',
    year: 4,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    studentId: 'ST002',
    name: 'สมหญิง รักเรียน',
    dob: new Date('2001-03-22'),
    major: 'เทคโนโลยีสารสนเทศ',
    year: 3,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    studentId: 'ST003',
    name: 'วิชัย เก่งมาก',
    dob: new Date('1999-11-08'),
    major: 'วิศวกรรมซอฟต์แวร์',
    year: 4,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    studentId: 'ST004',
    name: 'นิดา สวยงาม',
    dob: new Date('2002-07-14'),
    major: 'ระบบสารสนเทศ',
    year: 2,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    studentId: 'ST005',
    name: 'ประเสริฐ ดีมาก',
    dob: new Date('2000-12-03'),
    major: 'วิทยาการคอมพิวเตอร์',
    year: 4,
    status: 'inactive',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// ข้อมูลตัวอย่างสำหรับรายวิชา
const sampleCourses = [
  {
    courseId: 'CS101',
    name: 'Introduction to Programming',
    credits: 3,
    instructor: 'อาจารย์สมชาย',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    courseId: 'CS102',
    name: 'Data Structures',
    credits: 3,
    instructor: 'อาจารย์สมหญิง',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    courseId: 'CS103',
    name: 'Algorithms',
    credits: 3,
    instructor: 'อาจารย์วิชัย',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    courseId: 'CS104',
    name: 'Database Systems',
    credits: 3,
    instructor: 'อาจารย์นิดา',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    courseId: 'CS105',
    name: 'Software Engineering',
    credits: 3,
    instructor: 'อาจารย์ประเสริฐ',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    courseId: 'IT101',
    name: 'Information Technology Fundamentals',
    credits: 3,
    instructor: 'อาจารย์สมชาย',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    courseId: 'IT102',
    name: 'Web Development',
    credits: 3,
    instructor: 'อาจารย์สมหญิง',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    courseId: 'SE101',
    name: 'Software Design Patterns',
    credits: 3,
    instructor: 'อาจารย์วิชัย',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// ข้อมูลตัวอย่างสำหรับการลงทะเบียนเรียน
const sampleEnrollments = [
  // นักศึกษา ST001
  {
    studentId: 'ST001',
    courseId: 'CS101',
    courseName: 'Introduction to Programming',
    term: '1/2567',
    credits: 3,
    grade: 'A',
    gradePoint: 4.0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    studentId: 'ST001',
    courseId: 'CS102',
    courseName: 'Data Structures',
    term: '1/2567',
    credits: 3,
    grade: 'B+',
    gradePoint: 3.5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    studentId: 'ST001',
    courseId: 'CS103',
    courseName: 'Algorithms',
    term: '2/2567',
    credits: 3,
    grade: 'A',
    gradePoint: 4.0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    studentId: 'ST001',
    courseId: 'CS104',
    courseName: 'Database Systems',
    term: '2/2567',
    credits: 3,
    grade: 'B',
    gradePoint: 3.0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // นักศึกษา ST002
  {
    studentId: 'ST002',
    courseId: 'IT101',
    courseName: 'Information Technology Fundamentals',
    term: '1/2567',
    credits: 3,
    grade: 'A',
    gradePoint: 4.0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    studentId: 'ST002',
    courseId: 'IT102',
    courseName: 'Web Development',
    term: '1/2567',
    credits: 3,
    grade: 'B+',
    gradePoint: 3.5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    studentId: 'ST002',
    courseId: 'CS101',
    courseName: 'Introduction to Programming',
    term: '2/2567',
    credits: 3,
    grade: 'A',
    gradePoint: 4.0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // นักศึกษา ST003
  {
    studentId: 'ST003',
    courseId: 'SE101',
    courseName: 'Software Design Patterns',
    term: '1/2567',
    credits: 3,
    grade: 'A',
    gradePoint: 4.0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    studentId: 'ST003',
    courseId: 'CS105',
    courseName: 'Software Engineering',
    term: '1/2567',
    credits: 3,
    grade: 'B+',
    gradePoint: 3.5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // นักศึกษา ST004
  {
    studentId: 'ST004',
    courseId: 'IT101',
    courseName: 'Information Technology Fundamentals',
    term: '1/2567',
    credits: 3,
    grade: 'B',
    gradePoint: 3.0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    studentId: 'ST004',
    courseId: 'IT102',
    courseName: 'Web Development',
    term: '1/2567',
    credits: 3,
    grade: 'B+',
    gradePoint: 3.5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// ฟังก์ชันสำหรับเพิ่มข้อมูลนักศึกษา
async function seedStudents() {
  console.log('กำลังเพิ่มข้อมูลนักศึกษา...');
  
  for (const student of sampleStudents) {
    try {
      await db.collection('students').add(student);
      console.log(`เพิ่มนักศึกษา ${student.name} (${student.studentId}) สำเร็จ`);
    } catch (error) {
      console.error(`เกิดข้อผิดพลาดในการเพิ่มนักศึกษา ${student.name}:`, error);
    }
  }
}

// ฟังก์ชันสำหรับเพิ่มข้อมูลรายวิชา
async function seedCourses() {
  console.log('กำลังเพิ่มข้อมูลรายวิชา...');
  
  for (const course of sampleCourses) {
    try {
      await db.collection('courses').add(course);
      console.log(`เพิ่มรายวิชา ${course.name} (${course.courseId}) สำเร็จ`);
    } catch (error) {
      console.error(`เกิดข้อผิดพลาดในการเพิ่มรายวิชา ${course.name}:`, error);
    }
  }
}

// ฟังก์ชันสำหรับเพิ่มข้อมูลการลงทะเบียนเรียน
async function seedEnrollments() {
  console.log('กำลังเพิ่มข้อมูลการลงทะเบียนเรียน...');
  
  for (const enrollment of sampleEnrollments) {
    try {
      await db.collection('enrollments').add(enrollment);
      console.log(`เพิ่มการลงทะเบียน ${enrollment.courseName} สำหรับ ${enrollment.studentId} สำเร็จ`);
    } catch (error) {
      console.error(`เกิดข้อผิดพลาดในการเพิ่มการลงทะเบียน:`, error);
    }
  }
}

// ฟังก์ชันสำหรับสร้างผู้ใช้ admin เริ่มต้น
async function createAdminUser() {
  console.log('กำลังสร้างผู้ใช้ admin เริ่มต้น...');
  
  try {
    const adminUsers = [
      {
        uid: 'admin-001',
        name: 'ผู้ดูแลระบบ',
        email: 'admin@example.com',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uid: 'admin-002',
        name: 'ผู้ดูแลระบบ 2',
        email: 'admin2@example.com',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uid: 'admin-003',
        name: 'ผู้ดูแลระบบ 3',
        email: 'admin3@example.com',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
    
    for (const user of adminUsers) {
      await db.collection('users').doc(user.uid).set(user);
    }
    
    console.log('สร้างผู้ใช้ admin เริ่มต้นสำเร็จ');
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการสร้างผู้ใช้ admin:', error);
  }
}

// ฟังก์ชันหลักสำหรับรัน seed script
async function runSeed() {
  try {
    console.log('เริ่มต้นการเพิ่มข้อมูลตัวอย่าง...');
    
    // สร้างผู้ใช้ admin เริ่มต้น
    await createAdminUser();
    
    // เพิ่มข้อมูลนักศึกษา
    await seedStudents();
    
    // เพิ่มข้อมูลรายวิชา
    await seedCourses();
    
    // เพิ่มข้อมูลการลงทะเบียนเรียน
    await seedEnrollments();
    
    console.log('เพิ่มข้อมูลตัวอย่างเสร็จสิ้น!');
    console.log('\nข้อมูลที่เพิ่ม:');
    console.log('- นักศึกษา: 5 คน');
    console.log('- รายวิชา: 8 รายวิชา');
    console.log('- การลงทะเบียนเรียน: 11 รายการ');
    console.log('- ผู้ใช้ admin: 1 คน');
    
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการรัน seed script:', error);
  } finally {
    process.exit(0);
  }
}

// รัน seed script
runSeed();
