// Root Layout
// ไฟล์นี้กำหนด layout หลักของแอป Next.js

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ระบบจัดการนักศึกษา',
  description: 'ระบบจัดการข้อมูลนักศึกษาและผลการเรียน',
}

// Layout หลักของแอป
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body className={inter.className}>
        {/* AuthProvider สำหรับจัดการสถานะการเข้าสู่ระบบ */}
        <AuthProvider>
          {children}
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
