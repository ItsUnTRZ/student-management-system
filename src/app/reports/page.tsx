// Reports Page
// ไฟล์นี้เป็นหน้าสำหรับแสดงรายงานสถิติต่างๆ (Admin only)

'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import Layout from '@/components/layout/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Student, Course, Enrollment } from '@/types'
import { getStudents, getCourses } from '@/lib/firestore'
import { BarChart3, Users, BookOpen, GraduationCap, TrendingUp, Award } from 'lucide-react'

// หน้าสำหรับแสดงรายงานสถิติ
export default function ReportsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  // โหลดข้อมูลเริ่มต้น
  const loadInitialData = async () => {
    try {
      setLoading(true)
      const [studentsData, coursesData] = await Promise.all([
        getStudents({ search: '', major: '', year: null, status: '' }, { page: 1, limit: 1000 }),
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

  // โหลดข้อมูลเมื่อ component mount
  useEffect(() => {
    loadInitialData()
  }, [])

  // คำนวณสถิติต่างๆ
  const statistics = {
    totalStudents: students.length,
    activeStudents: students.filter(s => s.status === 'active').length,
    inactiveStudents: students.filter(s => s.status === 'inactive').length,
    deactivatedStudents: students.filter(s => s.status === 'deactivated').length,
    totalCourses: courses.length,
    studentsByYear: students.reduce((acc, student) => {
      acc[student.year] = (acc[student.year] || 0) + 1
      return acc
    }, {} as Record<number, number>),
    studentsByMajor: students.reduce((acc, student) => {
      acc[student.major] = (acc[student.major] || 0) + 1
      return acc
    }, {} as Record<string, number>),
  }

  // ฟังก์ชันสำหรับแสดงกราฟแท่งแบบง่าย
  const renderBarChart = (data: Record<string, number>, title: string) => {
    const maxValue = Math.max(...Object.values(data))
    
    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-900">{title}</h4>
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex items-center space-x-3">
            <div className="w-20 text-sm text-gray-600 truncate">{key}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full"
                style={{ width: `${(value / maxValue) * 100}%` }}
              />
            </div>
            <div className="w-8 text-sm text-gray-900 text-right">{value}</div>
          </div>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
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
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">รายงานสถิติ</h1>
              <p className="mt-1 text-sm text-gray-500">
                ข้อมูลสถิติและรายงานต่างๆ ของระบบ
              </p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        นักศึกษาทั้งหมด
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {statistics.totalStudents}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Award className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        นักศึกษาที่ใช้งาน
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {statistics.activeStudents}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BookOpen className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        รายวิชาทั้งหมด
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {statistics.totalCourses}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        อัตราการใช้งาน
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {statistics.totalStudents > 0 
                          ? Math.round((statistics.activeStudents / statistics.totalStudents) * 100)
                          : 0
                        }%
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Students by Year */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  จำนวนนักศึกษาแยกตามชั้นปี
                </h3>
                {renderBarChart(statistics.studentsByYear, 'ชั้นปี')}
              </div>
            </div>

            {/* Students by Major */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  จำนวนนักศึกษาแยกตามสาขาวิชา
                </h3>
                {renderBarChart(statistics.studentsByMajor, 'สาขาวิชา')}
              </div>
            </div>
          </div>

          {/* Student Status Breakdown */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                สถานะของนักศึกษา
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-900">ใช้งาน</p>
                  <p className="text-2xl font-bold text-green-600">
                    {statistics.activeStudents}
                  </p>
                  <p className="text-sm text-gray-500">
                    {statistics.totalStudents > 0 
                      ? Math.round((statistics.activeStudents / statistics.totalStudents) * 100)
                      : 0
                    }% ของทั้งหมด
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto bg-yellow-100 rounded-full">
                    <Users className="w-6 h-6 text-yellow-600" />
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-900">ไม่ใช้งาน</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {statistics.inactiveStudents}
                  </p>
                  <p className="text-sm text-gray-500">
                    {statistics.totalStudents > 0 
                      ? Math.round((statistics.inactiveStudents / statistics.totalStudents) * 100)
                      : 0
                    }% ของทั้งหมด
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                    <GraduationCap className="w-6 h-6 text-red-600" />
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-900">ยกเลิก</p>
                  <p className="text-2xl font-bold text-red-600">
                    {statistics.deactivatedStudents}
                  </p>
                  <p className="text-sm text-gray-500">
                    {statistics.totalStudents > 0 
                      ? Math.round((statistics.deactivatedStudents / statistics.totalStudents) * 100)
                      : 0
                    }% ของทั้งหมด
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                สรุปข้อมูลระบบ
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">ข้อมูลนักศึกษา</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• นักศึกษาทั้งหมด: {statistics.totalStudents} คน</li>
                    <li>• นักศึกษาที่ใช้งาน: {statistics.activeStudents} คน</li>
                    <li>• นักศึกษาไม่ใช้งาน: {statistics.inactiveStudents} คน</li>
                    <li>• นักศึกษาที่ยกเลิก: {statistics.deactivatedStudents} คน</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">ข้อมูลรายวิชา</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• รายวิชาทั้งหมด: {statistics.totalCourses} รายวิชา</li>
                    <li>• สาขาวิชาที่มี: {Object.keys(statistics.studentsByMajor).length} สาขา</li>
                    <li>• ชั้นปีที่มีนักศึกษา: {Object.keys(statistics.studentsByYear).length} ชั้นปี</li>
                    <li>• อัตราการใช้งานระบบ: {statistics.totalStudents > 0 
                      ? Math.round((statistics.activeStudents / statistics.totalStudents) * 100)
                      : 0
                    }%</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
