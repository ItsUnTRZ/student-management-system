// Grades Management Page
// ไฟล์นี้เป็นหน้าสำหรับจัดการเกรดของนักศึกษา

'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import Layout from '@/components/layout/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { Student, Course, Enrollment, GradeFormData } from '@/types'
import { getStudents, getCourses, getStudentEnrollments, updateGrade } from '@/lib/firestore'
import { calculateCumulativeGPA } from '@/lib/gpaCalculator'
import { FileText, Search, Edit, Save, X } from 'lucide-react'

// หน้าสำหรับจัดการเกรด
export default function GradesPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null)
  const [loading, setLoading] = useState(false)
  const [showGradeForm, setShowGradeForm] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [gradeForm, setGradeForm] = useState<GradeFormData>({
    studentId: '',
    courseId: '',
    term: '',
    grade: '',
  })

  // เกรดที่ใช้ในระบบ
  const GRADE_OPTIONS = [
    { value: 'A', label: 'A (4.0)' },
    { value: 'B+', label: 'B+ (3.5)' },
    { value: 'B', label: 'B (3.0)' },
    { value: 'C+', label: 'C+ (2.5)' },
    { value: 'C', label: 'C (2.0)' },
    { value: 'D+', label: 'D+ (1.5)' },
    { value: 'D', label: 'D (1.0)' },
    { value: 'F', label: 'F (0.0)' },
    { value: 'S', label: 'S (ผ่าน)' },
    { value: 'U', label: 'U (ไม่ผ่าน)' },
    { value: 'W', label: 'W (ถอน)' },
    { value: 'I', label: 'I (ไม่สมบูรณ์)' },
  ]

  // โหลดข้อมูลเริ่มต้น
  const loadInitialData = async () => {
    try {
      setLoading(true)
      const [studentsData, coursesData] = await Promise.all([
        getStudents({ search: '', major: '', year: null, status: 'active' }, { page: 1, limit: 100 }),
        getCourses(),
      ])
      setStudents(studentsData.students)
      setCourses(coursesData)
    } catch (error: any) {
      toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูล')
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  // โหลดข้อมูลการลงทะเบียนเรียนของนักศึกษา
  const loadStudentEnrollments = async (studentId: string) => {
    try {
      const enrollmentsData = await getStudentEnrollments(studentId)
      setEnrollments(enrollmentsData)
    } catch (error: any) {
      toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูลการลงทะเบียน')
      console.error('Error loading enrollments:', error)
    }
  }

  // โหลดข้อมูลเมื่อ component mount
  useEffect(() => {
    loadInitialData()
  }, [])

  // ฟังก์ชันสำหรับค้นหานักศึกษา
  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  // กรองนักศึกษาตามคำค้นหา
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.major.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // ฟังก์ชันสำหรับเลือกนักศึกษา
  const handleSelectStudent = async (student: Student) => {
    setSelectedStudent(student)
    await loadStudentEnrollments(student.id)
  }

  // ฟังก์ชันสำหรับแก้ไขเกรด
  const handleEditGrade = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment)
    setGradeForm({
      studentId: enrollment.studentId,
      courseId: enrollment.courseId,
      term: enrollment.term,
      grade: enrollment.grade || '',
    })
    setShowGradeForm(true)
  }

  // ฟังก์ชันสำหรับบันทึกเกรด
  const handleSaveGrade = async () => {
    if (!selectedEnrollment || !gradeForm.grade) return

    try {
      setFormLoading(true)
      
      // คำนวณคะแนนเกรด
      const gradePoints: Record<string, number> = {
        'A': 4.0, 'B+': 3.5, 'B': 3.0, 'C+': 2.5,
        'C': 2.0, 'D+': 1.5, 'D': 1.0, 'F': 0.0,
        'S': 0.0, 'U': 0.0, 'W': 0.0, 'I': 0.0,
      }
      
      const gradePoint = gradePoints[gradeForm.grade] || 0.0
      
      await updateGrade(selectedEnrollment.id, gradeForm.grade, gradePoint)
      
      toast.success('บันทึกเกรดสำเร็จ')
      setShowGradeForm(false)
      setSelectedEnrollment(null)
      
      // โหลดข้อมูลใหม่
      if (selectedStudent) {
        await loadStudentEnrollments(selectedStudent.id)
      }
    } catch (error: any) {
      toast.error(error.message || 'เกิดข้อผิดพลาดในการบันทึกเกรด')
    } finally {
      setFormLoading(false)
    }
  }

  // คำนวณ GPA ของนักศึกษาที่เลือก
  const studentGPA = selectedStudent ? calculateCumulativeGPA(enrollments) : null

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <FileText className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">จัดการเกรด</h1>
              <p className="mt-1 text-sm text-gray-500">
                บันทึกและแก้ไขเกรดของนักศึกษา
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Student Selection */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">เลือกนักศึกษา</h3>
                  
                  {/* Search */}
                  <div className="mb-4">
                    <Input
                      placeholder="ค้นหานักศึกษา..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      leftIcon={<Search className="w-4 h-4" />}
                    />
                  </div>

                  {/* Student List */}
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredStudents.map((student) => (
                      <button
                        key={student.id}
                        onClick={() => handleSelectStudent(student)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          selectedStudent?.id === student.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.studentId}</p>
                        <p className="text-sm text-gray-500">{student.major} - ปี {student.year}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Student Details and Grades */}
            <div className="lg:col-span-2">
              {selectedStudent ? (
                <div className="space-y-6">
                  {/* Student Info */}
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {selectedStudent.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {selectedStudent.studentId} • {selectedStudent.major} • ปี {selectedStudent.year}
                          </p>
                        </div>
                        {studentGPA && (
                          <div className="text-right">
                            <p className="text-sm text-gray-500">เกรดเฉลี่ยสะสม</p>
                            <p className="text-2xl font-bold text-primary-600">
                              {studentGPA.gpa.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {studentGPA.totalCredits} หน่วยกิต
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Enrollments */}
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">รายวิชาที่ลงทะเบียน</h3>
                      
                      {enrollments.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  รหัสวิชา
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  ชื่อวิชา
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  ภาคเรียน
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  หน่วยกิต
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  เกรด
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  การดำเนินการ
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {enrollments.map((enrollment) => (
                                <tr key={enrollment.id}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {enrollment.courseId}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {enrollment.courseName}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {enrollment.term}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {enrollment.credits}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <span className={`font-medium ${
                                      enrollment.grade === 'A' ? 'text-green-600' :
                                      enrollment.grade === 'B+' || enrollment.grade === 'B' ? 'text-blue-600' :
                                      enrollment.grade === 'C+' || enrollment.grade === 'C' ? 'text-yellow-600' :
                                      enrollment.grade === 'D+' || enrollment.grade === 'D' ? 'text-orange-600' :
                                      enrollment.grade === 'F' ? 'text-red-600' :
                                      'text-gray-600'
                                    }`}>
                                      {enrollment.grade || '-'}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditGrade(enrollment)}
                                      leftIcon={<Edit className="w-4 h-4" />}
                                    >
                                      แก้ไข
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <FileText className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่มีรายวิชาที่ลงทะเบียน</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            นักศึกษาคนนี้ยังไม่ได้ลงทะเบียนเรียนในรายวิชาใดๆ
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6 text-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">เลือกนักศึกษา</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      เลือกนักศึกษาจากรายการด้านซ้ายเพื่อดูและจัดการเกรด
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Grade Form Modal */}
          <Modal
            isOpen={showGradeForm}
            onClose={() => {
              setShowGradeForm(false)
              setSelectedEnrollment(null)
            }}
            title="แก้ไขเกรด"
            size="sm"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  รายวิชา
                </label>
                <p className="text-sm text-gray-900">
                  {selectedEnrollment?.courseId} - {selectedEnrollment?.courseName}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ภาคเรียน
                </label>
                <p className="text-sm text-gray-900">{selectedEnrollment?.term}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เกรด
                </label>
                <select
                  value={gradeForm.grade}
                  onChange={(e) => setGradeForm(prev => ({ ...prev, grade: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">เลือกเกรด</option>
                  {GRADE_OPTIONS.map((grade) => (
                    <option key={grade.value} value={grade.value}>
                      {grade.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowGradeForm(false)}
                  disabled={formLoading}
                >
                  ยกเลิก
                </Button>
                <Button
                  onClick={handleSaveGrade}
                  loading={formLoading}
                  disabled={!gradeForm.grade}
                >
                  บันทึก
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
