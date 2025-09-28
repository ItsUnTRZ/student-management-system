// Transcripts Page
// ไฟล์นี้เป็นหน้าสำหรับแสดงใบแสดงผลการเรียน (Transcript)

'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import Layout from '@/components/layout/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Student, Enrollment } from '@/types'
import { getStudents, getStudentEnrollments } from '@/lib/firestore'
import { calculateCumulativeGPA, calculateTermGPAs, generateAcademicReport } from '@/lib/gpaCalculator'
import { GraduationCap, Search, Download, FileText, Award, Calendar } from 'lucide-react'

// หน้าสำหรับแสดงใบแสดงผลการเรียน
export default function TranscriptsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTerm, setSelectedTerm] = useState('')

  // โหลดข้อมูลเริ่มต้น
  const loadInitialData = async () => {
    try {
      setLoading(true)
      const studentsData = await getStudents(
        { search: '', major: '', year: null, status: 'active' }, 
        { page: 1, limit: 100 }
      )
      setStudents(studentsData.students)
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

  // ฟังก์ชันสำหรับกรองตามภาคเรียน
  const filteredEnrollments = selectedTerm 
    ? enrollments.filter(e => e.term === selectedTerm)
    : enrollments

  // คำนวณข้อมูลผลการเรียน
  const academicReport = selectedStudent ? generateAcademicReport(enrollments) : null
  const termGPAs = selectedStudent ? calculateTermGPAs(enrollments) : []

  // ฟังก์ชันสำหรับดาวน์โหลดใบแสดงผลการเรียน
  const handleDownloadTranscript = () => {
    if (!selectedStudent) return

    // สร้างข้อมูลสำหรับ PDF
    const transcriptData = {
      student: selectedStudent,
      enrollments: filteredEnrollments,
      academicReport,
      termGPAs,
      generatedDate: new Date().toLocaleDateString('th-TH'),
    }

    // ในที่นี้จะแสดงข้อมูลใน console
    // ในระบบจริงควรใช้ jsPDF หรือ html2pdf
    console.log('Transcript Data:', transcriptData)
    toast.success('กำลังสร้างใบแสดงผลการเรียน...')
  }

  // ฟังก์ชันสำหรับแสดงสถานะการจบการศึกษา
  const getGraduationStatus = () => {
    if (!academicReport) return null

    const { graduationStatus } = academicReport
    return graduationStatus
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <GraduationCap className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ใบแสดงผลการเรียน</h1>
              <p className="mt-1 text-sm text-gray-500">
                ดูและดาวน์โหลดใบแสดงผลการเรียนของนักศึกษา
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

            {/* Transcript Content */}
            <div className="lg:col-span-2">
              {selectedStudent ? (
                <div className="space-y-6">
                  {/* Student Info and Actions */}
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
                        <Button
                          onClick={handleDownloadTranscript}
                          leftIcon={<Download className="w-4 h-4" />}
                        >
                          ดาวน์โหลด
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Academic Summary */}
                  {academicReport && (
                    <div className="bg-white shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">สรุปผลการเรียน</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-500">เกรดเฉลี่ยสะสม</p>
                            <p className="text-3xl font-bold text-primary-600">
                              {academicReport.cumulativeGPA.gpa.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {academicReport.cumulativeGPA.totalCredits} หน่วยกิต
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-500">รายวิชาที่ลงทะเบียน</p>
                            <p className="text-3xl font-bold text-secondary-600">
                              {academicReport.totalEnrollments}
                            </p>
                            <p className="text-sm text-gray-500">รายวิชา</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-500">รายวิชาที่ผ่าน</p>
                            <p className="text-3xl font-bold text-green-600">
                              {academicReport.completedCourses}
                            </p>
                            <p className="text-sm text-gray-500">รายวิชา</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Term Filter */}
                  {enrollments.length > 0 && (
                    <div className="bg-white shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">กรองตามภาคเรียน</h3>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setSelectedTerm('')}
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              selectedTerm === ''
                                ? 'bg-primary-100 text-primary-800'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            ทั้งหมด
                          </button>
                          {termGPAs.map((termGPA, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedTerm(termGPA.term)}
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                selectedTerm === termGPA.term
                                  ? 'bg-primary-100 text-primary-800'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {termGPA.term}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Course List */}
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">รายวิชาที่ลงทะเบียน</h3>
                      
                      {filteredEnrollments.length > 0 ? (
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
                              {filteredEnrollments.map((enrollment) => (
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
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <FileText className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่มีข้อมูลการลงทะเบียน</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {selectedTerm ? 'ไม่พบรายวิชาในภาคเรียนที่เลือก' : 'นักศึกษาคนนี้ยังไม่ได้ลงทะเบียนเรียนในรายวิชาใดๆ'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Graduation Status */}
                  {getGraduationStatus() && (
                    <div className="bg-white shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">สถานะการจบการศึกษา</h3>
                        <div className="flex items-center space-x-3">
                          <Award className={`w-8 h-8 ${
                            getGraduationStatus()?.canGraduate ? 'text-green-600' : 'text-yellow-600'
                          }`} />
                          <div>
                            <p className={`text-sm font-medium ${
                              getGraduationStatus()?.canGraduate ? 'text-green-800' : 'text-yellow-800'
                            }`}>
                              {getGraduationStatus()?.canGraduate ? 'สามารถจบการศึกษาได้' : 'ยังไม่สามารถจบการศึกษาได้'}
                            </p>
                            <p className="text-sm text-gray-500">
                              หน่วยกิตที่ลงทะเบียน: {getGraduationStatus()?.currentCredits} หน่วยกิต
                              {getGraduationStatus()?.remainingCredits > 0 && 
                                ` (ขาดอีก ${getGraduationStatus()?.remainingCredits} หน่วยกิต)`
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6 text-center">
                    <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">เลือกนักศึกษา</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      เลือกนักศึกษาจากรายการด้านซ้ายเพื่อดูใบแสดงผลการเรียน
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
