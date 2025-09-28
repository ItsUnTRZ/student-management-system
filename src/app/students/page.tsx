// Students List Page
// ไฟล์นี้เป็นหน้าหลักสำหรับแสดงรายชื่อนักศึกษา

'use client'

import { useState, useEffect, useMemo, useCallback, startTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import Layout from '@/components/layout/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import StudentTable from '@/components/students/StudentTable'
import SearchBar from '@/components/students/SearchBar'
import FilterPanel from '@/components/students/FilterPanel'
import StudentForm from '@/components/students/StudentForm'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Student, StudentFilters, StudentFormData, Pagination } from '@/types'
import { getStudents, createStudent, updateStudent, deleteStudent } from '@/lib/firestore'
import { Plus, Users } from 'lucide-react'

// หน้าหลักสำหรับแสดงรายชื่อนักศึกษา
export default function StudentsPage() {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<StudentFilters>({
    search: '',
    major: '',
    year: null,
    status: '',
  })
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const [showForm, setShowForm] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  // โหลดข้อมูลนักศึกษา
  const loadStudents = useCallback(async () => {
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
  }, [filters, pagination.page, pagination.limit])

  // โหลดข้อมูลเมื่อ component mount หรือ filters เปลี่ยน
  useEffect(() => {
    loadStudents()
  }, [loadStudents])

  // ฟังก์ชันสำหรับค้นหา
  const handleSearch = useCallback((query: string) => {
    startTransition(() => {
      setFilters(prev => ({ ...prev, search: query }))
      setPagination(prev => ({ ...prev, page: 1 }))
    })
  }, [])

  // ฟังก์ชันสำหรับอัปเดตตัวกรอง
  const handleFiltersChange = useCallback((newFilters: StudentFilters) => {
    startTransition(() => {
      setFilters(newFilters)
      setPagination(prev => ({ ...prev, page: 1 }))
    })
  }, [])

  // ฟังก์ชันสำหรับรีเซ็ตตัวกรอง
  const handleResetFilters = useCallback(() => {
    setFilters({
      search: '',
      major: '',
      year: null,
      status: '',
    })
    setPagination(prev => ({ ...prev, page: 1 }))
  }, [])

  // ฟังก์ชันสำหรับดูข้อมูลนักศึกษา
  const handleView = useCallback((student: Student) => {
    router.push(`/students/${student.id}`)
  }, [router])

  // ฟังก์ชันสำหรับแก้ไขข้อมูลนักศึกษา
  const handleEdit = useCallback((student: Student) => {
    setSelectedStudent(student)
    setShowForm(true)
  }, [])

  // ฟังก์ชันสำหรับลบนักศึกษา
  const handleDelete = useCallback((student: Student) => {
    setSelectedStudent(student)
    setShowDeleteDialog(true)
  }, [])

  // ฟังก์ชันสำหรับเพิ่มนักศึกษาใหม่
  const handleAddNew = useCallback(() => {
    setSelectedStudent(null)
    setShowForm(true)
  }, [])

  // ฟังก์ชันสำหรับส่งข้อมูลฟอร์ม
  const handleFormSubmit = async (data: StudentFormData) => {
    try {
      setFormLoading(true)
      
      if (selectedStudent) {
        // แก้ไขข้อมูลนักศึกษา
        if (!data.dob) {
          throw new Error('กรุณาระบุวันเกิด');
        }
        await updateStudent(selectedStudent.id, {
          ...data,
          dob: new Date(data.dob),
        })
        toast.success('อัปเดตข้อมูลนักศึกษาสำเร็จ')
      } else {
        // เพิ่มนักศึกษาใหม่
        if (!data.dob) {
          throw new Error('กรุณาระบุวันเกิด');
        }
        await createStudent({
          ...data,
          dob: new Date(data.dob),
          status: 'active', // กำหนดค่า default เป็น 'active'
        })
        toast.success('เพิ่มนักศึกษาใหม่สำเร็จแล้ว')
      }
      

      
      setShowForm(false)
      setSelectedStudent(null)
      loadStudents()
    } catch (error: any) {
      toast.error(error.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล')
    } finally {
      setFormLoading(false)
    }
  }

  // ฟังก์ชันสำหรับยืนยันการลบ
  const handleConfirmDelete = async () => {
    if (!selectedStudent) return

    try {
      setFormLoading(true)
      await deleteStudent(selectedStudent.id)
      toast.success('ลบนักศึกษาสำเร็จ')
      setShowDeleteDialog(false)
      setSelectedStudent(null)
      loadStudents()
    } catch (error: any) {
      toast.error(error.message || 'เกิดข้อผิดพลาดในการลบข้อมูล')
    } finally {
      setFormLoading(false)
    }
  }

  // ฟังก์ชันสำหรับเปลี่ยนหน้า
  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }, [])

  // Memoize pagination info เพื่อป้องกันการ re-render
  const paginationInfo = useMemo(() => ({
    showing: ((pagination.page - 1) * pagination.limit) + 1,
    to: Math.min(pagination.page * pagination.limit, pagination.total),
    total: pagination.total
  }), [pagination.page, pagination.limit, pagination.total])

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">รายชื่อนักศึกษา</h1>
              <p className="mt-1 text-sm text-gray-500">
                จัดการข้อมูลนักศึกษาและผลการเรียน
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button onClick={handleAddNew} leftIcon={<Plus className="w-4 h-4" />}>
                เพิ่มนักศึกษาใหม่
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3">
              <SearchBar
                onSearch={handleSearch}
                placeholder="ค้นหาตามชื่อ, รหัสนักศึกษา, หรือสาขาวิชา..."
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

          {/* Students Table */}
          <StudentTable
            students={students}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                แสดง {paginationInfo.showing} ถึง {paginationInfo.to} จาก {paginationInfo.total} รายการ
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  ก่อนหน้า
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  ถัดไป
                </Button>
              </div>
            </div>
          )}

          {/* Student Form Modal */}
          <Modal
            isOpen={showForm}
            onClose={() => {
              setShowForm(false)
              setSelectedStudent(null)
            }}
            title={selectedStudent ? 'แก้ไขข้อมูลนักศึกษา' : 'เพิ่มนักศึกษาใหม่'}
            size="lg"
          >
            <StudentForm
              student={selectedStudent}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false)
                setSelectedStudent(null)
              }}
              loading={formLoading}
            />
          </Modal>

          {/* Delete Confirmation Dialog */}
          <ConfirmDialog
            isOpen={showDeleteDialog}
            onClose={() => {
              setShowDeleteDialog(false)
              setSelectedStudent(null)
            }}
            onConfirm={handleConfirmDelete}
            title="ยืนยันการลบ"
            message={`คุณต้องการลบนักศึกษา ${selectedStudent?.name} หรือไม่?`}
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
