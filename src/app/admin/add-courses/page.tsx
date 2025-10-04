'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { createCourse } from '@/lib/firestore'

export default function AddCoursesPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const sampleCourses = [
    {
      courseId: "CS101",
      name: "Computer Programming",
      credits: 3,
      instructor: "อ.สมชาย ใจดี"
    },
    {
      courseId: "CS102", 
      name: "Data Structures",
      credits: 3,
      instructor: "อ.สมหญิง รักการเรียน"
    },
    {
      courseId: "CS201",
      name: "Database Systems",
      credits: 3,
      instructor: "อ.พิมพ์ใจ เก่งมาก"
    },
    {
      courseId: "CS202",
      name: "Web Development",
      credits: 3,
      instructor: "อ.ชาญชัย โค้ดดี"
    },
    {
      courseId: "CS301",
      name: "Software Engineering",
      credits: 3,
      instructor: "อ.วิชาญ พัฒนา"
    },
    {
      courseId: "CS302",
      name: "Mobile App Development",
      credits: 3,
      instructor: "อ.สมาร์ท โฟนดี"
    },
    {
      courseId: "MATH101",
      name: "Calculus I",
      credits: 3,
      instructor: "อ.สมศรี เลขาคณิต"
    },
    {
      courseId: "MATH102",
      name: "Statistics",
      credits: 3,
      instructor: "อ.ปัญญา วิเคราะห์"
    },
    {
      courseId: "ENG101",
      name: "English for Communication",
      credits: 3,
      instructor: "อ.จอห์น สมิธ"
    },
    {
      courseId: "PHY101",
      name: "Physics I",
      credits: 3,
      instructor: "อ.นิวตัน แรงดึงดูด"
    }
  ]

  const addSampleCourses = async () => {
    setLoading(true)
    setMessage('กำลังเพิ่มรายวิชา...')

    try {
      for (const course of sampleCourses) {
        await createCourse(course)
        setMessage(prev => prev + `\n✅ เพิ่ม ${course.courseId}: ${course.name}`)
      }
      setMessage(prev => prev + '\n\n🎉 เพิ่มรายวิชาทั้งหมดเสร็จสิ้น!')
    } catch (error: any) {
      setMessage('❌ เกิดข้อผิดพลาด: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="ml-[260px] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">เพิ่มรายวิชาตัวอย่าง</h1>
            <p className="text-gray-600">เพิ่มรายวิชาตัวอย่างเพื่อทดสอบระบบ</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">รายวิชาที่จะเพิ่ม</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {sampleCourses.map((course, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="font-medium text-blue-600">{course.courseId}</div>
                  <div className="text-gray-900">{course.name}</div>
                  <div className="text-sm text-gray-500">{course.credits} หน่วยกิต • {course.instructor}</div>
                </div>
              ))}
            </div>

            <Button 
              onClick={addSampleCourses}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'กำลังเพิ่ม...' : 'เพิ่มรายวิชาทั้งหมด'}
            </Button>

            {message && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm">{message}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}