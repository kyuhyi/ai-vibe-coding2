'use client'

import { useState, useEffect } from 'react'

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [useIframe, setUseIframe] = useState(false)
  const [SplineComponent, setSplineComponent] = useState<any>(null)
  const [iframeError, setIframeError] = useState(false)

  // Spline 씬 URL을 iframe 버전으로 변환
  const getIframeUrl = (sceneUrl: string) => {
    // prod.spline.design URL을 웹 뷰어 URL로 변환
    if (sceneUrl.includes('prod.spline.design')) {
      const sceneId = sceneUrl.split('/')[3] // kZDDjO5HuC9GJUM2 추출
      return `https://my.spline.design/${sceneId}`
    }
    // 기존 방식 유지 (다른 URL 형식용)
    const sceneId = sceneUrl.split('/').pop()?.replace('.splinecode', '')
    return `https://my.spline.design/${sceneId}`
  }

  useEffect(() => {
    // 프로덕션 환경에서는 바로 iframe 사용 (안정성 우선)
    const isProduction = process.env.NODE_ENV === 'production'

    if (isProduction) {
      console.log('Production environment detected, using iframe fallback')
      setUseIframe(true)
      setIsLoading(false)
      return
    }

    // 개발 환경에서만 React Spline 컴포넌트 시도
    const loadSplineComponent = async () => {
      try {
        if (typeof window === 'undefined') {
          setUseIframe(true)
          setIsLoading(false)
          return
        }

        // 짧은 지연 후 로드 시도
        await new Promise(resolve => setTimeout(resolve, 200))

        // React Spline 컴포넌트 로드 시도
        const splineModule = await import('@splinetool/react-spline')

        // 컴포넌트 임포트 확인
        if (splineModule.default && typeof splineModule.default === 'function') {
          setSplineComponent(splineModule.default)
          setIsLoading(false)
          return
        }

        throw new Error('Spline component not available')
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
    const handleIframeError = () => {
      console.error('Iframe loading failed')
      setIframeError(true)
    }

    if (iframeError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-50"></div>
            <p className="text-white/60">3D Scene Unavailable</p>
            <p className="text-white/40 text-sm mt-2">Network or loading issue</p>
          </div>
        </div>
      )
    }

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
          onError={handleIframeError}
          onLoad={() => console.log('Iframe loaded successfully')}
        />
      </div>
    )
  }

  // React 컴포넌트로 렌더링 (성공한 경우)
  if (SplineComponent) {
    return (
      <div className={className} style={{ width: '100%', height: '100%' }}>
        <SplineComponent scene={scene} />
      </div>
    )
  }

  // 로딩 실패 시 fallback UI
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm">
      <div className="text-center">
        <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-50 animate-pulse"></div>
        <p className="text-white/60">3D Scene Loading Error</p>
        <p className="text-white/40 text-sm mt-2">Please refresh the page</p>
      </div>
    </div>
  )
}