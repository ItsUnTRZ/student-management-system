// Student Details Page
// ไฟล์นี้เป็นหน้าสำหรับแสดงรายละเอียดของนักศึกษาแต่ละคน

'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import Layout from '@/components/layout/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import StudentForm from '@/components/students/StudentForm'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Student, StudentFormData, Enrollment } from '@/types'
import { getStudent, updateStudent, deleteStudent, getStudentEnrollments } from '@/lib/firestore'
import { calculateCumulativeGPA, calculateTermGPAs } from '@/lib/gpaCalculator'
import { 
  Edit, 
  Trash2, 
  ArrowLeft, 
  User, 
  Calendar, 
  BookOpen, 
  GraduationCap,
  Award,
  FileText
} from 'lucide-react'

// หน้าสำหรับแสดงรายละเอียดของนักศึกษา
export default function StudentDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const studentId = params.id as string

  const [student, setStudent] = useState<Student | null>(null)
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  // โหลดข้อมูลนักศึกษา
  const loadStudent = async () => {
    try {
      setLoading(true)
      const studentData = await getStudent(studentId)
      if (!studentData) {
        toast.error('ไม่พบข้อมูลนักศึกษา')
        router.push('/students')
        return
      }
      setStudent(studentData)
    } catch (error: any) {
      toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูลนักศึกษา')
      console.error('Error loading student:', error)
    } finally {
      setLoading(false)
    }
  }

  // โหลดข้อมูลการลงทะเบียนเรียน
  const loadEnrollments = async () => {
    try {
      const enrollmentsData = await getStudentEnrollments(studentId)
      setEnrollments(enrollmentsData)
    } catch (error: any) {
      console.error('Error loading enrollments:', error)
    }
  }

  // โหลดข้อมูลเมื่อ component mount
  useEffect(() => {
    if (studentId) {
      loadStudent()
      loadEnrollments()
    }
  }, [studentId])

  // ฟังก์ชันสำหรับแก้ไขข้อมูลนักศึกษา
  const handleEdit = () => {
    setShowForm(true)
  }

  // ฟังก์ชันสำหรับลบนักศึกษา
  const handleDelete = () => {
    setShowDeleteDialog(true)
  }

  // ฟังก์ชันสำหรับส่งข้อมูลฟอร์ม
  const handleFormSubmit = async (data: StudentFormData) => {
    if (!student) return

    try {
      setFormLoading(true)
      await updateStudent(student.id, data)
      toast.success('อัปเดตข้อมูลนักศึกษาสำเร็จ')
      setShowForm(false)
      loadStudent()
    } catch (error: any) {
      toast.error(error.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล')
    } finally {
      setFormLoading(false)
    }
  }

  // ฟังก์ชันสำหรับยืนยันการลบ
  const handleConfirmDelete = async () => {
    if (!student) return

    try {
      setFormLoading(true)
      await deleteStudent(student.id)
      toast.success('ลบนักศึกษาสำเร็จ')
      router.push('/students')
    } catch (error: any) {
      toast.error(error.message || 'เกิดข้อผิดพลาดในการลบข้อมูล')
    } finally {
      setFormLoading(false)
    }
  }

  // ฟังก์ชันสำหรับแสดงสถานะ
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'ใช้งาน', className: 'bg-green-100 text-green-800' },
      inactive: { label: 'ไม่ใช้งาน', className: 'bg-yellow-100 text-yellow-800' },
      deactivated: { label: 'ยกเลิก', className: 'bg-red-100 text-red-800' },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    )
  }

  // คำนวณ GPA
  const cumulativeGPA = calculateCumulativeGPA(enrollments)
  const termGPAs = calculateTermGPAs(enrollments)

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <LoadingSpinner size="lg" text="กำลังโหลดข้อมูลนักศึกษา..." />
        </Layout>
      </ProtectedRoute>
    )
  }

  if (!student) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่พบข้อมูลนักศึกษา</h3>
            <p className="mt-1 text-sm text-gray-500">นักศึกษาคนนี้อาจถูกลบหรือไม่พบในระบบ</p>
          </div>
        </Layout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                กลับ
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
                <p className="text-sm text-gray-500">{student.studentId}</p>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-2">
              <Button
                variant="outline"
                onClick={handleEdit}
                leftIcon={<Edit className="w-4 h-4" />}
              >
                แก้ไข
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                ลบ
              </Button>
            </div>
          </div>

          {/* Student Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">ข้อมูลส่วนตัว</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">ชื่อ-นามสกุล</p>
                    <p className="text-sm text-gray-900">{student.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">วันเกิด</p>
                    <p className="text-sm text-gray-900">
                      {student.dob.toLocaleDateString('th-TH')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">สาขาวิชา</p>
                    <p className="text-sm text-gray-900">{student.major}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <GraduationCap className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">ชั้นปี</p>
                    <p className="text-sm text-gray-900">ปี {student.year}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">สถานะ</p>
                    {getStatusBadge(student.status)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Performance */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">ผลการเรียน</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">เกรดเฉลี่ยสะสม</p>
                  <p className="text-3xl font-bold text-primary-600">
                    {cumulativeGPA.gpa.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {cumulativeGPA.totalCredits} หน่วยกิต
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">รายวิชาที่ลงทะเบียน</p>
                  <p className="text-3xl font-bold text-secondary-600">
                    {enrollments.length}
                  </p>
                  <p className="text-sm text-gray-500">รายวิชา</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">ภาคเรียนที่ลงทะเบียน</p>
                  <p className="text-3xl font-bold text-green-600">
                    {termGPAs.length}
                  </p>
                  <p className="text-sm text-gray-500">ภาคเรียน</p>
                </div>
              </div>
            </div>
          </div>

          {/* Term GPAs */}
          {termGPAs.length > 0 && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">เกรดเฉลี่ยต่อภาคเรียน</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ภาคเรียน
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          หน่วยกิต
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          เกรดเฉลี่ย
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {termGPAs.map((termGPA, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {termGPA.term}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {termGPA.credits}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className="font-medium">{termGPA.gpa.toFixed(2)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Enrollments */}
          {enrollments.length > 0 && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">รายวิชาที่ลงทะเบียน</h3>
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
                            {enrollment.grade || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Student Form Modal */}
          <Modal
            isOpen={showForm}
            onClose={() => setShowForm(false)}
            title="แก้ไขข้อมูลนักศึกษา"
            size="lg"
          >
            <StudentForm
              student={student}
              onSubmit={handleFormSubmit}
              onCancel={() => setShowForm(false)}
              loading={formLoading}
            />
          </Modal>

          {/* Delete Confirmation Dialog */}
          <ConfirmDialog
            isOpen={showDeleteDialog}
            onClose={() => setShowDeleteDialog(false)}
            onConfirm={handleConfirmDelete}
            title="ยืนยันการลบ"
            message={`คุณต้องการลบนักศึกษา ${student.name} หรือไม่?`}
            confirmText="ลบ"
            cancelText="ยกเลิก"
            variant="danger"
            loading={formLoading}
          />
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
