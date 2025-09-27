'use client'

import { Suspense, lazy, useState, useEffect } from 'react'

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [SplineComponent, setSplineComponent] = useState<any>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let mounted = true

    const loadSpline = async () => {
      try {
        const { default: Spline } = await import('@splinetool/react-spline')
        if (mounted) {
          setSplineComponent(() => Spline)
        }
      } catch (err) {
        console.warn('Spline loading failed:', err)
        if (mounted) {
          setError(true)
        }
      }
    }

    loadSpline()

    return () => {
      mounted = false
    }
  }, [])

  if (error || !SplineComponent) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-50 animate-pulse"></div>
          <p className="text-white/60">3D Scene Loading...</p>
        </div>
      </div>
    )
  }

  return (
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
      <SplineComponent
        scene={scene}
        className={className}
      />
    </Suspense>
  )
}