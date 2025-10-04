// สคริปต์เพิ่มรายวิชาตัวอย่าง
// รันคำสั่ง: node scripts/add-sample-courses.js

const { initializeApp } = require('firebase/app')
const { getFirestore, collection, addDoc, getDocs, query } = require('firebase/firestore')

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAj1ngOjgNLJ2yrSv1Mgk__MjbIfFb8Yx0",
  authDomain: "student-management-syste-412cf.firebaseapp.com",
  projectId: "student-management-syste-412cf",
  storageBucket: "student-management-syste-412cf.firebasestorage.app",
  messagingSenderId: "427336177993",
  appId: "1:427336177993:web:585da65ef17e48b8d62298"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// รายวิชาตัวอย่าง
const sampleCourses = [
  {
    courseId: "CS101",
    name: "Computer Programming",
    credits: 3,
    instructor: "อ.สมชาย ใจดี",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    courseId: "CS102", 
    name: "Data Structures",
    credits: 3,
    instructor: "อ.สมหญิง รักการเรียน",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    courseId: "CS201",
    name: "Database Systems",
    credits: 3,
    instructor: "อ.พิมพ์ใจ เก่งมาก",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    courseId: "CS202",
    name: "Web Development",
    credits: 3,
    instructor: "อ.ชาญชัย โค้ดดี",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    courseId: "CS301",
    name: "Software Engineering",
    credits: 3,
    instructor: "อ.วิชาญ พัฒนา",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    courseId: "CS302",
    name: "Mobile App Development",
    credits: 3,
    instructor: "อ.สมาร์ท โฟนดี",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    courseId: "MATH101",
    name: "Calculus I",
    credits: 3,
    instructor: "อ.สมศรี เลขาคณิต",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    courseId: "MATH102",
    name: "Statistics",
    credits: 3,
    instructor: "อ.ปัญญา วิเคราะห์",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    courseId: "ENG101",
    name: "English for Communication",
    credits: 3,
    instructor: "อ.จอห์น สมิธ",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    courseId: "PHY101",
    name: "Physics I",
    credits: 3,
    instructor: "อ.นิวตัน แรงดึงดูด",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function addSampleCourses() {
  try {
    console.log('🚀 เริ่มเพิ่มรายวิชาตัวอย่าง...')
    
    // ตรวจสอบว่ามีรายวิชาอยู่แล้วหรือไม่
    const existingCoursesSnapshot = await getDocs(collection(db, 'courses'))
    if (!existingCoursesSnapshot.empty) {
      console.log('⚠️  มีรายวิชาอยู่แล้ว', existingCoursesSnapshot.size, 'รายการ')
      console.log('📚 รายวิชาที่มีอยู่:')
      existingCoursesSnapshot.forEach(doc => {
        const data = doc.data()
        console.log(`   - ${data.courseId}: ${data.name}`)
      })
      return
    }

    // เพิ่มรายวิชาใหม่
    for (const course of sampleCourses) {
      const docRef = await addDoc(collection(db, 'courses'), course)
      console.log(`✅ เพิ่มรายวิชา ${course.courseId}: ${course.name}`)
    }
    
    console.log('🎉 เพิ่มรายวิชาตัวอย่างเสร็จสิ้น!')
    console.log(`📊 รวม ${sampleCourses.length} รายวิชา`)
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error)
  }
}

// รันสคริปต์
addSampleCourses().then(() => {
  console.log('🏁 สคริปต์เสร็จสิ้น')
  process.exit(0)
}).catch(error => {
  console.error('💥 สคริปต์ล้มเหลว:', error)
  process.exit(1)
})