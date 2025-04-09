import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { getUserSession } from "@/lib/auth"

// Get all assets or filtered by type
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const limit = Number.parseInt(searchParams.get("limit") || "50")

  try {
    const session = await getUserSession()
    const supabase = createServerClient()

    let query = supabase
      .from("assets")
      .select(`
        *,
        asset_prices(
          price,
          previous_close,
          change,
          change_percent,
          volume,
          timestamp
        )
      `)
      .order("symbol")
      .limit(limit)

    // Filter by type if provided
    if (type) {
      query = query.eq("type", type)
    }

    // Get latest price for each asset
    query = query.eq("asset_prices.is_latest", true)

    const { data, error } = await query

    if (error) {
      console.error("Error fetching assets:", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Format the response
    const formattedData = data.map((asset) => ({
      id: asset.id,
      symbol: asset.symbol,
      name: asset.name,
      type: asset.type,
      currentPrice: asset.asset_prices[0]?.price || 0,
      previousClose: asset.asset_prices[0]?.previous_close || 0,
      change: asset.asset_prices[0]?.change || 0,
      changePercent: asset.asset_prices[0]?.change_percent || 0,
      volume: asset.asset_prices[0]?.volume || 0,
      lastUpdated: asset.asset_prices[0]?.timestamp || new Date().toISOString(),
    }))

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error("Error in assets API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Add a new asset to track
export async function POST(request: Request) {
  try {
    const session = await getUserSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createServerClient()
    const body = await request.json()

    // Validate required fields
    if (!body.symbol || !body.name || !body.type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if asset already exists
    const { data: existingAsset } = await supabase.from("assets").select("id").eq("symbol", body.symbol).single()

    if (existingAsset) {
      return NextResponse.json({ error: "Asset already exists" }, { status: 409 })
    }

    // Insert new asset
    const { data, error } = await supabase
      .from("assets")
      .insert({
        symbol: body.symbol,
        name: body.name,
        type: body.type,
        coin_id: body.coinId || null,
        created_by: session.user.id,
      })
      .select()

    if (error) {
      console.error("Error adding asset:", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error in assets API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

