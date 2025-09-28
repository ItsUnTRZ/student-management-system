// Student Table Component
// ไฟล์นี้แสดงตารางรายชื่อนักศึกษาแบบ responsive

'use client'

import { Student } from '@/types'
import { Edit, Eye, Trash2, User } from 'lucide-react'
import Button from '../ui/Button'
import { useState, useMemo, useCallback, memo } from 'react'

interface StudentTableProps {
  students: Student[]
  onView: (student: Student) => void
  onEdit: (student: Student) => void
  onDelete: (student: Student) => void
  loading?: boolean
}

// Component สำหรับแสดงตารางนักศึกษา
const StudentTable: React.FC<StudentTableProps> = memo(({
  students,
  onView,
  onEdit,
  onDelete,
  loading = false,
}) => {
  const [sortField, setSortField] = useState<keyof Student>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // ฟังก์ชันสำหรับเรียงลำดับข้อมูล
  const handleSort = useCallback((field: keyof Student) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }, [sortField, sortDirection])

  // เรียงลำดับข้อมูล
  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [students, sortField, sortDirection])

  // ฟังก์ชันสำหรับแสดงสถานะ
  const getStatusBadge = useCallback((status: string) => {
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
  }, [])

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('studentId')}
              >
                รหัสนักศึกษา
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('name')}
              >
                ชื่อ-นามสกุล
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('major')}
              >
                สาขาวิชา
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('year')}
              >
                ชั้นปี
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('status')}
              >
                สถานะ
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                การดำเนินการ
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {student.studentId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.major}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.year}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(student.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(student)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(student)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(student)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden">
        {sortedStudents.map((student) => (
          <div key={student.id} className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{student.name}</p>
                  <p className="text-sm text-gray-500">{student.studentId}</p>
                  <p className="text-sm text-gray-500">{student.major} - ปี {student.year}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(student.status)}
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(student)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(student)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(student)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {students.length === 0 && (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่มีข้อมูลนักศึกษา</h3>
          <p className="mt-1 text-sm text-gray-500">เริ่มต้นด้วยการเพิ่มนักศึกษาใหม่</p>
        </div>
      )}
    </div>
  )
})

StudentTable.displayName = 'StudentTable'

export default StudentTable
