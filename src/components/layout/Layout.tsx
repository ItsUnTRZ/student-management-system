// Layout Component
// ไฟล์นี้สร้าง layout หลักของแอปที่รวม Sidebar และเนื้อหา

'use client'

import { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

interface LayoutProps {
  children: React.ReactNode
}

// Component สำหรับ layout หลัก
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Fixed position */}
      <aside className="fixed left-0 top-0 h-screen w-[260px] z-50">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Main content - with left margin to account for sidebar */}
      <main className="ml-[260px] p-6 max-w-none">
        {/* Header */}
        <Header 
          onMenuClick={toggleSidebar} 
          showMenuButton={true}
        />

        {/* Page content */}
        <div className="mt-6">
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout
