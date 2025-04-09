"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Search,
  ChevronRight,
  BarChart3,
  LineChart,
  DollarSign,
  Bitcoin,
  Briefcase,
  Globe,
  Landmark,
  Gem,
  Coins,
  CreditCard,
} from "lucide-react"

// Types
interface Category {
  id: string
  name: string
  icon: React.ElementType
  description: string
  trend: "up" | "down" | "neutral"
  change: number
  confidence: number
  color: string
}

interface Asset {
  id: string
  symbol: string
  name: string
  category: string
  currentPrice: number
  predictedPrice: number
  change: number
  confidence: number
  trend: "up" | "down" | "neutral"
}

export function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Mock categories data
  const categories: Category[] = [
    {
      id: "stocks",
      name: "Stocks",
      icon: BarChart3,
      description: "Equity securities representing ownership in corporations",
      trend: "up",
      change: 2.4,
      confidence: 78,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "bonds",
      name: "Bonds",
      icon: Landmark,
      description: "Fixed-income debt securities issued by governments and corporations",
      trend: "neutral",
      change: 0.3,
      confidence: 65,
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "crypto",
      name: "Cryptocurrency",
      icon: Bitcoin,
      description: "Digital or virtual currencies using cryptography for security",
      trend: "up",
      change: 5.7,
      confidence: 82,
      color: "from-orange-500 to-orange-600",
    },
    {
      id: "commodities",
      name: "Commodities",
      icon: Gem,
      description: "Raw materials or primary agricultural products",
      trend: "up",
      change: 1.8,
      confidence: 74,
      color: "from-amber-500 to-amber-600",
    },
    {
      id: "forex",
      name: "Forex",
      icon: Globe,
      description: "Foreign exchange market for trading currencies",
      trend: "down",
      change: -0.9,
      confidence: 68,
      color: "from-green-500 to-green-600",
    },
    {
      id: "indices",
      name: "Indices",
      icon: LineChart,
      description: "Statistical measures of changes in a representative group of stocks",
      trend: "up",
      change: 1.5,
      confidence: 76,
      color: "from-red-500 to-red-600",
    },
    {
      id: "etfs",
      name: "ETFs",
      icon: Briefcase,
      description: "Exchange-traded funds that track indices, commodities, or baskets of assets",
      trend: "up",
      change: 1.2,
      confidence: 72,
      color: "from-cyan-500 to-cyan-600",
    },
    {
      id: "precious-metals",
      name: "Precious Metals",
      icon: Coins,
      description: "Rare, naturally occurring metallic elements with high economic value",
      trend: "up",
      change: 2.1,
      confidence: 77,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      id: "real-estate",
      name: "Real Estate",
      icon: Landmark,
      description: "Property consisting of land and buildings for residential or commercial use",
      trend: "neutral",
      change: 0.5,
      confidence: 64,
      color: "from-indigo-500 to-indigo-600",
    },
    {
      id: "futures",
      name: "Futures",
      icon: CreditCard,
      description:
        "Financial contracts obligating the buyer to purchase an asset at a predetermined future date and price",
      trend: "down",
      change: -1.2,
      confidence: 66,
      color: "from-pink-500 to-pink-600",
    },
  ]

  // Mock assets data
  const assets: Asset[] = [
    // Stocks
    {
      id: "aapl",
      symbol: "AAPL",
      name: "Apple Inc.",
      category: "stocks",
      currentPrice: 187.32,
      predictedPrice: 205.45,
      change: 9.68,
      confidence: 84,
      trend: "up",
    },
    {
      id: "msft",
      symbol: "MSFT",
      name: "Microsoft Corp.",
      category: "stocks",
      currentPrice: 378.92,
      predictedPrice: 412.5,
      change: 8.86,
      confidence: 82,
      trend: "up",
    },
    {
      id: "nvda",
      symbol: "NVDA",
      name: "NVIDIA Corp.",
      category: "stocks",
      currentPrice: 824.15,
      predictedPrice: 920.75,
      change: 11.72,
      confidence: 86,
      trend: "up",
    },
    {
      id: "amzn",
      symbol: "AMZN",
      name: "Amazon.com Inc.",
      category: "stocks",
      currentPrice: 178.75,
      predictedPrice: 195.3,
      change: 9.26,
      confidence: 81,
      trend: "up",
    },
    {
      id: "googl",
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      category: "stocks",
      currentPrice: 142.65,
      predictedPrice: 155.8,
      change: 9.22,
      confidence: 80,
      trend: "up",
    },
    {
      id: "meta",
      symbol: "META",
      name: "Meta Platforms Inc.",
      category: "stocks",
      currentPrice: 475.2,
      predictedPrice: 515.4,
      change: 8.46,
      confidence: 79,
      trend: "up",
    },
    {
      id: "tsla",
      symbol: "TSLA",
      name: "Tesla Inc.",
      category: "stocks",
      currentPrice: 175.45,
      predictedPrice: 195.25,
      change: 11.28,
      confidence: 75,
      trend: "up",
    },
    {
      id: "amd",
      symbol: "AMD",
      name: "Advanced Micro Devices Inc.",
      category: "stocks",
      currentPrice: 156.78,
      predictedPrice: 175.9,
      change: 12.2,
      confidence: 83,
      trend: "up",
    },
    {
      id: "intc",
      symbol: "INTC",
      name: "Intel Corp.",
      category: "stocks",
      currentPrice: 32.45,
      predictedPrice: 36.8,
      change: 13.41,
      confidence: 72,
      trend: "up",
    },
    {
      id: "dis",
      symbol: "DIS",
      name: "The Walt Disney Company",
      category: "stocks",
      currentPrice: 98.75,
      predictedPrice: 110.25,
      change: 11.65,
      confidence: 76,
      trend: "up",
    },

    // Crypto
    {
      id: "btc",
      symbol: "BTC",
      name: "Bitcoin",
      category: "crypto",
      currentPrice: 43250.75,
      predictedPrice: 48750.5,
      change: 12.72,
      confidence: 85,
      trend: "up",
    },
    {
      id: "eth",
      symbol: "ETH",
      name: "Ethereum",
      category: "crypto",
      currentPrice: 2350.25,
      predictedPrice: 2650.75,
      change: 12.79,
      confidence: 83,
      trend: "up",
    },
    {
      id: "sol",
      symbol: "SOL",
      name: "Solana",
      category: "crypto",
      currentPrice: 145.8,
      predictedPrice: 175.4,
      change: 20.3,
      confidence: 78,
      trend: "up",
    },
    {
      id: "bnb",
      symbol: "BNB",
      name: "Binance Coin",
      category: "crypto",
      currentPrice: 575.25,
      predictedPrice: 625.5,
      change: 8.74,
      confidence: 76,
      trend: "up",
    },
    {
      id: "xrp",
      symbol: "XRP",
      name: "Ripple",
      category: "crypto",
      currentPrice: 0.5475,
      predictedPrice: 0.625,
      change: 14.16,
      confidence: 72,
      trend: "up",
    },
    {
      id: "ada",
      symbol: "ADA",
      name: "Cardano",
      category: "crypto",
      currentPrice: 0.425,
      predictedPrice: 0.495,
      change: 16.47,
      confidence: 74,
      trend: "up",
    },
    {
      id: "avax",
      symbol: "AVAX",
      name: "Avalanche",
      category: "crypto",
      currentPrice: 32.75,
      predictedPrice: 38.5,
      change: 17.56,
      confidence: 77,
      trend: "up",
    },
    {
      id: "dot",
      symbol: "DOT",
      name: "Polkadot",
      category: "crypto",
      currentPrice: 6.85,
      predictedPrice: 7.95,
      change: 16.06,
      confidence: 75,
      trend: "up",
    },
    {
      id: "link",
      symbol: "LINK",
      name: "Chainlink",
      category: "crypto",
      currentPrice: 14.25,
      predictedPrice: 16.75,
      change: 17.54,
      confidence: 79,
      trend: "up",
    },
    {
      id: "matic",
      symbol: "MATIC",
      name: "Polygon",
      category: "crypto",
      currentPrice: 0.685,
      predictedPrice: 0.795,
      change: 16.06,
      confidence: 76,
      trend: "up",
    },

    // Commodities
    {
      id: "gold",
      symbol: "XAU",
      name: "Gold",
      category: "commodities",
      currentPrice: 2325.5,
      predictedPrice: 2450.75,
      change: 5.39,
      confidence: 82,
      trend: "up",
    },
    {
      id: "silver",
      symbol: "XAG",
      name: "Silver",
      category: "commodities",
      currentPrice: 27.85,
      predictedPrice: 30.25,
      change: 8.62,
      confidence: 78,
      trend: "up",
    },
    {
      id: "oil",
      symbol: "CL",
      name: "Crude Oil",
      category: "commodities",
      currentPrice: 78.45,
      predictedPrice: 85.25,
      change: 8.67,
      confidence: 75,
      trend: "up",
    },
    {
      id: "natgas",
      symbol: "NG",
      name: "Natural Gas",
      category: "commodities",
      currentPrice: 2.35,
      predictedPrice: 2.65,
      change: 12.77,
      confidence: 72,
      trend: "up",
    },
    {
      id: "copper",
      symbol: "HG",
      name: "Copper",
      category: "commodities",
      currentPrice: 4.25,
      predictedPrice: 4.55,
      change: 7.06,
      confidence: 76,
      trend: "up",
    },
    {
      id: "platinum",
      symbol: "PL",
      name: "Platinum",
      category: "commodities",
      currentPrice: 975.25,
      predictedPrice: 1050.5,
      change: 7.72,
      confidence: 74,
      trend: "up",
    },
    {
      id: "palladium",
      symbol: "PA",
      name: "Palladium",
      category: "commodities",
      currentPrice: 950.75,
      predictedPrice: 1025.25,
      change: 7.84,
      confidence: 73,
      trend: "up",
    },
    {
      id: "wheat",
      symbol: "ZW",
      name: "Wheat",
      category: "commodities",
      currentPrice: 625.5,
      predictedPrice: 675.25,
      change: 7.95,
      confidence: 71,
      trend: "up",
    },
    {
      id: "corn",
      symbol: "ZC",
      name: "Corn",
      category: "commodities",
      currentPrice: 450.25,
      predictedPrice: 485.75,
      change: 7.88,
      confidence: 70,
      trend: "up",
    },
    {
      id: "cotton",
      symbol: "CT",
      name: "Cotton",
      category: "commodities",
      currentPrice: 82.45,
      predictedPrice: 88.75,
      change: 7.64,
      confidence: 69,
      trend: "up",
    },

    // Forex
    {
      id: "eurusd",
      symbol: "EUR/USD",
      name: "Euro/US Dollar",
      category: "forex",
      currentPrice: 1.0825,
      predictedPrice: 1.095,
      change: 1.15,
      confidence: 72,
      trend: "up",
    },
    {
      id: "gbpusd",
      symbol: "GBP/USD",
      name: "British Pound/US Dollar",
      category: "forex",
      currentPrice: 1.265,
      predictedPrice: 1.285,
      change: 1.58,
      confidence: 71,
      trend: "up",
    },
    {
      id: "usdjpy",
      symbol: "USD/JPY",
      name: "US Dollar/Japanese Yen",
      category: "forex",
      currentPrice: 151.75,
      predictedPrice: 148.5,
      change: -2.14,
      confidence: 74,
      trend: "down",
    },
    {
      id: "audusd",
      symbol: "AUD/USD",
      name: "Australian Dollar/US Dollar",
      category: "forex",
      currentPrice: 0.6575,
      predictedPrice: 0.6675,
      change: 1.52,
      confidence: 68,
      trend: "up",
    },
    {
      id: "usdcad",
      symbol: "USD/CAD",
      name: "US Dollar/Canadian Dollar",
      category: "forex",
      currentPrice: 1.365,
      predictedPrice: 1.345,
      change: -1.47,
      confidence: 69,
      trend: "down",
    },
    {
      id: "usdchf",
      symbol: "USD/CHF",
      name: "US Dollar/Swiss Franc",
      category: "forex",
      currentPrice: 0.905,
      predictedPrice: 0.895,
      change: -1.1,
      confidence: 67,
      trend: "down",
    },
    {
      id: "nzdusd",
      symbol: "NZD/USD",
      name: "New Zealand Dollar/US Dollar",
      category: "forex",
      currentPrice: 0.6025,
      predictedPrice: 0.6125,
      change: 1.66,
      confidence: 66,
      trend: "up",
    },
    {
      id: "eurjpy",
      symbol: "EUR/JPY",
      name: "Euro/Japanese Yen",
      category: "forex",
      currentPrice: 164.25,
      predictedPrice: 161.5,
      change: -1.67,
      confidence: 70,
      trend: "down",
    },
    {
      id: "gbpjpy",
      symbol: "GBP/JPY",
      name: "British Pound/Japanese Yen",
      category: "forex",
      currentPrice: 191.75,
      predictedPrice: 188.5,
      change: -1.69,
      confidence: 71,
      trend: "down",
    },
    {
      id: "eurgbp",
      symbol: "EUR/GBP",
      name: "Euro/British Pound",
      category: "forex",
      currentPrice: 0.855,
      predictedPrice: 0.85,
      change: -0.58,
      confidence: 65,
      trend: "down",
    },
  ]

  // Filter assets by selected category
  const filteredAssets = selectedCategory ? assets.filter((asset) => asset.category === selectedCategory) : []

  // Sort assets by predicted change (highest first)
  const sortedAssets = [...filteredAssets].sort((a, b) => b.change - a.change).slice(0, 10)

  // Calculate category summary data
  const getCategorySummary = (categoryId: string) => {
    const categoryAssets = assets.filter((asset) => asset.category === categoryId)
    const totalAssets = categoryAssets.length
    const upTrend = categoryAssets.filter((asset) => asset.trend === "up").length
    const downTrend = categoryAssets.filter((asset) => asset.trend === "down").length
    const neutralTrend = categoryAssets.filter((asset) => asset.trend === "neutral").length
    const avgConfidence = categoryAssets.reduce((sum, asset) => sum + asset.confidence, 0) / totalAssets
    const avgChange = categoryAssets.reduce((sum, asset) => sum + asset.change, 0) / totalAssets

    return {
      totalAssets,
      upTrend,
      downTrend,
      neutralTrend,
      avgConfidence,
      avgChange,
    }
  }

  // Render trend indicator
  const renderTrendIndicator = (trend: "up" | "down" | "neutral", change: number) => {
    if (trend === "up") {
      return (
        <div className="flex items-center gap-1 text-green-400">
          <ArrowUpRight className="h-4 w-4" />
          <span>+{Math.abs(change).toFixed(2)}%</span>
        </div>
      )
    } else if (trend === "down") {
      return (
        <div className="flex items-center gap-1 text-red-400">
          <ArrowDownRight className="h-4 w-4" />
          <span>-{Math.abs(change).toFixed(2)}%</span>
        </div>
      )
    } else {
      return (
        <div className="flex items-center gap-1 text-yellow-400">
          <span className="h-4 w-4">—</span>
          <span>{Math.abs(change).toFixed(2)}%</span>
        </div>
      )
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="bg-black/60 border-white/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white">Financial Market Categories</CardTitle>
            <CardDescription className="text-white/70">
              Explore different sectors and discover top growth opportunities
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              <Input
                placeholder="Search categories..."
                className="pl-8 bg-black/40 border-white/10 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Categories Grid */}
      {!selectedCategory && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories
            .filter(
              (category) =>
                category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                category.description.toLowerCase().includes(searchQuery.toLowerCase()),
            )
            .map((category) => (
              <Card
                key={category.id}
                className="bg-black/60 border-white/10 hover:border-[#00DC82]/50 transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div
                        className={`h-12 w-12 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}
                      >
                        <category.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex items-center gap-2">
                        {renderTrendIndicator(category.trend, category.change)}
                        <ChevronRight className="h-5 w-5 text-white/50 group-hover:text-[#00DC82] group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{category.name}</h3>
                      <p className="text-sm text-white/70 mt-1">{category.description}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-white/10 text-white border-0">
                          {category.confidence}% Confidence
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#00DC82] hover:text-[#00DC82] hover:bg-[#00DC82]/10"
                      >
                        View Assets
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      {/* Category Detail View */}
      {selectedCategory && (
        <div className="space-y-4">
          {/* Category Header */}
          <Card className="bg-black/60 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-white hover:bg-white/10"
                  onClick={() => setSelectedCategory(null)}
                >
                  <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
                  Back
                </Button>
                <div>
                  {categories
                    .filter((c) => c.id === selectedCategory)
                    .map((category) => (
                      <div key={category.id} className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}
                        >
                          <category.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-white">{category.name}</CardTitle>
                          <CardDescription className="text-white/70">{category.description}</CardDescription>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                  <Input placeholder="Search assets..." className="pl-8 bg-black/40 border-white/10 text-white" />
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Category Summary */}
          {selectedCategory && (
            <Card className="bg-black/60 border-white/10">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <Card className="bg-black/40 border-white/10 p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#00DC82]/20 to-[#36e4da]/20 flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-[#00DC82]" />
                      </div>
                      <div>
                        <p className="text-sm text-white/70">Average Growth</p>
                        <div className="flex items-center gap-1">
                          <p className="text-xl font-bold text-white">
                            {getCategorySummary(selectedCategory).avgChange.toFixed(2)}%
                          </p>
                          <ArrowUpRight className="h-4 w-4 text-green-400" />
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-black/40 border-white/10 p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500/20 to-green-400/20 flex items-center justify-center">
                        <ArrowUpRight className="h-6 w-6 text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-white/70">Uptrend Assets</p>
                        <p className="text-xl font-bold text-white">{getCategorySummary(selectedCategory).upTrend}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-black/40 border-white/10 p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-500/20 to-red-400/20 flex items-center justify-center">
                        <ArrowDownRight className="h-6 w-6 text-red-400" />
                      </div>
                      <div>
                        <p className="text-sm text-white/70">Downtrend Assets</p>
                        <p className="text-xl font-bold text-white">{getCategorySummary(selectedCategory).downTrend}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-black/40 border-white/10 p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-400/20 flex items-center justify-center">
                        <span className="h-6 w-6 text-yellow-400 flex items-center justify-center">—</span>
                      </div>
                      <div>
                        <p className="text-sm text-white/70">Neutral Assets</p>
                        <p className="text-xl font-bold text-white">
                          {getCategorySummary(selectedCategory).neutralTrend}
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-black/40 border-white/10 p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-400/20 flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-white/70">Avg. Confidence</p>
                        <p className="text-xl font-bold text-white">
                          {getCategorySummary(selectedCategory).avgConfidence.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top Assets Table */}
          <Card className="bg-black/60 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Top 10 Growth Assets</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="border-white/10 text-white hover:bg-white/10 hover:text-white">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <span>Sort by Growth</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-black/40 border-y border-white/10">
                    <tr>
                      <th className="text-left p-4 text-xs font-medium text-white/70">Asset</th>
                      <th className="text-center p-4 text-xs font-medium text-white/70">Current Price</th>
                      <th className="text-center p-4 text-xs font-medium text-white/70">Predicted Price</th>
                      <th className="text-center p-4 text-xs font-medium text-white/70">Predicted Growth</th>
                      <th className="text-center p-4 text-xs font-medium text-white/70">Confidence</th>
                      <th className="text-center p-4 text-xs font-medium text-white/70">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {sortedAssets.map((asset) => (
                      <tr key={asset.id} className="hover:bg-white/5">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center border border-white/20">
                              <span className="text-xs font-bold text-white">{asset.symbol}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{asset.name}</p>
                              <p className="text-xs text-white/60">{asset.symbol}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center text-sm text-white">
                          $
                          {asset.currentPrice.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="p-4 text-center text-sm text-[#36e4da]">
                          $
                          {asset.predictedPrice.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="p-4 text-center">{renderTrendIndicator(asset.trend, asset.change)}</td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 bg-white/10 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#00DC82] to-[#36e4da]"
                                style={{ width: `${asset.confidence}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-white">{asset.confidence}%</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-white/10 text-white hover:bg-white/10 hover:text-white"
                          >
                            <LineChart className="h-3 w-3 mr-1" />
                            Analyze
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

