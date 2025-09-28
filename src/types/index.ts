// TypeScript interfaces สำหรับระบบจัดการนักศึกษา
// ไฟล์นี้กำหนดโครงสร้างข้อมูลที่ใช้ในแอปทั้งหมด

// User interface - ข้อมูลผู้ใช้ในระบบ
export interface User {
  uid: string
  name: string
  email: string
  role: 'admin' // บทบาทในระบบ: admin เท่านั้น
  createdAt: Date
  updatedAt: Date
}

// Student interface - ข้อมูลนักศึกษา
export interface Student {
  id: string
  studentId: string // รหัสนักศึกษา
  name: string
  dob: Date // วันเกิด
  major: string // สาขาวิชา
  year: number // ชั้นปี
  status: 'active' | 'inactive' | 'deactivated' // สถานะ
  createdAt: Date
  updatedAt: Date
}

// Course interface - ข้อมูลรายวิชา
export interface Course {
  id: string
  courseId: string // รหัสวิชา
  name: string
  credits: number // หน่วยกิต
  instructor: string // อาจารย์ผู้สอน
  createdAt: Date
  updatedAt: Date
}

// Enrollment interface - ข้อมูลการลงทะเบียนเรียน
export interface Enrollment {
  id: string
  studentId: string
  courseId: string
  courseName: string
  term: string // ภาคเรียน (เช่น "1/2567")
  credits: number
  grade: string | null // เกรด (A, B+, B, C+, C, D+, D, F)
  gradePoint: number | null // คะแนนเกรด (4.0, 3.5, 3.0, 2.5, 2.0, 1.5, 1.0, 0)
  createdAt: Date
  updatedAt: Date
}

// Grade interface - ข้อมูลเกรด
export interface Grade {
  letter: string // เกรดตัวอักษร
  point: number // คะแนนเกรด
}

// Term GPA interface - เกรดเฉลี่ยต่อภาคเรียน
export interface TermGPA {
  term: string
  credits: number
  gradePoints: number
  gpa: number
}

// Cumulative GPA interface - เกรดเฉลี่ยสะสม
export interface CumulativeGPA {
  totalCredits: number
  totalGradePoints: number
  gpa: number
}

// Search filters interface - ตัวกรองการค้นหา
export interface StudentFilters {
  search: string
  major: string
  year: number | null
  status: string
}

// Pagination interface - การแบ่งหน้า
export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

// API Response interface - การตอบกลับจาก API
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Form data interfaces - ข้อมูลฟอร์ม
export interface StudentFormData {
  studentId: string
  name: string
  dob: string
  major: string
  year: number
}

export interface CourseFormData {
  courseId: string
  name: string
  credits: number
  instructor: string
}

export interface GradeFormData {
  studentId: string
  courseId: string
  term: string
  grade: string
}

// Navigation item interface - รายการเมนู
export interface NavItem {
  name: string
  href: string
  icon: string
  roles: string[] // บทบาทที่สามารถเข้าถึงได้
}
