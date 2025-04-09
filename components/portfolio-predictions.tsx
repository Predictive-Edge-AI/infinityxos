"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface PortfolioPredictionsProps {
  className?: string
}

export function PortfolioPredictions({ className }: PortfolioPredictionsProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [portfolioValue, setPortfolioValue] = useState(0)
  const [growthPercent, setGrowthPercent] = useState(0)
  const [growthAmount, setGrowthAmount] = useState(0)
  const [isPositive, setIsPositive] = useState(true)

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        // Simulate API call
        const response = await fetch("/api/portfolio")

        if (!response.ok) {
          throw new Error("Failed to fetch portfolio data")
        }

        const result = await response.json()

        // Process data for chart
        const chartData = result.historicalData.map((item: any) => ({
          date: new Date(item.date).toLocaleDateString(),
          value: item.value,
          prediction: null,
        }))

        // Add prediction data points
        result.predictions.forEach((pred: any) => {
          chartData.push({
            date: new Date(pred.date).toLocaleDateString(),
            value: null,
            prediction: pred.value,
          })
        })

        setData(chartData)
        setPortfolioValue(result.currentValue)
        setGrowthPercent(result.growthPercent)
        setGrowthAmount(result.growthAmount)
        setIsPositive(result.growthPercent >= 0)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching portfolio data:", err)
        setError("Failed to load portfolio predictions")
        setLoading(false)

        // Use mock data for demo
        const mockData = generateMockData()
        setData(mockData.data)
        setPortfolioValue(mockData.portfolioValue)
        setGrowthPercent(mockData.growthPercent)
        setGrowthAmount(mockData.growthAmount)
        setIsPositive(mockData.growthPercent >= 0)
      }
    }

    fetchPortfolioData()
  }, [])

  const generateMockData = () => {
    const baseValue = 10000 + Math.random() * 5000
    const volatility = 0.03
    const uptrend = 0.005
    const days = 30
    const predictionDays = 7

    let currentValue = baseValue
    const historicalData = []

    // Generate historical data
    for (let i = 0; i < days; i++) {
      const change = currentValue * (Math.random() * volatility * 2 - volatility + uptrend)
      currentValue += change
      historicalData.push({
        date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        value: Math.round(currentValue * 100) / 100,
        prediction: null,
      })
    }

    const lastValue = currentValue
    const predictions = []

    // Generate prediction data
    for (let i = 1; i <= predictionDays; i++) {
      const change = currentValue * (Math.random() * volatility * 2 - volatility + uptrend * 1.5)
      currentValue += change
      predictions.push({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString(),
        value: null,
        prediction: Math.round(currentValue * 100) / 100,
      })
    }

    const growthPercent = ((predictions[predictions.length - 1].prediction - lastValue) / lastValue) * 100
    const growthAmount = predictions[predictions.length - 1].prediction - lastValue

    return {
      data: [...historicalData, ...predictions],
      portfolioValue: Math.round(lastValue * 100) / 100,
      growthPercent: Math.round(growthPercent * 100) / 100,
      growthAmount: Math.round(growthAmount * 100) / 100,
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 p-2 rounded border border-green-500/30 text-xs">
          <p className="text-white">{`${label}`}</p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className={`rounded-xl bg-black/40 backdrop-blur-sm border border-green-500/10 p-4 ${className}`}>
        <div className="h-[300px] flex items-center justify-center">
          <div className="animate-pulse text-green-500">Loading portfolio predictions...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`rounded-xl bg-black/40 backdrop-blur-sm border border-green-500/10 p-4 ${className}`}>
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-xl bg-black/40 backdrop-blur-sm border border-green-500/10 p-4 ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium text-white">Portfolio Prediction</h3>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="date"
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }}
              tickLine={{ stroke: "rgba(255,255,255,0.1)" }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              minTickGap={20}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }}
              tickLine={{ stroke: "rgba(255,255,255,0.1)" }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#00ff00"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, stroke: "#00ff00", strokeWidth: 2, fill: "#000" }}
            />
            <Line
              type="monotone"
              dataKey="prediction"
              stroke="#0088ff"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 6, stroke: "#0088ff", strokeWidth: 2, fill: "#000" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

