// Sidebar Component
// ไฟล์นี้สร้าง sidebar navigation สำหรับเมนูหลัก

'use client'

import { useAuth } from '@/contexts/AuthContext'
import { NavItem } from '@/types'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import {
  Users,
  Search,
  FileText,
  GraduationCap,
  BookOpen,
  BarChart3,
  Settings,
  UserCheck,
  X,
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

// รายการเมนูหลัก
const navigationItems: NavItem[] = [
  {
    name: 'รายชื่อนักศึกษา',
    href: '/students',
    icon: 'Users',
    roles: ['admin'],
  },
  {
    name: 'ค้นหานักศึกษา',
    href: '/students/search',
    icon: 'Search',
    roles: ['admin'],
  },
  {
    name: 'บันทึกเกรด',
    href: '/grades',
    icon: 'FileText',
    roles: ['admin'],
  },
  {
    name: 'จัดการการลงทะเบียน',
    href: '/enrollments',
    icon: 'BookOpen',
    roles: ['admin'],
  },
  {
    name: 'ใบแสดงผลการเรียน',
    href: '/transcripts',
    icon: 'GraduationCap',
    roles: ['admin'],
  },
  {
    name: 'รายงานสถิติ',
    href: '/reports',
    icon: 'BarChart3',
    roles: ['admin'],
  },
  {
    name: 'จัดการผู้ใช้',
    href: '/users',
    icon: 'UserCheck',
    roles: ['admin'],
  },
  {
    name: 'ตั้งค่า',
    href: '/settings',
    icon: 'Settings',
    roles: ['admin'],
  },
]

// Component สำหรับ sidebar navigation
const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { hasPermission } = useAuth()
  const pathname = usePathname()

  // ฟังก์ชันสำหรับแสดงไอคอน
  const renderIcon = (iconName: string) => {
    const iconProps = { className: 'w-5 h-5' }
    
    switch (iconName) {
      case 'Users':
        return <Users {...iconProps} />
      case 'Search':
        return <Search {...iconProps} />
      case 'FileText':
        return <FileText {...iconProps} />
      case 'GraduationCap':
        return <GraduationCap {...iconProps} />
      case 'BookOpen':
        return <BookOpen {...iconProps} />
      case 'BarChart3':
        return <BarChart3 {...iconProps} />
      case 'UserCheck':
        return <UserCheck {...iconProps} />
      case 'Settings':
        return <Settings {...iconProps} />
      default:
        return null
    }
  }

  // แสดงเมนูทั้งหมด (ไม่ต้องกรองตามสิทธิ์)
  const filteredItems = navigationItems

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={clsx(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
            <h2 className="text-lg font-semibold text-gray-900">เมนู</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {filteredItems.map((item) => {
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={clsx(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  {renderIcon(item.icon)}
                  <span className="ml-3">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              ระบบจัดการนักศึกษา v1.0
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
