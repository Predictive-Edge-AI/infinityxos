import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { getUserSession } from "@/lib/auth"

// Get user portfolio
export async function GET() {
  try {
    const session = await getUserSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createServerClient()

    // Get user portfolio assets
    const { data: portfolioAssets, error: portfolioError } = await supabase
      .from("portfolio_assets")
      .select(`
        *,
        assets(
          symbol,
          name,
          type,
          asset_prices(
            price,
            previous_close,
            change,
            change_percent,
            timestamp
          )
        )
      `)
      .eq("user_id", session.user.id)

    if (portfolioError) {
      console.error("Error fetching portfolio:", portfolioError.message)
      return NextResponse.json({ error: portfolioError.message }, { status: 500 })
    }

    // Calculate portfolio metrics
    let totalValue = 0
    let totalCost = 0
    let dailyChange = 0

    const assets = portfolioAssets.map((item) => {
      const asset = item.assets
      const currentPrice = asset.asset_prices[0]?.price || 0
      const previousPrice = asset.asset_prices[0]?.previous_close || 0
      const currentValue = currentPrice * item.quantity
      const costBasis = item.average_price * item.quantity
      const profit = currentValue - costBasis
      const profitPercent = costBasis > 0 ? (profit / costBasis) * 100 : 0
      const dailyAssetChange = (currentPrice - previousPrice) * item.quantity

      totalValue += currentValue
      totalCost += costBasis
      dailyChange += dailyAssetChange

      return {
        symbol: asset.symbol,
        name: asset.name,
        type: asset.type,
        quantity: item.quantity,
        averagePrice: item.average_price,
        currentPrice,
        currentValue,
        profit,
        profitPercent,
        dailyChange: dailyAssetChange,
        dailyChangePercent: previousPrice > 0 ? ((currentPrice - previousPrice) / previousPrice) * 100 : 0,
      }
    })

    const totalProfit = totalValue - totalCost
    const totalProfitPercent = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0
    const dailyChangePercent = totalValue > 0 ? (dailyChange / (totalValue - dailyChange)) * 100 : 0

    // Get historical portfolio value for monthly change calculation
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: historicalValue, error: historicalError } = await supabase
      .from("portfolio_history")
      .select("value")
      .eq("user_id", session.user.id)
      .gte("date", thirtyDaysAgo.toISOString())
      .order("date")
      .limit(1)

    let monthlyChange = 0
    let monthlyChangePercent = 0

    if (!historicalError && historicalValue.length > 0) {
      const pastValue = historicalValue[0].value
      monthlyChange = totalValue - pastValue
      monthlyChangePercent = pastValue > 0 ? (monthlyChange / pastValue) * 100 : 0
    }

    return NextResponse.json({
      totalValue,
      totalCost,
      totalProfit,
      totalProfitPercent,
      dailyChange,
      dailyChangePercent,
      monthlyChange,
      monthlyChangePercent,
      assets,
    })
  } catch (error) {
    console.error("Error in portfolio API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Add asset to portfolio
export async function POST(request: Request) {
  try {
    const session = await getUserSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createServerClient()
    const body = await request.json()

    // Validate required fields
    if (!body.symbol || !body.quantity || !body.price) {
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

    // Check if asset already exists in portfolio
    const { data: existingAsset, error: existingError } = await supabase
      .from("portfolio_assets")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("asset_id", asset.id)
      .single()

    if (existingError && existingError.code !== "PGRST116") {
      console.error("Error checking existing portfolio asset:", existingError.message)
      return NextResponse.json({ error: existingError.message }, { status: 500 })
    }

    let result

    if (existingAsset) {
      // Update existing portfolio asset
      const newQuantity = existingAsset.quantity + body.quantity
      const newAveragePrice =
        (existingAsset.average_price * existingAsset.quantity + body.price * body.quantity) / newQuantity

      const { data, error } = await supabase
        .from("portfolio_assets")
        .update({
          quantity: newQuantity,
          average_price: newAveragePrice,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingAsset.id)
        .select()

      if (error) {
        console.error("Error updating portfolio asset:", error.message)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      result = data[0]
    } else {
      // Add new portfolio asset
      const { data, error } = await supabase
        .from("portfolio_assets")
        .insert({
          user_id: session.user.id,
          asset_id: asset.id,
          quantity: body.quantity,
          average_price: body.price,
        })
        .select()

      if (error) {
        console.error("Error adding portfolio asset:", error.message)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      result = data[0]
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in portfolio API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

