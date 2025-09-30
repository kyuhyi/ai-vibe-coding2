'use client'

import { useEffect, useRef, useState } from 'react'

interface SplineSceneProps {
  scene: string
  className?: string
}

declare global {
  interface Window {
    SplineRuntime: any
  }
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let app: any = null

    const loadSpline = async () => {
      try {
        // CDN에서 Spline Runtime 로드
        if (!window.SplineRuntime) {
          const script = document.createElement('script')
          script.type = 'module'
          script.src = 'https://unpkg.com/@splinetool/runtime@1.10.71/build/runtime.js'

          await new Promise((resolve, reject) => {
            script.onload = resolve
            script.onerror = reject
            document.head.appendChild(script)
          })
        }

        // Spline 앱 초기화
        if (canvasRef.current && window.SplineRuntime) {
          const { Application } = window.SplineRuntime
          app = new Application(canvasRef.current)
          await app.load(scene)
          setIsLoading(false)
        }
      } catch (err) {
        console.error('Spline load error:', err)
        setError(true)
        setIsLoading(false)
      }
    }

    loadSpline()

    return () => {
      if (app) {
        try {
          app.dispose()
        } catch (e) {
          console.warn('Spline disposal error:', e)
        }
      }
    }
  }, [scene])

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
    <div className={`relative w-full h-full ${className || ''}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-50 animate-pulse"></div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
    </div>
  )
}