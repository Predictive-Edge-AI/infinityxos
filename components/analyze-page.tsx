"use client"

import { useState, useRef, useEffect } from "react"
import type React from "react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ArrowUpRight,
  ArrowDownRight,
  Search,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  Brain,
  Lightbulb,
  Layers,
  Zap,
  Briefcase,
  Target,
  LineChart,
  Bot,
  User,
  Send,
  ChevronRight,
  Shield,
  BarChart,
  TrendingDown,
} from "lucide-react"
import { usePrediction } from "@/hooks/use-prediction"
import { useStrategySuggestion } from "@/hooks/use-strategy-suggestion"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface AssetSuggestion {
  symbol: string
  name: string
  type: string
}

interface AssetAnalysis {
  symbol: string
  name: string
  type: string
  logo?: string
  currentPrice: number
  previousClose: number
  change: number
  changePercent: number
  marketCap: string
  volume: string
  peRatio?: string
  dividend?: string
  yearRange: string
  description: string
  prediction: {
    shortTerm: {
      price: number
      change: number
      timeframe: string
      confidence: number
    }
    mediumTerm: {
      price: number
      change: number
      timeframe: string
      confidence: number
    }
    longTerm: {
      price: number
      change: number
      confidence: number
    }
  }
  conventionalAnalysis: {
    summary: string
    strengths: string[]
    weaknesses: string[]
    opportunities: string[]
    threats: string[]
    technicalIndicators: {
      name: string
      value: string
      signal: "buy" | "sell" | "neutral"
    }[]
  }
  unconventionalAnalysis: {
    summary: string
    insiderStrategies: string[]
    alternativeViewpoints: string[]
    hiddenOpportunities: string[]
    contraryIndicators: string[]
  }
  alternativeAssets: {
    symbol: string
    name: string
    type: string
    reason: string
  }[]
}

interface AnalysisTool {
  id: string
  name: string
  description: string
  icon: React.ElementType
  color: string
}

interface RiskCategory {
  id: string
  name: string
  description: string
  icon: React.ElementType
  color: string
}

interface AssetRecommendation {
  symbol: string
  name: string
  type: string
  currentPrice: number
  predictedChange: number
  confidence: number
}

export default function AnalyzePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchSuggestions, setSearchSuggestions] = useState<AssetSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Are you ready to get the deepest insight to the financial market world? Press YES to begin",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<AssetAnalysis | null>(null)
  const [analysisType, setAnalysisType] = useState<"fast" | "deep" | null>(null)
  const [showRiskButtons, setShowRiskButtons] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const [activeTab, setActiveTab] = useState("overview")
  const [timeframe, setTimeframe] = useState("1m") // 1d, 1w, 1m, 3m, 1y
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false)

  const [showAssetRecommendations, setShowAssetRecommendations] = useState(false)
  const [recommendedAssets, setRecommendedAssets] = useState<AssetRecommendation[]>([])
  const [selectedRiskCategory, setSelectedRiskCategory] = useState<string | null>(null)
  const [showNoRecommendationsPrompt, setShowNoRecommendationsPrompt] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle click outside suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Risk categories
  const riskCategories: RiskCategory[] = [
    {
      id: "low-risk",
      name: "Low Risk",
      description: "Conservative investments with stable returns and minimal volatility",
      icon: Shield,
      color: "from-green-500 to-green-600",
    },
    {
      id: "mid-risk",
      name: "Medium Risk",
      description: "Balanced investments with moderate growth potential and acceptable volatility",
      icon: BarChart,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "high-risk",
      name: "High Risk",
      description: "Aggressive investments with significant growth potential and higher volatility",
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "day-trading",
      name: "Day Trading",
      description: "Short-term opportunities for active traders with high liquidity and volatility",
      icon: TrendingDown,
      color: "from-red-500 to-red-600",
    },
  ]

  // Analysis tools
  const analysisTools: AnalysisTool[] = [
    {
      id: "deep-research",
      name: "AI Deep Research",
      description: "Comprehensive AI-powered research with fundamental and technical analysis",
      icon: Brain,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "sentiment-analysis",
      name: "Market Sentiment",
      description: "Analyze news, social media, and market sentiment for trading signals",
      icon: Lightbulb,
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "pattern-recognition",
      name: "Pattern Recognition",
      description: "Identify chart patterns and technical setups with AI precision",
      icon: Layers,
      color: "from-orange-500 to-orange-600",
    },
    {
      id: "trading-strategies",
      name: "Trading Strategies",
      description: "AI-generated trading strategies based on market conditions",
      icon: Zap,
      color: "from-amber-500 to-amber-600",
    },
    {
      id: "portfolio-optimization",
      name: "Portfolio Optimization",
      description: "Optimize your portfolio for maximum returns with minimal risk",
      icon: Briefcase,
      color: "from-green-500 to-green-600",
    },
    {
      id: "price-targets",
      name: "Price Targets",
      description: "AI-generated price targets with probability distributions",
      icon: Target,
      color: "from-red-500 to-red-600",
    },
  ]

  const { getPrediction, predictionData, isLoading: isPredictionLoading } = usePrediction()
  const { suggestStrategies, strategies: suggestedStrategies, isLoading: isStrategyLoading } = useStrategySuggestion()

  // Handle YES button click
  const handleYesButtonClick = () => {
    const aiMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content:
        "Excellent, now... would you like a recommendation on several financial assets that are showing potential for huge growth, or do you have something specific you want to analyze?",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, aiMessage])
    setShowRiskButtons(true)
  }

  // Handle risk category selection
  const handleRiskCategorySelect = (categoryId: string) => {
    const category = riskCategories.find((cat) => cat.id === categoryId)
    if (!category) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `Show me ${category.name} opportunities`,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // Get recommendations based on risk category
    const recommendations = getRecommendationsByRisk(categoryId)

    // Simulate API call delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `Based on my analysis, here are the top ${category.name.toLowerCase()} risk opportunities with strong growth potential and high confidence ratings. Click on any asset to see detailed analysis:`,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)

      // Show asset recommendation buttons
      setShowAssetRecommendations(true)
      setRecommendedAssets(recommendations)
      setSelectedRiskCategory(categoryId)
    }, 1000)
  }

  // Add this function to get recommendations based on risk level:
  const getRecommendationsByRisk = (riskLevel: string): AssetRecommendation[] => {
    switch (riskLevel) {
      case "low-risk":
        return [
          {
            symbol: "MSFT",
            name: "Microsoft Corporation",
            type: "Stock",
            currentPrice: 417.88,
            predictedChange: 5.0,
            confidence: 82,
          },
          {
            symbol: "AAPL",
            name: "Apple Inc.",
            type: "Stock",
            currentPrice: 187.32,
            predictedChange: 5.0,
            confidence: 78,
          },
          {
            symbol: "JNJ",
            name: "Johnson & Johnson",
            type: "Stock",
            currentPrice: 152.64,
            predictedChange: 3.5,
            confidence: 75,
          },
          {
            symbol: "PG",
            name: "Procter & Gamble",
            type: "Stock",
            currentPrice: 165.28,
            predictedChange: 3.2,
            confidence: 77,
          },
        ]
      case "mid-risk":
        return [
          {
            symbol: "NVDA",
            name: "NVIDIA Corporation",
            type: "Stock",
            currentPrice: 879.25,
            predictedChange: 8.5,
            confidence: 74,
          },
          {
            symbol: "AMD",
            name: "Advanced Micro Devices",
            type: "Stock",
            currentPrice: 156.82,
            predictedChange: 7.8,
            confidence: 72,
          },
          {
            symbol: "AMZN",
            name: "Amazon.com Inc.",
            type: "Stock",
            currentPrice: 178.25,
            predictedChange: 6.5,
            confidence: 73,
          },
          {
            symbol: "GOOGL",
            name: "Alphabet Inc.",
            type: "Stock",
            currentPrice: 164.5,
            predictedChange: 5.8,
            confidence: 71,
          },
        ]
      case "high-risk":
        return [
          {
            symbol: "TSLA",
            name: "Tesla, Inc.",
            type: "Stock",
            currentPrice: 215.35,
            predictedChange: 12.5,
            confidence: 68,
          },
          {
            symbol: "BTC",
            name: "Bitcoin",
            type: "Cryptocurrency",
            currentPrice: 63250.75,
            predictedChange: 15.0,
            confidence: 65,
          },
          {
            symbol: "ETH",
            name: "Ethereum",
            type: "Cryptocurrency",
            currentPrice: 3425.5,
            predictedChange: 18.0,
            confidence: 64,
          },
          {
            symbol: "PLTR",
            name: "Palantir Technologies",
            type: "Stock",
            currentPrice: 22.45,
            predictedChange: 14.0,
            confidence: 62,
          },
        ]
      case "day-trading":
        return [
          {
            symbol: "SPY",
            name: "SPDR S&P 500 ETF",
            type: "ETF",
            currentPrice: 515.25,
            predictedChange: 0.8,
            confidence: 60,
          },
          {
            symbol: "QQQ",
            name: "Invesco QQQ Trust",
            type: "ETF",
            currentPrice: 430.15,
            predictedChange: 1.2,
            confidence: 58,
          },
          {
            symbol: "AAPL",
            name: "Apple Inc.",
            type: "Stock",
            currentPrice: 187.32,
            predictedChange: 1.5,
            confidence: 56,
          },
          {
            symbol: "AMD",
            name: "Advanced Micro Devices",
            type: "Stock",
            currentPrice: 156.82,
            predictedChange: 2.2,
            confidence: 55,
          },
        ]
      default:
        return []
    }
  }

  // Add this function to handle when a user selects a specific asset recommendation:
  const handleAssetSelect = (symbol: string) => {
    // Clear recommendations
    setShowAssetRecommendations(false)

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `Analyze ${symbol}`,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Use the existing handleSearch function to analyze the selected asset
    handleSearch(symbol)
  }

  // Add this function to handle when a user doesn't like any recommendations:
  const handleNoRecommendations = () => {
    setShowAssetRecommendations(false)
    setShowNoRecommendationsPrompt(true)

    const aiMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content:
        "No problem. Would you like me to suggest assets in a different risk category, or would you prefer to search for a specific asset you have in mind?",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, aiMessage])
  }

  // Mock search suggestions
  const handleSearchInput = (query: string) => {
    setSearchQuery(query)

    if (query.length < 2) {
      setSearchSuggestions([])
      setShowSuggestions(false)
      return
    }

    // Simulate API call for suggestions
    const mockSuggestions: AssetSuggestion[] = [
      { symbol: "AAPL", name: "Apple Inc.", type: "Stock" },
      { symbol: "AMZN", name: "Amazon.com Inc.", type: "Stock" },
      { symbol: "MSFT", name: "Microsoft Corporation", type: "Stock" },
      { symbol: "GOOGL", name: "Alphabet Inc.", type: "Stock" },
      { symbol: "TSLA", name: "Tesla, Inc.", type: "Stock" },
      { symbol: "BTC", name: "Bitcoin", type: "Cryptocurrency" },
      { symbol: "ETH", name: "Ethereum", type: "Cryptocurrency" },
      { symbol: "SPY", name: "SPDR S&P 500 ETF Trust", type: "ETF" },
      { symbol: "QQQ", name: "Invesco QQQ Trust", type: "ETF" },
      { symbol: "GLD", name: "SPDR Gold Shares", type: "ETF" },
    ]

    const filteredSuggestions = mockSuggestions
      .filter(
        (suggestion) =>
          suggestion.symbol.toLowerCase().includes(query.toLowerCase()) ||
          suggestion.name.toLowerCase().includes(query.toLowerCase()),
      )
      .slice(0, 5)

    setSearchSuggestions(filteredSuggestions)
    setShowSuggestions(filteredSuggestions.length > 0)
  }

  // Mock search function
  const handleSearch = (query: string = searchQuery) => {
    if (!query) return

    setIsSearching(true)
    setShowSuggestions(false)

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `Analyze ${query}`,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate API call delay
    setTimeout(async () => {
      // Check for misspellings and suggest corrections
      if (query.toLowerCase() === "appl" || query.toLowerCase() === "apple") {
        const correctionMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: "I noticed you might be looking for Apple Inc. (AAPL). I'll analyze that for you.",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, correctionMessage])
        query = "AAPL"
      } else if (query.toLowerCase() === "amazn" || query.toLowerCase() === "amazon") {
        const correctionMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: "I noticed you might be looking for Amazon.com Inc. (AMZN). I'll analyze that for you.",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, correctionMessage])
        query = "AMZN"
      } else if (query.toLowerCase() === "btc" || query.toLowerCase() === "bitcoin") {
        query = "BTC"
      }

      // Simulate API call to get prediction
      const prediction = await getPrediction(query, "default-strategy")

      if (prediction) {
        // Add assistant response
        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: `I've analyzed ${query} for you. The predicted price is $${prediction.predictedPrice.toFixed(2)} with ${prediction.confidence.toFixed(2)}% confidence.`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
      } else {
        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: `I couldn't retrieve a prediction for ${query} at this time.`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
      }

      setIsSearching(false)
      setSearchQuery("")
    }, 1500)
  }

  // Handle message submission
  const handleSendMessage = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Process user message
    setTimeout(() => {
      let responseContent = ""

      // Check for "yes" response to initial message
      if (messages.length === 1 && input.toLowerCase().includes("yes")) {
        handleYesButtonClick()
        setIsLoading(false)
        return
      }

      // Check for response to "none of these interest me"
      if (showNoRecommendationsPrompt) {
        setShowNoRecommendationsPrompt(false)

        if (
          input.toLowerCase().includes("different") ||
          input.toLowerCase().includes("other") ||
          input.toLowerCase().includes("another") ||
          input.toLowerCase().includes("category") ||
          input.toLowerCase().includes("risk")
        ) {
          // User wants different risk category
          const aiMessage: Message = {
            id: Date.now().toString(),
            role: "assistant",
            content: "Please select a different risk category that interests you:",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, aiMessage])
          setShowRiskButtons(true)
        } else if (
          input.toLowerCase().includes("search") ||
          input.toLowerCase().includes("specific") ||
          input.toLowerCase().includes("look") ||
          input.toLowerCase().includes("find")
        ) {
          // User wants to search for a specific asset
          const aiMessage: Message = {
            id: Date.now().toString(),
            role: "assistant",
            content: "What specific asset would you like me to analyze? Please provide a symbol or name.",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, aiMessage])
        } else {
          // Default response
          const aiMessage: Message = {
            id: Date.now().toString(),
            role: "assistant",
            content:
              "I'd be happy to help you find the right investment opportunities. Would you like to explore a different risk category, or would you prefer to analyze a specific asset you have in mind?",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, aiMessage])
        }

        setIsLoading(false)
        return
      }

      // Handle new asset search in conversation
      else if (
        input.toLowerCase().includes("analyze") ||
        input.toLowerCase().includes("check") ||
        input.toLowerCase().includes("look up") ||
        input.toLowerCase().includes("research")
      ) {
        const words = input.split(/\s+/)
        const potentialSymbols = words.filter(
          (word) => word.length >= 2 && word.length <= 5 && word.toUpperCase() === word,
        )

        if (potentialSymbols.length > 0) {
          handleSearch(potentialSymbols[0])
          return
        } else {
          // Try to extract asset name
          const assetMatches = input.match(/(?:analyze|check|look up|research)\s+([a-zA-Z\s]+)/)
          if (assetMatches && assetMatches[1]) {
            handleSearch(assetMatches[1].trim())
            return
          } else {
            responseContent =
              "I'd be happy to analyze an asset for you. Please specify which stock, cryptocurrency, or other financial asset you'd like me to research."
          }
        }
      }
      // Default responses
      else {
        const responses = [
          "I'm here to help with financial analysis. You can ask me to analyze any stock, cryptocurrency, or other financial asset by name or symbol.",
          "Would you like me to analyze a specific financial asset? Just let me know the name or symbol.",
          "I can provide detailed analysis of stocks, cryptocurrencies, ETFs, and other financial assets. What would you like to research today?",
          "My specialty is providing both conventional and unconventional analysis of financial assets. Which asset are you interested in?",
          "I can help you make informed investment decisions with AI-powered analysis. What asset would you like to explore?",
        ]
        responseContent = responses[Math.floor(Math.random() * responses.length)]
      }

      const aiMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Handle tool selection
  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId)
    setIsGeneratingInsights(true)

    // Simulate AI processing
    setTimeout(() => {
      setIsGeneratingInsights(false)
    }, 2000)
  }

  // Handle analysis button click
  const handleAnalysisButtonClick = (type: "fast" | "deep") => {
    if (!selectedAsset) return

    setAnalysisType(type)

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `I'd like a ${type} analysis of ${selectedAsset.symbol}`,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    setTimeout(() => {
      let responseContent = ""

      if (type === "fast") {
        responseContent = `Here's a fast analysis of ${selectedAsset.symbol}:\n\n${selectedAsset.conventionalAnalysis.summary}\n\nThe current price is $${selectedAsset.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}, and our AI model predicts a potential price of $${selectedAsset.prediction.shortTerm.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${selectedAsset.prediction.shortTerm.change > 0 ? "+" : ""}${selectedAsset.prediction.shortTerm.change.toFixed(2)}%) in the short term with ${selectedAsset.prediction.shortTerm.confidence}% confidence.`
      } else {
        responseContent = `I'll provide a comprehensive deep analysis of ${selectedAsset.symbol}. Let's start with the conventional analysis and then explore unique insights and strategies.\n\n${selectedAsset.conventionalAnalysis.summary}\n\nWould you like me to continue with the strengths and weaknesses analysis, or would you prefer to see our unconventional insights and insider strategies?`
      }

      const aiMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

  // Render trend indicator
  const renderTrendIndicator = (trend: "up" | "down" | "neutral", change: number) => {
    if (trend === "up") {
      return (
        <div className="flex items-center gap-1 text-green-400">
          <ArrowUpRight className="h-4 w-4" />
          <span>+{Math.abs(change).toFixed(2)}%</span>
        </div>
      )
    } else if (trend === "down") {
      return (
        <div className="flex items-center gap-1 text-red-400">
          <ArrowDownRight className="h-4 w-4" />
          <span>-{Math.abs(change).toFixed(2)}%</span>
        </div>
      )
    } else {
      return (
        <div className="flex items-center gap-1 text-yellow-400">
          <span className="h-4 w-4">—</span>
          <span>{Math.abs(change).toFixed(2)}%</span>
        </div>
      )
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="bg-black/60 border-white/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#00DC82] to-[#36e4da] flex items-center justify-center">
              <Brain className="h-5 w-5 text-black" />
            </div>
            <div>
              <CardTitle className="text-white">Infinity</CardTitle>
              <CardDescription className="text-white/70">AI-powered financial analysis and insights</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Chat Interface */}
        <Card className="bg-black/60 border-white/10 md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Financial Assistant</CardTitle>
              <div className="relative w-full max-w-md">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                <Input
                  placeholder="Search any financial asset (e.g., AAPL, Bitcoin)"
                  className="pl-8 bg-black/40 border-white/10 text-white"
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch()
                      setShowSuggestions(false)
                    }
                  }}
                />
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div
                    ref={suggestionsRef}
                    className="absolute z-10 w-full mt-1 bg-black/90 border border-white/10 rounded-md shadow-lg max-h-60 overflow-auto"
                  >
                    {searchSuggestions.map((suggestion) => (
                      <div
                        key={suggestion.symbol}
                        className="px-4 py-2 hover:bg-white/10 cursor-pointer flex items-center justify-between"
                        onClick={() => {
                          setSearchQuery(suggestion.symbol)
                          handleSearch(suggestion.symbol)
                          setShowSuggestions(false)
                        }}
                      >
                        <div>
                          <span className="text-white font-medium">{suggestion.symbol}</span>
                          <span className="text-white/70 ml-2">{suggestion.name}</span>
                        </div>
                        <Badge variant="outline" className="bg-black/40 text-white/70 border-white/10">
                          {suggestion.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col h-[500px]">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`flex gap-2 max-w-[80%] ${
                        message.role === "user"
                          ? "bg-[#00DC82]/20 rounded-tl-2xl rounded-tr-sm rounded-bl-2xl"
                          : "bg-white/10 rounded-tr-2xl rounded-tl-sm rounded-br-2xl"
                      } p-3`}
                    >
                      {message.role === "assistant" && (
                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#00DC82] to-[#36e4da] flex-shrink-0 flex items-center justify-center">
                          <Bot className="h-3 w-3 text-black" />
                        </div>
                      )}
                      <div className="space-y-1">
                        <p className="text-sm text-white whitespace-pre-line">{message.content}</p>
                        <p className="text-xs text-white/50">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      {message.role === "user" && (
                        <div className="h-6 w-6 rounded-full bg-white/20 flex-shrink-0 flex items-center justify-center">
                          <User className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex gap-2 max-w-[80%] bg-white/10 rounded-tr-2xl rounded-tl-sm rounded-br-2xl p-3">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#00DC82] to-[#36e4da] flex-shrink-0 flex items-center justify-center">
                        <Bot className="h-3 w-3 text-black" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 bg-[#00DC82] rounded-full animate-bounce"></div>
                          <div
                            className="h-2 w-2 bg-[#00DC82] rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="h-2 w-2 bg-[#00DC82] rounded-full animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
                {messages.length === 1 && (
                  <div className="flex justify-center mt-4">
                    <Button
                      onClick={handleYesButtonClick}
                      className="bg-gradient-to-r from-[#00DC82] to-[#36e4da] text-black hover:opacity-90 px-8"
                    >
                      YES
                    </Button>
                  </div>
                )}
                {showRiskButtons && (
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {riskCategories.map((category) => (
                      <Button
                        key={category.id}
                        onClick={() => handleRiskCategorySelect(category.id)}
                        className={`bg-gradient-to-r ${category.color} text-white hover:opacity-90`}
                      >
                        <category.icon className="h-4 w-4 mr-2" />
                        <span>{category.name}</span>
                      </Button>
                    ))}
                  </div>
                )}
                {showAssetRecommendations && (
                  <div className="space-y-3 mt-4">
                    <div className="grid grid-cols-2 gap-2">
                      {recommendedAssets.map((asset) => (
                        <Button
                          key={asset.symbol}
                          onClick={() => handleAssetSelect(asset.symbol)}
                          className="bg-black/40 border border-white/10 hover:border-[#00DC82]/30 text-white hover:bg-black/50 flex flex-col items-start p-3 h-auto"
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-bold">{asset.symbol}</span>
                            <div className="flex items-center text-green-400 text-xs">
                              <ArrowUpRight className="h-3 w-3 mr-1" />
                              <span>+{asset.predictedChange.toFixed(1)}%</span>
                            </div>
                          </div>
                          <span className="text-xs text-white/70 text-left">{asset.name}</span>
                          <div className="flex items-center justify-between w-full mt-1">
                            <span className="text-xs text-white/50">${asset.currentPrice.toLocaleString()}</span>
                            <span className="text-xs text-[#00DC82]">{asset.confidence}% confidence</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                    <Button
                      onClick={handleNoRecommendations}
                      className="w-full bg-black/30 border border-white/10 text-white/70 hover:text-white hover:bg-black/40 mt-2"
                    >
                      None of these interest me
                    </Button>
                  </div>
                )}
              </div>
              <div className="border-t border-white/10 p-2">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about any financial asset..."
                    className="bg-white/5 border-white/10 focus-visible:ring-[#00DC82] text-white"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !input.trim()}
                    className="bg-gradient-to-r from-[#00DC82] to-[#36e4da] text-black hover:opacity-90"
                  >
                    {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Options */}
        <div className="space-y-4">
          {/* Analysis Buttons */}
          <Card className="bg-black/60 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Analysis Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:opacity-90 flex items-center justify-between"
                onClick={() => selectedAsset && handleAnalysisButtonClick("fast")}
                disabled={!selectedAsset || isLoading}
              >
                <div className="flex items-center">
                  <Zap className="h-4 w-4 mr-2" />
                  <span>Fast Analysis</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Button
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:opacity-90 flex items-center justify-between"
                onClick={() => selectedAsset && handleAnalysisButtonClick("deep")}
                disabled={!selectedAsset || isLoading}
              >
                <div className="flex items-center">
                  <Brain className="h-4 w-4 mr-2" />
                  <span>Deep Analysis</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Button
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:opacity-90 flex items-center justify-between"
                disabled={!selectedAsset || isLoading}
              >
                <div className="flex items-center">
                  <LineChart className="h-4 w-4 mr-2" />
                  <span>Technical Analysis</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Button
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white hover:opacity-90 flex items-center justify-between"
                disabled={!selectedAsset || isLoading}
              >
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <span>Price Predictions</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Button
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white hover:opacity-90 flex items-center justify-between"
                disabled={!selectedAsset || isLoading}
              >
                <div className="flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  <span>Trading Strategies</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Asset Info Card (if selected) */}
          {selectedAsset && (
            <Card className="bg-black/60 border-white/10">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">{selectedAsset.symbol}</CardTitle>
                  <Badge
                    variant="outline"
                    className={`${selectedAsset.change >= 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"} border-0`}
                  >
                    {selectedAsset.change >= 0 ? "+" : ""}
                    {selectedAsset.changePercent.toFixed(2)}%
                  </Badge>
                </div>
                <CardDescription className="text-white/70">
                  {selectedAsset.name} • {selectedAsset.type}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Current Price</span>
                  <span className="text-white font-bold">
                    $
                    {selectedAsset.currentPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Market Cap</span>
                  <span className="text-white">{selectedAsset.marketCap}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Volume</span>
                  <span className="text-white">{selectedAsset.volume}</span>
                </div>
                {selectedAsset.peRatio && (
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">P/E Ratio</span>
                    <span className="text-white">{selectedAsset.peRatio}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-white/70">52-Week Range</span>
                  <span className="text-white text-sm">{selectedAsset.yearRange}</span>
                </div>
                <div className="pt-2">
                  <p className="text-xs text-white/70">{selectedAsset.description.substring(0, 150)}...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Disclaimer */}
          <Card className="bg-black/40 border-white/10">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                <p className="text-xs text-white/70">
                  Financial analysis provided for informational purposes only. Not financial advice. Always conduct your
                  own research before making investment decisions.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

