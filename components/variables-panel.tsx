"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  PowerIcon as PoliticalCapital,
  CloudRain,
  TrendingUp,
  Newspaper,
  Users,
  AlertTriangle,
  Plus,
} from "lucide-react"

export function VariablesPanel() {
  const [variables, setVariables] = useState([
    { id: 1, name: "Political News", icon: PoliticalCapital, enabled: true, weight: 75, category: "News" },
    { id: 2, name: "Weather Events", icon: CloudRain, enabled: true, weight: 60, category: "Environmental" },
    { id: 3, name: "Market Sentiment", icon: TrendingUp, enabled: true, weight: 90, category: "Market" },
    { id: 4, name: "Social Sentiment", icon: Users, enabled: true, weight: 70, category: "Social" },
    { id: 5, name: "Critical News", icon: AlertTriangle, enabled: true, weight: 85, category: "News" },
    { id: 6, name: "Industry Reports", icon: Newspaper, enabled: false, weight: 65, category: "Market" },
  ])

  const handleToggleVariable = (id: number) => {
    setVariables(variables.map((v) => (v.id === id ? { ...v, enabled: !v.enabled } : v)))
  }

  const handleWeightChange = (id: number, value: number[]) => {
    setVariables(variables.map((v) => (v.id === id ? { ...v, weight: value[0] } : v)))
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {variables.map((variable) => (
          <Card key={variable.id} className="bg-black/40 border-white/10 p-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#00DC82]/20 to-[#36e4da]/20 flex items-center justify-center">
                  <variable.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-medium text-white">{variable.name}</h3>
                  <p className="text-xs text-white/60">{variable.category}</p>
                </div>
              </div>
              <Switch checked={variable.enabled} onCheckedChange={() => handleToggleVariable(variable.id)} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm text-white">Influence Weight</p>
                <p className="text-sm font-medium text-white">{variable.weight}%</p>
              </div>
              <Slider
                disabled={!variable.enabled}
                value={[variable.weight]}
                min={0}
                max={100}
                step={5}
                onValueChange={(value) => handleWeightChange(variable.id, value)}
                className={!variable.enabled ? "opacity-50" : ""}
              />
            </div>
          </Card>
        ))}

        <Card className="bg-black/20 border-white/5 border-dashed p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-black/30 transition-colors duration-200">
          <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
            <Plus className="h-5 w-5 text-white" />
          </div>
          <p className="text-sm text-white">Add New Variable</p>
        </Card>
      </div>

      <Card className="bg-black/40 border-white/10 p-4">
        <h3 className="text-base font-medium text-white mb-4">Variable Impact Analysis</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-sm text-white">Overall Market Influence</p>
            <p className="text-sm font-medium text-white">High</p>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#00DC82] to-[#36e4da]" style={{ width: "78%" }}></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-sm text-white/70">Top Variable</p>
              <p className="text-base font-bold text-white">Market Sentiment</p>
              <p className="text-xs text-[#00DC82]">90% Influence</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-sm text-white/70">Most Volatile</p>
              <p className="text-base font-bold text-white">Political News</p>
              <p className="text-xs text-amber-400">High Volatility</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-sm text-white/70">Recommended Focus</p>
              <p className="text-base font-bold text-white">Critical News</p>
              <p className="text-xs text-blue-400">85% Influence</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

