'use client'

import { useEffect } from 'react'
import { suppressRuntimeErrors } from '@/lib/error-suppression'

interface ErrorSuppressionProviderProps {
  children: React.ReactNode
}

export default function ErrorSuppressionProvider({ children }: ErrorSuppressionProviderProps) {
  useEffect(() => {
    // 클라이언트 사이드에서만 에러 억제 기능 활성화
    suppressRuntimeErrors()
  }, [])

  return <>{children}</>
}