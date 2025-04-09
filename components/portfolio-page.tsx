"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  TrendingUp,
  Brain,
  User,
  Briefcase,
  Target,
  Clock,
  Sparkles,
  Wallet,
  RotateCcw,
  Plus,
  DollarSign,
  BarChart3,
  Sliders,
  Zap,
  Search,
  AlertTriangle,
  CloudRain,
  Newspaper,
  Users,
  PieChart,
  Trash2,
  PlusCircle,
  Lightbulb,
} from "lucide-react"

export function PortfolioPage() {
  const [activeStrategy, setActiveStrategy] = useState<string | null>("ai-prophet")
  const [portfolioBalance, setPortfolioBalance] = useState(50000)
  const [riskLevel, setRiskLevel] = useState(50)
  const [isAiManaged, setIsAiManaged] = useState(true)
  const [minBudget, setMinBudget] = useState(0)
  const [maxBudget, setMaxBudget] = useState(500000)
  const [portfolioAssets, setPortfolioAssets] = useState<PortfolioAsset[]>([])
  const [isGeneratingPortfolio, setIsGeneratingPortfolio] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d")
  const [showAddAssetDialog, setShowAddAssetDialog] = useState(false)
  const [showAnalyzeDialog, setShowAnalyzeDialog] = useState(false)
  const [showVariablesDialog, setShowVariablesDialog] = useState(false)
  const [showPredictionsDialog, setShowPredictionsDialog] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<PortfolioAsset | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [newAsset, setNewAsset] = useState({
    symbol: "",
    name: "",
    shares: 0,
    purchasePrice: 0,
    strategy: "infinity",
  })

  // Mock assets for the portfolio
  const mockAssets: PortfolioAsset[] = [
    {
      id: "asset-1",
      symbol: "AAPL",
      name: "Apple Inc.",
      purchasePrice: 187.32,
      currentPrice: 192.53,
      shares: 15,
      strategy: "human",
      purchaseDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      performance: 2.78,
      predictedPrice: 203.45,
      predictedGrowth: 5.67,
      confidence: 89,
      history: generateMockHistory(187.32, 192.53, 203.45, 89),
    },
    {
      id: "asset-2",
      symbol: "NVDA",
      name: "NVIDIA Corporation",
      purchasePrice: 824.15,
      currentPrice: 856.3,
      shares: 5,
      strategy: "infinity",
      purchaseDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      performance: 3.9,
      predictedPrice: 912.3,
      predictedGrowth: 6.54,
      confidence: 91,
      history: generateMockHistory(824.15, 856.3, 912.3, 91),
    },
    {
      id: "asset-3",
      symbol: "BTC",
      name: "Bitcoin",
      purchasePrice: 43250.75,
      currentPrice: 44750.25,
      shares: 0.25,
      strategy: "infinity",
      purchaseDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      performance: 3.47,
      predictedPrice: 47250.5,
      predictedGrowth: 5.59,
      confidence: 82,
      history: generateMockHistory(43250.75, 44750.25, 47250.5, 82),
    },
    {
      id: "asset-4",
      symbol: "MSFT",
      name: "Microsoft Corp.",
      purchasePrice: 350.12,
      currentPrice: 378.92,
      shares: 10,
      strategy: "buffett",
      purchaseDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      performance: 8.23,
      predictedPrice: 412.67,
      predictedGrowth: 8.91,
      confidence: 86,
      history: generateMockHistory(350.12, 378.92, 412.67, 86),
    },
    {
      id: "asset-5",
      symbol: "TSLA",
      name: "Tesla Inc.",
      purchasePrice: 175.43,
      currentPrice: 187.25,
      shares: 20,
      strategy: "infinity",
      purchaseDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      performance: 6.74,
      predictedPrice: 195.25,
      predictedGrowth: 4.27,
      confidence: 75,
      history: generateMockHistory(175.43, 187.25, 195.25, 75),
    },
  ]

  // Variables for the variables panel
  const [variables, setVariables] = useState([
    { id: 1, name: "Political News", icon: "PoliticalCapital", enabled: true, weight: 75, category: "News" },
    { id: 2, name: "Weather Events", icon: "CloudRain", enabled: true, weight: 60, category: "Environmental" },
    { id: 3, name: "Market Sentiment", icon: "TrendingUp", enabled: true, weight: 90, category: "Market" },
    { id: 4, name: "Social Sentiment", icon: "Users", enabled: true, weight: 70, category: "Social" },
    { id: 5, name: "Critical News", icon: "AlertTriangle", enabled: true, weight: 85, category: "News" },
    { id: 6, name: "Industry Reports", icon: "Newspaper", enabled: false, weight: 65, category: "Market" },
  ])

  const handleToggleVariable = (id: number) => {
    setVariables(variables.map((v) => (v.id === id ? { ...v, enabled: !v.enabled } : v)))
  }

  const handleWeightChange = (id: number, value: number[]) => {
    setVariables(variables.map((v) => (v.id === id ? { ...v, weight: value[0] } : v)))
  }

  // Generate mock history data for an asset
  function generateMockHistory(
    startPrice: number,
    currentPrice: number,
    predictedPrice: number,
    confidence: number,
  ): DailyPerformance[] {
    const history: DailyPerformance[] = []
    const days = 30
    const today = new Date()

    // Calculate daily price change to reach current price
    const dailyChange = (currentPrice - startPrice) / days

    for (let i = 0; i < days; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - (days - i))

      // Add some randomness to daily price
      const randomFactor = 0.98 + Math.random() * 0.04 // Random between 0.98 and 1.02
      const dayPrice = startPrice + dailyChange * i * randomFactor

      // Calculate daily change
      const prevDayPrice = i > 0 ? history[i - 1].price : startPrice
      const dailyPriceChange = ((dayPrice - prevDayPrice) / prevDayPrice) * 100

      // Generate prediction (slightly higher than actual with some randomness)
      const predictionRandomness = 0.99 + Math.random() * 0.04
      const dayPrediction = dayPrice * (1 + 0.02 * predictionRandomness)

      // Calculate accuracy (how close was yesterday's prediction to today's actual)
      const accuracy =
        i > 0 ? 100 - Math.min(100, Math.abs(((history[i - 1].prediction - dayPrice) / dayPrice) * 100)) : confidence

      history.push({
        date: date.toISOString().split("T")[0],
        price: Number.parseFloat(dayPrice.toFixed(2)),
        change: Number.parseFloat(dailyPriceChange.toFixed(2)),
        prediction: Number.parseFloat(dayPrediction.toFixed(2)),
        accuracy: Number.parseFloat(accuracy.toFixed(1)),
      })
    }

    return history
  }

  const resetPortfolio = () => {
    setPortfolioBalance(50000)
    setPortfolioAssets([])
  }

  const generateAiPortfolio = () => {
    setIsGeneratingPortfolio(true)

    // Simulate API call delay
    setTimeout(() => {
      setPortfolioAssets(mockAssets)
      setPortfolioBalance(50000 - mockAssets.reduce((acc, asset) => acc + asset.purchasePrice * asset.shares, 0))
      setIsGeneratingPortfolio(false)
      setActiveStrategy("infinity")
    }, 2000)
  }

  // Handle adding a new asset
  const handleAddAsset = () => {
    if (!newAsset.symbol || !newAsset.name || newAsset.shares <= 0 || newAsset.purchasePrice <= 0) {
      return
    }

    const asset: PortfolioAsset = {
      id: `asset-${Date.now()}`,
      symbol: newAsset.symbol,
      name: newAsset.name,
      purchasePrice: newAsset.purchasePrice,
      currentPrice: newAsset.purchasePrice * (1 + Math.random() * 0.1), // Random current price
      shares: newAsset.shares,
      strategy: newAsset.strategy as any,
      purchaseDate: new Date(),
      performance: Math.random() * 10, // Random performance
      predictedPrice: newAsset.purchasePrice * (1 + Math.random() * 0.15),
      predictedGrowth: Math.random() * 8 + 2,
      confidence: Math.floor(Math.random() * 15) + 75,
      history: generateMockHistory(
        newAsset.purchasePrice,
        newAsset.purchasePrice * (1 + Math.random() * 0.1),
        newAsset.purchasePrice * (1 + Math.random() * 0.15),
        Math.floor(Math.random() * 15) + 75,
      ),
    }

    setPortfolioAssets([...portfolioAssets, asset])
    setShowAddAssetDialog(false)
    setNewAsset({
      symbol: "",
      name: "",
      shares: 0,
      purchasePrice: 0,
      strategy: "infinity",
    })
  }

  // Handle removing an asset
  const handleRemoveAsset = (id: string) => {
    setPortfolioAssets(portfolioAssets.filter((asset) => asset.id !== id))
  }

  const calculatePortfolioValue = () => {
    return portfolioAssets.reduce((acc, asset) => acc + asset.currentPrice * asset.shares, 0)
  }

  const calculatePortfolioGrowth = () => {
    const initialValue = portfolioAssets.reduce((acc, asset) => acc + asset.purchasePrice * asset.shares, 0)
    const currentValue = calculatePortfolioValue()
    return {
      value: currentValue - initialValue,
      percent: initialValue > 0 ? ((currentValue - initialValue) / initialValue) * 100 : 0,
    }
  }

  const calculatePredictedGrowth = () => {
    const currentValue = calculatePortfolioValue()
    const predictedValue = portfolioAssets.reduce((acc, asset) => acc + asset.predictedPrice * asset.shares, 0)
    return {
      value: predictedValue - currentValue,
      percent: currentValue > 0 ? ((predictedValue - currentValue) / currentValue) * 100 : 0,
    }
  }

  const portfolioGrowth = calculatePortfolioGrowth()
  const predictedGrowth = calculatePredictedGrowth()
  const totalValue = portfolioBalance + calculatePortfolioValue()

  // Calculate average prediction accuracy across all assets
  const calculateAveragePredictionAccuracy = () => {
    if (portfolioAssets.length === 0) return 0

    let totalAccuracy = 0
    let count = 0

    portfolioAssets.forEach((asset) => {
      if (asset.history && asset.history.length > 0) {
        // Get the last 7 days of history for accuracy calculation
        const recentHistory = asset.history.slice(-7)
        recentHistory.forEach((day) => {
          totalAccuracy += day.accuracy
          count++
        })
      }
    })

    return count > 0 ? totalAccuracy / count : 0
  }

  const averagePredictionAccuracy = calculateAveragePredictionAccuracy()

  // Mock search function
  const handleSearch = () => {
    if (!searchQuery) return

    setIsSearching(true)

    // Simulate API call delay
    setTimeout(() => {
      // Mock data for AAPL
      if (searchQuery.toUpperCase() === "AAPL" || searchQuery.toLowerCase().includes("apple")) {
        setSelectedAsset({
          id: "search-1",
          symbol: "AAPL",
          name: "Apple Inc.",
          purchasePrice: 187.32,
          currentPrice: 192.53,
          shares: 0,
          strategy: "a-la-carte",
          purchaseDate: new Date(),
          performance: 2.78,
          predictedPrice: 203.45,
          predictedGrowth: 5.67,
          confidence: 89,
          history: generateMockHistory(187.32, 192.53, 203.45, 89),
        })
      }
      // Mock data for MSFT
      else if (searchQuery.toUpperCase() === "MSFT" || searchQuery.toLowerCase().includes("microsoft")) {
        setSelectedAsset({
          id: "search-2",
          symbol: "MSFT",
          name: "Microsoft Corp.",
          purchasePrice: 378.92,
          currentPrice: 378.92,
          shares: 0,
          strategy: "a-la-carte",
          purchaseDate: new Date(),
          performance: 8.23,
          predictedPrice: 412.67,
          predictedGrowth: 8.91,
          confidence: 86,
          history: generateMockHistory(350.12, 378.92, 412.67, 86),
        })
      }
      // Default mock data for any other search
      else {
        setSelectedAsset({
          id: "search-3",
          symbol: searchQuery.toUpperCase(),
          name: `${searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1)} Corp.`,
          purchasePrice: 125.45,
          currentPrice: 125.45,
          shares: 0,
          strategy: "a-la-carte",
          purchaseDate: new Date(),
          performance: 8.21,
          predictedPrice: 135.75,
          predictedGrowth: 8.21,
          confidence: 72,
          history: generateMockHistory(115.45, 125.45, 135.75, 72),
        })
      }

      setIsSearching(false)
    }, 1500)
  }

  return (
    <div className="space-y-4">
      {/* Portfolio Predictions Chart (from home page) */}
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
              <CardTitle className="text-white text-lg md:text-xl font-bold">Portfolio Predictions</CardTitle>
              <p className="text-sm text-white/70">AI-powered market analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xs text-white/50">Last updated: {new Date().toLocaleTimeString()}</p>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/10">
              <RefreshCw className="h-4 w-4" />
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
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={`grid-${i}`}
                  x1="0"
                  y1={60 * i}
                  x2="800"
                  y2={60 * i}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1"
                />
              ))}

              {/* Portfolio value line (past) */}
              <path
                d="M0,240 C50,220 100,180 150,190 C200,200 250,150 300,140 C350,130 400,120 450,100 C500,80 550,90 600,70"
                fill="none"
                stroke="#000"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M0,240 C50,220 100,180 150,190 C200,200 250,150 300,140 C350,130 400,120 450,100 C500,80 550,90 600,70"
                fill="none"
                stroke="#00DC82"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Portfolio prediction line (future) */}
              <path
                d="M600,70 C650,60 700,40 750,20 C800,0"
                fill="none"
                stroke="#000"
                strokeWidth="3"
                strokeDasharray="5,5"
                strokeLinecap="round"
              />
              <path
                d="M600,70 C650,60 700,40 750,20 C800,0"
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
                d="M0,240 C50,220 100,180 150,190 C200,200 250,150 300,140 C350,130 400,120 450,100 C500,80 550,90 600,70 C650,60 700,40 750,20 C800,0 L800,300 L0,300 Z"
                fill="url(#portfolioGradient)"
              />

              {/* Current position marker */}
              <circle cx="600" cy="70" r="6" fill="#00DC82" />

              {/* Divider line between past and prediction */}
              <line
                x1="600"
                y1="0"
                x2="600"
                y2="300"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
                strokeDasharray="5,5"
              />
            </svg>

            {/* Vertical line indicator */}
            <div
              className="absolute inset-0 z-10"
              onMouseMove={(e) => {
                const container = e.currentTarget
                const rect = container.getBoundingClientRect()
                const x = e.clientX - rect.left
                const verticalLine = document.getElementById("portfolio-vertical-indicator")
                const priceTooltip = document.getElementById("portfolio-price-tooltip")

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
                const verticalLine = document.getElementById("portfolio-vertical-indicator")
                const priceTooltip = document.getElementById("portfolio-price-tooltip")

                if (verticalLine && priceTooltip) {
                  verticalLine.style.display = "none"
                  priceTooltip.style.display = "none"
                }
              }}
            >
              <div
                id="portfolio-vertical-indicator"
                className="hidden absolute top-0 bottom-0 w-px bg-white/50 pointer-events-none"
                style={{ display: "none" }}
              ></div>
              <div
                id="portfolio-price-tooltip"
                className="hidden absolute top-4 transform -translate-x-1/2 bg-black/80 border border-white/20 rounded-md px-3 py-2 text-xs text-white pointer-events-none"
                style={{ display: "none" }}
              ></div>
            </div>

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

            {/* Labels */}
            <div className="absolute bottom-4 left-4 text-xs text-white/60">Past Performance</div>
            <div className="absolute bottom-4 right-4 text-xs text-white/60">AI ML Prediction</div>

            {/* Value indicators */}
            <div className="absolute top-4 left-4 space-y-1">
              <div className="text-lg font-bold">$24,856.32</div>
              <div className="text-sm text-green-400">+$1,245.87 (5.28%)</div>
            </div>

            {/* Prediction indicator */}
            <div className="absolute top-4 right-4 space-y-1 text-right">
              <div className="text-lg font-bold text-[#00BFFF]">$27,320.15</div>
              <div className="text-sm text-[#00BFFF]">+$2,463.83 (9.91%)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Header */}
      <Card className="bg-black/60 border-white/10">
        <CardHeader className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-white text-xl">Portfolio</CardTitle>
              <CardDescription className="text-white/70">
                Manage your investment portfolio with AI-powered strategies
              </CardDescription>
            </div>
            <div className="flex flex-col xs:flex-row gap-2">
              <Button
                variant="outline"
                className="border-white/10 text-white hover:bg-white/10 hover:text-white"
                onClick={resetPortfolio}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Portfolio
              </Button>
              <Dialog open={showAddAssetDialog} onOpenChange={setShowAddAssetDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-[#00DC82] to-[#36e4da] text-black hover:opacity-90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Asset
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-black/90 border-white/10">
                  <DialogHeader>
                    <DialogTitle className="text-white">Add New Asset</DialogTitle>
                    <DialogDescription className="text-white/70">
                      Add a new asset to your portfolio for tracking and analysis.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="symbol" className="text-right text-white">
                        Symbol
                      </Label>
                      <Input
                        id="symbol"
                        value={newAsset.symbol}
                        onChange={(e) => setNewAsset({ ...newAsset, symbol: e.target.value })}
                        className="col-span-3 bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right text-white">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={newAsset.name}
                        onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                        className="col-span-3 bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="shares" className="text-right text-white">
                        Shares
                      </Label>
                      <Input
                        id="shares"
                        type="number"
                        value={newAsset.shares}
                        onChange={(e) => setNewAsset({ ...newAsset, shares: Number.parseFloat(e.target.value) })}
                        className="col-span-3 bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="price" className="text-right text-white">
                        Purchase Price
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        value={newAsset.purchasePrice}
                        onChange={(e) => setNewAsset({ ...newAsset, purchasePrice: Number.parseFloat(e.target.value) })}
                        className="col-span-3 bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="strategy" className="text-right text-white">
                        Strategy
                      </Label>
                      <Select
                        value={newAsset.strategy}
                        onValueChange={(value) => setNewAsset({ ...newAsset, strategy: value })}
                      >
                        <SelectTrigger className="col-span-3 bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-white/10">
                          <SelectItem value="index">Index</SelectItem>
                          <SelectItem value="human">Human</SelectItem>
                          <SelectItem value="buffett">Buffett AI</SelectItem>
                          <SelectItem value="infinity">Infinity AI</SelectItem>
                          <SelectItem value="a-la-carte">A-La-Carte</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowAddAssetDialog(false)}
                      className="border-white/10 text-white hover:bg-white/10 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddAsset}
                      className="bg-gradient-to-r from-[#00DC82] to-[#36e4da] text-black hover:opacity-90"
                    >
                      Add Asset
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-black/40 border-white/10 p-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#00DC82]/20 to-[#36e4da]/20 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-[#00DC82]" />
                </div>
                <div>
                  <p className="text-sm text-white/70">Available Balance</p>
                  <p className="text-lg font-bold text-white">
                    $
                    {portfolioBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-black/40 border-white/10 p-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#00DC82]/20 to-[#36e4da]/20 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-[#00DC82]" />
                </div>
                <div>
                  <p className="text-sm text-white/70">Portfolio Value</p>
                  <p className="text-lg font-bold text-white">
                    $
                    {calculatePortfolioValue().toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-black/40 border-white/10 p-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#00DC82]/20 to-[#36e4da]/20 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-[#00DC82]" />
                </div>
                <div>
                  <p className="text-sm text-white/70">Total Value</p>
                  <p className="text-lg font-bold text-white">
                    ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-black/40 border-white/10 p-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500/20 to-green-400/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-white/70">Portfolio Growth</p>
                  <div className="flex items-center gap-1">
                    <p className="text-lg font-bold text-green-400">
                      {portfolioGrowth.percent >= 0 ? "+" : ""}
                      {portfolioGrowth.percent.toFixed(2)}%
                    </p>
                    <span className="text-xs text-white/50">
                      ($
                      {Math.abs(portfolioGrowth.value).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      )
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* AI Strategy Selection */}
      <Card className="bg-black/60 border-white/10">
        <CardHeader className="p-4">
          <CardTitle className="text-white">AI Prophet Strategies</CardTitle>
          <CardDescription className="text-white/70">
            Select an AI-powered trading strategy to optimize your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Management Type Toggle */}
              <Card className="bg-black/40 border-white/10 p-4">
                <div className="flex flex-col space-y-3">
                  <h3 className="text-base font-medium text-white">Portfolio Management</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center ${isAiManaged ? "bg-[#00DC82]/20" : "bg-white/10"}`}
                      >
                        <Brain className={`h-4 w-4 ${isAiManaged ? "text-[#00DC82]" : "text-white/70"}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isAiManaged ? "text-white" : "text-white/70"}`}>
                          AI Managed
                        </p>
                        <p className="text-xs text-white/50">Automated portfolio optimization</p>
                      </div>
                    </div>
                    <Switch checked={isAiManaged} onCheckedChange={setIsAiManaged} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center ${!isAiManaged ? "bg-white/20" : "bg-white/10"}`}
                      >
                        <User className={`h-4 w-4 ${!isAiManaged ? "text-white" : "text-white/70"}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${!isAiManaged ? "text-white" : "text-white/70"}`}>
                          Human Managed
                        </p>
                        <p className="text-xs text-white/50">Manual trading decisions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Risk Level Slider */}
              <Card className="bg-black/40 border-white/10 p-4">
                <div className="flex flex-col space-y-3">
                  <h3 className="text-base font-medium text-white">Risk Preference</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white/70">Risk Level</p>
                    <Badge
                      variant="outline"
                      className={`
                        ${
                          riskLevel < 33
                            ? "bg-blue-500/20 text-blue-400"
                            : riskLevel < 66
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-red-500/20 text-red-400"
                        } 
                        border-0
                      `}
                    >
                      {riskLevel < 33 ? "Low Risk" : riskLevel < 66 ? "Medium Risk" : "High Risk"}
                    </Badge>
                  </div>
                  <Slider
                    value={[riskLevel]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setRiskLevel(value[0])}
                    disabled={!isAiManaged}
                  />
                  <div className="flex justify-between text-xs text-white/50">
                    <span>Conservative</span>
                    <span>Balanced</span>
                    <span>Aggressive</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Budget Range */}
            <Card className="bg-black/40 border-white/10 p-4">
              <div className="flex flex-col space-y-3">
                <h3 className="text-base font-medium text-white">Investment Budget</h3>
                <div className="flex justify-between">
                  <p className="text-sm text-white/70">Budget Range</p>
                  <p className="text-sm text-white">
                    ${minBudget.toLocaleString()} - ${maxBudget.toLocaleString()}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min-budget" className="text-white/70">
                      Minimum ($)
                    </Label>
                    <Input
                      id="min-budget"
                      type="number"
                      value={minBudget}
                      onChange={(e) => setMinBudget(Number(e.target.value))}
                      min={0}
                      max={portfolioBalance}
                      className="bg-white/5 border-white/10 text-white"
                      disabled={!isAiManaged}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-budget" className="text-white/70">
                      Maximum ($)
                    </Label>
                    <Input
                      id="max-budget"
                      type="number"
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(Number(e.target.value))}
                      min={minBudget}
                      max={500000}
                      className="bg-white/5 border-white/10 text-white"
                      disabled={!isAiManaged}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Strategy Selection */}
            <div className="space-y-3">
              <h3 className="text-base font-medium text-white">Select Strategy</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* AI Prophet Strategy */}
                <Card
                  className={`bg-black/40 border-white/10 p-4 cursor-pointer transition-all duration-200 hover:bg-black/60 ${activeStrategy === "ai-prophet" ? "ring-2 ring-[#00DC82]" : ""}`}
                  onClick={() => setActiveStrategy("ai-prophet")}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#00DC82] to-[#36e4da] flex items-center justify-center">
                      <Brain className="h-5 w-5 text-black" />
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-white">AI Prophet Strategy</h4>
                      <p className="text-xs text-white/70">Fully automated AI portfolio</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/70 mb-3">
                    Our flagship strategy uses advanced AI to select assets with the highest confidence, growth
                    potential, and accuracy.
                  </p>
                  <div className="flex justify-between text-xs">
                    <Badge variant="outline" className="bg-[#00DC82]/20 text-[#00DC82] border-0">
                      Recommended
                    </Badge>
                    <span className="text-white/50">Avg. Return: 12.4%</span>
                  </div>
                </Card>

                {/* Human Strategy */}
                <Card
                  className={`bg-black/40 border-white/10 p-4 cursor-pointer transition-all duration-200 hover:bg-black/60 ${activeStrategy === "human" ? "ring-2 ring-[#00DC82]" : ""}`}
                  onClick={() => setActiveStrategy("human")}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-white">Human Strategy</h4>
                      <p className="text-xs text-white/70">Traditional trading approach</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/70 mb-3">
                    Uses conventional human trading variables and techniques without AI-powered predictions.
                  </p>
                  <div className="flex justify-between text-xs">
                    <Badge variant="outline" className="bg-white/10 text-white/70 border-0">
                      Conservative
                    </Badge>
                    <span className="text-white/50">Avg. Return: 7.2%</span>
                  </div>
                </Card>

                {/* Warren Buffett Strategy */}
                <Card
                  className={`bg-black/40 border-white/10 p-4 cursor-pointer transition-all duration-200 hover:bg-black/60 ${activeStrategy === "buffett" ? "ring-2 ring-[#00DC82]" : ""}`}
                  onClick={() => setActiveStrategy("buffett")}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-400/20 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-white">Warren Buffett AI</h4>
                      <p className="text-xs text-white/70">Value investing with AI</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/70 mb-3">
                    Combines Buffett's value investing principles with AI prediction for long-term growth.
                  </p>
                  <div className="flex justify-between text-xs">
                    <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-0">
                      Long-term
                    </Badge>
                    <span className="text-white/50">Avg. Return: 9.8%</span>
                  </div>
                </Card>

                {/* Infinity AI Strategy */}
                <Card
                  className={`bg-black/40 border-white/10 p-4 cursor-pointer transition-all duration-200 hover:bg-black/60 ${activeStrategy === "infinity" ? "ring-2 ring-[#00DC82]" : ""}`}
                  onClick={() => setActiveStrategy("infinity")}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-white">Infinity AI Strategy</h4>
                      <p className="text-xs text-white/70">Maximum growth potential</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/70 mb-3">
                    Focuses on assets with exceptional growth potential and continuously monitors for optimal
                    performance.
                  </p>
                  <div className="flex justify-between text-xs">
                    <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-0">
                      Aggressive
                    </Badge>
                    <span className="text-white/50">Avg. Return: 15.7%</span>
                  </div>
                </Card>

                {/* Day Trading Strategy */}
                <Card
                  className={`bg-black/40 border-white/10 p-4 cursor-pointer transition-all duration-200 hover:bg-black/60 ${activeStrategy === "day-trading" ? "ring-2 ring-[#00DC82]" : ""}`}
                  onClick={() => setActiveStrategy("day-trading")}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-500/20 to-orange-400/20 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-white">Day Trading AI</h4>
                      <p className="text-xs text-white/70">Short-term opportunities</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/70 mb-3">
                    Identifies short-term trading opportunities with rapid entry and exit points for quick profits.
                  </p>
                  <div className="flex justify-between text-xs">
                    <Badge variant="outline" className="bg-red-500/20 text-red-400 border-0">
                      High Risk
                    </Badge>
                    <span className="text-white/50">Avg. Return: 18.3%</span>
                  </div>
                </Card>

                {/* Asset Focus Strategy */}
                <Card
                  className={`bg-black/40 border-white/10 p-4 cursor-pointer transition-all duration-200 hover:bg-black/60 ${activeStrategy === "asset-focus" ? "ring-2 ring-[#00DC82]" : ""}`}
                  onClick={() => setActiveStrategy("asset-focus")}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-400/20 flex items-center justify-center">
                      <Target className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-white">Asset Focus Strategy</h4>
                      <p className="text-xs text-white/70">Concentrated portfolio (max 3)</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/70 mb-3">
                    Concentrates investment in up to 3 high-potential assets for focused growth and simplified
                    management.
                  </p>
                  <div className="flex justify-between text-xs">
                    <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-0">
                      Focused
                    </Badge>
                    <span className="text-white/50">Avg. Return: 14.2%</span>
                  </div>
                </Card>

                {/* A-La-Carte Strategy */}
                <Card
                  className={`bg-black/40 border-white/10 p-4 cursor-pointer transition-all duration-200 hover:bg-black/60 ${activeStrategy === "a-la-carte" ? "ring-2 ring-[#00DC82]" : ""}`}
                  onClick={() => setActiveStrategy("a-la-carte")}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-500/20 to-indigo-400/20 flex items-center justify-center">
                      <PieChart className="h-5 w-5 text-pink-400" />
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-white">A-La-Carte Strategy</h4>
                      <p className="text-xs text-white/70">Custom asset selection</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/70 mb-3">
                    Choose any stocks or assets you want with complete control over your portfolio composition and risk
                    levels.
                  </p>
                  <div className="flex justify-between text-xs">
                    <Badge variant="outline" className="bg-pink-500/20 text-pink-400 border-0">
                      Customizable
                    </Badge>
                    <span className="text-white/50">Avg. Return: Varies</span>
                  </div>
                </Card>
              </div>
            </div>

            {/* A-La-Carte Custom Options */}
            {activeStrategy === "a-la-carte" && (
              <Card className="bg-black/40 border-white/10 p-4">
                <div className="space-y-4">
                  <h3 className="text-base font-medium text-white">A-La-Carte Options</h3>

                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                    <Input
                      placeholder="Search by symbol or name (e.g., AAPL, Bitcoin)"
                      className="pl-8 bg-black/40 border-white/10 text-white"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSearch()
                        }
                      }}
                    />
                    <Button
                      className="absolute right-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:opacity-90"
                      onClick={handleSearch}
                      disabled={isSearching || !searchQuery}
                    >
                      {isSearching ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          <span>Searching...</span>
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          <span>Search</span>
                        </>
                      )}
                    </Button>
                  </div>

                  {selectedAsset && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <Card className="bg-black/30 border-white/10 p-4">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center border border-white/20">
                            <span className="text-sm font-bold text-white">{selectedAsset.symbol}</span>
                          </div>
                          <div>
                            <h3 className="text-base font-medium text-white">{selectedAsset.name}</h3>
                            <p className="text-xs text-white/60">${selectedAsset.currentPrice.toFixed(2)}</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-white/70">Risk Level</p>
                            <Select defaultValue="medium">
                              <SelectTrigger className="w-32 bg-black/40 border-white/10 text-white">
                                <SelectValue placeholder="Risk Level" />
                              </SelectTrigger>
                              <SelectContent className="bg-black/90 border-white/10">
                                <SelectItem value="low">Low Risk</SelectItem>
                                <SelectItem value="medium">Medium Risk</SelectItem>
                                <SelectItem value="high">High Risk</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex justify-between items-center">
                            <p className="text-sm text-white/70">Add AI Analysis</p>
                            <Switch defaultChecked />
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm text-white/70">Variables to Include</p>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex items-center gap-2">
                                <Switch defaultChecked id="political" />
                                <Label htmlFor="political" className="text-xs text-white">
                                  Political News
                                </Label>
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch defaultChecked id="market" />
                                <Label htmlFor="market" className="text-xs text-white">
                                  Market Sentiment
                                </Label>
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch defaultChecked id="social" />
                                <Label htmlFor="social" className="text-xs text-white">
                                  Social Sentiment
                                </Label>
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch id="weather" />
                                <Label htmlFor="weather" className="text-xs text-white">
                                  Weather Events
                                </Label>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <p className="text-sm text-white/70">Shares to Purchase</p>
                            <Input
                              type="number"
                              className="w-32 bg-black/40 border-white/10 text-white"
                              placeholder="0"
                              min="0"
                            />
                          </div>

                          <div className="flex gap-2 mt-4">
                            <Button
                              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:opacity-90"
                              onClick={() => setShowAnalyzeDialog(true)}
                            >
                              <BarChart3 className="h-4 w-4 mr-2" />
                              Analyze
                            </Button>
                            <Button
                              className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:opacity-90"
                              onClick={() => setShowVariablesDialog(true)}
                            >
                              <Sliders className="h-4 w-4 mr-2" />
                              Variables
                            </Button>
                            <Button
                              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white hover:opacity-90"
                              onClick={() => setShowPredictionsDialog(true)}
                            >
                              <Zap className="h-4 w-4 mr-2" />
                              Predict
                            </Button>
                          </div>
                        </div>
                      </Card>

                      <Card className="bg-black/30 border-white/10 p-4">
                        <h3 className="text-base font-medium text-white mb-4">Prediction Growth</h3>
                        <div className="h-40 relative mb-4">
                          <svg width="100%" height="100%" viewBox="0 0 300 150" preserveAspectRatio="none">
                            {/* Background grid lines */}
                            {[0, 1, 2, 3].map((i) => (
                              <line
                                key={`grid-${i}`}
                                x1="0"
                                y1={50 * i}
                                x2="300"
                                y2={50 * i}
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth="1"
                              />
                            ))}

                            {/* Current portfolio line - GREEN */}
                            <path
                              d="M0,120 C50,110 100,100 150,90 C200,80 250,70 300,60"
                              fill="none"
                              stroke="#00DC82"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />

                            {/* Potential growth with new asset - BLUE */}
                            <path
                              d="M0,120 C50,105 100,90 150,75 C200,60 250,45 300,30"
                              fill="none"
                              stroke="#36e4da"
                              strokeWidth="2"
                              strokeDasharray="5,5"
                              strokeLinecap="round"
                            />
                          </svg>

                          <div className="absolute top-2 right-2 flex flex-col items-end">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-3 h-0.5 bg-[#00DC82]"></div>
                              <span className="text-xs text-white/70">Current Portfolio</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-0.5 bg-[#36e4da] border-dashed"></div>
                              <span className="text-xs text-white/70">ML Predicted Growth</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-white/70">Current Portfolio Growth</p>
                            <p className="text-sm font-medium text-green-400">+8.5%</p>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-white/70">Potential Growth with Asset</p>
                            <p className="text-sm font-medium text-[#36e4da]">+12.3%</p>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-white/70">Growth Improvement</p>
                            <p className="text-sm font-medium text-[#36e4da]">+3.8%</p>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-white/70">AI Confidence</p>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-[#00DC82] to-[#36e4da]"
                                  style={{ width: `${selectedAsset.confidence}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-white">{selectedAsset.confidence}%</span>
                            </div>
                          </div>
                        </div>

                        <Button className="w-full mt-4 bg-gradient-to-r from-[#00DC82] to-[#36e4da] text-black hover:opacity-90">
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add to Portfolio
                        </Button>
                      </Card>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Generate Portfolio Button */}
            <div className="flex justify-center mt-6">
              <Button
                className="bg-gradient-to-r from-[#00DC82] to-[#36e4da] text-black hover:opacity-90 px-8 py-6 text-base"
                disabled={!activeStrategy || isGeneratingPortfolio || !isAiManaged}
                onClick={generateAiPortfolio}
              >
                {isGeneratingPortfolio ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Generating AI Portfolio...
                  </>
                ) : (
                  <>
                    <Brain className="h-5 w-5 mr-2" />
                    Generate AI Portfolio
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Assets */}
      {portfolioAssets.length > 0 && (
        <Card className="bg-black/60 border-white/10">
          <CardHeader className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-white">Portfolio Assets</CardTitle>
                <CardDescription className="text-white/70">Your investment assets and performance</CardDescription>
              </div>
              <Badge variant="outline" className="bg-[#00DC82]/20 text-[#00DC82] border-0 px-3 py-1">
                <Brain className="h-3 w-3 mr-1" />
                AI Prediction Accuracy: {averagePredictionAccuracy.toFixed(1)}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black/40 border-y border-white/10">
                  <tr>
                    <th className="text-left p-4 text-xs font-medium text-white/70">Asset</th>
                    <th className="text-center p-4 text-xs font-medium text-white/70">Strategy</th>
                    <th className="text-right p-4 text-xs font-medium text-white/70">Shares</th>
                    <th className="text-right p-4 text-xs font-medium text-white/70">Purchase Price</th>
                    <th className="text-right p-4 text-xs font-medium text-white/70">Current Price</th>
                    <th className="text-right p-4 text-xs font-medium text-white/70">Value</th>
                    <th className="text-right p-4 text-xs font-medium text-white/70">Performance</th>
                    <th className="text-right p-4 text-xs font-medium text-white/70">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {portfolioAssets.map((asset) => (
                    <tr
                      key={asset.id}
                      className="hover:bg-white/5 cursor-pointer"
                      onClick={() => setSelectedAsset(asset)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center border border-white/20">
                            <span className="text-xs font-bold text-white">{asset.symbol}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{asset.name}</p>
                            <p className="text-xs text-white/60">{asset.purchaseDate.toLocaleDateString()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <Badge
                          variant="outline"
                          className={`
                            ${
                              asset.strategy === "index"
                                ? "bg-blue-500/20 text-blue-400"
                                : asset.strategy === "human"
                                  ? "bg-purple-500/20 text-purple-400"
                                  : asset.strategy === "buffett"
                                    ? "bg-amber-500/20 text-amber-400"
                                    : "bg-cyan-500/20 text-cyan-400"
                            } 
                            border-0
                          `}
                        >
                          {asset.strategy === "index"
                            ? "Index"
                            : asset.strategy === "human"
                              ? "Human"
                              : asset.strategy === "buffett"
                                ? "Buffett AI"
                                : "Infinity AI"}
                        </Badge>
                      </td>
                      <td className="p-4 text-right text-sm text-white">{asset.shares}</td>
                      <td className="p-4 text-right text-sm text-white">
                        $
                        {asset.purchasePrice.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="p-4 text-right text-sm text-white">
                        $
                        {asset.currentPrice.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="p-4 text-right text-sm text-white">
                        $
                        {(asset.currentPrice * asset.shares).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <ArrowUpRight className="h-3 w-3 text-green-400" />
                          <span className="text-sm text-green-400">+{asset.performance.toFixed(2)}%</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 rounded-full hover:bg-white/10"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedAsset(asset)
                              setShowAnalyzeDialog(true)
                            }}
                          >
                            <BarChart3 className="h-3 w-3 text-blue-400" />
                            <span className="sr-only">Analyze</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 rounded-full hover:bg-white/10"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedAsset(asset)
                              setShowVariablesDialog(true)
                            }}
                          >
                            <Sliders className="h-3 w-3 text-amber-400" />
                            <span className="sr-only">Variables</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 rounded-full hover:bg-white/10"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedAsset(asset)
                              setShowPredictionsDialog(true)
                            }}
                          >
                            <Zap className="h-3 w-3 text-red-400" />
                            <span className="sr-only">Predict</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 rounded-full hover:bg-white/10"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveAsset(asset.id)
                            }}
                          >
                            <Trash2 className="h-3 w-3 text-red-400" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Portfolio Summary */}
            <div className="p-4 border-t border-white/10 bg-black/40">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-white/70">Current Performance</p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center ${portfolioGrowth.percent >= 0 ? "bg-green-500/20" : "bg-red-500/20"}`}
                    >
                      {portfolioGrowth.percent >= 0 ? (
                        <ArrowUpRight className="h-4 w-4 text-green-400" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                    <div>
                      <p
                        className={`text-base font-bold ${portfolioGrowth.percent >= 0 ? "text-green-400" : "text-red-400"}`}
                      >
                        {portfolioGrowth.percent >= 0 ? "+" : ""}
                        {portfolioGrowth.percent.toFixed(2)}%
                      </p>
                      <p className="text-xs text-white/60">
                        $
                        {Math.abs(portfolioGrowth.value).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-white/70">Predicted Growth</p>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-[#36e4da]/20 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-[#36e4da]" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-[#36e4da]">+{predictedGrowth.percent.toFixed(2)}%</p>
                      <p className="text-xs text-white/60">
                        +$
                        {predictedGrowth.value.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-white/70">Portfolio Chart</p>
                  <div className="h-8 relative w-full">
                    <div className="absolute inset-0">
                      <svg width="100%" height="100%" viewBox="0 0 300 30" preserveAspectRatio="none">
                        {/* Portfolio value line (past) - GREEN */}
                        <path
                          d="M0,20 C10,18 20,15 30,16 C40,17 50,14 60,13 C70,12 80,11 90,10 C100,9 110,10 120,8"
                          fill="none"
                          stroke="#00DC82"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />

                        {/* Portfolio prediction line (future) - BLUE */}
                        <path
                          d="M120,8 C130,7 140,6 150,5 C160,4 170,3 180,2"
                          fill="none"
                          stroke="#36e4da"
                          strokeWidth="2"
                          strokeDasharray="3,3"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analyze Dialog */}
      <Dialog open={showAnalyzeDialog} onOpenChange={setShowAnalyzeDialog}>
        <DialogContent className="bg-black/90 border-white/10 max-w-4xl">
          {selectedAsset && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <DialogTitle className="text-white text-xl">Asset Analysis: {selectedAsset.symbol}</DialogTitle>
                    <DialogDescription className="text-white/70">
                      Comprehensive analysis and AI-powered insights
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <Card className="bg-black/40 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">AI Analysis Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/90 leading-relaxed">
                      {selectedAsset.symbol} shows strong bullish signals based on technical indicators and fundamental
                      analysis. The company's recent product launches and services growth are expected to drive revenue
                      expansion. AI analysis indicates a high probability of continued upward momentum in the short to
                      medium term, with potential resistance at ${(selectedAsset.currentPrice * 1.1).toFixed(2)}. Recent
                      institutional buying and positive analyst revisions further support this outlook.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Risk Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className="bg-green-500/20 text-green-400 border-0 px-3 py-1">
                        LOW RISK
                      </Badge>
                    </div>
                    <p className="text-white/90 leading-relaxed">
                      {selectedAsset.name} maintains a strong balance sheet with substantial cash reserves and
                      consistent cash flow. Market volatility risk is mitigated by product diversification and services
                      growth. Primary risks include supply chain disruptions and regulatory challenges in key markets.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-black/40 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Technical Indicators</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">RSI (14)</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white/90">62.5</span>
                          <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-0">
                            NEUTRAL
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">MACD</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white/90">Bullish</span>
                          <Badge variant="outline" className="bg-green-500/20 text-green-400 border-0">
                            BUY
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">Moving Average (50)</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white/90">
                            ${(selectedAsset.currentPrice * 0.95).toFixed(2)}
                          </span>
                          <Badge variant="outline" className="bg-green-500/20 text-green-400 border-0">
                            BUY
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">Moving Average (200)</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white/90">
                            ${(selectedAsset.currentPrice * 0.9).toFixed(2)}
                          </span>
                          <Badge variant="outline" className="bg-green-500/20 text-green-400 border-0">
                            BUY
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Fundamental Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">Market Cap</span>
                        <span className="text-sm text-white/90">$2.94T</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">P/E Ratio</span>
                        <span className="text-sm text-white/90">31.2</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">EPS (TTM)</span>
                        <span className="text-sm text-white/90">$6.01</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">Dividend Yield</span>
                        <span className="text-sm text-white/90">0.51%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">AI Predictions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">Short Term (7d)</span>
                        <div className="flex items-center gap-1">
                          <ArrowUpRight className="h-3 w-3 text-green-400" />
                          <span className="text-sm text-green-400">+5.2%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">Medium Term (30d)</span>
                        <div className="flex items-center gap-1">
                          <ArrowUpRight className="h-3 w-3 text-green-400" />
                          <span className="text-sm text-green-400">+{selectedAsset.predictedGrowth.toFixed(2)}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">Long Term (90d)</span>
                        <div className="flex items-center gap-1">
                          <ArrowUpRight className="h-3 w-3 text-green-400" />
                          <span className="text-sm text-green-400">
                            +{(selectedAsset.predictedGrowth * 1.5).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">Confidence</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#00DC82] to-[#36e4da]"
                              style={{ width: `${selectedAsset.confidence}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-white">{selectedAsset.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Variables Dialog */}
      <Dialog open={showVariablesDialog} onOpenChange={setShowVariablesDialog}>
        <DialogContent className="bg-black/90 border-white/10 max-w-4xl">
          {selectedAsset && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center">
                    <Sliders className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <DialogTitle className="text-white text-xl">Variables: {selectedAsset.symbol}</DialogTitle>
                    <DialogDescription className="text-white/70">
                      Customize variables that influence AI predictions
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {variables.map((variable) => (
                    <Card key={variable.id} className="bg-black/40 border-white/10 p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#00DC82]/20 to-[#36e4da]/20 flex items-center justify-center">
                            {variable.icon === "PoliticalCapital" && <AlertTriangle className="h-5 w-5 text-white" />}
                            {variable.icon === "CloudRain" && <CloudRain className="h-5 w-5 text-white" />}
                            {variable.icon === "TrendingUp" && <TrendingUp className="h-5 w-5 text-white" />}
                            {variable.icon === "Users" && <Users className="h-5 w-5 text-white" />}
                            {variable.icon === "AlertTriangle" && <AlertTriangle className="h-5 w-5 text-white" />}
                            {variable.icon === "Newspaper" && <Newspaper className="h-5 w-5 text-white" />}
                          </div>
                          <div>
                            <h3 className="text-base font-medium text-white">{variable.name}</h3>
                            <p className="text-xs text-white/60">{variable.category}</p>
                          </div>
                        </div>
                        <Switch checked={variable.enabled} onCheckedChange={() => handleToggleVariable(variable.id)} />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-white">Influence Weight</p>
                          <p className="text-sm font-medium text-white">{variable.weight}%</p>
                        </div>
                        <Slider
                          disabled={!variable.enabled}
                          value={[variable.weight]}
                          min={0}
                          max={100}
                          step={5}
                          onValueChange={(value) => handleWeightChange(variable.id, value)}
                          className={!variable.enabled ? "opacity-50" : ""}
                        />
                      </div>
                    </Card>
                  ))}

                  <Card className="bg-black/20 border-white/5 border-dashed p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-black/30 transition-colors duration-200">
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                      <Plus className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-sm text-white">Add New Variable</p>
                  </Card>
                </div>

                <Card className="bg-black/40 border-white/10 p-4">
                  <h3 className="text-base font-medium text-white mb-4">Variable Impact Analysis</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-white">Overall Market Influence</p>
                      <p className="text-sm font-medium text-white">High</p>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#00DC82] to-[#36e4da]"
                        style={{ width: "78%" }}
                      ></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-sm text-white/70">Top Variable</p>
                        <p className="text-base font-bold text-white">Market Sentiment</p>
                        <p className="text-xs text-[#00DC82]">90% Influence</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-sm text-white/70">Most Volatile</p>
                        <p className="text-base font-bold text-white">Political News</p>
                        <p className="text-xs text-amber-400">High Volatility</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-sm text-white/70">Recommended Focus</p>
                        <p className="text-base font-bold text-white">Critical News</p>
                        <p className="text-xs text-blue-400">85% Influence</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Predictions Dialog */}
      <Dialog open={showPredictionsDialog} onOpenChange={setShowPredictionsDialog}>
        <DialogContent className="bg-black/90 border-white/10 max-w-4xl">
          {selectedAsset && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <DialogTitle className="text-white text-xl">
                      Instant Predictions: {selectedAsset.symbol}
                    </DialogTitle>
                    <DialogDescription className="text-white/70">
                      AI-powered price predictions across multiple timeframes
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="flex justify-center mb-4">
                <div className="bg-black/40 border border-white/10 rounded-full p-1 flex">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-full px-3 py-1 text-xs ${selectedTimeframe === "15m" ? "bg-white/20 text-white" : "text-white/70"}`}
                    onClick={() => setSelectedTimeframe("15m")}
                  >
                    15m
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-full px-3 py-1 text-xs ${selectedTimeframe === "1h" ? "bg-white/20 text-white" : "text-white/70"}`}
                    onClick={() => setSelectedTimeframe("1h")}
                  >
                    1h
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-full px-3 py-1 text-xs ${selectedTimeframe === "6h" ? "bg-white/20 text-white" : "text-white/70"}`}
                    onClick={() => setSelectedTimeframe("6h")}
                  >
                    6h
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-full px-3 py-1 text-xs ${selectedTimeframe === "1d" ? "bg-white/20 text-white" : "text-white/70"}`}
                    onClick={() => setSelectedTimeframe("1d")}
                  >
                    1d
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-full px-3 py-1 text-xs ${selectedTimeframe === "7d" ? "bg-white/20 text-white" : "text-white/70"}`}
                    onClick={() => setSelectedTimeframe("7d")}
                  >
                    7d
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-full px-3 py-1 text-xs ${selectedTimeframe === "30d" ? "bg-white/20 text-white" : "text-white/70"}`}
                    onClick={() => setSelectedTimeframe("30d")}
                  >
                    30d
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-black/40 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Price Prediction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-40 relative mb-4">
                      <svg width="100%" height="100%" viewBox="0 0 300 150" preserveAspectRatio="none">
                        {/* Background grid lines */}
                        {[0, 1, 2, 3].map((i) => (
                          <line
                            key={`grid-${i}`}
                            x1="0"
                            y1={50 * i}
                            x2="300"
                            y2={50 * i}
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="1"
                          />
                        ))}

                        {/* Current price line - GREEN */}
                        <path
                          d="M0,100 C25,95 50,90 75,85 C100,80 125,75 150,70"
                          fill="none"
                          stroke="#00DC82"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />

                        {/* Prediction line - BLUE */}
                        <path
                          d="M150,70 C175,65 200,55 225,45 C250,35 275,25 300,15"
                          fill="none"
                          stroke="#36e4da"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                          strokeLinecap="round"
                        />

                        {/* Divider line between current and prediction */}
                        <line
                          x1="150"
                          y1="0"
                          x2="150"
                          y2="150"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="1"
                          strokeDasharray="5,5"
                        />

                        {/* Current position marker */}
                        <circle cx="150" cy="70" r="4" fill="#00DC82" />
                      </svg>

                      <div className="absolute top-2 right-2 flex flex-col items-end">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-3 h-0.5 bg-[#00DC82]"></div>
                          <span className="text-xs text-white/70">Current Price</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-0.5 bg-[#36e4da] border-dashed"></div>
                          <span className="text-xs text-white/70">ML Prediction</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-white/70">Current Price</p>
                        <p className="text-lg font-bold text-white">
                          $
                          {selectedAsset.currentPrice.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-white/70">Predicted Price ({selectedTimeframe})</p>
                        <p className="text-lg font-bold text-[#36e4da]">
                          $
                          {selectedAsset.predictedPrice.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-white/70">Predicted Change</p>
                        <div className="flex items-center gap-1">
                          <ArrowUpRight className="h-3 w-3 text-[#36e4da]" />
                          <p className="text-sm font-medium text-[#36e4da]">
                            +{selectedAsset.predictedGrowth.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-white/70">Confidence</p>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#00DC82] to-[#36e4da]"
                              style={{ width: `${selectedAsset.confidence}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-white">{selectedAsset.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Prediction Factors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500/20 to-green-400/20 flex items-center justify-center">
                          <TrendingUp className="h-4 w-4 text-green-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium text-white">Market Sentiment</p>
                            <Badge variant="outline" className="bg-green-500/20 text-green-400 border-0">
                              Positive
                            </Badge>
                          </div>
                          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-1">
                            <div
                              className="h-full bg-gradient-to-r from-[#00DC82] to-[#36e4da]"
                              style={{ width: "85%" }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-400/20 flex items-center justify-center">
                          <Newspaper className="h-4 w-4 text-amber-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium text-white">News Sentiment</p>
                            <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-0">
                              Neutral
                            </Badge>
                          </div>
                          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-1">
                            <div
                              className="h-full bg-gradient-to-r from-[#00DC82] to-[#36e4da]"
                              style={{ width: "60%" }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-400/20 flex items-center justify-center">
                          <Users className="h-4 w-4 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium text-white">Social Sentiment</p>
                            <Badge variant="outline" className="bg-green-500/20 text-green-400 border-0">
                              Positive
                            </Badge>
                          </div>
                          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-1">
                            <div
                              className="h-full bg-gradient-to-r from-[#00DC82] to-[#36e4da]"
                              style={{ width: "75%" }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-400/20 flex items-center justify-center">
                          <AlertTriangle className="h-4 w-4 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium text-white">Technical Indicators</p>
                            <Badge variant="outline" className="bg-green-500/20 text-green-400 border-0">
                              Bullish
                            </Badge>
                          </div>
                          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-1">
                            <div
                              className="h-full bg-gradient-to-r from-[#00DC82] to-[#36e4da]"
                              style={{ width: "80%" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="h-4 w-4 text-[#36e4da]" />
                        <p className="text-sm font-medium text-white">Key Insight</p>
                      </div>
                      <p className="text-xs text-white/90">
                        Strong technical indicators and positive market sentiment suggest continued upward momentum for{" "}
                        {selectedAsset.symbol} in the {selectedTimeframe} timeframe. Recent institutional buying
                        activity further supports this outlook.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <p className="text-xs text-white/70 mt-2">
                All predictions are generated by our advanced machine learning models analyzing historical data, market
                trends, and relevant variables.
              </p>

              <div className="flex justify-center mt-4">
                <Button className="bg-gradient-to-r from-[#00DC82] to-[#36e4da] text-black hover:opacity-90">
                  <Brain className="h-4 w-4 mr-2" />
                  Generate Detailed Report
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Types
interface PortfolioAsset {
  id: string
  symbol: string
  name: string
  purchasePrice: number
  currentPrice: number
  shares: number
  strategy: "index" | "human" | "buffett" | "infinity" | "a-la-carte"
  purchaseDate: Date
  performance: number
  predictedPrice: number
  predictedGrowth: number
  confidence: number
  history?: DailyPerformance[]
}

interface DailyPerformance {
  date: string
  price: number
  change: number
  prediction: number
  accuracy: number
}

