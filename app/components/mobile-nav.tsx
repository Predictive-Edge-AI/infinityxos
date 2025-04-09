"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Menu,
  Home,
  Briefcase,
  BarChart3,
  LineChart,
  Grid,
  MessageSquare,
  Lightbulb,
  Settings,
  LogOut,
  PenToolIcon as Tool,
  Zap,
  Search,
  CheckCircle2,
} from "lucide-react"

interface MobileNavProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function MobileNav({ activeTab, setActiveTab }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const [toolsExpanded, setToolsExpanded] = useState(false)

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64 bg-black/95 border-r border-white/10">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleTabChange("overview")}>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#00DC82] to-[#36e4da] flex items-center justify-center shadow-lg shadow-[#00DC82]/20">
                <LineChart className="h-4 w-4 text-black" />
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
      </SheetContent>
    </Sheet>
  )
}

