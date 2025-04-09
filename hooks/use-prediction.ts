"use client"

import { useState } from "react"

interface PredictionData {
  symbol: string
  predictedPrice: number
  currentPrice: number
  change: number
  changePercent: number
  confidence: number
  timeframe: string
  strategy: string
}

export function usePrediction() {
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getPrediction = async (symbol: string, strategy = "default-strategy") => {
    setIsLoading(true)
    setError(null)

    try {
      // In a real implementation, this would be an API call
      // For now, we'll simulate a response with mock data
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Mock data based on the symbol
      const mockData: Record<string, PredictionData> = {
        AAPL: {
          symbol: "AAPL",
          predictedPrice: 195.42,
          currentPrice: 187.32,
          change: 8.1,
          changePercent: 4.32,
          confidence: 78.5,
          timeframe: "30 days",
          strategy,
        },
        MSFT: {
          symbol: "MSFT",
          predictedPrice: 438.75,
          currentPrice: 417.88,
          change: 20.87,
          changePercent: 5.0,
          confidence: 82.3,
          timeframe: "30 days",
          strategy,
        },
        AMZN: {
          symbol: "AMZN",
          predictedPrice: 189.65,
          currentPrice: 178.25,
          change: 11.4,
          changePercent: 6.4,
          confidence: 73.8,
          timeframe: "30 days",
          strategy,
        },
        GOOGL: {
          symbol: "GOOGL",
          predictedPrice: 174.25,
          currentPrice: 164.5,
          change: 9.75,
          changePercent: 5.9,
          confidence: 71.2,
          timeframe: "30 days",
          strategy,
        },
        TSLA: {
          symbol: "TSLA",
          predictedPrice: 242.27,
          currentPrice: 215.35,
          change: 26.92,
          changePercent: 12.5,
          confidence: 68.4,
          timeframe: "30 days",
          strategy,
        },
        BTC: {
          symbol: "BTC",
          predictedPrice: 72738.36,
          currentPrice: 63250.75,
          change: 9487.61,
          changePercent: 15.0,
          confidence: 65.7,
          timeframe: "30 days",
          strategy,
        },
        ETH: {
          symbol: "ETH",
          predictedPrice: 4042.09,
          currentPrice: 3425.5,
          change: 616.59,
          changePercent: 18.0,
          confidence: 64.2,
          timeframe: "30 days",
          strategy,
        },
      }

      // Default data for any symbol not in our mock data
      const defaultData: PredictionData = {
        symbol: symbol.toUpperCase(),
        predictedPrice: Math.random() * 100 + 100, // Random price between 100-200
        currentPrice: Math.random() * 100 + 50, // Random price between 50-150
        change: 0,
        changePercent: Math.random() * 10, // Random percent between 0-10%
        confidence: Math.random() * 30 + 50, // Random confidence between 50-80%
        timeframe: "30 days",
        strategy,
      }

      // Calculate change if not provided
      defaultData.change = defaultData.predictedPrice - defaultData.currentPrice

      // Get data for the requested symbol or use default
      const data = mockData[symbol.toUpperCase()] || defaultData

      setPredictionData(data)
      setIsLoading(false)
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while fetching prediction data")
      setIsLoading(false)
      return null
    }
  }

  return {
    getPrediction,
    predictionData,
    isLoading,
    error,
  }
}

