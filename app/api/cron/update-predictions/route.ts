import { type NextRequest, NextResponse } from "next/server"
import { getServerSupabaseClient } from "@/lib/db"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// This route is called by a cron job to generate new predictions
export async function POST(request: NextRequest) {
  // Verify the request is from our cron job
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const supabase = getServerSupabaseClient()

    // Get all assets with their latest prices
    const { data: assets, error: assetsError } = await supabase
      .from("assets")
      .select(`
        *,
        asset_prices!inner(*)
      `)
      .eq("asset_prices.is_latest", true)

    if (assetsError) {
      throw assetsError
    }

    // Generate predictions for each asset
    const predictions = await Promise.all(
      assets.map(async (asset) => {
        try {
          // Get historical price data for this asset
          const { data: priceHistory, error: historyError } = await supabase
            .from("asset_prices")
            .select("*")
            .eq("asset_id", asset.id)
            .order("timestamp", { ascending: false })
            .limit(30)

          if (historyError) {
            throw historyError
          }

          // Format price history for the AI
          const priceData = priceHistory.map((p) => ({
            date: new Date(p.timestamp).toISOString().split("T")[0],
            price: p.price,
            change_percent: p.change_percent,
          }))

          // Generate prediction using AI
          const currentPrice = asset.asset_prices[0].price

          // Define timeframes for predictions
          const timeframes = ["1d", "1w", "1m"]

          // Generate predictions for each timeframe
          const timeframePredictions = await Promise.all(
            timeframes.map(async (timeframe) => {
              try {
                // Use AI to generate prediction
                const prompt = `
                  You are a financial AI model that predicts asset prices.
                  
                  Asset: ${asset.name} (${asset.symbol})
                  Type: ${asset.type}
                  Current Price: $${currentPrice}
                  
                  Historical price data (last 30 days):
                  ${JSON.stringify(priceData)}
                  
                  Based on this data, predict the price for this asset in ${timeframe === "1d" ? "one day" : timeframe === "1w" ? "one week" : "one month"}.
                  
                  Provide your prediction in this JSON format:
                  {
                    "predicted_price": number,
                    "confidence": number (between 0-100),
                    "factors": [string array of key factors influencing your prediction]
                  }
                `

                const { text } = await generateText({
                  model: openai("gpt-4o"),
                  prompt,
                  system:
                    "You are a financial prediction AI. Analyze the data and provide accurate price predictions with confidence levels. Only respond with valid JSON.",
                })

                // Parse the AI response
                const prediction = JSON.parse(text)

                // Insert prediction into database
                const { error: insertError } = await supabase.from("predictions").insert({
                  asset_symbol: asset.symbol,
                  predicted_price: prediction.predicted_price,
                  timeframe,
                  confidence: prediction.confidence,
                  factors: prediction.factors,
                  created_at: new Date().toISOString(),
                })

                if (insertError) {
                  throw insertError
                }

                return {
                  timeframe,
                  predicted_price: prediction.predicted_price,
                  confidence: prediction.confidence,
                  success: true,
                }
              } catch (error) {
                console.error(`Error generating prediction for ${asset.symbol} (${timeframe}):`, error)
                return { timeframe, success: false, error: String(error) }
              }
            }),
          )

          return {
            asset: asset.symbol,
            success: true,
            predictions: timeframePredictions,
          }
        } catch (error) {
          console.error(`Error generating predictions for ${asset.symbol}:`, error)
          return { asset: asset.symbol, success: false, error: String(error) }
        }
      }),
    )

    return NextResponse.json({
      success: true,
      message: "Predictions generated successfully",
      results: predictions,
    })
  } catch (error) {
    console.error("Error generating predictions:", error)
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 },
    )
  }
}

