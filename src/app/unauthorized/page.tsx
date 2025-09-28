// Unauthorized Page
// ไฟล์นี้เป็นหน้าสำหรับแสดงเมื่อผู้ใช้ไม่มีสิทธิ์เข้าถึง

'use client'

import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { Shield, ArrowLeft, Home } from 'lucide-react'

// หน้าสำหรับแสดงเมื่อไม่มีสิทธิ์เข้าถึง
export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Icon */}
        <div className="mx-auto h-24 w-24 bg-red-100 rounded-full flex items-center justify-center">
          <Shield className="h-12 w-12 text-red-600" />
        </div>

        {/* Content */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ไม่มีสิทธิ์เข้าถึง</h1>
          <p className="mt-2 text-sm text-gray-600">
            คุณไม่มีสิทธิ์เข้าถึงหน้านี้ กรุณาติดต่อผู้ดูแลระบบหากต้องการสิทธิ์เพิ่มเติม
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => router.back()}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            กลับหน้าก่อนหน้า
          </Button>
          <Button
            onClick={() => router.push('/students')}
            leftIcon={<Home className="w-4 h-4" />}
          >
            ไปหน้าแรก
          </Button>
        </div>
      </div>
    </div>
  )
}
