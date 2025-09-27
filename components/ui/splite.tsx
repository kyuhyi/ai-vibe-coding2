'use client'

import { useState, useEffect, useRef } from 'react'

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [SplineComponent, setSplineComponent] = useState<any>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true

    const loadSplineComponent = async () => {
      try {
        // 클라이언트 사이드에서만 로드
        if (typeof window === 'undefined') return

        // 동적 임포트로 Spline 컴포넌트 로드
        const splineModule = await import('@splinetool/react-spline')

        if (mountedRef.current) {
          setSplineComponent(() => splineModule.default)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Spline loading error:', error)
        if (mountedRef.current) {
          setHasError(true)
          setIsLoading(false)
        }
      }
    }

    // 지연 로딩으로 다른 컴포넌트들이 먼저 로드되도록
    const timer = setTimeout(loadSplineComponent, 1000)

    return () => {
      mountedRef.current = false
      clearTimeout(timer)
    }
  }, [])

  // 로딩 중이거나 에러가 발생한 경우 fallback UI
  if (isLoading || hasError || !SplineComponent) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-50 animate-pulse"></div>
          <p className="text-white/60">
            {hasError ? '3D Scene Unavailable' : '3D Scene Loading...'}
          </p>
        </div>
      </div>
    )
  }

  // 스플라인 컴포넌트 렌더링
  return (
    <div className={className}>
      <SplineComponent
        scene={scene}
        onLoad={() => console.log('Spline scene loaded successfully')}
        onError={(error: any) => {
          console.error('Spline runtime error:', error)
          setHasError(true)
        }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}