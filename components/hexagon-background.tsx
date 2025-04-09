"use client"

import { useRef, useEffect } from "react"
import { useMobile } from "@/hooks/use-mobile"
import { useMobileOptimization } from "@/hooks/use-mobile-optimization"

export function HexagonBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isMobile = useMobile()
  const { disableBackgroundEffects, reduceAnimations } = useMobileOptimization()

  useEffect(() => {
    if (disableBackgroundEffects) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Hexagon properties
    const hexSize = isMobile ? 30 : 50
    const hexSpacing = isMobile ? 40 : 70
    const hexRows = Math.ceil(window.innerHeight / hexSpacing) + 1
    const hexCols = Math.ceil(window.innerWidth / hexSpacing) + 1

    // Animation properties
    const animationSpeed = reduceAnimations ? 0.0005 : 0.001

    // Draw hexagons
    let animationFrame: number
    let time = 0

    const animate = () => {
      time += animationSpeed
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let row = 0; row < hexRows; row++) {
        for (let col = 0; col < hexCols; col++) {
          const x = col * hexSpacing + (row % 2 === 0 ? 0 : hexSpacing / 2)
          const y = row * hexSpacing

          // Skip some hexagons on mobile for better performance
          if (isMobile && (row + col) % 3 !== 0) continue

          // Calculate opacity based on time and position
          const opacity = 0.05 + 0.05 * Math.sin(time + x * 0.01 + y * 0.01)

          // Draw hexagon
          ctx.beginPath()
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3
            const hx = x + hexSize * Math.cos(angle)
            const hy = y + hexSize * Math.sin(angle)

            if (i === 0) {
              ctx.moveTo(hx, hy)
            } else {
              ctx.lineTo(hx, hy)
            }
          }
          ctx.closePath()

          // Set hexagon style
          ctx.strokeStyle = `rgba(0, 220, 130, ${opacity})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [isMobile, disableBackgroundEffects, reduceAnimations])

  if (disableBackgroundEffects) {
    return <div className="fixed inset-0 bg-black" />
  }

  return <canvas ref={canvasRef} className="fixed inset-0 bg-black" />
}

