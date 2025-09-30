'use client'

import { Suspense, lazy, useState, useEffect } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 3

  useEffect(() => {
    // 로딩 타임아웃 설정 (개발: 15초, 프로덕션: 10초)
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn('Spline loading timeout, attempting retry...')
        if (retryCount < maxRetries) {
          setRetryCount(prev => prev + 1)
          setIsLoading(true)
        } else {
          setError(true)
          setIsLoading(false)
        }
      }
    }, process.env.NODE_ENV === 'development' ? 15000 : 10000)

    return () => clearTimeout(timeout)
  }, [isLoading, retryCount])

  const handleLoad = () => {
    setIsLoading(false)
    setError(false)
  }

  const handleError = () => {
    console.error('Spline failed to load')
    if (retryCount < maxRetries) {
      console.log(`Retrying... (${retryCount + 1}/${maxRetries})`)
      setRetryCount(prev => prev + 1)
    } else {
      setError(true)
      setIsLoading(false)
    }
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-30 mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">3D 콘텐츠를 불러올 수 없습니다</p>
        </div>
      </div>
    )
  }

  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-50 animate-pulse"></div>
        </div>
      }
    >
      <Spline
        scene={scene}
        className={className}
        onLoad={handleLoad}
        onError={handleError}
      />
    </Suspense>
  )
}