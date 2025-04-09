"use client"

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"

export function SplashScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          return 100
        }
        return prev + 5
      })
    }, 100)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
      <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-[#00DC82]/20 to-[#36e4da]/20 flex items-center justify-center animate-pulse">
        <div className="absolute h-16 w-16 rounded-full bg-gradient-to-br from-[#00DC82]/40 to-[#36e4da]/40 flex items-center justify-center">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#00DC82] to-[#36e4da] flex items-center justify-center shadow-lg shadow-[#00DC82]/20">
            <TrendingUp className="h-6 w-6 text-black" />
          </div>
        </div>
      </div>
      <h1 className="mt-6 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
        AI Prophet
      </h1>
      <p className="mt-2 text-sm text-white/60">AI-powered market predictions</p>
      <div className="mt-6 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#00DC82] to-[#36e4da] transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  )
}

