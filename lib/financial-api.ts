import { getServerSupabaseClient } from "./db"

// Types
export interface Asset {
  id: string
  symbol: string
  name: string
  type: string
  coin_id?: string
  created_at: string
}

export interface AssetPrice {
  id: string
  asset_id: string
  price: number
  previous_close?: number
  change?: number
  change_percent?: number
  volume?: number
  is_latest: boolean
  timestamp: string
}

export interface Prediction {
  id: string
  asset_symbol: string
  predicted_price: number
  timeframe: string
  confidence: number
  factors?: string[]
  created_at: string
}

export interface PortfolioAsset {
  id: string
  user_id: string
  asset_id: string
  quantity: number
  average_price: number
  created_at: string
  updated_at: string
  asset?: Asset
  current_price?: number
}

// Asset functions
export async function getAssets() {
  const supabase = getServerSupabaseClient()
  const { data, error } = await supabase.from("assets").select("*").order("symbol")

  if (error) {
    console.error("Error fetching assets:", error)
    throw error
  }

  return data as Asset[]
}

export async function getAssetBySymbol(symbol: string) {
  const supabase = getServerSupabaseClient()
  const { data, error } = await supabase.from("assets").select("*").eq("symbol", symbol).single()

  if (error) {
    console.error(`Error fetching asset ${symbol}:`, error)
    throw error
  }

  return data as Asset
}

// Asset price functions
export async function getLatestPrices() {
  const supabase = getServerSupabaseClient()
  const { data, error } = await supabase.from("asset_prices").select("*, assets!inner(*)").eq("is_latest", true)

  if (error) {
    console.error("Error fetching latest prices:", error)
    throw error
  }

  return data
}

export async function getAssetPriceHistory(assetId: string, days = 30) {
  const supabase = getServerSupabaseClient()
  const date = new Date()
  date.setDate(date.getDate() - days)

  const { data, error } = await supabase
    .from("asset_prices")
    .select("*")
    .eq("asset_id", assetId)
    .gte("timestamp", date.toISOString())
    .order("timestamp")

  if (error) {
    console.error(`Error fetching price history for asset ${assetId}:`, error)
    throw error
  }

  return data as AssetPrice[]
}

// Prediction functions
export async function getPredictions(limit = 50) {
  const supabase = getServerSupabaseClient()
  const { data, error } = await supabase
    .from("predictions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching predictions:", error)
    throw error
  }

  return data as Prediction[]
}

export async function getPredictionsByAssetSymbol(symbol: string, limit = 10) {
  const supabase = getServerSupabaseClient()
  const { data, error } = await supabase
    .from("predictions")
    .select("*")
    .eq("asset_symbol", symbol)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error(`Error fetching predictions for asset ${symbol}:`, error)
    throw error
  }

  return data as Prediction[]
}

// Portfolio functions
export async function getUserPortfolio(userId: string) {
  const supabase = getServerSupabaseClient()
  const { data, error } = await supabase.from("portfolio_assets").select("*, assets(*)").eq("user_id", userId)

  if (error) {
    console.error(`Error fetching portfolio for user ${userId}:`, error)
    throw error
  }

  // Get latest prices for each asset
  const portfolioWithPrices = await Promise.all(
    data.map(async (item) => {
      const { data: priceData } = await supabase
        .from("asset_prices")
        .select("*")
        .eq("asset_id", item.asset_id)
        .eq("is_latest", true)
        .single()

      return {
        ...item,
        current_price: priceData?.price || 0,
      }
    }),
  )

  return portfolioWithPrices as (PortfolioAsset & { asset: Asset; current_price: number })[]
}

export async function getPortfolioHistory(userId: string, days = 30) {
  const supabase = getServerSupabaseClient()
  const date = new Date()
  date.setDate(date.getDate() - days)

  const { data, error } = await supabase
    .from("portfolio_history")
    .select("*")
    .eq("user_id", userId)
    .gte("date", date.toISOString().split("T")[0])
    .order("date")

  if (error) {
    console.error(`Error fetching portfolio history for user ${userId}:`, error)
    throw error
  }

  return data
}

