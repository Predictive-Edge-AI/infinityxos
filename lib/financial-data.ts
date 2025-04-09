import { fetchWithErrorHandling } from "./api-utils"

// Types for financial data
export interface AssetData {
  symbol: string
  name: string
  type: "Stock" | "Cryptocurrency" | "Index" | "Futures" | "ETF"
  currentPrice: number
  previousClose: number
  change: number
  changePercent: number
  volume: number
  marketCap?: number
  lastUpdated: Date
}

export interface PredictionData {
  assetSymbol: string
  predictedPrice: number
  timeframe: string
  confidence: number
  createdAt: Date
  factors: string[]
}

export interface PortfolioData {
  totalValue: number
  dailyChange: number
  dailyChangePercent: number
  monthlyChange: number
  monthlyChangePercent: number
  assets: {
    symbol: string
    quantity: number
    averagePrice: number
    currentValue: number
    profit: number
    profitPercent: number
  }[]
}

// Fetch stock data from Alpha Vantage
export async function fetchStockData(symbol: string): Promise<AssetData> {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`

  try {
    const data = await fetchWithErrorHandling(url)
    const quote = data["Global Quote"]

    if (!quote || !quote["01. symbol"]) {
      throw new Error(`No data found for symbol: ${symbol}`)
    }

    return {
      symbol: quote["01. symbol"],
      name: symbol, // Alpha Vantage doesn't return name in this endpoint
      type: "Stock",
      currentPrice: Number.parseFloat(quote["05. price"]),
      previousClose: Number.parseFloat(quote["08. previous close"]),
      change: Number.parseFloat(quote["09. change"]),
      changePercent: Number.parseFloat(quote["10. change percent"].replace("%", "")),
      volume: Number.parseInt(quote["06. volume"]),
      lastUpdated: new Date(),
    }
  } catch (error) {
    console.error(`Error fetching stock data for ${symbol}:`, error)
    throw error
  }
}

// Fetch cryptocurrency data from CoinGecko
export async function fetchCryptoData(id: string): Promise<AssetData> {
  const apiKey = process.env.COINGECKO_API_KEY
  const url = `https://api.coingecko.com/api/v3/coins/${id}?x_cg_api_key=${apiKey}`

  try {
    const data = await fetchWithErrorHandling(url)

    const currentPrice = data.market_data.current_price.usd
    const previousClose = currentPrice / (1 + data.market_data.price_change_percentage_24h / 100)

    return {
      symbol: data.symbol.toUpperCase(),
      name: data.name,
      type: "Cryptocurrency",
      currentPrice,
      previousClose,
      change: data.market_data.price_change_24h,
      changePercent: data.market_data.price_change_percentage_24h,
      volume: data.market_data.total_volume.usd,
      marketCap: data.market_data.market_cap.usd,
      lastUpdated: new Date(data.last_updated),
    }
  } catch (error) {
    console.error(`Error fetching crypto data for ${id}:`, error)
    throw error
  }
}

// Fetch market index data
export async function fetchIndexData(symbol: string): Promise<AssetData> {
  const apiKey = process.env.FINNHUB_API_KEY
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`

  try {
    const data = await fetchWithErrorHandling(url)

    return {
      symbol,
      name: getIndexName(symbol),
      type: "Index",
      currentPrice: data.c,
      previousClose: data.pc,
      change: data.c - data.pc,
      changePercent: ((data.c - data.pc) / data.pc) * 100,
      volume: data.v,
      lastUpdated: new Date(data.t * 1000),
    }
  } catch (error) {
    console.error(`Error fetching index data for ${symbol}:`, error)
    throw error
  }
}

// Helper function to get index names
function getIndexName(symbol: string): string {
  const indexNames: Record<string, string> = {
    "^GSPC": "S&P 500",
    "^DJI": "Dow Jones Industrial Average",
    "^IXIC": "NASDAQ Composite",
    "^RUT": "Russell 2000",
    "^VIX": "CBOE Volatility Index",
  }

  return indexNames[symbol] || symbol
}

// Generate AI prediction for an asset
export async function generatePrediction(symbol: string, timeframe: string): Promise<PredictionData> {
  // In a real implementation, this would call your ML model API
  // For now, we'll simulate a prediction

  const assetData = await fetchStockData(symbol)
  const currentPrice = assetData.currentPrice

  // Simulate different prediction ranges based on timeframe
  let predictedChange: number
  let confidence: number

  switch (timeframe) {
    case "1d":
      predictedChange = (Math.random() * 2 - 1) * 0.02 // -1% to +1%
      confidence = 70 + Math.random() * 20 // 70-90%
      break
    case "1w":
      predictedChange = (Math.random() * 4 - 1.5) * 0.02 // -3% to +5%
      confidence = 65 + Math.random() * 20 // 65-85%
      break
    case "1m":
      predictedChange = (Math.random() * 6 - 2) * 0.02 // -4% to +8%
      confidence = 60 + Math.random() * 25 // 60-85%
      break
    default: // 3m
      predictedChange = (Math.random() * 10 - 3) * 0.02 // -6% to +14%
      confidence = 55 + Math.random() * 25 // 55-80%
  }

  const predictedPrice = currentPrice * (1 + predictedChange)

  // Simulate factors that influenced the prediction
  const possibleFactors = [
    "Historical price patterns",
    "Trading volume analysis",
    "Market sentiment indicators",
    "Sector performance trends",
    "Technical indicators alignment",
    "Earnings forecast analysis",
    "Macroeconomic indicators",
    "Volatility patterns",
  ]

  // Randomly select 2-4 factors
  const factorCount = 2 + Math.floor(Math.random() * 3)
  const shuffledFactors = [...possibleFactors].sort(() => 0.5 - Math.random())
  const selectedFactors = shuffledFactors.slice(0, factorCount)

  return {
    assetSymbol: symbol,
    predictedPrice,
    timeframe,
    confidence,
    createdAt: new Date(),
    factors: selectedFactors,
  }
}

