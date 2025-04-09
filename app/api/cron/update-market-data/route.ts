import { type NextRequest, NextResponse } from "next/server"
import { getServerSupabaseClient } from "@/lib/db"

// This route is called by a cron job to update market data
export async function POST(request: NextRequest) {
  // Verify the request is from our cron job
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const supabase = getServerSupabaseClient()

    // Get all assets
    const { data: assets, error: assetsError } = await supabase.from("assets").select("*")

    if (assetsError) {
      throw assetsError
    }

    // Update prices for each asset
    const updates = await Promise.all(
      assets.map(async (asset) => {
        try {
          // Fetch price data from external API based on asset type
          let priceData

          if (asset.type === "Cryptocurrency" && asset.coin_id) {
            // Fetch crypto price from CoinGecko or similar API
            const response = await fetch(
              `https://api.coingecko.com/api/v3/simple/price?ids=${asset.coin_id}&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true`,
            )
            const data = await response.json()

            if (data[asset.coin_id]) {
              priceData = {
                price: data[asset.coin_id].usd,
                change: data[asset.coin_id].usd_24h_change,
                change_percent: data[asset.coin_id].usd_24h_change,
                volume: data[asset.coin_id].usd_24h_vol,
              }
            }
          } else if (asset.type === "Stock") {
            // Fetch stock price from Alpha Vantage or similar API
            const apiKey = process.env.ALPHA_VANTAGE_API_KEY
            const response = await fetch(
              `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${asset.symbol}&apikey=${apiKey}`,
            )
            const data = await response.json()

            if (data["Global Quote"]) {
              const quote = data["Global Quote"]
              priceData = {
                price: Number.parseFloat(quote["05. price"]),
                previous_close: Number.parseFloat(quote["08. previous close"]),
                change: Number.parseFloat(quote["09. change"]),
                change_percent: Number.parseFloat(quote["10. change percent"].replace("%", "")),
                volume: Number.parseInt(quote["06. volume"]),
              }
            }
          }

          // If we got price data, insert it into the database
          if (priceData) {
            const { error: insertError } = await supabase.from("asset_prices").insert({
              asset_id: asset.id,
              price: priceData.price,
              previous_close: priceData.previous_close,
              change: priceData.change,
              change_percent: priceData.change_percent,
              volume: priceData.volume,
              is_latest: true,
              timestamp: new Date().toISOString(),
            })

            if (insertError) {
              console.error(`Error inserting price for ${asset.symbol}:`, insertError)
              return { asset: asset.symbol, success: false, error: insertError.message }
            }

            return { asset: asset.symbol, success: true }
          }

          return { asset: asset.symbol, success: false, error: "No price data available" }
        } catch (error) {
          console.error(`Error updating price for ${asset.symbol}:`, error)
          return { asset: asset.symbol, success: false, error: String(error) }
        }
      }),
    )

    return NextResponse.json({
      success: true,
      message: "Market data updated successfully",
      results: updates,
    })
  } catch (error) {
    console.error("Error updating market data:", error)
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 },
    )
  }
}

