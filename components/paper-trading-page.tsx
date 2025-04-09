"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  TrendingUp,
  Brain,
  User,
  Briefcase,
  Target,
  Clock,
  Sparkles,
  Wallet,
  RotateCcw,
  Plus,
  Minus,
  DollarSign,
} from "lucide-react"

export function PaperTradingPage() {
  const [activeStrategy, setActiveStrategy] = useState<string | null>(null)
  const [paperBalance, setPaperBalance] = useState(5000)
  const [riskLevel, setRiskLevel] = useState(50)
  const [isAiManaged, setIsAiManaged] = useState(true)
  const [minBudget, setMinBudget] = useState(1000)
  const [maxBudget, setMaxBudget] = useState(4000)
  const [portfolioAssets, setPortfolioAssets] = useState<PaperAsset[]>([])
  const [isGeneratingPortfolio, setIsGeneratingPortfolio] = useState(false)

  // Mock assets for the paper trading portfolio
  const mockAssets: PaperAsset[] = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      purchasePrice: 187.32,
      currentPrice: 192.53,
      shares: 5,
      value: 962.65,
      change: 5.21,
      percentChange: 2.78,
      predictedPrice: 203.45,
      predictedGrowth: 5.67,
      confidence: 89,
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corporation",
      purchasePrice: 824.15,
      currentPrice: 856.3,
      shares: 1,
      value: 856.3,
      change: 32.15,
      percentChange: 3.9,
      predictedPrice: 912.3,
      predictedGrowth: 6.54,
      confidence: 91,
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      purchasePrice: 43250.75,
      currentPrice: 44750.25,
      shares: 0.05,
      value: 2237.51,
      change: 1499.5,
      percentChange: 3.47,
      predictedPrice: 47250.5,
      predictedGrowth: 5.59,
      confidence: 82,
    },
  ]

  const resetPaperTrading = () => {
    setPaperBalance(5000)
    setPortfolioAssets([])
  }

  const generateAiPortfolio = () => {
    setIsGeneratingPortfolio(true)

    // Simulate API call delay
    setTimeout(() => {
      setPortfolioAssets(mockAssets)
      setPaperBalance(5000 - mockAssets.reduce((acc, asset) => acc + asset.purchasePrice * asset.shares, 0))
      setIsGeneratingPortfolio(false)
      setActiveStrategy("ai-prophet")
    }, 2000)
  }

  const calculatePortfolioValue = () => {
    return portfolioAssets.reduce((acc, asset) => acc + asset.currentPrice * asset.shares, 0)
  }

  const calculatePortfolioGrowth = () => {
    const initialValue = portfolioAssets.reduce((acc, asset) => acc + asset.purchasePrice * asset.shares, 0)
    const currentValue = calculatePortfolioValue()
    return {
      value: currentValue - initialValue,
      percent: initialValue > 0 ? ((currentValue - initialValue) / initialValue) * 100 : 0,
    }
  }

  const calculatePredictedGrowth = () => {
    const currentValue = calculatePortfolioValue()
    const predictedValue = portfolioAssets.reduce((acc, asset) => acc + asset.predictedPrice * asset.shares, 0)
    return {
      value: predictedValue - currentValue,
      percent: currentValue > 0 ? ((predictedValue - currentValue) / currentValue) * 100 : 0,
    }
  }

  const portfolioGrowth = calculatePortfolioGrowth()
  const predictedGrowth = calculatePredictedGrowth()
  const totalValue = paperBalance + calculatePortfolioValue()

  return (
    <div className="space-y-4">
      {/* Paper Trading Header */}
      <Card className="bg-black/60 border-white/10">
        <CardHeader className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-white text-xl">Paper Trading</CardTitle>
              <CardDescription className="text-white/70">
                Practice trading with virtual funds and AI-powered strategies
              </CardDescription>
            </div>
            <div className="flex flex-col xs:flex-row gap-2">
              <Button
                variant="outline"
                className="border-white/10 text-white hover:bg-white/10 hover:text-white"
                onClick={resetPaperTrading}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Account
              </Button>
              <Button className="bg-gradient-to-r from-[#00DC82] to-[#36e4da] text-black hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Add Asset
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-black/40 border-white/10 p-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#00DC82]/20 to-[#36e4da]/20 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-[#00DC82]" />
                </div>
                <div>
                  <p className="text-sm text-white/70">Available Balance</p>
                  <p className="text-lg font-bold text-white">
                    ${paperBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-black/40 border-white/10 p-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#00DC82]/20 to-[#36e4da]/20 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-[#00DC82]" />
                </div>
                <div>
                  <p className="text-sm text-white/70">Portfolio Value</p>
                  <p className="text-lg font-bold text-white">
                    $
                    {calculatePortfolioValue().toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-black/40 border-white/10 p-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#00DC82]/20 to-[#36e4da]/20 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-[#00DC82]" />
                </div>
                <div>
                  <p className="text-sm text-white/70">Total Value</p>
                  <p className="text-lg font-bold text-white">
                    ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-black/40 border-white/10 p-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500/20 to-green-400/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-white/70">Portfolio Growth</p>
                  <div className="flex items-center gap-1">
                    <p className="text-lg font-bold text-green-400">
                      {portfolioGrowth.percent >= 0 ? "+" : ""}
                      {portfolioGrowth.percent.toFixed(2)}%
                    </p>
                    <span className="text-xs text-white/50">
                      ($
                      {Math.abs(portfolioGrowth.value).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      )
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* AI Strategy Selection */}
      <Card className="bg-black/60 border-white/10">
        <CardHeader className="p-4">
          <CardTitle className="text-white">AI Prophet Strategies</CardTitle>
          <CardDescription className="text-white/70">
            Select an AI-powered trading strategy to optimize your paper trading portfolio
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Management Type Toggle */}
              <Card className="bg-black/40 border-white/10 p-4">
                <div className="flex flex-col space-y-3">
                  <h3 className="text-base font-medium text-white">Portfolio Management</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center ${isAiManaged ? "bg-[#00DC82]/20" : "bg-white/10"}`}
                      >
                        <Brain className={`h-4 w-4 ${isAiManaged ? "text-[#00DC82]" : "text-white/70"}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isAiManaged ? "text-white" : "text-white/70"}`}>
                          AI Managed
                        </p>
                        <p className="text-xs text-white/50">Automated portfolio optimization</p>
                      </div>
                    </div>
                    <Switch checked={isAiManaged} onCheckedChange={setIsAiManaged} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center ${!isAiManaged ? "bg-white/20" : "bg-white/10"}`}
                      >
                        <User className={`h-4 w-4 ${!isAiManaged ? "text-white" : "text-white/70"}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${!isAiManaged ? "text-white" : "text-white/70"}`}>
                          Human Managed
                        </p>
                        <p className="text-xs text-white/50">Manual trading decisions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Risk Level Slider */}
              <Card className="bg-black/40 border-white/10 p-4">
                <div className="flex flex-col space-y-3">
                  <h3 className="text-base font-medium text-white">Risk Preference</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white/70">Risk Level</p>
                    <Badge
                      variant="outline"
                      className={`
                        ${
                          riskLevel < 33
                            ? "bg-blue-500/20 text-blue-400"
                            : riskLevel < 66
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-red-500/20 text-red-400"
                        } 
                        border-0
                      `}
                    >
                      {riskLevel < 33 ? "Low Risk" : riskLevel < 66 ? "Medium Risk" : "High Risk"}
                    </Badge>
                  </div>
                  <Slider
                    value={[riskLevel]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setRiskLevel(value[0])}
                    disabled={!isAiManaged}
                  />
                  <div className="flex justify-between text-xs text-white/50">
                    <span>Conservative</span>
                    <span>Balanced</span>
                    <span>Aggressive</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Budget Range */}
            <Card className="bg-black/40 border-white/10 p-4">
              <div className="flex flex-col space-y-3">
                <h3 className="text-base font-medium text-white">Investment Budget</h3>
                <div className="flex justify-between">
                  <p className="text-sm text-white/70">Budget Range</p>
                  <p className="text-sm text-white">
                    ${minBudget.toLocaleString()} - ${maxBudget.toLocaleString()}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min-budget" className="text-white/70">
                      Minimum ($)
                    </Label>
                    <Input
                      id="min-budget"
                      type="number"
                      value={minBudget}
                      onChange={(e) => setMinBudget(Number(e.target.value))}
                      min={0}
                      max={paperBalance}
                      className="bg-white/5 border-white/10 text-white"
                      disabled={!isAiManaged}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-budget" className="text-white/70">
                      Maximum ($)
                    </Label>
                    <Input
                      id="max-budget"
                      type="number"
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(Number(e.target.value))}
                      min={minBudget}
                      max={paperBalance}
                      className="bg-white/5 border-white/10 text-white"
                      disabled={!isAiManaged}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Strategy Selection */}
            <div className="space-y-3">
              <h3 className="text-base font-medium text-white">Select Strategy</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* AI Prophet Strategy */}
                <Card
                  className={`bg-black/40 border-white/10 p-4 cursor-pointer transition-all duration-200 hover:bg-black/60 ${activeStrategy === "ai-prophet" ? "ring-2 ring-[#00DC82]" : ""}`}
                  onClick={() => setActiveStrategy("ai-prophet")}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#00DC82] to-[#36e4da] flex items-center justify-center">
                      <Brain className="h-5 w-5 text-black" />
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-white">AI Prophet Strategy</h4>
                      <p className="text-xs text-white/70">Fully automated AI portfolio</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/70 mb-3">
                    Our flagship strategy uses advanced AI to select assets with the highest confidence, growth
                    potential, and accuracy.
                  </p>
                  <div className="flex justify-between text-xs">
                    <Badge variant="outline" className="bg-[#00DC82]/20 text-[#00DC82] border-0">
                      Recommended
                    </Badge>
                    <span className="text-white/50">Avg. Return: 12.4%</span>
                  </div>
                </Card>

                {/* Human Strategy */}
                <Card
                  className={`bg-black/40 border-white/10 p-4 cursor-pointer transition-all duration-200 hover:bg-black/60 ${activeStrategy === "human" ? "ring-2 ring-[#00DC82]" : ""}`}
                  onClick={() => setActiveStrategy("human")}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-white">Human Strategy</h4>
                      <p className="text-xs text-white/70">Traditional trading approach</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/70 mb-3">
                    Uses conventional human trading variables and techniques without AI-powered predictions.
                  </p>
                  <div className="flex justify-between text-xs">
                    <Badge variant="outline" className="bg-white/10 text-white/70 border-0">
                      Conservative
                    </Badge>
                    <span className="text-white/50">Avg. Return: 7.2%</span>
                  </div>
                </Card>

                {/* Warren Buffett Strategy */}
                <Card
                  className={`bg-black/40 border-white/10 p-4 cursor-pointer transition-all duration-200 hover:bg-black/60 ${activeStrategy === "buffett" ? "ring-2 ring-[#00DC82]" : ""}`}
                  onClick={() => setActiveStrategy("buffett")}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-400/20 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-white">Warren Buffett AI</h4>
                      <p className="text-xs text-white/70">Value investing with AI</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/70 mb-3">
                    Combines Buffett's value investing principles with AI prediction for long-term growth.
                  </p>
                  <div className="flex justify-between text-xs">
                    <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-0">
                      Long-term
                    </Badge>
                    <span className="text-white/50">Avg. Return: 9.8%</span>
                  </div>
                </Card>

                {/* Infinity AI Strategy */}
                <Card
                  className={`bg-black/40 border-white/10 p-4 cursor-pointer transition-all duration-200 hover:bg-black/60 ${activeStrategy === "infinity" ? "ring-2 ring-[#00DC82]" : ""}`}
                  onClick={() => setActiveStrategy("infinity")}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-white">Infinity AI Strategy</h4>
                      <p className="text-xs text-white/70">Maximum growth potential</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/70 mb-3">
                    Focuses on assets with exceptional growth potential and continuously monitors for optimal
                    performance.
                  </p>
                  <div className="flex justify-between text-xs">
                    <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-0">
                      Aggressive
                    </Badge>
                    <span className="text-white/50">Avg. Return: 15.7%</span>
                  </div>
                </Card>

                {/* Day Trading Strategy */}
                <Card
                  className={`bg-black/40 border-white/10 p-4 cursor-pointer transition-all duration-200 hover:bg-black/60 ${activeStrategy === "day-trading" ? "ring-2 ring-[#00DC82]" : ""}`}
                  onClick={() => setActiveStrategy("day-trading")}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-500/20 to-orange-400/20 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-white">Day Trading AI</h4>
                      <p className="text-xs text-white/70">Short-term opportunities</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/70 mb-3">
                    Identifies short-term trading opportunities with rapid entry and exit points for quick profits.
                  </p>
                  <div className="flex justify-between text-xs">
                    <Badge variant="outline" className="bg-red-500/20 text-red-400 border-0">
                      High Risk
                    </Badge>
                    <span className="text-white/50">Avg. Return: 18.3%</span>
                  </div>
                </Card>

                {/* Asset Focus Strategy */}
                <Card
                  className={`bg-black/40 border-white/10 p-4 cursor-pointer transition-all duration-200 hover:bg-black/60 ${activeStrategy === "asset-focus" ? "ring-2 ring-[#00DC82]" : ""}`}
                  onClick={() => setActiveStrategy("asset-focus")}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-400/20 flex items-center justify-center">
                      <Target className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-white">Asset Focus Strategy</h4>
                      <p className="text-xs text-white/70">Concentrated portfolio (max 3)</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/70 mb-3">
                    Concentrates investment in up to 3 high-potential assets for focused growth and simplified
                    management.
                  </p>
                  <div className="flex justify-between text-xs">
                    <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-0">
                      Focused
                    </Badge>
                    <span className="text-white/50">Avg. Return: 14.2%</span>
                  </div>
                </Card>
              </div>
            </div>

            {/* Generate Portfolio Button */}
            <div className="flex justify-center mt-6">
              <Button
                className="bg-gradient-to-r from-[#00DC82] to-[#36e4da] text-black hover:opacity-90 px-8 py-6 text-base"
                disabled={!activeStrategy || isGeneratingPortfolio || !isAiManaged}
                onClick={generateAiPortfolio}
              >
                {isGeneratingPortfolio ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Generating AI Portfolio...
                  </>
                ) : (
                  <>
                    <Brain className="h-5 w-5 mr-2" />
                    Generate AI Portfolio
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Assets */}
      {portfolioAssets.length > 0 && (
        <Card className="bg-black/60 border-white/10">
          <CardHeader className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-white">Paper Trading Portfolio</CardTitle>
                <CardDescription className="text-white/70">Your virtual trading assets and performance</CardDescription>
              </div>
              <Badge variant="outline" className="bg-[#00DC82]/20 text-[#00DC82] border-0 px-3 py-1">
                <Brain className="h-3 w-3 mr-1" />
                AI Prophet Strategy
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black/40 border-y border-white/10">
                  <tr>
                    <th className="text-left p-4 text-xs font-medium text-white/70">Asset</th>
                    <th className="text-right p-4 text-xs font-medium text-white/70">Shares</th>
                    <th className="text-right p-4 text-xs font-medium text-white/70">Purchase Price</th>
                    <th className="text-right p-4 text-xs font-medium text-white/70">Current Price</th>
                    <th className="text-right p-4 text-xs font-medium text-white/70">Value</th>
                    <th className="text-right p-4 text-xs font-medium text-white/70">Change</th>
                    <th className="text-right p-4 text-xs font-medium text-white/70">Predicted</th>
                    <th className="text-right p-4 text-xs font-medium text-white/70">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {portfolioAssets.map((asset) => (
                    <tr key={asset.symbol} className="hover:bg-white/5">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center border border-white/20">
                            <span className="text-xs font-bold text-white">{asset.symbol}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{asset.name}</p>
                            <div className="flex items-center gap-1">
                              <div
                                className={`h-1.5 w-1.5 rounded-full ${asset.percentChange >= 0 ? "bg-green-400" : "bg-red-400"}`}
                              ></div>
                              <p className="text-xs text-white/60">Confidence: {asset.confidence}%</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right text-sm text-white">{asset.shares}</td>
                      <td className="p-4 text-right text-sm text-white">
                        $
                        {asset.purchasePrice.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="p-4 text-right text-sm text-white">
                        $
                        {asset.currentPrice.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="p-4 text-right text-sm text-white">
                        ${asset.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {asset.percentChange >= 0 ? (
                            <ArrowUpRight className="h-3 w-3 text-green-400" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 text-red-400" />
                          )}
                          <span className={`text-sm ${asset.percentChange >= 0 ? "text-green-400" : "text-red-400"}`}>
                            {asset.percentChange >= 0 ? "+" : ""}
                            {asset.percentChange.toFixed(2)}%
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <ArrowUpRight className="h-3 w-3 text-[#36e4da]" />
                          <span className="text-sm text-[#36e4da]">+{asset.predictedGrowth.toFixed(2)}%</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full hover:bg-white/10">
                            <Plus className="h-3 w-3 text-white" />
                            <span className="sr-only">Buy more</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full hover:bg-white/10">
                            <Minus className="h-3 w-3 text-white" />
                            <span className="sr-only">Sell</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Portfolio Summary */}
            <div className="p-4 border-t border-white/10 bg-black/40">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-white/70">Current Performance</p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center ${portfolioGrowth.percent >= 0 ? "bg-green-500/20" : "bg-red-500/20"}`}
                    >
                      {portfolioGrowth.percent >= 0 ? (
                        <ArrowUpRight className="h-4 w-4 text-green-400" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                    <div>
                      <p
                        className={`text-base font-bold ${portfolioGrowth.percent >= 0 ? "text-green-400" : "text-red-400"}`}
                      >
                        {portfolioGrowth.percent >= 0 ? "+" : ""}
                        {portfolioGrowth.percent.toFixed(2)}%
                      </p>
                      <p className="text-xs text-white/60">
                        $
                        {Math.abs(portfolioGrowth.value).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-white/70">Predicted Growth</p>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-[#36e4da]/20 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-[#36e4da]" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-[#36e4da]">+{predictedGrowth.percent.toFixed(2)}%</p>
                      <p className="text-xs text-white/60">
                        +$
                        {predictedGrowth.value.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-white/70">Average Confidence</p>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-[#00DC82]/20 flex items-center justify-center">
                      <Brain className="h-4 w-4 text-[#00DC82]" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-white">
                        {(
                          portfolioAssets.reduce((acc, asset) => acc + asset.confidence, 0) / portfolioAssets.length
                        ).toFixed(0)}
                        %
                      </p>
                      <p className="text-xs text-white/60">AI Confidence Score</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Types
interface PaperAsset {
  symbol: string
  name: string
  purchasePrice: number
  currentPrice: number
  shares: number
  value: number
  change: number
  percentChange: number
  predictedPrice: number
  predictedGrowth: number
  confidence: number
}

