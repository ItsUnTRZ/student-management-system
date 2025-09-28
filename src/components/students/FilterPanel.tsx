// Filter Panel Component
// ไฟล์นี้สร้างแผงกรองข้อมูลนักศึกษา

'use client'

import { useState, useCallback, memo } from 'react'
import { Filter, X } from 'lucide-react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { StudentFilters } from '@/types'

interface FilterPanelProps {
  filters: StudentFilters
  onFiltersChange: (filters: StudentFilters) => void
  onReset: () => void
}

// ตัวเลือกสำหรับสาขาวิชา
const MAJOR_OPTIONS = [
  'วิทยาการคอมพิวเตอร์',
  'เทคโนโลยีสารสนเทศ',
  'วิศวกรรมซอฟต์แวร์',
  'ระบบสารสนเทศ',
  'การจัดการ',
  'บัญชี',
  'การตลาด',
  'อื่นๆ',
]

// ตัวเลือกสำหรับชั้นปี
const YEAR_OPTIONS = [1, 2, 3, 4, 5, 6]

// ตัวเลือกสำหรับสถานะ
const STATUS_OPTIONS = [
  { value: 'active', label: 'ใช้งาน' },
  { value: 'inactive', label: 'ไม่ใช้งาน' },
  { value: 'deactivated', label: 'ยกเลิก' },
]

// Component สำหรับแผงกรองข้อมูล
const FilterPanel: React.FC<FilterPanelProps> = memo(({
  filters,
  onFiltersChange,
  onReset,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Update filters immediately on input change
  const updateFilter = useCallback((field: keyof StudentFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  }, [filters, onFiltersChange]);

  // ฟังก์ชันสำหรับรีเซ็ตตัวกรอง
  const handleReset = useCallback(() => {
    onReset()
    setIsOpen(false)
  }, [onReset])

  // ตรวจสอบว่ามีตัวกรองที่ใช้งานอยู่หรือไม่
  const hasActiveFilters = 
    filters.major || 
    filters.year || 
    filters.status

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Filter header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-900">ตัวกรอง</h3>
            {hasActiveFilters && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                ใช้งาน
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? 'ซ่อน' : 'แสดง'}
          </Button>
        </div>
      </div>

      {/* Filter content */}
      {isOpen && (
        <div className="p-4 space-y-4">
          {/* สาขาวิชา */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              สาขาวิชา
            </label>
            <select
              value={filters.major}
              onChange={(e) => updateFilter('major', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">ทั้งหมด</option>
              {MAJOR_OPTIONS.map((major) => (
                <option key={major} value={major}>
                  {major}
                </option>
              ))}
            </select>
          </div>

          {/* ชั้นปี */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ชั้นปี
            </label>
            <select
              value={filters.year || ''}
              onChange={(e) => updateFilter('year', e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">ทั้งหมด</option>
              {YEAR_OPTIONS.map((year) => (
                <option key={year} value={year}>
                  ปี {year}
                </option>
              ))}
            </select>
          </div>

          {/* สถานะ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              สถานะ
            </label>
            <select
              value={filters.status}
              onChange={(e) => updateFilter('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">ทั้งหมด</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
            >
              <X className="w-4 h-4 mr-1" />
              รีเซ็ต
            </Button>
          </div>
        </div>
      )}
    </div>
  )
})

FilterPanel.displayName = 'FilterPanel'

export default FilterPanel
