"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight, TrendingUp, ExternalLink } from "lucide-react"

interface TopPredictionsProps {
  setActiveTab: (tab: string) => void
}

export function TopPredictions({ setActiveTab }: TopPredictionsProps) {
  // Mock data for top predictions
  const predictions = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      currentPrice: 187.32,
      predictedPrice: 203.45,
      change: 8.61,
      confidence: 89,
      timeframe: "7d",
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corp.",
      currentPrice: 378.92,
      predictedPrice: 412.67,
      change: 8.91,
      confidence: 86,
      timeframe: "7d",
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corp.",
      currentPrice: 824.15,
      predictedPrice: 912.3,
      change: 10.7,
      confidence: 91,
      timeframe: "7d",
    },
    {
      symbol: "AMZN",
      name: "Amazon.com Inc.",
      currentPrice: 178.75,
      predictedPrice: 195.2,
      change: 9.2,
      confidence: 84,
      timeframe: "7d",
    },
    {
      symbol: "TSLA",
      name: "Tesla Inc.",
      currentPrice: 175.43,
      predictedPrice: 162.3,
      change: -7.5,
      confidence: 78,
      timeframe: "7d",
    },
  ]

  return (
    <Card className="bg-black/70 border-[#00DC82]/30 overflow-hidden group hover:border-[#00DC82]/50 transition-all duration-300 shadow-lg shadow-[#00DC82]/10">
      <CardHeader className="p-3 md:p-4 flex flex-row items-center justify-between border-b border-white/20 bg-gradient-to-r from-[#00DC82]/20 to-transparent">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#00DC82] to-[#36e4da] flex items-center justify-center shadow-lg shadow-[#00DC82]/20">
            <TrendingUp className="h-4 w-4 text-black" />
          </div>
          <div>
            <CardTitle className="text-white text-base md:text-lg">Top Prediction Assets</CardTitle>
            <p className="text-xs text-white/70">Highest confidence predictions</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1 text-xs hover:bg-white/10"
          onClick={() => setActiveTab("prediction-history")}
        >
          <span>View All</span>
          <ExternalLink className="h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 divide-y divide-white/10">
          {predictions.map((prediction) => (
            <div key={prediction.symbol} className="p-3 hover:bg-white/5 transition-colors duration-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center border border-white/20">
                    <span className="text-xs font-bold text-white">{prediction.symbol}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">{prediction.name}</h3>
                    <p className="text-xs text-white/60">${prediction.currentPrice.toFixed(2)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <p className="text-sm font-bold">${prediction.predictedPrice.toFixed(2)}</p>
                    {prediction.change >= 0 ? (
                      <ArrowUpRight className="h-4 w-4 text-green-400" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-400" />
                    )}
                  </div>
                  <p className={`text-xs ${prediction.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {prediction.change >= 0 ? "+" : ""}
                    {prediction.change.toFixed(2)}% ({prediction.timeframe})
                  </p>
                </div>
              </div>
              <div className="mt-2 w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00DC82] to-[#36e4da]"
                  style={{ width: `${prediction.confidence}%` }}
                ></div>
              </div>
              <div className="mt-1 flex justify-between items-center">
                <p className="text-xs text-white/50">Confidence</p>
                <p className="text-xs font-medium">{prediction.confidence}%</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

