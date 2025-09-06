import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

export default function Private({ children }: { children: ReactNode }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" replace />
}