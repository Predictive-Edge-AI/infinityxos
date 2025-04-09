"use client"

import type React from "react"

import { useState } from "react"
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bitcoin,
  Briefcase,
  ChevronRight,
  Clock,
  Coins,
  CreditCard,
  Gem,
  Globe,
  Info,
  Landmark,
  LineChart,
  RefreshCw,
  Search,
  TrendingUp,
  AlertTriangle,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function MarketDataPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchedAsset, setSearchedAsset] = useState<AssetData | null>(null)
  const [timeframe, setTimeframe] = useState("1m") // 1h, 1d, 1m, 1y
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Categories data - same as in CategoriesPage
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

  // Mock asset data for demonstration
  const mockAssets: Record<string, AssetData> = {
    AAPL: {
      symbol: "AAPL",
      name: "Apple Inc.",
      type: "Stock",
      sector: "Technology",
      currentPrice: 187.32,
      predictedPrice: 203.45,
      change: 8.61,
      percentChange: 4.6,
      confidence: 89,
      marketCap: "3.02T",
      volume: "58.4M",
      peRatio: "31.2",
      dividend: "0.92%",
      yearHigh: 198.23,
      yearLow: 143.9,
      relatedNews: [
        {
          id: 1,
          title: "Apple announces new iPhone release date",
          source: "TechCrunch",
          time: "2h ago",
          url: "#",
          sentiment: "positive",
        },
        {
          id: 2,
          title: "Apple's services revenue hits all-time high",
          source: "CNBC",
          time: "5h ago",
          url: "#",
          sentiment: "positive",
        },
        {
          id: 3,
          title: "Analysts raise Apple price targets ahead of earnings",
          source: "Bloomberg",
          time: "1d ago",
          url: "#",
          sentiment: "positive",
        },
      ],
    },
    MSFT: {
      symbol: "MSFT",
      name: "Microsoft Corporation",
      type: "Stock",
      sector: "Technology",
      currentPrice: 378.92,
      predictedPrice: 412.67,
      change: 33.75,
      percentChange: 8.91,
      confidence: 86,
      marketCap: "2.81T",
      volume: "42.1M",
      peRatio: "35.7",
      dividend: "0.78%",
      yearHigh: 384.12,
      yearLow: 275.37,
      relatedNews: [
        {
          id: 1,
          title: "Microsoft Cloud revenue surges in latest quarter",
          source: "Reuters",
          time: "3h ago",
          url: "#",
          sentiment: "positive",
        },
        {
          id: 2,
          title: "Microsoft expands AI capabilities across product line",
          source: "The Verge",
          time: "1d ago",
          url: "#",
          sentiment: "positive",
        },
      ],
    },
    TSLA: {
      symbol: "TSLA",
      name: "Tesla, Inc.",
      type: "Stock",
      sector: "Automotive",
      currentPrice: 242.68,
      predictedPrice: 287.35,
      change: 44.67,
      percentChange: 18.4,
      confidence: 92,
      marketCap: "772.4B",
      volume: "124.7M",
      peRatio: "68.3",
      dividend: "0%",
      yearHigh: 299.29,
      yearLow: 138.8,
      relatedNews: [
        {
          id: 1,
          title: "Tesla delivers record number of vehicles in Q2",
          source: "Wall Street Journal",
          time: "4h ago",
          url: "#",
          sentiment: "positive",
        },
        {
          id: 2,
          title: "Tesla's Full Self-Driving software sees wider rollout",
          source: "Electrek",
          time: "1d ago",
          url: "#",
          sentiment: "positive",
        },
      ],
    },
    NVDA: {
      symbol: "NVDA",
      name: "NVIDIA Corporation",
      type: "Stock",
      sector: "Technology",
      currentPrice: 824.15,
      predictedPrice: 912.3,
      change: 88.15,
      percentChange: 10.7,
      confidence: 91,
      marketCap: "2.03T",
      volume: "87.3M",
      peRatio: "72.1",
      dividend: "0.05%",
      yearHigh: 840.25,
      yearLow: 380.55,
      relatedNews: [
        {
          id: 1,
          title: "NVIDIA unveils next-gen AI chips at developer conference",
          source: "TechCrunch",
          time: "6h ago",
          url: "#",
          sentiment: "positive",
        },
        {
          id: 2,
          title: "NVIDIA partners with leading cloud providers for AI infrastructure",
          source: "VentureBeat",
          time: "1d ago",
          url: "#",
          sentiment: "positive",
        },
      ],
    },
    BTC: {
      symbol: "BTC",
      name: "Bitcoin",
      type: "Cryptocurrency",
      sector: "Digital Assets",
      currentPrice: 43250.75,
      predictedPrice: 45750.5,
      change: 2499.75,
      percentChange: 5.78,
      confidence: 82,
      marketCap: "845.7B",
      volume: "32.5B",
      peRatio: "N/A",
      dividend: "N/A",
      yearHigh: 69000.0,
      yearLow: 24800.0,
      relatedNews: [
        {
          id: 1,
          title: "Bitcoin ETF inflows reach new monthly high",
          source: "CoinDesk",
          time: "3h ago",
          url: "#",
          sentiment: "positive",
        },
        {
          id: 2,
          title: "Major bank adds Bitcoin to treasury reserves",
          source: "Bloomberg",
          time: "1d ago",
          url: "#",
          sentiment: "positive",
        },
      ],
    },
  }

  // Category-specific assets
  const categoryAssets: Record<string, Asset[]> = {
    stocks: [
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
    ],
    crypto: [
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
    ],
    commodities: [
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
    ],
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)

    // Simulate API call delay
    setTimeout(() => {
      const normalizedQuery = searchQuery.toUpperCase().trim()
      const asset = mockAssets[normalizedQuery] || null
      setSearchedAsset(asset)
      setIsSearching(false)
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
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
      {/* Search Section */}
      <Card className="bg-black/60 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Market Data Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search for stocks, cryptocurrencies, indices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-white/5 border-white/10 text-white pl-10 focus-visible:ring-[#00DC82]"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
            </div>
            <Button
              className="bg-gradient-to-r from-[#00DC82] to-[#36e4da] text-black hover:opacity-90"
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
            >
              {isSearching ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search Asset
                </>
              )}
            </Button>
          </div>

          <div className="mt-4 text-sm text-white/70">
            <p>Examples: AAPL, MSFT, TSLA, NVDA, BTC</p>
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid - Show when no category is selected and no asset is searched */}
      {!selectedCategory && !searchedAsset && (
        <>
          <Card className="bg-black/60 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">Financial Market Categories</CardTitle>
                <CardDescription className="text-white/70">
                  Explore different sectors and discover top growth opportunities
                </CardDescription>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
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
        </>
      )}

      {/* Category Detail View */}
      {selectedCategory && !searchedAsset && (
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
                  <Input
                    placeholder="Search assets..."
                    className="pl-8 bg-black/40 border-white/10 text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Top Assets Table */}
          <Card className="bg-black/60 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Top Growth Assets</CardTitle>
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
                    {categoryAssets[selectedCategory]?.map((asset) => (
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
                            onClick={() => {
                              setSearchQuery(asset.symbol)
                              handleSearch()
                            }}
                          >
                            <Search className="h-3 w-3 mr-1" />
                            View Details
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

      {/* Asset Details */}
      {searchedAsset && (
        <div className="space-y-4">
          {/* Asset Header */}
          <Card className="bg-black/60 border-white/10">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-white hover:bg-white/10 mr-2"
                    onClick={() => {
                      setSearchedAsset(null)
                      setSearchQuery("")
                    }}
                  >
                    <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
                    Back
                  </Button>
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center border border-white/20">
                    <span className="text-base font-bold text-white">{searchedAsset.symbol}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{searchedAsset.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="bg-white/10 text-white border-0">
                        {searchedAsset.type}
                      </Badge>
                      <Badge variant="outline" className="bg-white/10 text-white border-0">
                        {searchedAsset.sector}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    $
                    {searchedAsset.currentPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    {searchedAsset.change >= 0 ? (
                      <ArrowUpRight className="h-4 w-4 text-green-400" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-400" />
                    )}
                    <span
                      className={`text-sm font-medium ${searchedAsset.change >= 0 ? "text-green-400" : "text-red-400"}`}
                    >
                      {searchedAsset.change >= 0 ? "+" : ""}$
                      {Math.abs(searchedAsset.change).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      ({searchedAsset.percentChange.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Asset Chart */}
          <Card className="bg-black/70 border-[#00DC82]/30 overflow-hidden group hover:border-[#00DC82]/50 transition-all duration-300 shadow-lg shadow-[#00DC82]/10">
            <CardHeader className="p-3 md:p-4 flex flex-row items-center justify-between border-b border-white/20 bg-gradient-to-r from-[#00DC82]/20 to-transparent">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#00DC82] to-[#36e4da] flex items-center justify-center shadow-lg shadow-[#00DC82]/20">
                  <LineChart className="h-4 w-4 text-black" />
                </div>
                <div>
                  <CardTitle className="text-white text-base md:text-lg">{searchedAsset.symbol} Price Chart</CardTitle>
                  <p className="text-xs text-white/70">Historical data and AI predictions</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs text-white">Last updated: {new Date().toLocaleTimeString()}</p>
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
                  <span>${(searchedAsset.currentPrice * 1.5).toFixed(2)}</span>
                  <span>${(searchedAsset.currentPrice * 1.3).toFixed(2)}</span>
                  <span>${(searchedAsset.currentPrice * 1.1).toFixed(2)}</span>
                  <span>${searchedAsset.currentPrice.toFixed(2)}</span>
                  <span>${(searchedAsset.currentPrice * 0.9).toFixed(2)}</span>
                  <span>${(searchedAsset.currentPrice * 0.7).toFixed(2)}</span>
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

                  {/* Asset value line (past) - GREEN */}
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

                  {/* Asset prediction line (future) - BLUE */}
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
                    stroke="#36e4da"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    strokeLinecap="round"
                  />

                  {/* Area under the curve */}
                  <linearGradient id="assetGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#00DC82" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#00DC82" stopOpacity="0" />
                  </linearGradient>
                  <path
                    d="M30,240 C80,220 130,180 180,190 C230,200 280,150 330,140 C380,130 430,120 480,100 C530,80 580,90 630,70 C680,60 730,40 780,20 L780,300 L30,300 Z"
                    fill="url(#assetGradient)"
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
                </svg>

                {/* Labels */}
                <div className="absolute bottom-4 left-8 text-xs text-white">Historical Data</div>
                <div className="absolute bottom-4 right-4 text-xs text-white">AI Prediction</div>

                {/* Value indicators */}
                <div className="absolute top-4 left-8 space-y-1">
                  <div className="text-lg font-bold text-white">
                    $
                    {searchedAsset.currentPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div className={`text-sm ${searchedAsset.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {searchedAsset.change >= 0 ? "+" : ""}$
                    {Math.abs(searchedAsset.change).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    ({searchedAsset.percentChange.toFixed(2)}%)
                  </div>
                </div>

                {/* Prediction indicator */}
                <div className="absolute top-4 right-4 space-y-1 text-right">
                  <div className="text-lg font-bold text-[#36e4da]">
                    $
                    {searchedAsset.predictedPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div className="text-sm text-[#36e4da]">
                    +$
                    {(searchedAsset.predictedPrice - searchedAsset.currentPrice).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    (
                    {(
                      ((searchedAsset.predictedPrice - searchedAsset.currentPrice) / searchedAsset.currentPrice) *
                      100
                    ).toFixed(2)}
                    %)
                  </div>
                </div>

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

          {/* Asset Details and Prediction */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Asset Details */}
            <Card className="bg-black/60 border-white/10">
              <CardHeader className="p-3 md:p-4 flex flex-row items-center justify-between border-b border-white/20">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center">
                    <Info className="h-4 w-4 text-white" />
                  </div>
                  <CardTitle className="text-white text-base md:text-lg">Asset Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-white/70">Market Cap</p>
                    <p className="text-sm font-medium text-white">${searchedAsset.marketCap}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-white/70">Volume</p>
                    <p className="text-sm font-medium text-white">{searchedAsset.volume}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-white/70">P/E Ratio</p>
                    <p className="text-sm font-medium text-white">{searchedAsset.peRatio}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-white/70">Dividend Yield</p>
                    <p className="text-sm font-medium text-white">{searchedAsset.dividend}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-white/70">52-Week High</p>
                    <p className="text-sm font-medium text-white">
                      $
                      {searchedAsset.yearHigh.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-white/70">52-Week Low</p>
                    <p className="text-sm font-medium text-white">
                      $
                      {searchedAsset.yearLow.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Prediction */}
            <Card className="bg-black/60 border-white/10">
              <CardHeader className="p-3 md:p-4 flex flex-row items-center justify-between border-b border-white/20">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#00DC82] to-[#36e4da] flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-black" />
                  </div>
                  <CardTitle className="text-white text-base md:text-lg">AI Prediction</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-xs text-white/70">Predicted Price (7d)</p>
                      <p className="text-xl font-bold text-[#36e4da]">
                        $
                        {searchedAsset.predictedPrice.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-xs text-white/70">Potential Growth</p>
                      <p className="text-xl font-bold text-[#36e4da]">
                        +
                        {(
                          ((searchedAsset.predictedPrice - searchedAsset.currentPrice) / searchedAsset.currentPrice) *
                          100
                        ).toFixed(2)}
                        %
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-white">AI Confidence</p>
                      <p className="text-sm font-medium text-white">{searchedAsset.confidence}%</p>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#00DC82] to-[#36e4da]"
                        style={{ width: `${searchedAsset.confidence}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-black/40 rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-400" />
                      <p className="text-sm font-medium text-white">Market Factors</p>
                    </div>
                    <p className="text-xs text-white/70">
                      Our AI analysis considers recent earnings reports, market sentiment, technical indicators, and
                      sector performance to generate this prediction.
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" className="border-white/10 text-white hover:bg-white/10 hover:text-white">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Detailed Analysis
                    </Button>
                    <Button className="bg-gradient-to-r from-[#00DC82] to-[#36e4da] text-black hover:opacity-90">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Add to Portfolio
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Asset News */}
          <Card className="bg-black/60 border-white/10">
            <CardHeader className="p-3 md:p-4 flex flex-row items-center justify-between border-b border-white/20">
              <div className="flex items-center gap-2">
                <CardTitle className="text-white text-base md:text-lg">{searchedAsset.symbol} Related News</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {searchedAsset.relatedNews.map((news) => (
                  <Card
                    key={news.id}
                    className="bg-black/40 border-white/10 p-3 hover:bg-white/5 transition-colors duration-200 cursor-pointer group"
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-white group-hover:text-[#00DC82] transition-colors duration-200">
                          {news.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-white/60">{news.source}</span>
                          <span className="text-xs text-white/40">•</span>
                          <span className="text-xs text-white/60">{news.time}</span>
                          <div
                            className={`h-2 w-2 rounded-full ${
                              news.sentiment === "positive"
                                ? "bg-green-400"
                                : news.sentiment === "negative"
                                  ? "bg-red-400"
                                  : "bg-yellow-400"
                            }`}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!selectedCategory && !searchedAsset && (
        <Card className="bg-black/40 border-white/10 p-6 text-center hidden">
          <div className="flex flex-col items-center gap-3">
            <Search className="h-12 w-12 text-white/30" />
            <h3 className="text-lg font-medium text-white">Search for an Asset</h3>
            <p className="text-sm text-white/70 max-w-md mx-auto">
              Enter a stock symbol, cryptocurrency, or index to view detailed market data, charts, and AI predictions.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}

// Types
interface AssetData {
  symbol: string
  name: string
  type: string
  sector: string
  currentPrice: number
  predictedPrice: number
  change: number
  percentChange: number
  confidence: number
  marketCap: string
  volume: string
  peRatio: string
  dividend: string
  yearHigh: number
  yearLow: number
  relatedNews: {
    id: number
    title: string
    source: string
    time: string
    url: string
    sentiment: string
  }[]
}

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

