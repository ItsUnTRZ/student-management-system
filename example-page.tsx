// ตัวอย่างหน้าที่ใช้ Layout ใหม่
'use client'

import Layout from '@/components/layout/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import Button from '@/components/ui/Button'
import { Plus, Users, BookOpen } from 'lucide-react'

export default function ExamplePage() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6 max-w-none">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ตัวอย่างหน้า</h1>
              <p className="mt-1 text-sm text-gray-500">
                หน้านี้แสดงตัวอย่างการใช้ Layout ใหม่ที่ content ชิดซ้ายตรงกับ sidebar
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button leftIcon={<Plus className="w-4 h-4" />}>
                เพิ่มข้อมูลใหม่
              </Button>
            </div>
          </div>

          {/* Content Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">นักศึกษา</h3>
                  <p className="text-sm text-gray-500">จำนวน 1,234 คน</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <BookOpen className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">หลักสูตร</h3>
                  <p className="text-sm text-gray-500">จำนวน 45 หลักสูตร</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">อาจารย์</h3>
                  <p className="text-sm text-gray-500">จำนวน 89 คน</p>
                </div>
              </div>
            </div>
          </div>

          {/* Wide Content Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                ตัวอย่างเนื้อหาเต็มความกว้าง
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-600">
                  เนื้อหาในส่วนนี้จะใช้ความกว้างเต็มที่ของ main content area 
                  โดยไม่มี max-width จำกัด ทำให้สามารถใช้พื้นที่ได้อย่างเต็มประสิทธิภาพ
                </p>
                <p className="text-gray-600 mt-4">
                  Layout นี้เหมาะสำหรับการแสดงตาราง, แดชบอร์ด, หรือเนื้อหาที่ต้องการพื้นที่กว้าง
                  โดย content จะเริ่มต้นจากขอบซ้ายที่ตรงแนวเดียวกับ sidebar
                </p>
              </div>
            </div>
          </div>

          {/* Table Example */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">ตัวอย่างตาราง</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      รายการ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      สถานะ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      วันที่สร้าง
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      การดำเนินการ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      รายการที่ 1
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ใช้งาน
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      01/01/2024
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button variant="ghost" size="sm">แก้ไข</Button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      รายการที่ 2
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        รอดำเนินการ
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      02/01/2024
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button variant="ghost" size="sm">แก้ไข</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}