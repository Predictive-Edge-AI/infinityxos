"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Search, Shield, Globe, Zap, RefreshCw, Save } from "lucide-react"

export function SettingsPanel() {
  const [instantPredictionsEnabled, setInstantPredictionsEnabled] = useState(true)
  const [scanFrequency, setScanFrequency] = useState(60) // minutes
  const [confidenceThreshold, setConfidenceThreshold] = useState(80)

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="bg-black/40 border border-white/10 mb-4">
        <TabsTrigger
          value="general"
          className="text-white data-[state=active]:bg-white/10 data-[state=active]:text-white"
        >
          General
        </TabsTrigger>
        <TabsTrigger
          value="notifications"
          className="text-white data-[state=active]:bg-white/10 data-[state=active]:text-white"
        >
          Notifications
        </TabsTrigger>
        <TabsTrigger
          value="predictions"
          className="text-white data-[state=active]:bg-white/10 data-[state=active]:text-white"
        >
          Predictions
        </TabsTrigger>
        <TabsTrigger
          value="account"
          className="text-white data-[state=active]:bg-white/10 data-[state=active]:text-white"
        >
          Account
        </TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-black/40 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Interface Settings</CardTitle>
              <CardDescription className="text-white/70">Customize your dashboard experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">Dark Mode</Label>
                  <p className="text-xs text-white/70">Use dark theme across the application</p>
                </div>
                <Switch checked={true} disabled />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">Compact View</Label>
                  <p className="text-xs text-white/70">Display more information in less space</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">Animations</Label>
                  <p className="text-xs text-white/70">Enable UI animations and transitions</p>
                </div>
                <Switch checked={true} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Data Settings</CardTitle>
              <CardDescription className="text-white/70">Configure data refresh and display options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">Auto-Refresh</Label>
                  <p className="text-xs text-white/70">Automatically refresh market data</p>
                </div>
                <Switch checked={true} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-white">Refresh Interval</Label>
                  <span className="text-sm text-white">60 seconds</span>
                </div>
                <Slider defaultValue={[60]} min={15} max={300} step={15} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">Show Extended Data</Label>
                  <p className="text-xs text-white/70">Display additional market metrics</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="notifications">
        <Card className="bg-black/40 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Notification Preferences</CardTitle>
            <CardDescription className="text-white/70">Configure how and when you receive alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-white" />
                <div className="space-y-0.5">
                  <Label className="text-white">Price Alerts</Label>
                  <p className="text-xs text-white/70">Notify when assets reach target prices</p>
                </div>
              </div>
              <Switch checked={true} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-white" />
                <div className="space-y-0.5">
                  <Label className="text-white">Prediction Alerts</Label>
                  <p className="text-xs text-white/70">Notify for new high-confidence predictions</p>
                </div>
              </div>
              <Switch checked={true} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-white" />
                <div className="space-y-0.5">
                  <Label className="text-white">News Alerts</Label>
                  <p className="text-xs text-white/70">Notify for breaking news affecting your portfolio</p>
                </div>
              </div>
              <Switch checked={true} />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Notification Method</Label>
              <Select defaultValue="app">
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/10">
                  <SelectItem value="app">In-App Only</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="both">Both App and Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="predictions">
        <Card className="bg-black/40 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Instant Predictions</CardTitle>
            <CardDescription className="text-white/70">
              Configure AI-powered market opportunity scanning
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-white" />
                <div className="space-y-0.5">
                  <Label className="text-white">Enable Instant Predictions</Label>
                  <p className="text-xs text-white/70">Automatically scan for market opportunities</p>
                </div>
              </div>
              <Switch checked={instantPredictionsEnabled} onCheckedChange={setInstantPredictionsEnabled} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-white">Scan Frequency (minutes)</Label>
                <span className="text-sm text-white">{scanFrequency} min</span>
              </div>
              <Slider
                value={[scanFrequency]}
                min={15}
                max={240}
                step={15}
                disabled={!instantPredictionsEnabled}
                onValueChange={(value) => setScanFrequency(value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-white">Confidence Threshold</Label>
                <span className="text-sm text-white">{confidenceThreshold}%</span>
              </div>
              <Slider
                value={[confidenceThreshold]}
                min={50}
                max={95}
                step={5}
                disabled={!instantPredictionsEnabled}
                onValueChange={(value) => setConfidenceThreshold(value[0])}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Data Sources</Label>
              <Select defaultValue="all" disabled={!instantPredictionsEnabled}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select sources" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/10">
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="news">News & Social Media</SelectItem>
                  <SelectItem value="technical">Technical Analysis</SelectItem>
                  <SelectItem value="fundamental">Fundamental Data</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-2">
              <Button
                className="w-full bg-gradient-to-r from-[#00DC82] to-[#36e4da] text-black hover:opacity-90"
                disabled={!instantPredictionsEnabled}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Run Manual Scan Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="account">
        <Card className="bg-black/40 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Account Settings</CardTitle>
            <CardDescription className="text-white/70">Manage your account information and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                Display Name
              </Label>
              <Input id="name" defaultValue="Demo User" className="bg-white/5 border-white/10 text-white" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email Address
              </Label>
              <Input id="email" defaultValue="demo@example.com" className="bg-white/5 border-white/10 text-white" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-white" />
                <div className="space-y-0.5">
                  <Label className="text-white">Two-Factor Authentication</Label>
                  <p className="text-xs text-white/70">Add an extra layer of security</p>
                </div>
              </div>
              <Switch />
            </div>

            <div className="pt-2 flex justify-end">
              <Button className="bg-gradient-to-r from-[#00DC82] to-[#36e4da] text-black hover:opacity-90">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

