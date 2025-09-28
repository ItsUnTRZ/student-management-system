// Student Search Page
// ไฟล์นี้เป็นหน้าสำหรับค้นหานักศึกษาแบบละเอียด

'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import Layout from '@/components/layout/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import StudentTable from '@/components/students/StudentTable'
import SearchBar from '@/components/students/SearchBar'
import FilterPanel from '@/components/students/FilterPanel'
import { Student, StudentFilters, Pagination } from '@/types'
import { getStudents } from '@/lib/firestore'
import { Search, Users } from 'lucide-react'

// หน้าสำหรับค้นหานักศึกษาแบบละเอียด
export default function StudentSearchPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<StudentFilters>({
    search: '',
    major: '',
    year: null,
    status: '',
  })
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })

  // โหลดข้อมูลนักศึกษา
  const loadStudents = async () => {
    try {
      setLoading(true)
      const result = await getStudents(filters, {
        page: pagination.page,
        limit: pagination.limit,
      })
      setStudents(result.students)
      setPagination(result.pagination)
    } catch (error: any) {
      toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูลนักศึกษา')
      console.error('Error loading students:', error)
    } finally {
      setLoading(false)
    }
  }

  // โหลดข้อมูลเมื่อ filters เปลี่ยน
  useEffect(() => {
    loadStudents()
  }, [filters, pagination.page])

  // ฟังก์ชันสำหรับค้นหา
  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, search: query }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  // ฟังก์ชันสำหรับอัปเดตตัวกรอง
  const handleFiltersChange = (newFilters: StudentFilters) => {
    setFilters(newFilters)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  // ฟังก์ชันสำหรับรีเซ็ตตัวกรอง
  const handleResetFilters = () => {
    setFilters({
      search: '',
      major: '',
      year: null,
      status: '',
    })
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  // ฟังก์ชันสำหรับดูข้อมูลนักศึกษา
  const handleView = (student: Student) => {
    window.location.href = `/students/${student.id}`
  }

  // ฟังก์ชันสำหรับแก้ไขข้อมูลนักศึกษา
  const handleEdit = (student: Student) => {
    window.location.href = `/students/${student.id}`
  }

  // ฟังก์ชันสำหรับลบนักศึกษา
  const handleDelete = (student: Student) => {
    // ไปที่หน้า students หลักเพื่อลบ
    window.location.href = `/students`
  }

  // ฟังก์ชันสำหรับเปลี่ยนหน้า
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Search className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ค้นหานักศึกษา</h1>
              <p className="mt-1 text-sm text-gray-500">
                ค้นหาและกรองข้อมูลนักศึกษาตามเงื่อนไขต่างๆ
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3">
              <SearchBar
                onSearch={handleSearch}
                placeholder="ค้นหาตามชื่อ, รหัสนักศึกษา, สาขาวิชา, หรือชั้นปี..."
              />
            </div>
            <div className="lg:col-span-1">
              <FilterPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onReset={handleResetFilters}
              />
            </div>
          </div>

          {/* Search Results */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">ผลการค้นหา</h3>
                <div className="text-sm text-gray-500">
                  พบ {pagination.total} รายการ
                </div>
              </div>

              <StudentTable
                students={students}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={loading}
              />
            </div>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                แสดง {((pagination.page - 1) * pagination.limit) + 1} ถึง{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} จาก{' '}
                {pagination.total} รายการ
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ก่อนหน้า
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ถัดไป
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && students.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่พบข้อมูลนักศึกษา</h3>
              <p className="mt-1 text-sm text-gray-500">
                ลองเปลี่ยนคำค้นหาหรือตัวกรองเพื่อหาข้อมูลที่ต้องการ
              </p>
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
