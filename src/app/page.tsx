// Home Page
// ไฟล์นี้เป็นหน้าแรกของแอป

'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

// หน้าแรกของแอป
export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        // ถ้าเข้าสู่ระบบแล้ว ให้ไปหน้า students
        router.push('/students')
      } else {
        // ถ้ายังไม่ได้เข้าสู่ระบบ ให้ไปหน้า login
        router.push('/login')
      }
    }
  }, [user, loading, router])

  // แสดง loading spinner ขณะตรวจสอบสถานะการเข้าสู่ระบบ
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="กำลังโหลดระบบ..." />
      </div>
    )
  }

  return null
}
