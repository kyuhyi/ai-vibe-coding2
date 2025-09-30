'use client'

import React, { useEffect, useState } from 'react'

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // 로딩 타임아웃 설정
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log('Spline iframe loading timeout')
        setIsLoading(false)
      }
    }, 10000)

    return () => clearTimeout(timeout)
  }, [isLoading])

  const handleIframeLoad = () => {
    console.log('Spline iframe loaded successfully')
    setIsLoading(false)
    setHasError(false)
  }

  const handleIframeError = () => {
    console.error('Spline iframe failed to load')
    setIsLoading(false)
    setHasError(true)
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
    <div className={`relative w-full h-full ${className || ''}`}>
      {isLoading && (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm z-10">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-50 animate-pulse"></div>
            <p className="text-white/60">3D Scene Loading...</p>
          </div>
        </div>
      )}
      <iframe
        src={scene}
        frameBorder="0"
        width="100%"
        height="100%"
        className="w-full h-full"
        style={{ minHeight: '600px' }}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        title="3D Spline Scene"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  )
}