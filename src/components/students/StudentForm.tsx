// Student Form Component
// ไฟล์นี้สร้างฟอร์มสำหรับเพิ่ม/แก้ไขข้อมูลนักศึกษา

'use client'

import { useState, useEffect } from 'react'
import { Student, StudentFormData } from '@/types'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { User, Calendar, BookOpen, GraduationCap } from 'lucide-react'

interface StudentFormProps {
  student?: Student | null
  onSubmit: (data: StudentFormData) => void
  onCancel: () => void
  loading?: boolean
}

// Component สำหรับฟอร์มนักศึกษา
const StudentForm: React.FC<StudentFormProps> = ({
  student,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<StudentFormData>({
    studentId: '',
    name: '',
    dob: '',
    major: '',
    year: 1,
  })
  const [errors, setErrors] = useState<Partial<StudentFormData>>({})

  // โหลดข้อมูลนักศึกษาเมื่อมีการแก้ไข
  useEffect(() => {
    if (student) {
      setFormData({
        studentId: student.studentId,
        name: student.name,
        dob: student.dob.toISOString().split('T')[0], // แปลงเป็น YYYY-MM-DD
        major: student.major,
        year: student.year,
      })
    }
  }, [student])

  // ฟังก์ชันสำหรับตรวจสอบความถูกต้องของข้อมูล
  const validateForm = (): boolean => {
    const newErrors: Partial<StudentFormData> = {}

    if (!formData.studentId.trim()) {
      newErrors.studentId = 'กรุณากรอกรหัสนักศึกษา'
    } else if (!/^[A-Z0-9]+$/.test(formData.studentId)) {
      newErrors.studentId = 'รหัสนักศึกษาต้องเป็นตัวอักษรภาษาอังกฤษและตัวเลขเท่านั้น'
    }

    if (!formData.name.trim()) {
      newErrors.name = 'กรุณากรอกชื่อ-นามสกุล'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'ชื่อ-นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร'
    }

    if (!formData.dob) {
      newErrors.dob = 'กรุณาเลือกวันเกิด'
    } else {
      const dob = new Date(formData.dob)
      const today = new Date()
      const age = today.getFullYear() - dob.getFullYear()
      
      if (age < 15 || age > 100) {
        newErrors.dob = 'อายุต้องอยู่ระหว่าง 15-100 ปี'
      }
    }

    if (!formData.major.trim()) {
      newErrors.major = 'กรุณากรอกสาขาวิชา'
    }

    if (!formData.year || formData.year < 1 || formData.year > 6) {
      newErrors.year = 'ชั้นปีต้องอยู่ระหว่าง 1-6'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงข้อมูล
  const handleChange = (field: keyof StudentFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
    
    // ลบ error เมื่อผู้ใช้เริ่มแก้ไข
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  // ฟังก์ชันสำหรับส่งข้อมูล
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* รหัสนักศึกษา */}
        <Input
          label="รหัสนักศึกษา"
          value={formData.studentId}
          onChange={(e) => handleChange('studentId', e.target.value)}
          error={errors.studentId}
          leftIcon={<User className="w-4 h-4" />}
          placeholder="เช่น ST001"
          disabled={loading}
        />

        {/* ชื่อ-นามสกุล */}
        <Input
          label="ชื่อ-นามสกุล"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          leftIcon={<User className="w-4 h-4" />}
          placeholder="เช่น สมชาย ใจดี"
          disabled={loading}
        />

        {/* วันเกิด */}
        <Input
          label="วันเกิด"
          type="date"
          value={formData.dob}
          onChange={(e) => handleChange('dob', e.target.value)}
          error={errors.dob}
          leftIcon={<Calendar className="w-4 h-4" />}
          disabled={loading}
        />

        {/* สาขาวิชา */}
        <Input
          label="สาขาวิชา"
          value={formData.major}
          onChange={(e) => handleChange('major', e.target.value)}
          error={errors.major}
          leftIcon={<BookOpen className="w-4 h-4" />}
          placeholder="เช่น วิทยาการคอมพิวเตอร์"
          disabled={loading}
        />

        {/* ชั้นปี */}
        <Input
          label="ชั้นปี"
          type="number"
          min="1"
          max="6"
          value={formData.year}
          onChange={(e) => handleChange('year', parseInt(e.target.value) || 1)}
          error={errors.year}
          leftIcon={<GraduationCap className="w-4 h-4" />}
          disabled={loading}
        />
      </div>

      {/* ปุ่มดำเนินการ */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          ยกเลิก
        </Button>
        <Button
          type="submit"
          loading={loading}
        >
          {student ? 'อัปเดตข้อมูล' : 'เพิ่มนักศึกษา'}
        </Button>
      </div>
    </form>
  )
}

export default StudentForm
