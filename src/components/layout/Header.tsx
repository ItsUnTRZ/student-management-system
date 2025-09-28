// Header Component
// ไฟล์นี้สร้าง header bar ที่แสดงข้อมูลผู้ใช้และเมนู

'use client'

import { useAuth } from '@/contexts/AuthContext'
import { LogOut, User, Menu } from 'lucide-react'
import Button from '../ui/Button'
import { useState } from 'react'

interface HeaderProps {
  onMenuClick?: () => void
  showMenuButton?: boolean
}

// Component สำหรับ header bar
const Header: React.FC<HeaderProps> = ({ 
  onMenuClick, 
  showMenuButton = false 
}) => {
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Menu button and title */}
          <div className="flex items-center">
            {showMenuButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMenuClick}
                className="mr-3 lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
            )}
            
            <h1 className="text-xl font-semibold text-gray-900">
              ระบบจัดการนักศึกษา
            </h1>
          </div>

          {/* Right side - User menu */}
          <div className="flex items-center space-x-4">
            {user && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:block">{user.name}</span>
                </Button>

                {/* User dropdown menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <p className="text-xs text-gray-500 capitalize">
                        ผู้ดูแลระบบ
                      </p>
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      ออกจากระบบ
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
