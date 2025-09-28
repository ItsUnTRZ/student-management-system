// Users Management Page
// ไฟล์นี้เป็นหน้าสำหรับจัดการผู้ใช้ในระบบ (Admin only)

'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import Layout from '@/components/layout/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { User } from '@/types'
import { UserCheck, Search, Plus, Edit, Trash2, Shield, User as UserIcon } from 'lucide-react'

// หน้าสำหรับจัดการผู้ใช้
export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserForm, setShowUserForm] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin' as 'admin',
  })

  // Mock data สำหรับผู้ใช้ (ในระบบจริงควรดึงจาก API)
  const mockUsers: User[] = [
    {
      uid: '1',
      name: 'ผู้ดูแลระบบ',
      email: 'admin@example.com',
      role: 'admin',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      uid: '2',
      name: 'ผู้ดูแลระบบ 2',
      email: 'admin2@example.com',
      role: 'admin',
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
    {
      uid: '3',
      name: 'ผู้ดูแลระบบ 3',
      email: 'admin3@example.com',
      role: 'admin',
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03'),
    },
  ]

  // โหลดข้อมูลผู้ใช้
  const loadUsers = async () => {
    try {
      setLoading(true)
      // ในระบบจริงควรเรียก API
      setUsers(mockUsers)
    } catch (error: any) {
      toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้')
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  // โหลดข้อมูลเมื่อ component mount
  useEffect(() => {
    loadUsers()
  }, [])

  // ฟังก์ชันสำหรับค้นหาผู้ใช้
  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  // กรองผู้ใช้ตามคำค้นหา
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // ฟังก์ชันสำหรับเพิ่มผู้ใช้ใหม่
  const handleAddUser = () => {
    setUserForm({
      name: '',
      email: '',
      password: '',
      role: 'staff',
    })
    setSelectedUser(null)
    setShowUserForm(true)
  }

  // ฟังก์ชันสำหรับแก้ไขผู้ใช้
  const handleEditUser = (user: User) => {
    setUserForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
    })
    setSelectedUser(user)
    setShowUserForm(true)
  }

  // ฟังก์ชันสำหรับลบผู้ใช้
  const handleDeleteUser = (user: User) => {
    setSelectedUser(user)
    setShowDeleteDialog(true)
  }

  // ฟังก์ชันสำหรับบันทึกผู้ใช้
  const handleSaveUser = async () => {
    if (!userForm.name || !userForm.email) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
      return
    }

    try {
      setFormLoading(true)
      
      // ในระบบจริงควรเรียก API
      const newUser: User = {
        uid: selectedUser?.uid || Date.now().toString(),
        name: userForm.name,
        email: userForm.email,
        role: userForm.role,
        createdAt: selectedUser?.createdAt || new Date(),
        updatedAt: new Date(),
      }

      if (selectedUser) {
        // แก้ไขผู้ใช้
        setUsers(prev => prev.map(u => u.uid === selectedUser.uid ? newUser : u))
        toast.success('อัปเดตข้อมูลผู้ใช้สำเร็จ')
      } else {
        // เพิ่มผู้ใช้ใหม่
        setUsers(prev => [...prev, newUser])
        toast.success('เพิ่มผู้ใช้ใหม่สำเร็จ')
      }

      setShowUserForm(false)
      setSelectedUser(null)
    } catch (error: any) {
      toast.error(error.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล')
    } finally {
      setFormLoading(false)
    }
  }

  // ฟังก์ชันสำหรับยืนยันการลบ
  const handleConfirmDelete = async () => {
    if (!selectedUser) return

    try {
      setFormLoading(true)
      
      // ในระบบจริงควรเรียก API
      setUsers(prev => prev.filter(u => u.uid !== selectedUser.uid))
      toast.success('ลบผู้ใช้สำเร็จ')
      setShowDeleteDialog(false)
      setSelectedUser(null)
    } catch (error: any) {
      toast.error(error.message || 'เกิดข้อผิดพลาดในการลบข้อมูล')
    } finally {
      setFormLoading(false)
    }
  }

  // ฟังก์ชันสำหรับแสดงสถานะบทบาท
  const getRoleBadge = (role: string) => {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        ผู้ดูแลระบบ
      </span>
    )
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">จัดการผู้ใช้</h1>
              <p className="mt-1 text-sm text-gray-500">
                จัดการบัญชีผู้ใช้และสิทธิ์การเข้าถึงระบบ
              </p>
            </div>
          </div>

          {/* Search and Add Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="w-full sm:w-96">
              <Input
                placeholder="ค้นหาผู้ใช้..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <Button
              onClick={handleAddUser}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              เพิ่มผู้ใช้ใหม่
            </Button>
          </div>

          {/* Users Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">รายชื่อผู้ใช้</h3>
              
              {loading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : filteredUsers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ชื่อ-นามสกุล
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          อีเมล
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          บทบาท
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          วันที่สร้าง
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          การดำเนินการ
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.uid} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <UserIcon className="h-5 w-5 text-gray-400" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getRoleBadge(user.role)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.createdAt.toLocaleDateString('th-TH')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditUser(user)}
                                leftIcon={<Edit className="w-4 h-4" />}
                              >
                                แก้ไข
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteUser(user)}
                                leftIcon={<Trash2 className="w-4 h-4" />}
                                className="text-red-600 hover:text-red-700"
                              >
                                ลบ
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <UserCheck className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่พบข้อมูลผู้ใช้</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchQuery ? 'ไม่พบผู้ใช้ที่ตรงกับคำค้นหา' : 'ยังไม่มีผู้ใช้ในระบบ'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* User Form Modal */}
          <Modal
            isOpen={showUserForm}
            onClose={() => {
              setShowUserForm(false)
              setSelectedUser(null)
            }}
            title={selectedUser ? 'แก้ไขข้อมูลผู้ใช้' : 'เพิ่มผู้ใช้ใหม่'}
            size="sm"
          >
            <div className="space-y-4">
              <Input
                label="ชื่อ-นามสกุล"
                value={userForm.name}
                onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="กรอกชื่อ-นามสกุล"
                disabled={formLoading}
              />

              <Input
                label="อีเมล"
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="กรอกอีเมล"
                disabled={formLoading}
              />

              {!selectedUser && (
                <Input
                  label="รหัสผ่าน"
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="กรอกรหัสผ่าน"
                  disabled={formLoading}
                />
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  บทบาท
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                  ผู้ดูแลระบบ (ไม่สามารถเปลี่ยนแปลงได้)
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowUserForm(false)}
                  disabled={formLoading}
                >
                  ยกเลิก
                </Button>
                <Button
                  onClick={handleSaveUser}
                  loading={formLoading}
                  disabled={!userForm.name || !userForm.email || (!selectedUser && !userForm.password)}
                >
                  {selectedUser ? 'อัปเดต' : 'เพิ่ม'}
                </Button>
              </div>
            </div>
          </Modal>

          {/* Delete Confirmation Dialog */}
          <ConfirmDialog
            isOpen={showDeleteDialog}
            onClose={() => {
              setShowDeleteDialog(false)
              setSelectedUser(null)
            }}
            onConfirm={handleConfirmDelete}
            title="ยืนยันการลบ"
            message={`คุณต้องการลบผู้ใช้ ${selectedUser?.name} หรือไม่?`}
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
