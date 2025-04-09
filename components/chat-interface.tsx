"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, User, RefreshCw } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  compact?: boolean
}

export function ChatInterface({ compact = false }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI financial assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
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

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Based on current market trends, I'd recommend diversifying your portfolio with a mix of growth stocks and value investments.",
        "The recent volatility in tech stocks suggests a potential correction. Consider hedging your positions with some defensive assets.",
        "Looking at historical data, similar market conditions have led to opportunities in emerging markets. Would you like me to analyze specific regions?",
        "I've analyzed your portfolio, and it appears to be well-balanced. However, you might want to consider increasing your exposure to renewable energy sectors.",
        "The current economic indicators suggest a potential rise in inflation. Treasury Inflation-Protected Securities (TIPS) might be worth considering.",
      ]

      const aiMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full">
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
                <p className="text-sm text-white">{message.content}</p>
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
      </div>
      <div className={`border-t border-white/10 p-2 ${compact ? "mt-auto" : ""}`}>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about markets or investments..."
            className="bg-white/5 border-white/10 focus-visible:ring-[#00DC82] text-white"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-[#00DC82] to-[#36e4da] text-black hover:opacity-90"
          >
            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}

