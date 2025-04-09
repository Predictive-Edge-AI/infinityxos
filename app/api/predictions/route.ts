import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { getUserSession } from "@/lib/auth"

// Get predictions for assets
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get("symbol")
  const timeframe = searchParams.get("timeframe")
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  try {
    const supabase = createServerClient()

    let query = supabase
      .from("predictions")
      .select(`
        *,
        assets(symbol, name, type)
      `)
      .order("created_at", { ascending: false })
      .limit(limit)

    // Filter by symbol if provided
    if (symbol) {
      query = query.eq("asset_symbol", symbol)
    }

    // Filter by timeframe if provided
    if (timeframe) {
      query = query.eq("timeframe", timeframe)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching predictions:", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Format the response
    const formattedData = data.map((prediction) => ({
      id: prediction.id,
      assetSymbol: prediction.asset_symbol,
      assetName: prediction.assets?.name || prediction.asset_symbol,
      assetType: prediction.assets?.type || "Unknown",
      predictedPrice: prediction.predicted_price,
      timeframe: prediction.timeframe,
      confidence: prediction.confidence,
      factors: prediction.factors || [],
      createdAt: prediction.created_at,
    }))

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error("Error in predictions API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Generate a new prediction
export async function POST(request: Request) {
  try {
    const session = await getUserSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createServerClient()
    const body = await request.json()

    // Validate required fields
    if (!body.symbol || !body.timeframe) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if asset exists
    const { data: asset, error: assetError } = await supabase
      .from("assets")
      .select("id")
      .eq("symbol", body.symbol)
      .single()

    if (assetError || !asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 })
    }

    // In a real implementation, this would call your ML model API
    // For now, we'll simulate a prediction
    const currentPrice = body.currentPrice || 100
    const predictedChange = (Math.random() * 10 - 3) * 0.01 // -3% to +7%
    const predictedPrice = currentPrice * (1 + predictedChange)
    const confidence = 60 + Math.random() * 30 // 60-90%

    // Simulate factors that influenced the prediction
    const possibleFactors = [
      "Historical price patterns",
      "Trading volume analysis",
      "Market sentiment indicators",
      "Sector performance trends",
      "Technical indicators alignment",
      "Earnings forecast analysis",
    ]

    // Randomly select 2-4 factors
    const factorCount = 2 + Math.floor(Math.random() * 3)
    const shuffledFactors = [...possibleFactors].sort(() => 0.5 - Math.random())
    const selectedFactors = shuffledFactors.slice(0, factorCount)

    // Store prediction in database
    const { data, error } = await supabase
      .from("predictions")
      .insert({
        asset_symbol: body.symbol,
        predicted_price: predictedPrice,
        timeframe: body.timeframe,
        confidence,
        factors: selectedFactors,
        created_by: session.user.id,
      })
      .select()

    if (error) {
      console.error("Error storing prediction:", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      id: data[0].id,
      assetSymbol: data[0].asset_symbol,
      predictedPrice,
      timeframe: data[0].timeframe,
      confidence,
      factors: selectedFactors,
      createdAt: data[0].created_at,
    })
  } catch (error) {
    console.error("Error in predictions API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

