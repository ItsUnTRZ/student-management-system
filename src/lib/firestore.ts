// Firestore database service
// ไฟล์นี้จัดการการเชื่อมต่อและทำงานกับฐานข้อมูล Firestore

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import { Student, Course, Enrollment, User, StudentFilters, Pagination } from '@/types'

// ฟังก์ชันสำหรับแปลง Firestore Timestamp เป็น Date
const convertTimestamp = (timestamp: any): Date => {
  if (timestamp && timestamp.toDate) {
    return timestamp.toDate()
  }
  return new Date(timestamp)
}

// ฟังก์ชันสำหรับแปลง Date เป็น Firestore Timestamp
const convertToTimestamp = (date: Date) => {
  return Timestamp.fromDate(date)
}

// ฟังก์ชันสำหรับจัดการ Firestore Index Error
const handleIndexError = (error: any, operationName: string): Error => {
  if (error.code === 'failed-precondition') {
    console.warn(`⚠️  Firestore Index Required for ${operationName}:`, error.message)
    
    // ดึง URL สำหรับสร้าง index จาก error message
    const indexUrl = error.message.match(/https:\/\/[^\s]+/)
    
    if (indexUrl) {
      console.log('🔗 Create index at:', indexUrl[0])
      return new Error(`
❌ ต้องการสร้าง Firestore Index สำหรับ ${operationName}

🔧 วิธีแก้ไข:
1. คลิกลิงก์นี้: ${indexUrl[0]}
2. หรือใช้คำสั่ง: firebase deploy --only firestore:indexes

💡 เคล็ดลับ: ระบบจะใช้ client-side filtering แทนในขณะนี้
      `)
    }
    
    return new Error(`ต้องการสร้าง Firestore Index สำหรับ ${operationName}`)
  }
  
  return error
}

// ==================== STUDENT OPERATIONS ====================

// สร้างนักศึกษาใหม่
export const createStudent = async (studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const now = new Date()
    const studentWithTimestamps = {
      ...studentData,
      createdAt: convertToTimestamp(now),
      updatedAt: convertToTimestamp(now),
    }

    const docRef = await addDoc(collection(db, 'students'), studentWithTimestamps)
    return docRef.id
  } catch (error: any) {
    throw new Error(`Failed to create student: ${error.message}`)
  }
}

// ดึงข้อมูลนักศึกษาตาม ID
export const getStudent = async (id: string): Promise<Student | null> => {
  try {
    const docRef = doc(db, 'students', id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return null
    }

    const data = docSnap.data()
    return {
      id: docSnap.id,
      ...data,
      dob: convertTimestamp(data.dob),
      createdAt: convertTimestamp(data.createdAt),
      updatedAt: convertTimestamp(data.updatedAt),
    } as Student
  } catch (error: any) {
    throw new Error(`Failed to get student: ${error.message}`)
  }
}

// ดึงรายการนักศึกษาพร้อมการกรองและแบ่งหน้า
export const getStudents = async (
  filters: StudentFilters,
  pagination: { page: number; limit: number }
): Promise<{ students: Student[]; pagination: Pagination }> => {
  try {
    // แก้ไข: ใช้ client-side filtering เพื่อหลีกเลี่ยง composite index
    // เหตุผล: query ที่มี where หลายตัว + orderBy ต้องการ composite index ที่ซับซ้อน
    // การใช้ client-side filtering ทำให้ยืดหยุ่นมากขึ้นและลดความซับซ้อนของ index
    
    let q = query(collection(db, 'students'), orderBy('name'))

    try {
      // ดึงข้อมูลทั้งหมดด้วย query ง่ายๆ
      const querySnapshot = await getDocs(q)
      let students: Student[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        students.push({
          id: doc.id,
          ...data,
          dob: convertTimestamp(data.dob),
          createdAt: convertTimestamp(data.createdAt),
          updatedAt: convertTimestamp(data.updatedAt),
        } as Student)
      })

      // Client-side filtering ทุกเงื่อนไข
      const filteredStudents = students.filter((student) => {
        // กรองตาม search
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase()
          const matchesSearch = (
            student.name.toLowerCase().includes(searchTerm) ||
            student.studentId.toLowerCase().includes(searchTerm) ||
            student.major.toLowerCase().includes(searchTerm)
          )
          if (!matchesSearch) return false
        }

        // กรองตาม major
        if (filters.major && student.major !== filters.major) {
          return false
        }

        // กรองตาม year
        if (filters.year && student.year !== filters.year) {
          return false
        }

        // กรองตาม status
        if (filters.status && student.status !== filters.status) {
          return false
        }

        return true
      })

      // Pagination
      const total = filteredStudents.length
      const totalPages = Math.ceil(total / pagination.limit)
      const offset = (pagination.page - 1) * pagination.limit
      const paginatedStudents = filteredStudents.slice(offset, offset + pagination.limit)

      return {
        students: paginatedStudents,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total,
          totalPages,
        },
      }

    } catch (queryError: any) {
      // ตรวจจับ error เฉพาะ failed-precondition (missing index)
      if (queryError.code === 'failed-precondition') {
        const indexError = handleIndexError(queryError, 'การกรองนักศึกษา')
        throw indexError
      }
      
      throw queryError
    }

  } catch (error: any) {
    throw new Error(`Failed to get students: ${error.message}`)
  }
}

// อัปเดตข้อมูลนักศึกษา
export const updateStudent = async (id: string, updates: Partial<Student>): Promise<void> => {
  try {
    const docRef = doc(db, 'students', id)
    const updateData = {
      ...updates,
      updatedAt: convertToTimestamp(new Date()),
    }
    await updateDoc(docRef, updateData)
  } catch (error: any) {
    throw new Error(`Failed to update student: ${error.message}`)
  }
}

// ลบนักศึกษา (soft delete)
export const deleteStudent = async (id: string): Promise<void> => {
  try {
    await updateStudent(id, { status: 'deactivated' })
  } catch (error: any) {
    throw new Error(`Failed to delete student: ${error.message}`)
  }
}

// ลบนักศึกษาอย่างถาวร (hard delete)
export const permanentlyDeleteStudent = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'students', id)
    await deleteDoc(docRef)
  } catch (error: any) {
    throw new Error(`Failed to permanently delete student: ${error.message}`)
  }
}

// ==================== COURSE OPERATIONS ====================

// สร้างรายวิชาใหม่
export const createCourse = async (courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const now = new Date()
    const courseWithTimestamps = {
      ...courseData,
      createdAt: convertToTimestamp(now),
      updatedAt: convertToTimestamp(now),
    }

    const docRef = await addDoc(collection(db, 'courses'), courseWithTimestamps)
    return docRef.id
  } catch (error: any) {
    throw new Error(`Failed to create course: ${error.message}`)
  }
}

// ดึงรายการรายวิชาทั้งหมด
export const getCourses = async (): Promise<Course[]> => {
  try {
    const q = query(collection(db, 'courses'), orderBy('courseId'))
    const querySnapshot = await getDocs(q)
    const courses: Course[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      courses.push({
        id: doc.id,
        ...data,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
      } as Course)
    })

    return courses
  } catch (error: any) {
    throw new Error(`Failed to get courses: ${error.message}`)
  }
}

// ==================== ENROLLMENT OPERATIONS ====================

// สร้างการลงทะเบียนเรียน
export const createEnrollment = async (enrollmentData: Omit<Enrollment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const now = new Date()
    const enrollmentWithTimestamps = {
      ...enrollmentData,
      createdAt: convertToTimestamp(now),
      updatedAt: convertToTimestamp(now),
    }

    const docRef = await addDoc(collection(db, 'enrollments'), enrollmentWithTimestamps)
    return docRef.id
  } catch (error: any) {
    throw new Error(`Failed to create enrollment: ${error.message}`)
  }
}

// ดึงรายการการลงทะเบียนเรียนของนักศึกษา
export const getStudentEnrollments = async (studentId: string): Promise<Enrollment[]> => {
  try {
    // ลองใช้ query ที่มี composite index ก่อน
    try {
      const q = query(
        collection(db, 'enrollments'),
        where('studentId', '==', studentId),
        orderBy('term', 'desc')
      )
      const querySnapshot = await getDocs(q)
      const enrollments: Enrollment[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        enrollments.push({
          id: doc.id,
          ...data,
          createdAt: convertTimestamp(data.createdAt),
          updatedAt: convertTimestamp(data.updatedAt),
        } as Enrollment)
      })

      return enrollments

    } catch (queryError: any) {
      // ตรวจจับ error failed-precondition
      if (queryError.code === 'failed-precondition') {
        console.warn('⚠️  Enrollment Index Missing, using fallback query')
        
        // Fallback: query แบบง่าย + sort ใน client
        const q = query(
          collection(db, 'enrollments'),
          where('studentId', '==', studentId)
        )
        const querySnapshot = await getDocs(q)
        const enrollments: Enrollment[] = []

        querySnapshot.forEach((doc) => {
          const data = doc.data()
          enrollments.push({
            id: doc.id,
            ...data,
            createdAt: convertTimestamp(data.createdAt),
            updatedAt: convertTimestamp(data.updatedAt),
          } as Enrollment)
        })

        // Client-side sorting
        enrollments.sort((a, b) => b.term.localeCompare(a.term))
        
        // แสดงคำแนะนำสร้าง index (ไม่ throw error เพราะมี fallback)
        const indexError = handleIndexError(queryError, 'การเรียงลำดับการลงทะเบียน')
        console.warn(indexError.message)

        return enrollments
      }
      
      throw queryError
    }

  } catch (error: any) {
    throw new Error(`Failed to get student enrollments: ${error.message}`)
  }
}

// อัปเดตเกรด
export const updateGrade = async (enrollmentId: string, grade: string, gradePoint: number): Promise<void> => {
  try {
    const docRef = doc(db, 'enrollments', enrollmentId)
    await updateDoc(docRef, {
      grade,
      gradePoint,
      updatedAt: convertToTimestamp(new Date()),
    })
  } catch (error: any) {
    throw new Error(`Failed to update grade: ${error.message}`)
  }
}

// ลบการลงทะเบียนเรียน
export const deleteEnrollment = async (enrollmentId: string): Promise<void> => {
  try {
    const docRef = doc(db, 'enrollments', enrollmentId)
    await deleteDoc(docRef)
  } catch (error: any) {
    throw new Error(`Failed to delete enrollment: ${error.message}`)
  }
}
