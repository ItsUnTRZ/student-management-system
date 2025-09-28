// Settings Page
// ไฟล์นี้เป็นหน้าสำหรับตั้งค่าระบบ (Admin only)

'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import Layout from '@/components/layout/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Settings, Save, Database, Shield, Bell, Globe } from 'lucide-react'

// หน้าสำหรับตั้งค่าระบบ
export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    systemName: 'ระบบจัดการนักศึกษา',
    systemVersion: '1.0.0',
    maxStudents: 1000,
    maxCourses: 500,
    gpaScale: '4.0',
    academicYear: '2567',
    semester: '1',
    emailNotifications: true,
    smsNotifications: false,
    autoBackup: true,
    backupFrequency: 'daily',
    maintenanceMode: false,
  })

  // ฟังก์ชันสำหรับบันทึกการตั้งค่า
  const handleSaveSettings = async () => {
    try {
      setLoading(true)
      
      // ในระบบจริงควรเรียก API เพื่อบันทึกการตั้งค่า
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      toast.success('บันทึกการตั้งค่าสำเร็จ')
    } catch (error: any) {
      toast.error('เกิดข้อผิดพลาดในการบันทึกการตั้งค่า')
    } finally {
      setLoading(false)
    }
  }

  // ฟังก์ชันสำหรับรีเซ็ตการตั้งค่า
  const handleResetSettings = () => {
    setSettings({
      systemName: 'ระบบจัดการนักศึกษา',
      systemVersion: '1.0.0',
      maxStudents: 1000,
      maxCourses: 500,
      gpaScale: '4.0',
      academicYear: '2567',
      semester: '1',
      emailNotifications: true,
      smsNotifications: false,
      autoBackup: true,
      backupFrequency: 'daily',
      maintenanceMode: false,
    })
    toast.success('รีเซ็ตการตั้งค่าเป็นค่าเริ่มต้น')
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Settings className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ตั้งค่าระบบ</h1>
              <p className="mt-1 text-sm text-gray-500">
                จัดการการตั้งค่าและกำหนดค่าต่างๆ ของระบบ
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">หมวดหมู่การตั้งค่า</h3>
                  <nav className="space-y-2">
                    <button className="w-full text-left px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-md">
                      ข้อมูลระบบ
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md">
                      การแจ้งเตือน
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md">
                      ความปลอดภัย
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md">
                      การสำรองข้อมูล
                    </button>
                  </nav>
                </div>
              </div>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* System Information */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Database className="w-5 h-5 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900">ข้อมูลระบบ</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="ชื่อระบบ"
                      value={settings.systemName}
                      onChange={(e) => setSettings(prev => ({ ...prev, systemName: e.target.value }))}
                      disabled={loading}
                    />
                    
                    <Input
                      label="เวอร์ชัน"
                      value={settings.systemVersion}
                      onChange={(e) => setSettings(prev => ({ ...prev, systemVersion: e.target.value }))}
                      disabled={loading}
                    />
                    
                    <Input
                      label="จำนวนนักศึกษาสูงสุด"
                      type="number"
                      value={settings.maxStudents}
                      onChange={(e) => setSettings(prev => ({ ...prev, maxStudents: parseInt(e.target.value) || 0 }))}
                      disabled={loading}
                    />
                    
                    <Input
                      label="จำนวนรายวิชาสูงสุด"
                      type="number"
                      value={settings.maxCourses}
                      onChange={(e) => setSettings(prev => ({ ...prev, maxCourses: parseInt(e.target.value) || 0 }))}
                      disabled={loading}
                    />
                    
                    <Input
                      label="ระบบเกรด"
                      value={settings.gpaScale}
                      onChange={(e) => setSettings(prev => ({ ...prev, gpaScale: e.target.value }))}
                      disabled={loading}
                    />
                    
                    <Input
                      label="ปีการศึกษา"
                      value={settings.academicYear}
                      onChange={(e) => setSettings(prev => ({ ...prev, academicYear: e.target.value }))}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Bell className="w-5 h-5 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900">การแจ้งเตือน</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">แจ้งเตือนทางอีเมล</p>
                        <p className="text-sm text-gray-500">ส่งการแจ้งเตือนผ่านอีเมล</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={(e) => setSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                          className="sr-only peer"
                          disabled={loading}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">แจ้งเตือนทาง SMS</p>
                        <p className="text-sm text-gray-500">ส่งการแจ้งเตือนผ่าน SMS</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.smsNotifications}
                          onChange={(e) => setSettings(prev => ({ ...prev, smsNotifications: e.target.checked }))}
                          className="sr-only peer"
                          disabled={loading}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900">ความปลอดภัย</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">โหมดบำรุงรักษา</p>
                        <p className="text-sm text-gray-500">ปิดระบบชั่วคราวเพื่อบำรุงรักษา</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.maintenanceMode}
                          onChange={(e) => setSettings(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                          className="sr-only peer"
                          disabled={loading}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Backup */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900">การสำรองข้อมูล</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">สำรองข้อมูลอัตโนมัติ</p>
                        <p className="text-sm text-gray-500">สร้างสำเนาข้อมูลอัตโนมัติ</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.autoBackup}
                          onChange={(e) => setSettings(prev => ({ ...prev, autoBackup: e.target.checked }))}
                          className="sr-only peer"
                          disabled={loading}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ความถี่ในการสำรองข้อมูล
                      </label>
                      <select
                        value={settings.backupFrequency}
                        onChange={(e) => setSettings(prev => ({ ...prev, backupFrequency: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        disabled={loading}
                      >
                        <option value="daily">ทุกวัน</option>
                        <option value="weekly">ทุกสัปดาห์</option>
                        <option value="monthly">ทุกเดือน</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={handleResetSettings}
                      disabled={loading}
                    >
                      รีเซ็ต
                    </Button>
                    <Button
                      onClick={handleSaveSettings}
                      loading={loading}
                      leftIcon={<Save className="w-4 h-4" />}
                    >
                      บันทึกการตั้งค่า
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
