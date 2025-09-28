// GPA Calculation Service
// ไฟล์นี้จัดการการคำนวณเกรดเฉลี่ย (GPA) และเกรดเฉลี่ยสะสม (GPAX)

import { Enrollment, TermGPA, CumulativeGPA, Grade } from '@/types'

// ตารางการแปลงเกรดเป็นคะแนน
// ใช้ระบบเกรด 4.0 ตามมาตรฐานมหาวิทยาลัยไทย
const GRADE_POINTS: Record<string, number> = {
  'A': 4.0,
  'B+': 3.5,
  'B': 3.0,
  'C+': 2.5,
  'C': 2.0,
  'D+': 1.5,
  'D': 1.0,
  'F': 0.0,
  'S': 0.0, // Satisfactory (ไม่นับใน GPA)
  'U': 0.0, // Unsatisfactory (ไม่นับใน GPA)
  'W': 0.0, // Withdraw (ไม่นับใน GPA)
  'I': 0.0, // Incomplete (ไม่นับใน GPA)
}

// ฟังก์ชันสำหรับแปลงเกรดเป็นคะแนน
// รับเกรดตัวอักษร (A, B+, B, C+, C, D+, D, F) และคืนค่าคะแนน
export const getGradePoint = (grade: string): number => {
  const normalizedGrade = grade.toUpperCase().trim()
  return GRADE_POINTS[normalizedGrade] ?? 0.0
}

// ฟังก์ชันสำหรับตรวจสอบว่าเกรดนับใน GPA หรือไม่
// เกรด S, U, W, I ไม่นับใน GPA
export const isGradeCountedInGPA = (grade: string): boolean => {
  const normalizedGrade = grade.toUpperCase().trim()
  const excludedGrades = ['S', 'U', 'W', 'I']
  return !excludedGrades.includes(normalizedGrade)
}

// ฟังก์ชันสำหรับคำนวณ GPA ต่อภาคเรียน
// รับรายการการลงทะเบียนเรียนของภาคเรียนหนึ่ง และคืนค่า GPA
export const calculateTermGPA = (enrollments: Enrollment[]): TermGPA => {
  let totalCredits = 0
  let totalGradePoints = 0

  // คำนวณผลรวมของหน่วยกิตและคะแนนเกรด
  enrollments.forEach((enrollment) => {
    if (enrollment.grade && isGradeCountedInGPA(enrollment.grade)) {
      const gradePoint = getGradePoint(enrollment.grade)
      totalCredits += enrollment.credits
      totalGradePoints += gradePoint * enrollment.credits
    }
  })

  // คำนวณ GPA
  const gpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0.0

  return {
    term: enrollments[0]?.term || '',
    credits: totalCredits,
    gradePoints: totalGradePoints,
    gpa: Math.round(gpa * 100) / 100, // ปัดเศษเป็น 2 ตำแหน่ง
  }
}

// ฟังก์ชันสำหรับคำนวณเกรดเฉลี่ยสะสม (GPAX)
// รับรายการการลงทะเบียนเรียนทั้งหมด และคืนค่า GPAX
export const calculateCumulativeGPA = (enrollments: Enrollment[]): CumulativeGPA => {
  let totalCredits = 0
  let totalGradePoints = 0

  // คำนวณผลรวมของหน่วยกิตและคะแนนเกรดทั้งหมด
  enrollments.forEach((enrollment) => {
    if (enrollment.grade && isGradeCountedInGPA(enrollment.grade)) {
      const gradePoint = getGradePoint(enrollment.grade)
      totalCredits += enrollment.credits
      totalGradePoints += gradePoint * enrollment.credits
    }
  })

  // คำนวณ GPAX
  const gpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0.0

  return {
    totalCredits,
    totalGradePoints,
    gpa: Math.round(gpa * 100) / 100, // ปัดเศษเป็น 2 ตำแหน่ง
  }
}

// ฟังก์ชันสำหรับคำนวณ GPA แยกตามภาคเรียน
// รับรายการการลงทะเบียนเรียนทั้งหมด และคืนค่า GPA ของแต่ละภาคเรียน
export const calculateTermGPAs = (enrollments: Enrollment[]): TermGPA[] => {
  // จัดกลุ่มการลงทะเบียนเรียนตามภาคเรียน
  const enrollmentsByTerm: Record<string, Enrollment[]> = {}
  
  enrollments.forEach((enrollment) => {
    if (!enrollmentsByTerm[enrollment.term]) {
      enrollmentsByTerm[enrollment.term] = []
    }
    enrollmentsByTerm[enrollment.term].push(enrollment)
  })

  // คำนวณ GPA ของแต่ละภาคเรียน
  const termGPAs: TermGPA[] = []
  
  Object.keys(enrollmentsByTerm).forEach((term) => {
    const termGPA = calculateTermGPA(enrollmentsByTerm[term])
    termGPAs.push(termGPA)
  })

  // เรียงลำดับตามภาคเรียน (ใหม่สุดก่อน)
  return termGPAs.sort((a, b) => b.term.localeCompare(a.term))
}

// ฟังก์ชันสำหรับคำนวณเกรดเฉลี่ยของรายวิชา
// ใช้สำหรับการวิเคราะห์ผลการเรียนของรายวิชา
export const calculateCourseGPA = (enrollments: Enrollment[], courseId: string): number => {
  const courseEnrollments = enrollments.filter(
    (enrollment) => enrollment.courseId === courseId && enrollment.grade
  )

  if (courseEnrollments.length === 0) return 0.0

  let totalCredits = 0
  let totalGradePoints = 0

  courseEnrollments.forEach((enrollment) => {
    if (isGradeCountedInGPA(enrollment.grade!)) {
      const gradePoint = getGradePoint(enrollment.grade!)
      totalCredits += enrollment.credits
      totalGradePoints += gradePoint * enrollment.credits
    }
  })

  return totalCredits > 0 ? Math.round((totalGradePoints / totalCredits) * 100) / 100 : 0.0
}

// ฟังก์ชันสำหรับตรวจสอบสถานะการจบการศึกษา
// ตรวจสอบว่านักศึกษาสามารถจบการศึกษาได้หรือไม่
export const checkGraduationStatus = (
  enrollments: Enrollment[],
  requiredCredits: number = 120
): { canGraduate: boolean; currentCredits: number; remainingCredits: number } => {
  const cumulativeGPA = calculateCumulativeGPA(enrollments)
  const currentCredits = cumulativeGPA.totalCredits
  const remainingCredits = Math.max(0, requiredCredits - currentCredits)
  const canGraduate = currentCredits >= requiredCredits && cumulativeGPA.gpa >= 2.0

  return {
    canGraduate,
    currentCredits,
    remainingCredits,
  }
}

// ฟังก์ชันสำหรับสร้างรายงานผลการเรียน
// สร้างรายงานสรุปผลการเรียนของนักศึกษา
export const generateAcademicReport = (enrollments: Enrollment[]) => {
  const cumulativeGPA = calculateCumulativeGPA(enrollments)
  const termGPAs = calculateTermGPAs(enrollments)
  const graduationStatus = checkGraduationStatus(enrollments)

  return {
    cumulativeGPA,
    termGPAs,
    graduationStatus,
    totalEnrollments: enrollments.length,
    completedCourses: enrollments.filter(e => e.grade && isGradeCountedInGPA(e.grade)).length,
  }
}
