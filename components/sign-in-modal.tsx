"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, User, Lock } from "lucide-react"

interface SignInModalProps {
  onClose: () => void
}

export function SignInModal({ onClose }: SignInModalProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false)
      onClose()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-black/90 border border-white/10 rounded-lg shadow-lg shadow-[#00DC82]/10 p-6">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 rounded-full hover:bg-white/10"
          onClick={onClose}
        >
          <X className="h-4 w-4 text-white" />
          <span className="sr-only">Close</span>
        </Button>

        <div className="flex flex-col items-center mb-6">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#00DC82] to-[#36e4da] flex items-center justify-center shadow-lg shadow-[#00DC82]/20 mb-4">
            <User className="h-8 w-8 text-black" />
          </div>
          <h2 className="text-xl font-bold text-white">Sign In</h2>
          <p className="text-sm text-white/70 mt-1">Access your AI Prophet account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-white">
              Username
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white/5 border-white/10 pl-10 text-white focus-visible:ring-[#00DC82]"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/10 pl-10 text-white focus-visible:ring-[#00DC82]"
                required
              />
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <a href="#" className="text-[#00DC82] hover:underline">
              Forgot password?
            </a>
            <a href="#" className="text-[#00DC82] hover:underline">
              Create account
            </a>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#00DC82] to-[#36e4da] text-black hover:opacity-90"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  )
}

