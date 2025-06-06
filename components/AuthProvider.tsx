'use client'

import { AuthProvider as AuthContextProvider, useAuthProvider } from '@/hooks/useAuth'

interface AuthProviderProps {
  children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const authValue = useAuthProvider()
  
  return (
    <AuthContextProvider value={authValue}>
      {children}
    </AuthContextProvider>
  )
} 