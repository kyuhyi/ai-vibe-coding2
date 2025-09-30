'use client'

import { Suspense, lazy, useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

const Spline = lazy(() => import('@splinetool/react-spline'))

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

  useEffect(() => {
    // 로딩 타임아웃 설정 (30초)
    const loadingTimeout = setTimeout(() => {
      if (isLoading && retryCount < 2) {
        setRetryCount(prev => prev + 1)
        setIsLoading(true)
      } else {
        setHasError(true)
        setIsLoading(false)
      }
    }, 30000)

    return () => clearTimeout(loadingTimeout)
  }, [isLoading, retryCount])

  const handleLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleError = () => {
    setIsLoading(false)
    if (retryCount < 2) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1)
        setIsLoading(true)
        setHasError(false)
      }, 2000)
    } else {
      setHasError(true)
    }
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
      <Spline
        scene={scene}
        className={className}
        onLoad={handleLoad}
        onError={handleError}
      />
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