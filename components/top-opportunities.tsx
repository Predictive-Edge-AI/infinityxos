"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight, Brain, Shield, BarChart, TrendingUp, TrendingDown } from "lucide-react"

interface Asset {
  symbol: string
  name: string
  type: string
  currentPrice: number
  change: number
  changePercent: number
  prediction: {
    price: number
    change: number
    timeframe: string
    confidence: number
  }
  riskLevel: "low" | "medium" | "high" | "day-trading"
}

export function TopOpportunities({ riskLevel = "all" }: { riskLevel?: string }) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<"1m" | "3m" | "1y">("1m")

  // Mock data for top opportunities
  const assets: Asset[] = [
    {
      symbol: "MSFT",
      name: "Microsoft Corporation",
      type: "Stock",
      currentPrice: 417.88,
      change: 2.32,
      changePercent: 0.56,
      prediction: {
        price: 438.77,
        change: 5.0,
        timeframe: "1 month",
        confidence: 82,
      },
      riskLevel: "low",
    },
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      type: "Stock",
      currentPrice: 187.32,
      change: 1.4,
      changePercent: 0.75,
      prediction: {
        price: 196.68,
        change: 5.0,
        timeframe: "1 month",
        confidence: 78,
      },
      riskLevel: "medium",
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corporation",
      type: "Stock",
      currentPrice: 879.25,
      change: 15.75,
      changePercent: 1.82,
      prediction: {
        price: 950.59,
        change: 8.1,
        timeframe: "1 month",
        confidence: 76,
      },
      riskLevel: "medium",
    },
    {
      symbol: "TSLA",
      name: "Tesla, Inc.",
      type: "Stock",
      currentPrice: 175.34,
      change: 2.71,
      changePercent: 1.57,
      prediction: {
        price: 193.75,
        change: 10.5,
        timeframe: "1 month",
        confidence: 68,
      },
      riskLevel: "high",
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      type: "Cryptocurrency",
      currentPrice: 63250.75,
      change: 1100.5,
      changePercent: 1.77,
      prediction: {
        price: 68710.81,
        change: 8.63,
        timeframe: "1 month",
        confidence: 72,
      },
      riskLevel: "day-trading",
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      type: "Cryptocurrency",
      currentPrice: 3450.25,
      change: 85.75,
      changePercent: 2.55,
      prediction: {
        price: 3795.28,
        change: 10.0,
        timeframe: "1 month",
        confidence: 70,
      },
      riskLevel: "high",
    },
    {
      symbol: "AMZN",
      name: "Amazon.com Inc.",
      type: "Stock",
      currentPrice: 178.75,
      change: 1.25,
      changePercent: 0.7,
      prediction: {
        price: 189.48,
        change: 6.0,
        timeframe: "1 month",
        confidence: 80,
      },
      riskLevel: "low",
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      type: "Stock",
      currentPrice: 164.5,
      change: 2.15,
      changePercent: 1.32,
      prediction: {
        price: 177.66,
        change: 8.0,
        timeframe: "1 month",
        confidence: 79,
      },
      riskLevel: "low",
    },
  ]

  // Filter assets by risk level if specified
  const filteredAssets = riskLevel === "all" ? assets : assets.filter((asset) => asset.riskLevel === riskLevel)

  // Sort assets by confidence and potential return
  const sortedAssets = [...filteredAssets].sort((a, b) => {
    // First sort by confidence
    if (b.prediction.confidence !== a.prediction.confidence) {
      return b.prediction.confidence - a.prediction.confidence
    }
    // Then by potential return
    return b.prediction.change - a.prediction.change
  })

  // Get risk level icon
  const getRiskIcon = (level: string) => {
    switch (level) {
      case "low":
        return <Shield className="h-4 w-4 text-green-400" />
      case "medium":
        return <BarChart className="h-4 w-4 text-blue-400" />
      case "high":
        return <TrendingUp className="h-4 w-4 text-purple-400" />
      case "day-trading":
        return <TrendingDown className="h-4 w-4 text-red-400" />
      default:
        return <Shield className="h-4 w-4 text-green-400" />
    }
  }

  return (
    <div className="space-y-4">
      <Card className="bg-black/60 border-white/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white">Top Rated Opportunities</CardTitle>
            <CardDescription className="text-white/70">
              Assets with the highest growth potential and confidence ratings
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={selectedTimeframe === "1m" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTimeframe("1m")}
              className={selectedTimeframe === "1m" ? "bg-[#00DC82] text-black" : "border-white/10 text-white"}
            >
              1M
            </Button>
            <Button
              variant={selectedTimeframe === "3m" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTimeframe("3m")}
              className={selectedTimeframe === "3m" ? "bg-[#00DC82] text-black" : "border-white/10 text-white"}
            >
              3M
            </Button>
            <Button
              variant={selectedTimeframe === "1y" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTimeframe("1y")}
              className={selectedTimeframe === "1y" ? "bg-[#00DC82] text-black" : "border-white/10 text-white"}
            >
              1Y
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedAssets.map((asset) => (
              <Card
                key={asset.symbol}
                className="bg-black/40 border-white/10 hover:border-[#00DC82]/50 transition-all duration-300"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#00DC82]/20 to-[#36e4da]/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-[#00DC82]">{asset.symbol}</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{asset.name}</h3>
                        <div className="flex items-center gap-1">
                          <Badge
                            variant="outline"
                            className="bg-black/40 text-white/70 border-white/10 text-xs px-1 py-0"
                          >
                            {asset.type}
                          </Badge>
                          <div className="flex items-center gap-1">
                            {getRiskIcon(asset.riskLevel)}
                            <span className="text-xs text-white/70 capitalize">{asset.riskLevel} Risk</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">
                        $
                        {asset.currentPrice.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                      <div className="flex items-center justify-end gap-1">
                        {asset.changePercent >= 0 ? (
                          <div className="flex items-center gap-1 text-green-400">
                            <ArrowUpRight className="h-3 w-3" />
                            <span className="text-xs">+{asset.changePercent.toFixed(2)}%</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-red-400">
                            <ArrowDownRight className="h-3 w-3" />
                            <span className="text-xs">-{Math.abs(asset.changePercent).toFixed(2)}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-3 border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        <Brain className="h-4 w-4 text-[#36e4da]" />
                        <span className="text-xs text-white/70">AI Prediction ({asset.prediction.timeframe})</span>
                      </div>
                      <Badge variant="outline" className="bg-[#00DC82]/10 text-[#00DC82] border-[#00DC82]/20">
                        {asset.prediction.confidence}% Confidence
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-[#36e4da]">
                        $
                        {asset.prediction.price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                      <div className="flex items-center gap-1 text-[#00DC82]">
                        <ArrowUpRight className="h-3 w-3" />
                        <span className="text-xs">+{asset.prediction.change.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

