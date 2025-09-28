// Firebase Authentication service
// ไฟล์นี้จัดการการเข้าสู่ระบบ, การลงทะเบียน, และการจัดการผู้ใช้

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase'
import { User } from '@/types'

// ฟังก์ชันสำหรับการลงทะเบียนผู้ใช้ใหม่
// รับ email, password, name (ทุกคนจะเป็น admin)
export const registerUser = async (
  email: string,
  password: string,
  name: string,
  role: 'admin' = 'admin'
): Promise<User> => {
  try {
    // สร้างผู้ใช้ใน Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const firebaseUser = userCredential.user

    // อัปเดต display name
    await updateProfile(firebaseUser, { displayName: name })

    // สร้างข้อมูลผู้ใช้ใน Firestore
    const userData: User = {
      uid: firebaseUser.uid,
      name,
      email,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // บันทึกข้อมูลผู้ใช้ใน Firestore
    await setDoc(doc(db, 'users', firebaseUser.uid), userData)

    return userData
  } catch (error: any) {
    throw new Error(error.message)
  }
}

// ฟังก์ชันสำหรับการเข้าสู่ระบบ
// รับ email และ password
export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    // เข้าสู่ระบบด้วย Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const firebaseUser = userCredential.user

    // ดึงข้อมูลผู้ใช้จาก Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
    
    if (!userDoc.exists()) {
      throw new Error('User data not found')
    }

    return userDoc.data() as User
  } catch (error: any) {
    throw new Error(error.message)
  }
}

// ฟังก์ชันสำหรับการออกจากระบบ
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth)
  } catch (error: any) {
    throw new Error(error.message)
  }
}

// ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้ปัจจุบัน
// ใช้สำหรับตรวจสอบสถานะการเข้าสู่ระบบ
export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      unsubscribe()
      
      if (!firebaseUser) {
        resolve(null)
        return
      }

      try {
        // ดึงข้อมูลผู้ใช้จาก Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        
        if (!userDoc.exists()) {
          resolve(null)
          return
        }

        resolve(userDoc.data() as User)
      } catch (error) {
        reject(error)
      }
    })
  })
}

// ฟังก์ชันสำหรับตรวจสอบสิทธิ์การเข้าถึง
// ตรวจสอบว่าผู้ใช้มีสิทธิ์เข้าถึงหน้าที่ต้องการหรือไม่
export const hasPermission = (userRole: string, requiredRoles: string[]): boolean => {
  return true // ให้ทุกคนเข้าถึงได้
}

// ฟังก์ชันสำหรับสร้างผู้ใช้ admin ครั้งแรก
// ใช้สำหรับการตั้งค่าเริ่มต้นของระบบ
export const createAdminUser = async (
  email: string,
  password: string,
  name: string
): Promise<User> => {
  return registerUser(email, password, name, 'admin')
}
