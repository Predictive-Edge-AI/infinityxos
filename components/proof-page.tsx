"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Minus,
  DollarSign,
  Brain,
  Briefcase,
  User,
  Sparkles,
  Clock3,
} from "lucide-react"
import { NasdaqFeed } from "@/components/nasdaq-feed"
import { BitcoinFeed } from "@/components/bitcoin-feed"
import { NQFeed } from "@/components/nq-feed"

// Types
interface Prediction {
  id: string
  timestamp: Date
  asset: {
    symbol: string
    name: string
    type: string
    color: string
  }
  predictedDirection: "up" | "down" | "neutral"
  predictedChange: number
  actualDirection: "up" | "down" | "neutral"
  actualChange: number
  confidence: number
  timeframe: string
  holdTime: string
  isCorrect: boolean
  startPrice: number
  predictedPrice: number
  actualPrice: number
  profit: number
  accuracyScore: number
  growthPercentage: number
}

interface AccuracyBucket {
  range: string
  count: number
  color: string
}

interface StrategyPortfolio {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  performance: number
  risk: "Low" | "Medium" | "High"
  assets: string[]
  color: string
  avgReturn: string
  indexOutperformance?: string
  accuracyRate?: number
  predictionSpread?: number
}

// Provide both a named export and a default export
export function ProofPage() {
  const [activeTab, setActiveTab] = useState("portfolio")
  const [isLoading, setIsLoading] = useState(false)
  const [predictionTimeframe, setPredictionTimeframe] = useState("30d")
  const [showDetailedHistory, setShowDetailedHistory] = useState(false)
  const [timeRangeFilter, setTimeRangeFilter] = useState([30]) // Default 30 days
  const [selectedHoldTime, setSelectedHoldTime] = useState("all")
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null)
  const [showStrategyDetails, setShowStrategyDetails] = useState(false)
  const [sortOption, setSortOption] = useState("highest-to-lowest") // Add sort option state
  const [searchQuery, setSearchQuery] = useState("") // Add search query state

  // Strategy portfolios data - matching all strategies from portfolio and paper trading pages
  const strategyPortfolios: StrategyPortfolio[] = [
    {
      id: "ai-prophet",
      name: "AI Prophet Strategy",
      description:
        "Our flagship strategy designed to analyze and outperform market indices by leveraging advanced AI prediction models and pattern recognition.",
      icon: <Brain className="h-6 w-6" />,
      performance: 18.7,
      risk: "Medium",
      assets: ["NVDA", "AAPL", "MSFT", "AMZN", "TSLA"],
      color: "#00DC82",
      avgReturn: "18.7%",
      indexOutperformance: "+10.2%",
      accuracyRate: 87.5,
      predictionSpread: 4.2,
    },
    {
      id: "human",
      name: "Human Strategy",
      description: "Uses conventional human trading variables and techniques without AI-powered predictions.",
      icon: <User className="h-6 w-6" />,
      performance: 7.2,
      risk: "Low",
      assets: ["AAPL", "JNJ", "PG", "KO", "VZ"],
      color: "#ffffff",
      avgReturn: "7.2%",
      indexOutperformance: "-1.3%",
      accuracyRate: 62.8,
      predictionSpread: 8.7,
    },
    {
      id: "buffett",
      name: "Warren Buffett AI",
      description: "Combines Buffett's value investing principles with AI prediction for long-term growth.",
      icon: <Briefcase className="h-6 w-6" />,
      performance: 9.8,
      risk: "Low",
      assets: ["BRK.B", "KO", "AAPL", "BAC", "AXP"],
      color: "#f59e0b",
      avgReturn: "9.8%",
      indexOutperformance: "+1.3%",
      accuracyRate: 71.4,
      predictionSpread: 6.5,
    },
    {
      id: "infinity",
      name: "Infinity AI Strategy",
      description:
        "Self-analyzing, self-correcting AI system that continuously evolves to identify exceptional growth opportunities.",
      icon: <Sparkles className="h-6 w-6" />,
      performance: 22.3,
      risk: "High",
      assets: ["NVDA", "TSLA", "PLTR", "COIN", "AMD"],
      color: "#3b82f6",
      avgReturn: "22.3%",
      indexOutperformance: "+13.8%",
      accuracyRate: 89.2,
      predictionSpread: 3.8,
    },
    {
      id: "day-trading",
      name: "Day Trading AI",
      description: "Identifies short-term trading opportunities with rapid entry and exit points for quick profits.",
      icon: <Clock3 className="h-6 w-6" />,
      performance: 25.6,
      risk: "High",
      assets: ["TSLA", "NVDA", "AMZN", "AAPL", "MSFT"],
      color: "#ef4444",
      avgReturn: "25.6%",
      indexOutperformance: "+17.1%",
      accuracyRate: 83.6,
      predictionSpread: 5.2,
    },
  ]

  // Standard hold time options
  const holdTimeOptions = [
    { value: "15min", label: "15 Minutes" },
    { value: "30min", label: "30 Minutes" },
    { value: "1h", label: "1 Hour" },
    { value: "3h", label: "3 Hours" },
    { value: "6h", label: "6 Hours" },
    { value: "12h", label: "12 Hours" },
    { value: "24h", label: "24 Hours" },
    { value: "1w", label: "1 Week" },
    { value: "1m", label: "1 Month" },
  ]

  // Mock data for prediction history
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [accuracyBuckets, setAccuracyBuckets] = useState<AccuracyBucket[]>([])
  const [filteredPredictions, setFilteredPredictions] = useState<Prediction[]>([])

  // Calculate overall accuracy
  const correctPredictions = predictions.filter((p) => p.isCorrect).length
  const failedPredictions = predictions.length - correctPredictions
  const accuracyRate = predictions.length > 0 ? (correctPredictions / predictions.length) * 100 : 0

  // Calculate advanced accuracy metrics
  const averageAccuracyScore =
    predictions.length > 0 ? (predictions.reduce((sum, p) => sum + p.accuracyScore, 0) / predictions.length) * 100 : 0

  // Calculate predictions within 5% spread
  const predictionsWithinSpread = predictions.filter(
    (p) => Math.abs(((p.actualPrice - p.predictedPrice) / p.predictedPrice) * 100) <= 5,
  ).length
  const spreadAccuracyRate = predictions.length > 0 ? (predictionsWithinSpread / predictions.length) * 100 : 0

  // Calculate average profit percentage
  const averageProfitPercentage =
    predictions.length > 0 ? predictions.reduce((sum, p) => sum + p.growthPercentage, 0) / predictions.length : 0

  // Generate mock data on component mount
  useEffect(() => {
    generateMockData()
  }, [])

  // Filter predictions based on selected hold time
  useEffect(() => {
    if (selectedHoldTime === "all") {
      setFilteredPredictions(predictions)
    } else {
      setFilteredPredictions(predictions.filter((p) => p.holdTime === selectedHoldTime))
    }
  }, [selectedHoldTime, predictions])

  // Function to calculate accuracy score using the advanced method
  const calculateAccuracyScore = (
    startPrice: number,
    predictedPrice: number,
    actualPrice: number,
    confidence: number,
  ) => {
    // Step 1: Directionality Score
    const predictedDirection = predictedPrice > startPrice
    const actualDirection = actualPrice > startPrice
    const directionScore = predictedDirection === actualDirection ? 1.0 : 0.0

    // Step 2: Spread Proximity Score with 5% tolerance (changed from 4%)
    const toleranceBand = 0.05 * predictedPrice
    const withinBand = Math.abs(actualPrice - predictedPrice) <= toleranceBand
    let proximityScore = withinBand
      ? 1.0
      : Math.max(0, 1 - Math.min(1.0, Math.abs(actualPrice - predictedPrice) / toleranceBand))

    // Apply boost if direction is right but spread is missed
    if (directionScore === 1 && proximityScore < 0.5) {
      proximityScore = 0.5
    }

    // Step 3: Final Accuracy Metric with confidence scaling
    const confidenceWeight = confidence / 100

    return 0.5 * directionScore + 0.3 * proximityScore + 0.2 * confidenceWeight
  }

  // Function to generate mock data
  const generateMockData = () => {
    setIsLoading(true)

    // Generate prediction history
    const mockPredictions: Prediction[] = []
    const assets = [
      { symbol: "AAPL", name: "Apple Inc.", type: "Stock", color: "#A2AAAD" },
      { symbol: "MSFT", name: "Microsoft Corp.", type: "Stock", color: "#00A4EF" },
      { symbol: "NVDA", name: "NVIDIA Corp.", type: "Stock", color: "#76B900" },
      { symbol: "TSLA", name: "Tesla Inc.", type: "Stock", color: "#E31937" },
      { symbol: "AMZN", name: "Amazon.com Inc.", type: "Stock", color: "#FF9900" },
      { symbol: "BTC", name: "Bitcoin", type: "Cryptocurrency", color: "#F7931A" },
      { symbol: "ETH", name: "Ethereum", type: "Cryptocurrency", color: "#627EEA" },
      { symbol: "XAU", name: "Gold", type: "Commodity", color: "#FFD700" },
      { symbol: "EUR/USD", name: "Euro/US Dollar", type: "Forex", color: "#0052B4" },
    ]

    const timeframes = ["15min", "30min", "1h", "3h", "6h", "12h", "24h", "1w", "1m"]

    // Generate 50 days of predictions
    for (let i = 0; i < 50; i++) {
      const asset = assets[Math.floor(Math.random() * assets.length)]
      const holdTime = timeframes[Math.floor(Math.random() * timeframes.length)]

      // Generate realistic prices
      const startPrice =
        asset.symbol === "BTC"
          ? 30000 + Math.random() * 10000
          : asset.symbol === "ETH"
            ? 1800 + Math.random() * 400
            : 10 + Math.random() * 190

      const predictedDirection = Math.random() > 0.3 ? "up" : Math.random() > 0.5 ? "down" : "neutral"
      const predictedChangePercent =
        predictedDirection === "up"
          ? Math.random() * 10 + 1
          : predictedDirection === "down"
            ? -(Math.random() * 10 + 1)
            : Math.random() * 2 - 1

      const predictedPrice = startPrice * (1 + predictedChangePercent / 100)

      // Simulate 80% accuracy
      const isCorrect = Math.random() > 0.2
      const actualDirection = isCorrect
        ? predictedDirection
        : predictedDirection === "up"
          ? Math.random() > 0.5
            ? "down"
            : "neutral"
          : predictedDirection === "down"
            ? Math.random() > 0.5
              ? "up"
              : "neutral"
            : Math.random() > 0.5
              ? "up"
              : "down"

      const actualChangePercent = isCorrect
        ? predictedChangePercent + (Math.random() * 2 - 1)
        : actualDirection === "up"
          ? Math.random() * 10 + 1
          : actualDirection === "down"
            ? -(Math.random() * 10 + 1)
            : Math.random() * 2 - 1

      const actualPrice = startPrice * (1 + actualChangePercent / 100)

      // Calculate profit (simplified)
      const profit =
        actualDirection === "up" ? actualPrice - startPrice : actualDirection === "down" ? startPrice - actualPrice : 0

      // Calculate growth percentage
      const growthPercentage = ((actualPrice - startPrice) / startPrice) * 100

      const confidence = Math.floor(Math.random() * 20 + 75) // 75-95% confidence

      // Calculate accuracy score using our advanced method
      const accuracyScore = calculateAccuracyScore(startPrice, predictedPrice, actualPrice, confidence)

      const daysAgo = Math.floor(Math.random() * 30)
      const timestamp = new Date()
      timestamp.setDate(timestamp.getDate() - daysAgo)

      // Add hours and minutes for more precise timestamp
      timestamp.setHours(Math.floor(Math.random() * 24))
      timestamp.setMinutes(Math.floor(Math.random() * 60))

      mockPredictions.push({
        id: `pred-${i}`,
        timestamp,
        asset,
        predictedDirection,
        predictedChange: predictedChangePercent,
        actualDirection,
        actualChange: actualChangePercent,
        confidence,
        timeframe: timeframes[Math.floor(Math.random() * timeframes.length)],
        holdTime,
        isCorrect,
        startPrice,
        predictedPrice,
        actualPrice,
        profit,
        accuracyScore,
        growthPercentage,
      })
    }

    // Sort by timestamp (newest first)
    mockPredictions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    setPredictions(mockPredictions)
    setFilteredPredictions(mockPredictions)

    // Generate accuracy buckets for pie chart
    const buckets: AccuracyBucket[] = [
      { range: "90-100%", count: 0, color: "#00DC82" },
      { range: "80-90%", count: 0, color: "#36e4da" },
      { range: "70-80%", count: 0, color: "#60a5fa" },
      { range: "60-70%", count: 0, color: "#818cf8" },
      { range: "Below 60%", count: 0, color: "#c084fc" },
    ]

    mockPredictions.forEach((pred) => {
      const score = pred.accuracyScore * 100
      if (score >= 90) buckets[0].count++
      else if (score >= 80) buckets[1].count++
      else if (score >= 70) buckets[2].count++
      else if (score >= 60) buckets[3].count++
      else buckets[4].count++
    })

    setAccuracyBuckets(buckets)
    setIsLoading(false)
  }

  // Render trend indicator
  const renderTrendIndicator = (direction: "up" | "down" | "neutral", percent: number) => {
    if (direction === "up") {
      return (
        <div className="flex items-center gap-1 text-green-400">
          <ArrowUpRight className="h-4 w-4" />
          <span>+{Math.abs(percent).toFixed(2)}%</span>
        </div>
      )
    } else if (direction === "down") {
      return (
        <div className="flex items-center gap-1 text-red-400">
          <ArrowDownRight className="h-4 w-4" />
          <span>-{Math.abs(percent).toFixed(2)}%</span>
        </div>
      )
    } else {
      return (
        <div className="flex items-center gap-1 text-yellow-400">
          <Minus className="h-4 w-4" />
          <span>{Math.abs(percent).toFixed(2)}%</span>
        </div>
      )
    }
  }

  // Format hold time for display
  const formatHoldTime = (holdTime: string) => {
    const option = holdTimeOptions.find((opt) => opt.value === holdTime)
    return option ? option.label : holdTime
  }

  // Get accuracy color based on score
  const getAccuracyColor = (score: number) => {
    if (score >= 70) return "text-[#00DC82]"
    if (score >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  // Get accuracy progress bar color based on score
  const getAccuracyProgressColor = (score: number) => {
    if (score >= 70) return "from-[#00DC82] to-[#36e4da]"
    if (score >= 60) return "from-yellow-500 to-yellow-400"
    return "from-red-500 to-red-400"
  }

  // Sort the predictions based on the selected option
  const sortedPredictions = [...filteredPredictions].sort((a, b) => {
    switch (sortOption) {
      case "highest-to-lowest":
        return b.growthPercentage - a.growthPercentage
      case "lowest-to-highest":
        return a.growthPercentage - b.growthPercentage
      case "top-confidence-assets":
        return b.confidence - a.confidence
      case "highest-accuracy-assets":
        return b.accuracyScore - a.accuracyScore
      case "highest-growth-assets":
        return b.growthPercentage - a.growthPercentage
      default:
        return 0
    }
  })

  return (
    <div className="space-y-6">
      {/* Prediction Proof Heading */}
      <h2 className="text-2xl font-bold text-white tracking-tight">Prediction Proof</h2>

      {/* Accuracy Metrics Box */}
      <Card className="bg-black/60 border-white/10 p-4">
        <CardContent className="flex flex-wrap justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <span className="text-sm text-white">Correct: {correctPredictions}</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-400" />
              <span className="text-sm text-white">Incorrect: {failedPredictions}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#00DC82]" />
              <span className="text-sm text-white">Accuracy: {accuracyRate.toFixed(1)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-[#00DC82]" />
              <span className="text-sm text-white">Avg. Profit: +{averageProfitPercentage.toFixed(2)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Replicated Portfolio Section */}
      <section>
        <h3 className="text-xl font-bold text-white tracking-tight">Portfolio</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <NasdaqFeed />
          <BitcoinFeed />
          <NQFeed />
        </div>
      </section>

      {/* Comparative Performance Graph */}
      <section>
        <h2 className="text-2xl font-bold text-white tracking-tight">Strategy Performance Comparison</h2>
        <p className="text-sm text-white/70 mt-1">Comparing AI strategies against S&P 500 index and human trading</p>
        <Card className="bg-black/60 border-white/10 backdrop-blur-sm mt-4">
          <CardHeader>
            <CardTitle className="text-white text-xl">Strategy Performance Comparison</CardTitle>
            <CardDescription className="text-white/70">
              Comparing AI strategies against S&P 500 index and human trading
            </CardDescription>
          </CardHeader>
          <CardContent className="h-96 relative">
            <svg width="100%" height="100%" viewBox="0 0 800 350" preserveAspectRatio="none">
              {/* Background grid lines */}
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <line
                  key={`grid-${i}`}
                  x1="40"
                  y1={i * 50}
                  x2="780"
                  y2={i * 50}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1"
                />
              ))}

              {/* Y-axis labels */}
              <text x="30" y="10" fill="#ffffff" fontSize="12" textAnchor="end">
                +30%
              </text>
              <text x="30" y="60" fill="#ffffff" fontSize="12" textAnchor="end">
                +25%
              </text>
              <text x="30" y="110" fill="#ffffff" fontSize="12" textAnchor="end">
                +20%
              </text>
              <text x="30" y="160" fill="#ffffff" fontSize="12" textAnchor="end">
                +15%
              </text>
              <text x="30" y="210" fill="#ffffff" fontSize="12" textAnchor="end">
                +10%
              </text>
              <text x="30" y="260" fill="#ffffff" fontSize="12" textAnchor="end">
                +5%
              </text>
              <text x="30" y="310" fill="#ffffff" fontSize="12" textAnchor="end">
                0%
              </text>

              {/* S&P 500 line - YELLOW */}
              <path
                d="M40,260 C100,250 160,240 220,230 C280,240 340,230 400,220 C460,210 520,220 580,210 C640,200 700,210 760,200"
                fill="none"
                stroke="#EAB308"
                strokeWidth="3"
              />

              {/* Human Trading line - WHITE */}
              <path
                d="M40,260 C100,255 160,250 220,245 C280,240 340,235 400,230 C460,225 520,230 580,225 C640,220 700,215 760,210"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="3"
              />

              {/* Warren Buffett AI line - AMBER */}
              <path
                d="M40,260 C100,250 160,240 220,230 C280,220 340,210 400,200 C460,190 520,200 580,190 C640,180 700,170 760,160"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="3"
              />

              {/* AI Prophet line - GREEN */}
              <path
                d="M40,260 C100,240 160,220 220,200 C280,180 340,160 400,140 C460,120 520,140 580,120 C640,100 700,80 760,60"
                fill="none"
                stroke="#00DC82"
                strokeWidth="3"
              />

              {/* Infinity AI line - TURQUOISE */}
              <path
                d="M40,260 C100,230 160,200 220,170 C280,140 340,110 400,80 C460,50 520,80 580,50 C640,20 700,50 760,20"
                fill="none"
                stroke="#36E4DA"
                strokeWidth="3"
              />

              {/* Asset Focus line - PURPLE */}
              <path
                d="M40,260 C100,235 160,210 220,185 C280,160 340,135 400,110 C460,85 520,110 580,85 C640,60 700,85 760,60"
                fill="none"
                stroke="#A855F7"
                strokeWidth="3"
              />

              {/* Day Trading line - RED */}
              <path
                d="M40,260 C100,220 160,180 220,140 C280,180 340,100 400,60 C460,100 520,140 580,80 C640,20 700,60 760,20"
                fill="none"
                stroke="#EF4444"
                strokeWidth="3"
              />

              {/* X-axis labels */}
              <text x="40" y="340" fill="#ffffff" fontSize="12" textAnchor="middle">
                Jan
              </text>
              <text x="220" y="340" fill="#ffffff" fontSize="12" textAnchor="middle">
                Mar
              </text>
              <text x="400" y="340" fill="#ffffff" fontSize="12" textAnchor="middle">
                May
              </text>
              <text x="580" y="340" fill="#ffffff" fontSize="12" textAnchor="middle">
                Jul
              </text>
              <text x="760" y="340" fill="#ffffff" fontSize="12" textAnchor="middle">
                Sep
              </text>
            </svg>

            {/* Legend */}
            <div className="absolute top-4 right-4 bg-black/60 p-3 rounded-lg border border-white/10">
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#EAB308]"></div>
                  <span className="text-xs text-white">S&P 500 (8.5%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-white"></div>
                  <span className="text-xs text-white">Human Trading (7.2%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#F59E0B]"></div>
                  <span className="text-xs text-white">Warren Buffett AI (9.8%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#00DC82]"></div>
                  <span className="text-xs text-white">AI Prophet (18.7%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#36E4DA]"></div>
                  <span className="text-xs text-white">Infinity AI (22.3%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#A855F7]"></div>
                  <span className="text-xs text-white">Asset Focus (19.8%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#EF4444]"></div>
                  <span className="text-xs text-white">Day Trading AI (25.6%)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Strategy Portfolios Section */}
      <section>
        <h2 className="text-2xl font-bold text-white tracking-tight">AI Trading Strategies</h2>
        <p className="text-sm text-white/70 mt-1">Explore our AI-powered trading strategies</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          {strategyPortfolios.map((strategy) => (
            <Card
              key={strategy.id}
              className={`bg-black/40 border-white/10 p-4 cursor-pointer transition-all duration-200 hover:bg-black/60 ${selectedStrategy === strategy.id ? "ring-2 ring-[#00DC82]" : ""}`}
              onClick={() => setSelectedStrategy(strategy.id)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#00DC82] to-[#36e4da] flex items-center justify-center">
                  {strategy.icon}
                </div>
                <div>
                  <h4 className="text-base font-medium text-white">{strategy.name}</h4>
                  <p className="text-xs text-white/70">{strategy.description}</p>
                </div>
              </div>
              <div className="flex justify-between text-xs">
                <Badge variant="outline" className="bg-[#00DC82]/20 text-[#00DC82] border-0">
                  Recommended
                </Badge>
                <span className="text-white/50">Avg. Return: {strategy.avgReturn}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Prediction History Section */}
      <section>
        <h2 className="text-2xl font-bold text-white tracking-tight">Prediction History</h2>
        <p className="text-sm text-white/70 mt-1">
          Detailed breakdown of predictions with timestamps, prices, and accuracy
        </p>
        <Card className="bg-black/60 border-white/10 backdrop-blur-sm mt-4">
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black/40 border-y border-white/10">
                  <tr>
                    <th className="text-left p-4 text-xs font-medium text-white/70">Timestamp</th>
                    <th className="text-left p-4 text-xs font-medium text-white/70">Asset</th>
                    <th className="text-center p-4 text-xs font-medium text-white/70">Hold Time</th>
                    <th className="text-right p-4 text-xs font-medium text-white/70">Buy Price</th>
                    <th className="text-right p-4 text-xs font-medium text-white/70">Prediction Price</th>
                    <th className="text-center p-4 text-xs font-medium text-white/70">Confidence</th>
                    <th className="text-right p-4 text-xs font-medium text-white/70">Final Price</th>
                    <th className="text-right p-4 text-xs font-medium text-white/70">Growth %</th>
                    <th className="text-right p-4 text-xs font-medium text-white/70">Profit %</th>
                    <th className="text-right p-4 text-xs font-medium text-white/70">Accuracy %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {/* Mock data for demonstration */}
                  {[...Array(10)].map((_, index) => (
                    <tr key={index} className="hover:bg-white/5">
                      <td className="p-4 text-left text-sm text-white/70">{new Date().toLocaleDateString()}</td>
                      <td className="p-4 text-left text-sm text-white">AAPL</td>
                      <td className="p-4 text-center text-sm text-white">1 Day</td>
                      <td className="p-4 text-right text-sm text-white">$150.00</td>
                      <td className="p-4 text-right text-sm text-white">$165.00</td>
                      <td className="p-4 text-center">
                        <ArrowUpRight className="h-4 w-4 text-green-400" />
                      </td>
                      <td className="p-4 text-right text-sm text-white">$170.00</td>
                      <td className="p-4 text-right text-sm text-green-400">+13.33%</td>
                      <td className="p-4 text-right text-sm text-green-400">+10.00%</td>
                      <td className="p-4 text-right text-sm text-green-400">95%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

export default ProofPage

