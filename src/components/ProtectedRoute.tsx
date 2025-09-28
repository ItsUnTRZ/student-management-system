// Protected Route Component
// ไฟล์นี้จัดการการป้องกันหน้าเว็บที่ต้องเข้าสู่ระบบก่อน

'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import LoadingSpinner from './ui/LoadingSpinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: string[]
  fallback?: React.ReactNode
}

// Component สำหรับป้องกันหน้าเว็บ
// ตรวจสอบการเข้าสู่ระบบและสิทธิ์การเข้าถึง
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  fallback,
}) => {
  const { user, loading, hasPermission } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // ถ้ายังโหลดข้อมูลอยู่ ให้รอ
    if (loading) return

    // ถ้าไม่ได้เข้าสู่ระบบ ให้ไปหน้า login
    if (!user) {
      router.push('/login')
      return
    }

    // ให้ทุกคนเข้าถึงได้ (ไม่ต้องตรวจสอบ role)
  }, [user, loading, router])

  // แสดง loading spinner ขณะตรวจสอบการเข้าสู่ระบบ
  if (loading) {
    return <LoadingSpinner />
  }

  // ถ้าไม่ได้เข้าสู่ระบบ ให้แสดง fallback หรือไม่แสดงอะไร
  if (!user) {
    return fallback || null
  }

  // แสดงเนื้อหาหน้าเว็บ
  return <>{children}</>
}

export default ProtectedRoute
