'use client'

import { Suspense, lazy, useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

const Spline = lazy(() =>
  import('@splinetool/react-spline').catch(() => {
    console.warn('Failed to load Spline component, using fallback')
    return { default: () => null }
  })
)

interface SplineSceneProps {
  scene: string
  className?: string
}

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm">
      <div className="text-center">
        <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-r from-red-400 to-orange-400 rounded-full opacity-50"></div>
        <p className="text-white/60 mb-4">3D Scene Failed to Load</p>
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  )
}

function SplineWrapper({ scene, className }: SplineSceneProps) {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [retryCount, setRetryCount] = useState(0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // 클라이언트 사이드에서만 실행되도록 보장
    setIsClient(true)

    // 개발 환경에서 더 긴 타임아웃 설정
    const isDev = process.env.NODE_ENV === 'development'
    const timeout = isDev ? 15000 : 10000

    let timeoutId: NodeJS.Timeout | null = null

    if (isLoading && isClient) {
      timeoutId = setTimeout(() => {
        console.log(`Spline loading timeout after ${timeout/1000} seconds (${isDev ? 'dev' : 'prod'} mode)`)
        setIsLoading(false)
      }, timeout)
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [isLoading, isClient])

  const handleLoad = () => {
    console.log('Spline scene loaded successfully')
    setIsLoading(false)
    setHasError(false)
    setRetryCount(0)
  }

  const handleError = (error?: any) => {
    console.log('Spline loading error:', error)
    setIsLoading(false)

    if (retryCount < 1) { // 재시도 횟수를 1회로 줄임
      console.log(`Retrying Spline load... (attempt ${retryCount + 1})`)
      setTimeout(() => {
        setRetryCount(prev => prev + 1)
        setIsLoading(true)
        setHasError(false)
      }, 3000) // 재시도 딜레이를 3초로 증가
    } else {
      console.log('Spline loading failed permanently after retries, showing fallback')
      setHasError(true)
    }
  }

  // 클라이언트 사이드에서만 렌더링
  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-50 animate-pulse"></div>
          <p className="text-white/60">3D Scene Initializing...</p>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-50"></div>
          <p className="text-white/60 mb-4">3D Scene Unavailable</p>
          <p className="text-white/40 text-sm">Using fallback display</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm z-10">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-50 animate-pulse"></div>
            <p className="text-white/60">3D Scene Loading...</p>
            {retryCount > 0 && (
              <p className="text-white/40 text-sm mt-2">Retry attempt {retryCount}</p>
            )}
          </div>
        </div>
      )}
      <div className="w-full h-full" style={{ minHeight: '400px' }}>
        <Spline
          scene={scene}
          className={`${className} w-full h-full`}
          onLoad={handleLoad}
          onError={handleError}
        />
      </div>
    </>
  )
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-50 animate-pulse"></div>
              <p className="text-white/60">3D Scene Loading...</p>
            </div>
          </div>
        }
      >
        <SplineWrapper scene={scene} className={className} />
      </Suspense>
    </ErrorBoundary>
  )
}