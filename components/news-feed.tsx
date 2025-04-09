"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"

interface NewsFeedProps {
  portfolioOnly?: boolean
}

export function NewsFeed({ portfolioOnly = false }: NewsFeedProps) {
  const [loading, setLoading] = useState(true)

  // Mock news data
  const allNewsItems = [
    {
      id: 1,
      title: "Fed signals potential rate cuts as inflation cools",
      source: "Financial Times",
      time: "2h ago",
      url: "#",
      sentiment: "positive",
      relatedAssets: ["NASDAQ", "NQ"],
    },
    {
      id: 2,
      title: "Tech stocks rally on strong earnings reports",
      source: "Wall Street Journal",
      time: "4h ago",
      url: "#",
      sentiment: "positive",
      relatedAssets: ["NASDAQ", "NQ"],
    },
    {
      id: 3,
      title: "Oil prices drop amid concerns over global demand",
      source: "Bloomberg",
      time: "6h ago",
      url: "#",
      sentiment: "negative",
      relatedAssets: ["OIL"],
    },
    {
      id: 4,
      title: "Bitcoin surges past $45,000 on ETF approval news",
      source: "CoinDesk",
      time: "8h ago",
      url: "#",
      sentiment: "positive",
      relatedAssets: ["BTC"],
    },
    {
      id: 5,
      title: "Supply chain disruptions continue to impact manufacturing sector",
      source: "Reuters",
      time: "10h ago",
      url: "#",
      sentiment: "negative",
      relatedAssets: ["NASDAQ"],
    },
    {
      id: 6,
      title: "Nasdaq futures point to higher open after tech earnings",
      source: "CNBC",
      time: "1h ago",
      url: "#",
      sentiment: "positive",
      relatedAssets: ["NASDAQ", "NQ"],
    },
    {
      id: 7,
      title: "Bitcoin mining difficulty reaches all-time high",
      source: "CryptoNews",
      time: "5h ago",
      url: "#",
      sentiment: "neutral",
      relatedAssets: ["BTC"],
    },
  ]

  // Filter news based on portfolio assets if needed
  const portfolioAssets = ["NASDAQ", "BTC", "NQ"]
  const newsItems = portfolioOnly
    ? allNewsItems.filter((item) => item.relatedAssets.some((asset) => portfolioAssets.includes(asset)))
    : allNewsItems

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">{portfolioOnly ? "Portfolio News" : "Market News"}</h2>
        <a href="#" className="text-xs text-[#00DC82] hover:underline flex items-center gap-1">
          View All <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-white/5 border-white/10 p-3 animate-pulse h-16"></Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {newsItems.map((item) => (
            <Card
              key={item.id}
              className="bg-black/40 border-white/10 p-3 hover:bg-white/5 transition-colors duration-200 cursor-pointer group"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="text-sm font-medium text-white group-hover:text-[#00DC82] transition-colors duration-200">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-white/60">{item.source}</span>
                    <span className="text-xs text-white/40">•</span>
                    <span className="text-xs text-white/60">{item.time}</span>
                    <div
                      className={`h-2 w-2 rounded-full ${
                        item.sentiment === "positive"
                          ? "bg-green-400"
                          : item.sentiment === "negative"
                            ? "bg-red-400"
                            : "bg-yellow-400"
                      }`}
                    ></div>
                    {item.relatedAssets.length > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-white/40">•</span>
                        <div className="flex items-center gap-1">
                          {item.relatedAssets.map((asset) => (
                            <span key={asset} className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white">
                              {asset}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-white/40 group-hover:text-[#00DC82] transition-colors duration-200" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

