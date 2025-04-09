"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { RefreshCw } from "lucide-react"

export function BitcoinFeed() {
  const [data, setData] = useState({
    currentPrice: 43250.75,
    change: 1250.25,
    percentChange: 2.98,
    prediction: 45750.5,
    confidence: 82,
    lastUpdated: new Date(),
  })
  const [loading, setLoading] = useState(false)

  // Simulate data fetching
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate random data for demo
      const currentPrice = 42000 + Math.random() * 3000
      const change = Math.random() > 0.5 ? Math.random() * 2000 : -Math.random() * 1000
      const percentChange = (change / currentPrice) * 100
      const prediction = currentPrice + (Math.random() > 0.6 ? Math.random() * 3000 : -Math.random() * 1500)
      const confidence = 65 + Math.random() * 30

      setData({
        currentPrice,
        change,
        percentChange,
        prediction,
        confidence,
        lastUpdated: new Date(),
      })
      setLoading(false)
    }

    fetchData()
    // Set up interval for real-time updates
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#F7931A] to-[#FFAD33] flex items-center justify-center">
            <span className="text-xs font-bold text-white">BTC</span>
          </div>
          <div>
            <h3 className="text-sm font-medium">Bitcoin</h3>
            <p className="text-xs text-white/60">Cryptocurrency</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold">
            ${data.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className={`text-xs ${data.change >= 0 ? "text-green-400" : "text-red-400"}`}>
            {data.change >= 0 ? "+" : ""}
            {data.change.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (
            {data.percentChange.toFixed(2)}%)
          </p>
        </div>
      </div>

      <Card className="bg-black/40 border-white/5 p-3">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-xs font-medium text-white/70">AI Prediction (24h)</h4>
          <p className="text-xs text-white/50 flex items-center gap-1">
            <span>Last updated: {data.lastUpdated.toLocaleString()}</span>
            {loading && <RefreshCw className="h-3 w-3 animate-spin" />}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-base font-bold">
              ${data.prediction.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className={`text-xs ${data.prediction > data.currentPrice ? "text-green-400" : "text-red-400"}`}>
              {data.prediction > data.currentPrice ? "+" : ""}
              {(data.prediction - data.currentPrice).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              ({(((data.prediction - data.currentPrice) / data.currentPrice) * 100).toFixed(2)}%)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#F7931A]/20 to-[#FFAD33]/20 border border-white/10 flex items-center justify-center">
              <span className="text-xs font-bold">{data.confidence.toFixed(0)}%</span>
            </div>
            <div className="text-xs text-white/70">
              <p>Confidence</p>
              <p>Level</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

