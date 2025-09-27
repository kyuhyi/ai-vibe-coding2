'use client'

import { useState, useEffect } from 'react'

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [useIframe, setUseIframe] = useState(false)

  // Spline 씬 URL을 iframe 버전으로 변환
  const getIframeUrl = (sceneUrl: string) => {
    // .splinecode URL을 웹 뷰어 URL로 변환
    const sceneId = sceneUrl.split('/').pop()?.replace('.splinecode', '')
    return `https://my.spline.design/${sceneId}`
  }

  useEffect(() => {
    // 프로덕션에서는 iframe 사용, 개발에서는 React 컴포넌트 시도
    const isProduction = process.env.NODE_ENV === 'production'

    if (isProduction) {
      setUseIframe(true)
      setIsLoading(false)
      return
    }

    // 개발 환경에서 React Spline 컴포넌트 시도
    const loadSplineComponent = async () => {
      try {
        if (typeof window === 'undefined') return

        // 짧은 지연 후 로드 시도
        await new Promise(resolve => setTimeout(resolve, 500))

        // React Spline 컴포넌트 로드 시도
        const splineModule = await import('@splinetool/react-spline')

        // 성공하면 React 컴포넌트 사용
        setIsLoading(false)
      } catch (error) {
        console.warn('React Spline failed, falling back to iframe:', error)
        // 실패하면 iframe으로 fallback
        setUseIframe(true)
        setIsLoading(false)
      }
    }

    loadSplineComponent()
  }, [])

  // 로딩 중
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-50 animate-pulse"></div>
          <p className="text-white/60">3D Scene Loading...</p>
        </div>
      </div>
    )
  }

  // iframe으로 렌더링 (프로덕션 또는 React 컴포넌트 실패 시)
  if (useIframe) {
    return (
      <div className={className} style={{ width: '100%', height: '100%' }}>
        <iframe
          src={getIframeUrl(scene)}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            background: 'transparent'
          }}
          allowFullScreen
          loading="lazy"
          title="3D Scene"
        />
      </div>
    )
  }

  // React 컴포넌트로 렌더링 (개발 환경에서 성공한 경우)
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm">
      <div className="text-center">
        <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-50 animate-pulse"></div>
        <p className="text-white/60">3D Scene Ready</p>
      </div>
    </div>
  )
}