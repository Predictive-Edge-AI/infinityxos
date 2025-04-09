"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import {
  BarChart3,
  LineChart,
  Settings,
  User,
  Bell,
  Search,
  Home,
  Briefcase,
  TrendingUp,
  LogOut,
  Grid,
  PenToolIcon as Tool,
  Zap,
  Lightbulb,
  RefreshCw,
  MessageSquare,
  Plus,
  Clock,
  CheckCircle2,
} from "lucide-react"
import { ChatInterface } from "@/components/chat-interface"
import { HexagonBackground } from "@/components/hexagon-background"
import { NewsFeed } from "@/components/news-feed"
import { AssetCard } from "@/components/asset-card"
import { VariablesPanel } from "@/components/variables-panel"
import MobileNav from "@/app/components/mobile-nav"
import { SplashScreen } from "@/components/splash-screen"
import { InstallPrompt } from "@/components/install-prompt"
import { SignInModal } from "@/components/sign-in-modal"
import { InstantPredictions } from "@/components/instant-predictions"
import { SettingsPanel } from "@/components/settings-panel"
import { MarketDataPage } from "@/components/market-data-page"
import { PaperTradingPage } from "@/components/paper-trading-page"
import { ProofPage } from "@/components/proof-page"
import { CategoriesPage } from "@/components/categories-page"
import AnalyzePage from "@/components/analyze-page"
import { PortfolioPage } from "@/components/portfolio-page"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  const [toolsExpanded, setToolsExpanded] = useState(false)
  const [dataRefreshInterval, setDataRefreshInterval] = useState<NodeJS.Timeout | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [timeframe, setTimeframe] = useState("1m") // 1h, 1d, 1m, 1y
  const [showSignInModal, setShowSignInModal] = useState(false)
  const mainContentRef = useRef<HTMLDivElement>(null)

  // Refresh all live data
  const refreshAllData = () => {
    setIsRefreshing(true)
    // Force re-fetching in components that have useEffect dependencies
    setDataRefreshInterval(setInterval(() => {}, 100))

    // Show refresh for 1.5 seconds
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1500)
  }

  // For animation effects
  useEffect(() => {
    setMounted(true)

    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    // Hide splash screen after 2.5 seconds
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 2500)

    // Set up data refresh interval - refresh all live data every 60 seconds
    const refreshInterval = setInterval(() => {
      console.log("Refreshing live data...")
      refreshAllData()
    }, 60000)

    return () => {
      window.removeEventListener("resize", checkMobile)
      clearTimeout(timer)
      if (dataRefreshInterval) clearInterval(dataRefreshInterval)
      clearInterval(refreshInterval)
    }
  }, [])

  // Scroll to top on initial load to fix mobile navigation issue
  useEffect(() => {
    if (!showSplash && mainContentRef.current) {
      mainContentRef.current.scrollTop = 0
    }
  }, [showSplash])

  // Mock session data
  const session = { user: { name: "Demo User", email: "demo@example.com" } }

  // Handle tab change - ensure proper scrolling on mobile
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0
    }
  }

  return (
    <>
      {showSplash && <SplashScreen />}
      {showSignInModal && <SignInModal onClose={() => setShowSignInModal(false)} />}

      <div
        className={`flex h-[100dvh] bg-black text-white overflow-hidden ${
          mounted && !showSplash ? "opacity-100" : "opacity-0"
        } transition-opacity duration-500`}
      >
        {/* 3D Hexagon Background */}
        <div className="fixed inset-0 z-0">
          <HexagonBackground />
        </div>

        {/* Sidebar - hidden on mobile */}
        <div className="hidden md:flex w-64 border-r border-white/10 bg-black/80 backdrop-blur-sm flex-col h-full z-10 relative">
          {/* Logo in sidebar */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => (window.location.href = "/")}>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#00DC82] to-[#36e4da] flex items-center justify-center shadow-lg shadow-[#00DC82]/20">
                <TrendingUp className="h-4 w-4 text-black" />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                AI Prophet
              </h1>
            </div>
          </div>
          <nav className="flex-1 overflow-auto p-4 space-y-2">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 transition-all duration-200 hover:bg-white/10 hover:translate-x-1 ${
                activeTab === "overview"
                  ? "bg-gradient-to-r from-[#00DC82]/20 to-transparent border-l-2 border-[#00DC82] pl-3"
                  : ""
              }`}
              onClick={() => handleTabChange("overview")}
            >
              <Home className={`h-4 w-4 ${activeTab === "overview" ? "text-[#00DC82]" : ""}`} />
              <span className="text-white">Overview</span>
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 transition-all duration-200 hover:bg-white/10 hover:translate-x-1 ${
                activeTab === "proof"
                  ? "bg-gradient-to-r from-[#00DC82]/20 to-transparent border-l-2 border-[#00DC82] pl-3"
                  : ""
              }`}
              onClick={() => handleTabChange("proof")}
            >
              <CheckCircle2 className={`h-4 w-4 ${activeTab === "proof" ? "text-[#00DC82]" : ""}`} />
              <span className="text-white">Proof</span>
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 transition-all duration-200 hover:bg-white/10 hover:translate-x-1 ${
                activeTab === "portfolio"
                  ? "bg-gradient-to-r from-[#00DC82]/20 to-transparent border-l-2 border-[#00DC82] pl-3"
                  : ""
              }`}
              onClick={() => handleTabChange("portfolio")}
            >
              <Briefcase className={`h-4 w-4 ${activeTab === "portfolio" ? "text-[#00DC82]" : ""}`} />
              <span className="text-white">Portfolio</span>
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 transition-all duration-200 hover:bg-white/10 hover:translate-x-1 ${
                activeTab === "trading"
                  ? "bg-gradient-to-r from-[#00DC82]/20 to-transparent border-l-2 border-[#00DC82] pl-3"
                  : ""
              }`}
              onClick={() => handleTabChange("trading")}
            >
              <BarChart3 className={`h-4 w-4 ${activeTab === "trading" ? "text-[#00DC82]" : ""}`} />
              <span className="text-white">Paper Trading</span>
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 transition-all duration-200 hover:bg-white/10 hover:translate-x-1 ${
                activeTab === "market"
                  ? "bg-gradient-to-r from-[#00DC82]/20 to-transparent border-l-2 border-[#00DC82] pl-3"
                  : ""
              }`}
              onClick={() => handleTabChange("market")}
            >
              <LineChart className={`h-4 w-4 ${activeTab === "market" ? "text-[#00DC82]" : ""}`} />
              <span className="text-white">Market Data</span>
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 transition-all duration-200 hover:bg-white/10 hover:translate-x-1 ${
                activeTab === "categories"
                  ? "bg-gradient-to-r from-[#00DC82]/20 to-transparent border-l-2 border-[#00DC82] pl-3"
                  : ""
              }`}
              onClick={() => handleTabChange("categories")}
            >
              <Grid className={`h-4 w-4 ${activeTab === "categories" ? "text-[#00DC82]" : ""}`} />
              <span className="text-white">Categories</span>
            </Button>

            {/* Tools Section */}
            <div className="pt-2 pb-1">
              <Button
                variant="ghost"
                className={`w-full justify-between items-center transition-all duration-200 hover:bg-white/10 ${
                  toolsExpanded ? "bg-gradient-to-r from-[#00DC82]/10 to-transparent" : ""
                }`}
                onClick={() => setToolsExpanded(!toolsExpanded)}
              >
                <div className="flex items-center gap-2">
                  <Tool className="h-4 w-4" />
                  <span className="text-white">Tools</span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-200 ${toolsExpanded ? "rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </Button>

              {toolsExpanded && (
                <div className="pl-4 mt-1 space-y-1 border-l border-white/10 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start gap-2 transition-all duration-200 hover:bg-white/10 hover:translate-x-1 ${
                      activeTab === "analyze"
                        ? "bg-gradient-to-r from-blue-500/20 to-transparent border-l-2 border-blue-500 pl-3"
                        : ""
                    }`}
                    onClick={() => handleTabChange("analyze")}
                  >
                    <BarChart3 className={`h-4 w-4 ${activeTab === "analyze" ? "text-blue-500" : ""}`} />
                    <span className="text-white">Analyze</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start gap-2 transition-all duration-200 hover:bg-white/10 hover:translate-x-1 ${
                      activeTab === "predict"
                        ? "bg-gradient-to-r from-amber-500/20 to-transparent border-l-2 border-amber-500 pl-3"
                        : ""
                    }`}
                    onClick={() => handleTabChange("predict")}
                  >
                    <LineChart className={`h-4 w-4 ${activeTab === "predict" ? "text-amber-500" : ""}`} />
                    <span className="text-white">Predict</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start gap-2 transition-all duration-200 hover:bg-white/10 hover:translate-x-1 ${
                      activeTab === "variables"
                        ? "bg-gradient-to-r from-red-500/20 to-transparent border-l-2 border-red-500 pl-3"
                        : ""
                    }`}
                    onClick={() => handleTabChange("variables")}
                  >
                    <Zap className={`h-4 w-4 ${activeTab === "variables" ? "text-red-500" : ""}`} />
                    <span className="text-white">Variables</span>
                  </Button>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 transition-all duration-200 hover:bg-white/10 hover:translate-x-1 ${
                activeTab === "assistant"
                  ? "bg-gradient-to-r from-[#00DC82]/20 to-transparent border-l-2 border-[#00DC82] pl-3"
                  : ""
              }`}
              onClick={() => handleTabChange("assistant")}
            >
              <MessageSquare className={`h-4 w-4 ${activeTab === "assistant" ? "text-[#00DC82]" : ""}`} />
              <span className="text-white">AI Assistant</span>
            </Button>

            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 transition-all duration-200 hover:bg-white/10 hover:translate-x-1 ${
                activeTab === "prediction-history"
                  ? "bg-gradient-to-r from-[#00DC82]/20 to-transparent border-l-2 border-[#00DC82] pl-3"
                  : ""
              }`}
              onClick={() => handleTabChange("prediction-history")}
            >
              <Lightbulb className={`h-4 w-4 ${activeTab === "prediction-history" ? "text-[#00DC82]" : ""}`} />
              <span className="text-white">ML Predictions</span>
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 transition-all duration-200 hover:bg-white/10 hover:translate-x-1 ${
                activeTab === "instant-predictions"
                  ? "bg-gradient-to-r from-[#00DC82]/20 to-transparent border-l-2 border-[#00DC82] pl-3"
                  : ""
              }`}
              onClick={() => handleTabChange("instant-predictions")}
            >
              <Search className={`h-4 w-4 ${activeTab === "instant-predictions" ? "text-[#00DC82]" : ""}`} />
              <span className="text-white">Instant Predictions</span>
            </Button>
          </nav>

          <div className="p-4 border-t border-white/10">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 transition-all duration-200 hover:bg-white/10 hover:translate-x-1 ${
                activeTab === "settings"
                  ? "bg-gradient-to-r from-[#00DC82]/20 to-transparent border-l-2 border-[#00DC82] pl-3"
                  : ""
              }`}
              onClick={() => handleTabChange("settings")}
            >
              <Settings className={`h-4 w-4 ${activeTab === "settings" ? "text-[#00DC82]" : "text-white"}`} />
              <span className="text-white font-medium">Settings</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 transition-all duration-200 hover:bg-red-500/10 hover:translate-x-1"
            >
              <LogOut className="h-4 w-4 text-red-400" />
              <span className="text-red-400 font-medium">Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden z-10 relative w-full">
          {/* Header */}
          <header className="h-14 md:h-16 border-b border-white/10 bg-black/50 backdrop-blur-sm flex items-center justify-between px-2 md:px-6">
            <div className="flex items-center gap-2">
              {/* Mobile menu */}
              <MobileNav activeTab={activeTab} setActiveTab={handleTabChange} />

              {/* Logo for mobile */}
              <div
                className="md:hidden flex items-center gap-2 cursor-pointer"
                onClick={() => (window.location.href = "/")}
              >
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#00DC82] to-[#36e4da] flex items-center justify-center shadow-lg shadow-[#00DC82]/20">
                  <TrendingUp className="h-3 w-3 text-black" />
                </div>
                <h1 className="text-base font-bold">AI Prophet</h1>
              </div>

              {/* New gradient green button */}
              <Button
                className="bg-gradient-to-r from-yellow-500 to-yellow-300 text-black hover:opacity-90 hidden md:flex"
                onClick={() => refreshAllData()}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                <span>Refresh</span>
              </Button>

              {/* Variables button */}
              <Button
                className="bg-gradient-to-r from-blue-500/80 to-blue-300/80 text-black hover:opacity-90 hidden md:flex"
                onClick={() => handleTabChange("variables")}
              >
                <Zap className="h-4 w-4 mr-2" />
                <span>Variables</span>
              </Button>

              {/* Replace search input with Instant Search button */}
              <Button
                className="bg-gradient-to-r from-[#00DC82] to-[#36e4da] text-black hover:opacity-90 hidden md:flex items-center gap-2"
                onClick={() => handleTabChange("instant-predictions")}
              >
                <Search className="h-4 w-4" />
                <span>Instant Predictions</span>
              </Button>
            </div>

            <div className="flex items-center gap-1 md:gap-4">
              <Button variant="ghost" size="icon" className="rounded-full relative group h-8 w-8 md:h-10 md:w-10">
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#00DC82] rounded-full"></div>
                <Bell className="h-4 w-4 md:h-5 md:w-5 group-hover:text-[#00DC82] transition-colors duration-200" />
              </Button>
              <div
                className="flex items-center gap-1 md:gap-2 bg-white/5 px-2 py-1 rounded-full border border-white/10 hover:border-[#00DC82]/50 transition-colors duration-200 cursor-pointer"
                onClick={() => setShowSignInModal(true)}
              >
                <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-gradient-to-br from-[#00DC82]/80 to-[#36e4da]/80 flex items-center justify-center shadow-md">
                  <User className="h-3 w-3 md:h-4 md:w-4 text-black" />
                </div>
                <span className="text-xs md:text-base hidden xs:block text-white">
                  {session?.user?.name || session?.user?.email || "Sign In"}
                </span>
              </div>
            </div>
          </header>

          {/* Main content area */}
          <main ref={mainContentRef} className="flex-1 overflow-auto p-2 md:p-6 backdrop-blur-sm">
            {isRefreshing && (
              <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 bg-black/80 border border-[#00DC82]/50 text-white px-4 py-2 rounded-full flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin text-[#00DC82]" />
                <span>Refreshing live data...</span>
              </div>
            )}

            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange} className="space-y-4">
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {/* Portfolio Predictions Chart */}
                  <div className="col-span-1">
                    <Card className="bg-black/70 border-[#00DC82]/30 overflow-hidden group hover:border-[#00DC82]/50 transition-all duration-300 shadow-lg shadow-[#00DC82]/10">
                      <CardHeader className="p-3 md:p-4 flex flex-row items-center justify-between border-b border-white/20 bg-gradient-to-r from-[#00DC82]/20 to-transparent">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#00DC82] to-[#36e4da] flex items-center justify-center shadow-lg shadow-[#00DC82]/20">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4 text-black"
                            >
                              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                            </svg>
                          </div>
                          <div>
                            <CardTitle className="text-white text-lg md:text-xl font-bold">
                              Portfolio Predictions
                            </CardTitle>
                            <p className="text-sm text-white/70">AI-powered market analysis</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-white">Last updated: {new Date().toLocaleTimeString()}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-white/10"
                            onClick={refreshAllData}
                          >
                            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                            <span className="sr-only">Refresh data</span>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0 h-[300px] relative overflow-hidden">
                        <div className="h-full w-full relative p-4">
                          {/* Y-axis labels */}
                          <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-between text-white text-xs">
                            <span>$30,000</span>
                            <span>$25,000</span>
                            <span>$20,000</span>
                            <span>$15,000</span>
                            <span>$10,000</span>
                            <span>$5,000</span>
                            <span>$0</span>
                          </div>

                          <svg width="100%" height="100%" viewBox="0 0 800 300" preserveAspectRatio="none">
                            {/* Background grid lines */}
                            {[0, 1, 2, 3, 4, 5].map((i) => (
                              <line
                                key={`grid-${i}`}
                                x1="30"
                                y1={60 * i}
                                x2="800"
                                y2={60 * i}
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth="1"
                              />
                            ))}

                            {/* Portfolio value line (past) - GREEN */}
                            <path
                              d="M30,240 C80,220 130,180 180,190 C230,200 280,150 330,140 C380,130 430,120 480,100 C530,80 580,90 630,70"
                              fill="none"
                              stroke="#000"
                              strokeWidth="3"
                              strokeLinecap="round"
                            />
                            <path
                              d="M30,240 C80,220 130,180 180,190 C230,200 280,150 330,140 C380,130 430,120 480,100 C530,80 580,90 630,70"
                              fill="none"
                              stroke="#00DC82"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />

                            {/* Portfolio prediction line (future) - BLUE */}
                            <path
                              d="M630,70 C680,60 730,40 780,20"
                              fill="none"
                              stroke="#000"
                              strokeWidth="3"
                              strokeDasharray="5,5"
                              strokeLinecap="round"
                            />
                            <path
                              d="M630,70 C680,60 730,40 780,20"
                              fill="none"
                              stroke="#00BFFF"
                              strokeWidth="2.5"
                              strokeDasharray="5,5"
                              strokeLinecap="round"
                            />

                            {/* Area under the curve */}
                            <linearGradient id="portfolioGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#00DC82" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#00DC82" stopOpacity="0" />
                            </linearGradient>
                            <path
                              d="M30,240 C80,220 130,180 180,190 C230,200 280,150 330,140 C380,130 430,120 480,100 C530,80 580,90 630,70 C680,60 730,40 780,20 L780,300 L30,300 Z"
                              fill="url(#portfolioGradient)"
                            />

                            {/* Current position marker */}
                            <circle cx="630" cy="70" r="6" fill="#00DC82" />

                            {/* Divider line between past and prediction */}
                            <line
                              x1="630"
                              y1="0"
                              x2="630"
                              y2="300"
                              stroke="rgba(255,255,255,0.2)"
                              strokeWidth="1"
                              strokeDasharray="5,5"
                            />

                            {/* 30-day history markers at bottom */}
                            {Array.from({ length: 31 }).map((_, i) => (
                              <line
                                key={`day-${i}`}
                                x1={30 + i * 20}
                                y1="290"
                                x2={30 + i * 20}
                                y2="295"
                                stroke="rgba(255,255,255,0.5)"
                                strokeWidth="1"
                              />
                            ))}
                          </svg>

                          {/* Vertical line indicator */}
                          <div
                            className="absolute inset-0 z-10"
                            onMouseMove={(e) => {
                              const container = e.currentTarget
                              const rect = container.getBoundingClientRect()
                              const x = e.clientX - rect.left
                              const verticalLine = document.getElementById("dashboard-vertical-indicator")
                              const priceTooltip = document.getElementById("dashboard-price-tooltip")

                              if (verticalLine && priceTooltip) {
                                verticalLine.style.left = `${x}px`
                                verticalLine.style.display = "block"

                                // Calculate price based on x position (simplified)
                                const chartWidth = rect.width
                                const priceRange = 25000 // $25,000 range from bottom to top
                                const dayPosition = Math.min(Math.max(Math.round((x / chartWidth) * 30), 0), 30)
                                const isPastData = x < chartWidth * 0.75

                                // Mock price calculation
                                let price
                                if (isPastData) {
                                  price = 10000 + (Math.sin(dayPosition * 0.5) + 1) * 15000
                                } else {
                                  price = 24000 + (Math.sin(dayPosition * 0.3) + 0.5) * 3000
                                }

                                priceTooltip.style.left = `${x}px`
                                priceTooltip.style.display = "block"
                                priceTooltip.innerHTML = `
                                  <div class="font-bold">${isPastData ? "Day" : "Predicted"} ${dayPosition}</div>
                                  <div class="${isPastData ? "text-[#00DC82]" : "text-[#00BFFF]"}">${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price)}</div>
                                `
                              }
                            }}
                            onMouseLeave={() => {
                              const verticalLine = document.getElementById("dashboard-vertical-indicator")
                              const priceTooltip = document.getElementById("dashboard-price-tooltip")

                              if (verticalLine && priceTooltip) {
                                verticalLine.style.display = "none"
                                priceTooltip.style.display = "none"
                              }
                            }}
                          >
                            <div
                              id="dashboard-vertical-indicator"
                              className="hidden absolute top-0 bottom-0 w-px bg-white/50 pointer-events-none"
                              style={{ display: "none" }}
                            ></div>
                            <div
                              id="dashboard-price-tooltip"
                              className="hidden absolute top-4 transform -translate-x-1/2 bg-black/80 border border-white/20 rounded-md px-3 py-2 text-xs text-white pointer-events-none"
                              style={{ display: "none" }}
                            ></div>
                          </div>

                          {/* Labels */}
                          <div className="absolute bottom-4 left-8 text-xs text-white">Past Performance</div>
                          <div className="absolute bottom-4 right-4 text-xs text-white">AI Prediction</div>

                          {/* Time period toggles */}
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex bg-black/50 rounded-full border border-white/10 p-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`rounded-full px-3 py-1 text-xs ${timeframe === "1h" ? "bg-white/20 text-white" : "text-white/70"}`}
                              onClick={() => setTimeframe("1h")}
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              1H
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`rounded-full px-3 py-1 text-xs ${timeframe === "1d" ? "bg-white/20 text-white" : "text-white/70"}`}
                              onClick={() => setTimeframe("1d")}
                            >
                              1D
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`rounded-full px-3 py-1 text-xs ${timeframe === "1m" ? "bg-white/20 text-white" : "text-white/70"}`}
                              className={`rounded-full px-3 py-1 text-xs ${timeframe === "1m" ? "bg-white/20 text-white" : "text-white/70"}`}
                              onClick={() => setTimeframe("1m")}
                            >
                              1M
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`rounded-full px-3 py-1 text-xs ${timeframe === "1y" ? "bg-white/20 text-white" : "text-white/70"}`}
                              onClick={() => setTimeframe("1y")}
                            >
                              1Y
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Individual Asset Cards */}
                  <div className="col-span-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <AssetCard
                      symbol="NASDAQ"
                      name="NASDAQ Composite"
                      type="Index"
                      currentPrice={17654.32}
                      predictedPrice={17890.21}
                      change={123.45}
                      confidence={78}
                    />
                    <AssetCard
                      symbol="BTC"
                      name="Bitcoin"
                      type="Cryptocurrency"
                      currentPrice={43250.75}
                      predictedPrice={45750.5}
                      change={1250.25}
                      confidence={82}
                    />
                    <AssetCard
                      symbol="NQ"
                      name="Nasdaq 100 Futures"
                      type="Futures"
                      currentPrice={18432.5}
                      predictedPrice={18750.25}
                      change={317.75}
                      confidence={75}
                    />
                  </div>

                  {/* AI Assistant */}
                  <div className="col-span-1">
                    <Card className="bg-black/70 border-[#00DC82]/30 overflow-hidden group hover:border-[#00DC82]/50 transition-all duration-300 h-full shadow-lg shadow-[#00DC82]/10">
                      <CardHeader className="relative p-3 md:p-4 flex items-center gap-2 border-b border-white/20 bg-gradient-to-r from-[#00DC82]/20 to-transparent">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#00DC82] to-[#36e4da] flex items-center justify-center shadow-lg shadow-[#00DC82]/20">
                          <MessageSquare className="h-4 w-4 text-black" />
                        </div>
                        <div>
                          <CardTitle className="text-white text-base md:text-lg">AI Assistant</CardTitle>
                          <p className="text-xs text-white">Ask me anything about markets or investments</p>
                        </div>
                      </CardHeader>
                      <CardContent className="relative p-0 h-[400px] sm:h-[450px]">
                        <ChatInterface compact={true} />
                      </CardContent>
                    </Card>
                  </div>

                  {/* News Feed - Portfolio Related */}
                  <div className="col-span-1">
                    <Card className="bg-black/60 border-white/10 overflow-hidden group hover:border-[#00DC82]/30 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#00DC82]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <CardContent className="p-3 md:p-4">
                        <NewsFeed portfolioOnly={true} />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Portfolio Tab */}
              <TabsContent value="portfolio">
                <PortfolioPage />
              </TabsContent>

              {/* Variables Tab */}
              <TabsContent value="variables">
                <div className="space-y-4">
                  <Card className="bg-black/60 border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-white">Market Variables</CardTitle>
                      <Button className="bg-gradient-to-r from-[#00DC82] to-[#36e4da] text-black hover:opacity-90">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Variable
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <VariablesPanel />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Instant Predictions Tab */}
              <TabsContent value="instant-predictions">
                <div className="space-y-4">
                  <Card className="bg-black/60 border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-white">Instant Predictions</CardTitle>
                        <p className="text-sm text-white/70 mt-1">
                          Real-time market opportunities with high confidence
                        </p>
                      </div>
                      <Button className="bg-gradient-to-r from-[#00DC82] to-[#36e4da] text-black hover:opacity-90">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        <span>Scan Now</span>
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <InstantPredictions />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Market Data Tab */}
              <TabsContent value="market">
                <MarketDataPage />
              </TabsContent>

              {/* Paper Trading Tab */}
              <TabsContent value="trading">
                <PaperTradingPage />
              </TabsContent>

              {/* Categories Tab */}
              <TabsContent value="categories">
                <CategoriesPage />
              </TabsContent>

              {/* Analyze Tab */}
              <TabsContent value="analyze">
                <AnalyzePage />
              </TabsContent>

              <TabsContent value="predict">
                <div className="space-y-4">
                  <Card className="bg-black/60 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">Predict</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white">Prediction tools will be displayed here.</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="assistant">
                <Card className="bg-black/60 border-white/10 overflow-hidden group hover:border-[#00DC82]/30 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00DC82]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardHeader className="relative p-3 md:p-4 flex items-center gap-2 border-b border-white/20 bg-gradient-to-r from-[#00DC82]/20 to-transparent">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#00DC82] to-[#36e4da] flex items-center justify-center shadow-lg shadow-[#00DC82]/20">
                      <MessageSquare className="h-4 w-4 text-black" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-base md:text-lg">AI Financial Assistant</CardTitle>
                      <p className="text-xs text-white">Ask me anything about markets or investments</p>
                    </div>
                  </CardHeader>
                  <CardContent className="relative p-0 h-[calc(100vh-180px)]">
                    <ChatInterface />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="prediction-history">
                <div className="space-y-4">
                  <Card className="bg-black/60 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">ML Predictions History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white">Prediction history will be displayed here.</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="proof">
                <ProofPage />
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings">
                <div className="space-y-4">
                  <Card className="bg-black/60 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SettingsPanel />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>

      <InstallPrompt />
    </>
  )
}

