"use client"

import { useState, useEffect } from "react"
import { useMobile } from "@/hooks/use-mobile"

export function useMobileOptimization() {
  const isMobile = useMobile()
  const [optimizationLevel, setOptimizationLevel] = useState<"none" | "low" | "medium" | "high">("none")

  useEffect(() => {
    if (!isMobile) {
      setOptimizationLevel("none")
      return
    }

    // Check device performance
    const checkPerformance = async () => {
      // Simple performance check based on device memory (if available)
      if ("deviceMemory" in navigator) {
        const memory = (navigator as any).deviceMemory

        if (memory <= 2) {
          setOptimizationLevel("high")
        } else if (memory <= 4) {
          setOptimizationLevel("medium")
        } else {
          setOptimizationLevel("low")
        }
      } else {
        // Fallback to medium optimization if deviceMemory not available
        setOptimizationLevel("medium")
      }
    }

    checkPerformance()
  }, [isMobile])

  // Return optimization settings based on level
  return {
    optimizationLevel,
    // Reduce animation complexity
    reduceAnimations: optimizationLevel !== "none",
    // Reduce data points in charts
    dataPointReduction:
      optimizationLevel === "high"
        ? 0.25
        : optimizationLevel === "medium"
          ? 0.5
          : optimizationLevel === "low"
            ? 0.75
            : 1,
    // Reduce update frequency
    updateInterval:
      optimizationLevel === "high"
        ? 60000
        : optimizationLevel === "medium"
          ? 30000
          : optimizationLevel === "low"
            ? 15000
            : 5000,
    // Lazy load components
    useLazyLoading: optimizationLevel !== "none",
    // Disable background effects
    disableBackgroundEffects: optimizationLevel === "high",
  }
}

