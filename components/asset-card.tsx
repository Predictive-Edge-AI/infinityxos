"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight, X } from "lucide-react"

interface AssetCardProps {
  symbol: string
  name: string
  type: string
  currentPrice: number
  predictedPrice: number
  change: number
  confidence: number
  showRemove?: boolean
}

export function AssetCard({
  symbol,
  name,
  type,
  currentPrice,
  predictedPrice,
  change,
  confidence,
  showRemove = false,
}: AssetCardProps) {
  const percentChange = (change / currentPrice) * 100
  const predictionChange = predictedPrice - currentPrice
  const predictionPercentChange = (predictionChange / currentPrice) * 100
  const isPositive = change >= 0

  // Function to determine the color based on confidence
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 70) return "text-[#00DC82]"
    if (confidence >= 50) return "text-amber-400"
    return "text-red-400"
  }

  return (
    <Card className="bg-black/60 border-white/10 overflow-hidden group hover:border-[#00DC82]/30 transition-all duration-300 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#00DC82]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {showRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 rounded-full bg-white/10 hover:bg-white/20 z-10"
        >
          <X className="h-3 w-3 text-white" />
        </Button>
      )}

      <CardContent className="p-3">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center border border-white/20">
              <span className="text-xs font-bold text-white">{symbol}</span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">{name}</h3>
              <p className="text-xs text-white/60">{type}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-base font-bold text-white">
              ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className={`text-xs flex items-center justify-end ${isPositive ? "text-green-400" : "text-red-400"}`}>
              {isPositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
              {isPositive ? "+" : ""}
              {change.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (
              {percentChange.toFixed(2)}%)
            </p>
          </div>
        </div>

        {/* Mini chart */}
        <div className="h-20 w-full mb-3">
          <svg width="100%" height="100%" viewBox="0 0 300 80" preserveAspectRatio="none">
            {/* Background grid lines */}
            {[0, 1, 2, 3].map((i) => (
              <line
                key={`grid-${i}`}
                x1="0"
                y1={20 * i}
                x2="300"
                y2={20 * i}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            ))}

            {/* Asset value line (past) */}
            <path
              d={`M0,${isPositive ? 60 : 20} C30,${isPositive ? 50 : 30} 60,${isPositive ? 40 : 40} 90,${isPositive ? 45 : 35} C120,${isPositive ? 50 : 30} 150,${isPositive ? 30 : 50} 180,${isPositive ? 20 : 60} C210,${isPositive ? 25 : 55} 240,${isPositive ? 15 : 65} 270,${isPositive ? 10 : 70} `}
              fill="none"
              stroke="#00DC82"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Asset prediction line (future) */}
            <path
              d={`M270,${isPositive ? 10 : 70} C280,${isPositive ? 8 : 72} 290,${isPositive ? 5 : 75} 300,${isPositive ? 2 : 78}`}
              fill="none"
              stroke="#36e4da"
              strokeWidth="2"
              strokeDasharray="3,3"
              strokeLinecap="round"
            />

            {/* Area under the curve */}
            <linearGradient id={`assetGradient-${symbol}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00DC82" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#00DC82" stopOpacity="0" />
            </linearGradient>
            <path
              d={`M0,${isPositive ? 60 : 20} C30,${isPositive ? 50 : 30} 60,${isPositive ? 40 : 40} 90,${isPositive ? 45 : 35} C120,${isPositive ? 50 : 30} 150,${isPositive ? 30 : 50} 180,${isPositive ? 20 : 60} C210,${isPositive ? 25 : 55} 240,${isPositive ? 15 : 65} 270,${isPositive ? 10 : 70} C280,${isPositive ? 8 : 72} 290,${isPositive ? 5 : 75} 300,${isPositive ? 2 : 78} L300,80 L0,80 Z`}
              fill={`url(#assetGradient-${symbol})`}
            />

            {/* Current position marker */}
            <circle cx="270" cy={isPositive ? 10 : 70} r="3" fill="#00DC82" />
          </svg>
        </div>

        <div className="bg-black/40 rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-xs font-medium text-white">AI Prediction</h4>
            <div className="flex items-center gap-1">
              <div
                className={`h-5 w-5 rounded-full bg-gradient-to-br from-[#00DC82]/20 to-[#36e4da]/20 border border-white/10 flex items-center justify-center ${getConfidenceColor(confidence)}`}
              >
                <span className="text-[10px] font-bold">{confidence}%</span>
              </div>
              <p className="text-xs text-white/70">Confidence</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm font-bold text-white">
              ${predictedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className={`text-xs ${predictionChange >= 0 ? "text-[#36e4da]" : "text-red-400"}`}>
              {predictionChange >= 0 ? "+" : ""}
              {predictionChange.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (
              {predictionPercentChange.toFixed(2)}%)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

