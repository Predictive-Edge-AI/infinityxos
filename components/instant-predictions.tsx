"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, Filter, TrendingUp, Clock, AlertTriangle } from "lucide-react"

export function InstantPredictions() {
  const [activeFilter, setActiveFilter] = useState("all")

  // Mock data for instant predictions
  const predictions = [
    {
      symbol: "TSLA",
      name: "Tesla Inc.",
      sector: "Automotive",
      currentPrice: 242.68,
      predictedPrice: 287.35,
      change: 18.4,
      confidence: 92,
      timeframe: "72h",
      source: "Earnings Report",
      urgency: "high",
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corp.",
      sector: "Technology",
      currentPrice: 824.15,
      predictedPrice: 912.3,
      change: 10.7,
      confidence: 91,
      timeframe: "7d",
      source: "AI Advancement",
      urgency: "medium",
    },
    {
      symbol: "AMZN",
      name: "Amazon.com Inc.",
      sector: "E-Commerce",
      currentPrice: 178.75,
      predictedPrice: 195.2,
      change: 9.2,
      confidence: 84,
      timeframe: "14d",
      source: "Market Analysis",
      urgency: "medium",
    },
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      sector: "Technology",
      currentPrice: 187.32,
      predictedPrice: 203.45,
      change: 8.61,
      confidence: 89,
      timeframe: "7d",
      source: "Product Launch",
      urgency: "medium",
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corp.",
      sector: "Technology",
      currentPrice: 378.92,
      predictedPrice: 412.67,
      change: 8.91,
      confidence: 86,
      timeframe: "7d",
      source: "Cloud Growth",
      urgency: "low",
    },
    {
      symbol: "GOOG",
      name: "Alphabet Inc.",
      sector: "Technology",
      currentPrice: 142.56,
      predictedPrice: 155.38,
      change: 9.0,
      confidence: 83,
      timeframe: "14d",
      source: "AI Integration",
      urgency: "low",
    },
    {
      symbol: "AMD",
      name: "Advanced Micro Devices",
      sector: "Semiconductors",
      currentPrice: 156.43,
      predictedPrice: 178.32,
      change: 14.0,
      confidence: 88,
      timeframe: "7d",
      source: "Chip Demand",
      urgency: "high",
    },
    {
      symbol: "PLTR",
      name: "Palantir Technologies",
      sector: "Software",
      currentPrice: 22.87,
      predictedPrice: 26.53,
      change: 16.0,
      confidence: 87,
      timeframe: "7d",
      source: "Government Contract",
      urgency: "high",
    },
  ]

  // Filter predictions based on active filter
  const filteredPredictions =
    activeFilter === "all" ? predictions : predictions.filter((p) => p.urgency === activeFilter)

  // Sort by confidence and change
  const sortedPredictions = [...filteredPredictions].sort((a, b) => {
    if (b.confidence === a.confidence) {
      return b.change - a.change
    }
    return b.confidence - a.confidence
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setActiveFilter}>
          <TabsList className="bg-black/40 border border-white/10">
            <TabsTrigger
              value="all"
              className="text-white data-[state=active]:bg-white/10 data-[state=active]:text-white"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="high"
              className="text-white data-[state=active]:bg-white/10 data-[state=active]:text-white"
            >
              High Urgency
            </TabsTrigger>
            <TabsTrigger
              value="medium"
              className="text-white data-[state=active]:bg-white/10 data-[state=active]:text-white"
            >
              Medium
            </TabsTrigger>
            <TabsTrigger
              value="low"
              className="text-white data-[state=active]:bg-white/10 data-[state=active]:text-white"
            >
              Low
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/10 hover:text-white">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/10 hover:text-white">
            <Clock className="h-4 w-4 mr-2" />
            Timeframe
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedPredictions.map((prediction) => (
          <Card
            key={prediction.symbol}
            className="bg-black/40 border-white/10 p-4 hover:bg-black/50 transition-colors duration-200"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center border border-white/20">
                  <span className="text-sm font-bold text-white">{prediction.symbol}</span>
                </div>
                <div>
                  <h3 className="text-base font-medium text-white">{prediction.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/60">{prediction.sector}</span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1 py-0 h-4 border-0 ${
                        prediction.urgency === "high"
                          ? "bg-red-500/20 text-red-400"
                          : prediction.urgency === "medium"
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {prediction.urgency === "high" && <AlertTriangle className="h-2 w-2 mr-1" />}
                      {prediction.urgency.charAt(0).toUpperCase() + prediction.urgency.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-base font-bold text-white">${prediction.currentPrice.toFixed(2)}</p>
                <div className="flex items-center justify-end gap-1">
                  <ArrowUpRight className="h-3 w-3 text-green-400" />
                  <p className="text-xs text-green-400">
                    +{prediction.change.toFixed(2)}% ({prediction.timeframe})
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-xs text-white/70">Predicted Price</p>
                <p className="text-lg font-bold text-[#00DC82]">${prediction.predictedPrice.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/70">Confidence</p>
                <p className="text-lg font-bold text-white">{prediction.confidence}%</p>
              </div>
            </div>

            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-[#00DC82] to-[#36e4da]"
                style={{ width: `${prediction.confidence}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1 text-xs text-white/60">
                <TrendingUp className="h-3 w-3" />
                <span>Source: {prediction.source}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-[#00DC82] hover:bg-white/10 hover:text-[#00DC82]"
              >
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <Button variant="outline" className="border-white/10 text-white hover:bg-white/10 hover:text-white">
          Load More Predictions
        </Button>
      </div>
    </div>
  )
}

