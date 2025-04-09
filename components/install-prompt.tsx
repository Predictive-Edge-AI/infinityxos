"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, X, Check, Smartphone } from "lucide-react"

export function InstallPrompt() {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [installStatus, setInstallStatus] = useState<"idle" | "installing" | "success" | "error">("idle")
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Check if the app is already installed
    const isAppInstalled = window.matchMedia("(display-mode: standalone)").matches

    if (isAppInstalled) {
      return // Don't show install prompt if already installed
    }

    // Detect iOS devices
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    // Listen for the beforeinstallprompt event (non-iOS devices)
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
      // Show the install button
      setShowInstallPrompt(true)
    }

    // For iOS devices, show custom instructions
    if (isIOSDevice) {
      // Only show after 3 seconds to avoid immediate popup
      const timer = setTimeout(() => {
        setShowInstallPrompt(true)
      }, 3000)
      return () => clearTimeout(timer)
    } else {
      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      }
    }
  }, [])

  const handleInstallClick = async () => {
    if (isIOS) {
      // For iOS, we just show instructions
      return
    }

    if (!deferredPrompt) return

    setInstallStatus("installing")

    try {
      // Show the install prompt
      deferredPrompt.prompt()

      // Wait for the user to respond to the prompt
      const choiceResult = await deferredPrompt.userChoice

      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt")
        setInstallStatus("success")
        // Show success message briefly before hiding
        setTimeout(() => {
          setShowInstallPrompt(false)
        }, 2000)
      } else {
        console.log("User dismissed the install prompt")
        setInstallStatus("idle")
      }

      // Clear the saved prompt since it can't be used again
      setDeferredPrompt(null)
    } catch (error) {
      console.error("Installation error:", error)
      setInstallStatus("error")
      // Reset after error
      setTimeout(() => {
        setInstallStatus("idle")
      }, 3000)
    }
  }

  if (!showInstallPrompt) return null

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/90 border border-[#00DC82]/50 text-white px-4 py-3 rounded-lg flex flex-col items-center gap-2 max-w-xs w-full shadow-lg shadow-[#00DC82]/20">
      <div className="flex items-center justify-between w-full">
        <h3 className="text-sm font-bold">Install AI Prophet</h3>
        <button onClick={() => setShowInstallPrompt(false)} className="text-white/70 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>

      {isIOS ? (
        <>
          <div className="flex items-center gap-2 text-xs text-white/90">
            <Smartphone className="h-4 w-4 text-[#00DC82]" />
            <p>To install on iOS:</p>
          </div>
          <ol className="text-xs text-white/80 list-decimal pl-5 space-y-1">
            <li>Tap the share button</li>
            <li>Scroll down and tap "Add to Home Screen"</li>
            <li>Tap "Add" in the top right</li>
          </ol>
        </>
      ) : (
        <>
          <p className="text-xs text-center text-white/90">
            Install AI Prophet on your device for the best experience with offline access
          </p>
          <Button
            className="bg-gradient-to-r from-[#00DC82] to-[#36e4da] text-black hover:opacity-90 w-full"
            onClick={handleInstallClick}
            disabled={installStatus === "installing" || installStatus === "success"}
          >
            {installStatus === "idle" && (
              <>
                <Download className="h-4 w-4 mr-2" />
                <span>Install App</span>
              </>
            )}
            {installStatus === "installing" && (
              <>
                <span className="animate-spin h-4 w-4 mr-2 border-2 border-black border-t-transparent rounded-full" />
                <span>Installing...</span>
              </>
            )}
            {installStatus === "success" && (
              <>
                <Check className="h-4 w-4 mr-2" />
                <span>Installed!</span>
              </>
            )}
            {installStatus === "error" && (
              <>
                <X className="h-4 w-4 mr-2" />
                <span>Error - Try Again</span>
              </>
            )}
          </Button>
        </>
      )}
    </div>
  )
}

