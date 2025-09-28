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
    let q = query(collection(db, 'students'))

    // เพิ่มเงื่อนไขการกรอง
    if (filters.major) {
      q = query(q, where('major', '==', filters.major))
    }
    if (filters.year) {
      q = query(q, where('year', '==', filters.year))
    }
    if (filters.status) {
      q = query(q, where('status', '==', filters.status))
    }

    // เรียงลำดับตามชื่อ
    q = query(q, orderBy('name'))

    // ดึงข้อมูลทั้งหมดเพื่อนับจำนวน
    const allDocs = await getDocs(q)
    const total = allDocs.size
    const totalPages = Math.ceil(total / pagination.limit)

    // คำนวณ offset สำหรับการแบ่งหน้า
    const offset = (pagination.page - 1) * pagination.limit
    q = query(q, limit(pagination.limit))

    // ดึงข้อมูลตามหน้าที่กำหนด
    const querySnapshot = await getDocs(q)
    const students: Student[] = []

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

    // กรองด้วยคำค้นหา (client-side filtering)
    const filteredStudents = students.filter((student) => {
      if (!filters.search) return true
      const searchTerm = filters.search.toLowerCase()
      return (
        student.name.toLowerCase().includes(searchTerm) ||
        student.studentId.toLowerCase().includes(searchTerm) ||
        student.major.toLowerCase().includes(searchTerm)
      )
    })

    return {
      students: filteredStudents,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages,
      },
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
