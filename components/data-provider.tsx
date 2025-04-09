"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getClientSupabaseClient } from "@/lib/db"

// Types
interface Asset {
  id: string
  symbol: string
  name: string
  type: string
  currentPrice: number
  previousClose?: number
  change?: number
  changePercent?: number
  volume?: number
  prediction?: {
    price: number
    confidence: number
    timeframe: string
  }
}

interface PortfolioAsset {
  id: string
  assetId: string
  symbol: string
  name: string
  type: string
  quantity: number
  averagePrice: number
  currentPrice: number
  value: number
  change: number
  changePercent: number
  prediction?: {
    price: number
    growth: number
    confidence: number
  }
}

interface DataContextType {
  assets: Asset[]
  topAssets: Asset[]
  portfolioAssets: PortfolioAsset[]
  portfolioValue: number
  portfolioGrowth: {
    value: number
    percent: number
  }
  predictedGrowth: {
    value: number
    percent: number
  }
  isLoading: boolean
  error: string | null
  refreshData: () => Promise<void>
}

const DataContext = createContext<DataContextType | null>(null)

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [portfolioAssets, setPortfolioAssets] = useState<PortfolioAsset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const supabase = getClientSupabaseClient()

      // Get user session
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        // If no session, use mock data
        setAssets(getMockAssets())
        setPortfolioAssets(getMockPortfolioAssets())
        return
      }

      // Fetch assets with latest prices
      const { data: assetsData, error: assetsError } = await supabase
        .from("assets")
        .select(`
          *,
          asset_prices!inner(*)
        `)
        .eq("asset_prices.is_latest", true)

      if (assetsError) {
        throw assetsError
      }

      // Fetch latest predictions
      const { data: predictionsData, error: predictionsError } = await supabase
        .from("predictions")
        .select("*")
        .order("created_at", { ascending: false })

      if (predictionsError) {
        throw predictionsError
      }

      // Group predictions by asset symbol and get the latest for each
      const latestPredictions = predictionsData.reduce(
        (acc, prediction) => {
          if (
            !acc[prediction.asset_symbol] ||
            new Date(prediction.created_at) > new Date(acc[prediction.asset_symbol].created_at)
          ) {
            acc[prediction.asset_symbol] = prediction
          }
          return acc
        },
        {} as Record<string, any>,
      )

      // Format assets data
      const formattedAssets = assetsData.map((asset) => {
        const priceData = asset.asset_prices[0]
        const prediction = latestPredictions[asset.symbol]

        return {
          id: asset.id,
          symbol: asset.symbol,
          name: asset.name,
          type: asset.type,
          currentPrice: priceData.price,
          previousClose: priceData.previous_close,
          change: priceData.change,
          changePercent: priceData.change_percent,
          volume: priceData.volume,
          prediction: prediction
            ? {
                price: prediction.predicted_price,
                confidence: prediction.confidence,
                timeframe: prediction.timeframe,
              }
            : undefined,
        }
      })

      setAssets(formattedAssets)

      // Fetch user portfolio
      const { data: portfolioData, error: portfolioError } = await supabase
        .from("portfolio_assets")
        .select(`
          *,
          assets(*)
        `)
        .eq("user_id", session.user.id)

      if (portfolioError) {
        throw portfolioError
      }

      // Format portfolio data
      const formattedPortfolio = await Promise.all(
        portfolioData.map(async (item) => {
          // Get latest price for this asset
          const { data: priceData, error: priceError } = await supabase
            .from("asset_prices")
            .select("*")
            .eq("asset_id", item.asset_id)
            .eq("is_latest", true)
            .single()

          if (priceError) {
            console.error(`Error fetching price for asset ${item.asset_id}:`, priceError)
            return null
          }

          const prediction = latestPredictions[item.assets.symbol]
          const currentPrice = priceData.price
          const value = item.quantity * currentPrice
          const initialValue = item.quantity * item.average_price
          const change = value - initialValue
          const changePercent = (change / initialValue) * 100

          return {
            id: item.id,
            assetId: item.asset_id,
            symbol: item.assets.symbol,
            name: item.assets.name,
            type: item.assets.type,
            quantity: item.quantity,
            averagePrice: item.average_price,
            currentPrice,
            value,
            change,
            changePercent,
            prediction: prediction
              ? {
                  price: prediction.predicted_price,
                  growth: ((prediction.predicted_price - currentPrice) / currentPrice) * 100,
                  confidence: prediction.confidence,
                }
              : undefined,
          }
        }),
      )

      // Filter out null values
      setPortfolioAssets(formattedPortfolio.filter(Boolean) as PortfolioAsset[])
    } catch (err) {
      console.error("Error fetching data:", err)
      setError(String(err))

      // Use mock data as fallback
      setAssets(getMockAssets())
      setPortfolioAssets(getMockPortfolioAssets())
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate portfolio metrics
  const portfolioValue = portfolioAssets.reduce((sum, asset) => sum + asset.value, 0)

  const portfolioGrowth = {
    value: portfolioAssets.reduce((sum, asset) => sum + asset.change, 0),
    percent:
      portfolioAssets.length > 0
        ? (portfolioAssets.reduce((sum, asset) => sum + asset.change, 0) /
            portfolioAssets.reduce((sum, asset) => sum + asset.averagePrice * asset.quantity, 0)) *
          100
        : 0,
  }

  const predictedGrowth = {
    value: portfolioAssets.reduce((sum, asset) => {
      if (!asset.prediction) return sum
      return sum + (asset.prediction.price - asset.currentPrice) * asset.quantity
    }, 0),
    percent:
      portfolioValue > 0
        ? (portfolioAssets.reduce((sum, asset) => {
            if (!asset.prediction) return sum
            return sum + (asset.prediction.price - asset.currentPrice) * asset.quantity
          }, 0) /
            portfolioValue) *
          100
        : 0,
  }

  // Get top assets by predicted growth
  const topAssets = [...assets]
    .filter((asset) => asset.prediction)
    .sort((a, b) => {
      const growthA = a.prediction ? ((a.prediction.price - a.currentPrice) / a.currentPrice) * 100 : 0
      const growthB = b.prediction ? ((b.prediction.price - b.currentPrice) / b.currentPrice) * 100 : 0
      return growthB - growthA
    })
    .slice(0, 5)

  useEffect(() => {
    fetchData()

    // Set up real-time subscription for price updates
    const supabase = getClientSupabaseClient()

    const priceSubscription = supabase
      .channel("asset_prices_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "asset_prices",
          filter: "is_latest=eq.true",
        },
        () => {
          fetchData()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(priceSubscription)
    }
  }, [])

  return (
    <DataContext.Provider
      value={{
        assets,
        topAssets,
        portfolioAssets,
        portfolioValue,
        portfolioGrowth,
        predictedGrowth,
        isLoading,
        error,
        refreshData: fetchData,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

// Mock data functions
function getMockAssets(): Asset[] {
  return [
    {
      id: "1",
      symbol: "AAPL",
      name: "Apple Inc.",
      type: "Stock",
      currentPrice: 187.32,
      previousClose: 185.92,
      change: 1.4,
      changePercent: 0.75,
      volume: 58234567,
      prediction: {
        price: 203.45,
        confidence: 89,
        timeframe: "1m",
      },
    },
    {
      id: "2",
      symbol: "MSFT",
      name: "Microsoft Corp.",
      type: "Stock",
      currentPrice: 378.92,
      previousClose: 372.45,
      change: 6.47,
      changePercent: 1.74,
      volume: 23456789,
      prediction: {
        price: 412.67,
        confidence: 86,
        timeframe: "1m",
      },
    },
    {
      id: "3",
      symbol: "NVDA",
      name: "NVIDIA Corp.",
      type: "Stock",
      currentPrice: 824.15,
      previousClose: 792.0,
      change: 32.15,
      changePercent: 4.06,
      volume: 34567890,
      prediction: {
        price: 912.3,
        confidence: 91,
        timeframe: "1m",
      },
    },
    {
      id: "4",
      symbol: "TSLA",
      name: "Tesla Inc.",
      type: "Stock",
      currentPrice: 187.25,
      previousClose: 175.43,
      change: 11.82,
      changePercent: 6.74,
      volume: 45678901,
      prediction: {
        price: 195.25,
        confidence: 75,
        timeframe: "1m",
      },
    },
    {
      id: "5",
      symbol: "AMZN",
      name: "Amazon.com Inc.",
      type: "Stock",
      currentPrice: 185.35,
      previousClose: 178.75,
      change: 6.6,
      changePercent: 3.69,
      volume: 56789012,
      prediction: {
        price: 195.2,
        confidence: 84,
        timeframe: "1m",
      },
    },
    {
      id: "6",
      symbol: "BTC",
      name: "Bitcoin",
      type: "Cryptocurrency",
      currentPrice: 44750.25,
      previousClose: 43250.75,
      change: 1499.5,
      changePercent: 3.47,
      volume: 67890123,
      prediction: {
        price: 47250.5,
        confidence: 82,
        timeframe: "1m",
      },
    },
    {
      id: "7",
      symbol: "ETH",
      name: "Ethereum",
      type: "Cryptocurrency",
      currentPrice: 3245.75,
      previousClose: 3125.5,
      change: 120.25,
      changePercent: 3.85,
      volume: 78901234,
      prediction: {
        price: 3450.25,
        confidence: 80,
        timeframe: "1m",
      },
    },
    {
      id: "8",
      symbol: "SPY",
      name: "SPDR S&P 500 ETF",
      type: "ETF",
      currentPrice: 487.25,
      previousClose: 460.75,
      change: 26.5,
      changePercent: 5.75,
      volume: 89012345,
      prediction: {
        price: 505.25,
        confidence: 79,
        timeframe: "1m",
      },
    },
  ]
}

function getMockPortfolioAssets(): PortfolioAsset[] {
  return [
    {
      id: "1",
      assetId: "1",
      symbol: "AAPL",
      name: "Apple Inc.",
      type: "Stock",
      quantity: 15,
      averagePrice: 175.25,
      currentPrice: 187.32,
      value: 2809.8,
      change: 181.05,
      changePercent: 6.89,
      prediction: {
        price: 203.45,
        growth: 8.61,
        confidence: 89,
      },
    },
    {
      id: "2",
      assetId: "3",
      symbol: "NVDA",
      name: "NVIDIA Corp.",
      type: "Stock",
      quantity: 5,
      averagePrice: 740.5,
      currentPrice: 824.15,
      value: 4120.75,
      change: 418.25,
      changePercent: 11.3,
      prediction: {
        price: 912.3,
        growth: 10.7,
        confidence: 91,
      },
    },
    {
      id: "3",
      assetId: "6",
      symbol: "BTC",
      name: "Bitcoin",
      type: "Cryptocurrency",
      quantity: 0.25,
      averagePrice: 38750.25,
      currentPrice: 44750.25,
      value: 11187.56,
      change: 1500.0,
      changePercent: 15.5,
      prediction: {
        price: 47250.5,
        growth: 5.59,
        confidence: 82,
      },
    },
  ]
}

