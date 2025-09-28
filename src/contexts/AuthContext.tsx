// Authentication Context
// ไฟล์นี้จัดการสถานะการเข้าสู่ระบบและข้อมูลผู้ใช้ทั่วทั้งแอป

'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@/types'
import { getCurrentUser, loginUser, registerUser, logoutUser } from '@/lib/auth'

// Interface สำหรับ AuthContext
interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  hasPermission: (requiredRoles: string[]) => boolean
}

// สร้าง Context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// AuthProvider component
// Component นี้จะ wrap ทั้งแอปเพื่อให้ทุก component เข้าถึงข้อมูลการเข้าสู่ระบบได้
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // ฟังก์ชันสำหรับเข้าสู่ระบบ
  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const userData = await loginUser(email, password)
      setUser(userData)
    } catch (error: any) {
      throw new Error(error.message)
    } finally {
      setLoading(false)
    }
  }

  // ฟังก์ชันสำหรับลงทะเบียน
  const register = async (
    email: string,
    password: string,
    name: string
  ) => {
    try {
      setLoading(true)
      const userData = await registerUser(email, password, name, 'admin')
      setUser(userData)
    } catch (error: any) {
      throw new Error(error.message)
    } finally {
      setLoading(false)
    }
  }

  // ฟังก์ชันสำหรับออกจากระบบ
  const logout = async () => {
    try {
      setLoading(true)
      await logoutUser()
      setUser(null)
    } catch (error: any) {
      throw new Error(error.message)
    } finally {
      setLoading(false)
    }
  }

  // ฟังก์ชันสำหรับตรวจสอบสิทธิ์
  const hasPermission = (requiredRoles: string[]): boolean => {
    return true // ให้ทุกคนเข้าถึงได้
  }

  // ตรวจสอบสถานะการเข้าสู่ระบบเมื่อ component mount
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        setLoading(true)
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error('Error checking auth state:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuthState()
  }, [])

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    hasPermission,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook สำหรับใช้ AuthContext
// ใช้ hook นี้ใน component อื่นๆ เพื่อเข้าถึงข้อมูลการเข้าสู่ระบบ
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
