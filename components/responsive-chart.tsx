"use client"

import { useState, useEffect } from "react"
import { useMobile } from "@/hooks/use-mobile"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from "recharts"

interface ChartProps {
  data: any[]
  dataKey: string
  stroke?: string
  gradient?: boolean
  height?: number
  xAxisDataKey?: string
  showGrid?: boolean
  showTooltip?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
}

export function ResponsiveChart({
  data,
  dataKey,
  stroke = "#00DC82",
  gradient = true,
  height = 300,
  xAxisDataKey = "name",
  showGrid = true,
  showTooltip = true,
  showXAxis = true,
  showYAxis = true,
}: ChartProps) {
  const isMobile = useMobile()
  const [chartHeight, setChartHeight] = useState(height)

  // Adjust chart height for mobile
  useEffect(() => {
    setChartHeight(isMobile ? Math.min(height, 200) : height)
  }, [isMobile, height])

  // Reduce data points for mobile to improve performance
  const optimizedData =
    isMobile && data.length > 20 ? data.filter((_, index) => index % Math.ceil(data.length / 20) === 0) : data

  return (
    <div className="w-full" style={{ height: chartHeight }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={optimizedData}
          margin={{
            top: 5,
            right: isMobile ? 5 : 20,
            left: isMobile ? 5 : 20,
            bottom: 5,
          }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />}
          {showXAxis && (
            <XAxis
              dataKey={xAxisDataKey}
              tick={{ fontSize: isMobile ? 10 : 12, fill: "rgba(255,255,255,0.7)" }}
              tickLine={{ stroke: "rgba(255,255,255,0.3)" }}
              axisLine={{ stroke: "rgba(255,255,255,0.3)" }}
              tickMargin={5}
              minTickGap={isMobile ? 20 : 10}
            />
          )}
          {showYAxis && (
            <YAxis
              tick={{ fontSize: isMobile ? 10 : 12, fill: "rgba(255,255,255,0.7)", textAnchor: "start" }}
              tickLine={{ stroke: "rgba(255,255,255,0.3)" }}
              axisLine={{ stroke: "rgba(255,255,255,0.3)" }}
              tickMargin={5}
              width={isMobile ? 30 : 40}
              orientation="right"
            />
          )}
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.8)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "4px",
                color: "white",
                fontSize: isMobile ? "10px" : "12px",
              }}
            />
          )}
          <defs>
            {gradient && (
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={stroke} stopOpacity={0.8} />
                <stop offset="95%" stopColor={stroke} stopOpacity={0} />
              </linearGradient>
            )}
            <linearGradient id="predictionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#36e4da" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#36e4da" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#00DC82"
            strokeWidth={2}
            dot={isMobile ? false : { r: 2, fill: stroke }}
            activeDot={{ r: isMobile ? 4 : 6 }}
            fill={gradient ? "url(#colorGradient)" : "none"}
          />
          <Line
            type="monotone"
            dataKey="prediction"
            stroke="#36e4da"
            strokeWidth={2}
            dot={isMobile ? false : { r: 2, fill: "#36e4da" }}
            activeDot={{ r: isMobile ? 4 : 6 }}
          />
          <Area type="monotone" dataKey="prediction" strokeWidth={0} fill="url(#predictionGradient)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

