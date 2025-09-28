// Firebase configuration และ initialization
// ไฟล์นี้จะทำการตั้งค่า Firebase และ export functions สำหรับใช้งานในแอป

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase configuration object
// ต้องไปตั้งค่าใน Firebase Console และ copy config มาใส่ที่นี่
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
// เริ่มต้น Firebase app ด้วย config ที่กำหนด
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
// เริ่มต้น Firebase Auth สำหรับจัดการการเข้าสู่ระบบ
export const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
// เริ่มต้น Firestore สำหรับจัดการฐานข้อมูล
export const db = getFirestore(app)

export default app
