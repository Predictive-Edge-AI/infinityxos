"use server"

import { getServerSupabaseClient } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function addAssetToPortfolio(userId: string, assetId: string, quantity: number, price: number) {
  try {
    const supabase = getServerSupabaseClient()

    // Check if user already has this asset
    const { data: existingAsset, error: queryError } = await supabase
      .from("portfolio_assets")
      .select("*")
      .eq("user_id", userId)
      .eq("asset_id", assetId)
      .single()

    if (queryError && queryError.code !== "PGRST116") {
      // PGRST116 is "no rows returned"
      throw queryError
    }

    if (existingAsset) {
      // Update existing asset
      const newQuantity = existingAsset.quantity + quantity
      const newAveragePrice = (existingAsset.quantity * existingAsset.average_price + quantity * price) / newQuantity

      const { error: updateError } = await supabase
        .from("portfolio_assets")
        .update({
          quantity: newQuantity,
          average_price: newAveragePrice,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingAsset.id)

      if (updateError) {
        throw updateError
      }
    } else {
      // Add new asset
      const { error: insertError } = await supabase.from("portfolio_assets").insert({
        user_id: userId,
        asset_id: assetId,
        quantity,
        average_price: price,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (insertError) {
        throw insertError
      }
    }

    // Revalidate portfolio page
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error adding asset to portfolio:", error)
    return { success: false, error: String(error) }
  }
}

export async function removeAssetFromPortfolio(userId: string, portfolioAssetId: string) {
  try {
    const supabase = getServerSupabaseClient()

    // Delete the asset from portfolio
    const { error } = await supabase.from("portfolio_assets").delete().eq("id", portfolioAssetId).eq("user_id", userId) // Security check

    if (error) {
      throw error
    }

    // Revalidate portfolio page
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error removing asset from portfolio:", error)
    return { success: false, error: String(error) }
  }
}

export async function updateAssetQuantity(userId: string, portfolioAssetId: string, newQuantity: number) {
  try {
    const supabase = getServerSupabaseClient()

    if (newQuantity <= 0) {
      // If quantity is zero or negative, remove the asset
      return removeAssetFromPortfolio(userId, portfolioAssetId)
    }

    // Update the asset quantity
    const { error } = await supabase
      .from("portfolio_assets")
      .update({
        quantity: newQuantity,
        updated_at: new Date().toISOString(),
      })
      .eq("id", portfolioAssetId)
      .eq("user_id", userId) // Security check

    if (error) {
      throw error
    }

    // Revalidate portfolio page
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error updating asset quantity:", error)
    return { success: false, error: String(error) }
  }
}

export async function generateAiPortfolio(userId: string, budget: number, riskLevel: number, strategy: string) {
  try {
    const supabase = getServerSupabaseClient()

    // Get available assets
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

    // Get latest predictions
    const { data: predictions, error: predictionsError } = await supabase
      .from("predictions")
      .select("*")
      .in("timeframe", ["1w", "1m"])
      .order("created_at", { ascending: false })

    if (predictionsError) {
      throw predictionsError
    }

    // Group predictions by asset symbol and get the latest for each
    const latestPredictions = predictions.reduce(
      (acc, prediction) => {
        if (
          !acc[prediction.asset_symbol] ||
          new Date(prediction.created_at) > new Date(acc[prediction.asset_symbol].created_at)
        ) {
          acc[prediction.asset_symbol] = prediction
        }
        return acc
      },
      {} as Record<string, any>,
    )

    // Filter assets based on strategy and risk level
    let filteredAssets = assets

    if (strategy === "ai-prophet" || strategy === "infinity") {
      // High growth potential assets with high confidence predictions
      filteredAssets = assets.filter((asset) => {
        const prediction = latestPredictions[asset.symbol]
        if (!prediction) return false

        const predictedGrowth =
          ((prediction.predicted_price - asset.asset_prices[0].price) / asset.asset_prices[0].price) * 100
        return prediction.confidence > 80 && predictedGrowth > 5
      })
    } else if (strategy === "buffett") {
      // Value investing - stable assets with moderate growth
      filteredAssets = assets.filter((asset) => {
        const prediction = latestPredictions[asset.symbol]
        if (!prediction) return false

        const predictedGrowth =
          ((prediction.predicted_price - asset.asset_prices[0].price) / asset.asset_prices[0].price) * 100
        return prediction.confidence > 75 && predictedGrowth > 3 && predictedGrowth < 10
      })
    } else if (strategy === "human") {
      // Conservative approach - stable assets with lower volatility
      filteredAssets = assets.filter((asset) => {
        const prediction = latestPredictions[asset.symbol]
        if (!prediction) return false

        const predictedGrowth =
          ((prediction.predicted_price - asset.asset_prices[0].price) / asset.asset_prices[0].price) * 100
        return prediction.confidence > 70 && predictedGrowth > 1 && predictedGrowth < 7
      })
    }

    // Sort by predicted growth and confidence
    filteredAssets.sort((a, b) => {
      const predA = latestPredictions[a.symbol]
      const predB = latestPredictions[b.symbol]

      if (!predA || !predB) return 0

      const growthA = ((predA.predicted_price - a.asset_prices[0].price) / a.asset_prices[0].price) * 100
      const growthB = ((predB.predicted_price - b.asset_prices[0].price) / b.asset_prices[0].price) * 100

      // Weight by growth and confidence
      const scoreA = growthA * (predA.confidence / 100)
      const scoreB = growthB * (predB.confidence / 100)

      return scoreB - scoreA
    })

    // Limit to top assets based on risk level
    const numAssets = riskLevel < 33 ? 5 : riskLevel < 66 ? 3 : 2
    filteredAssets = filteredAssets.slice(0, numAssets)

    // Calculate allocation based on risk level and predictions
    const totalScore = filteredAssets.reduce((sum, asset) => {
      const prediction = latestPredictions[asset.symbol]
      if (!prediction) return sum

      const growth = ((prediction.predicted_price - asset.asset_prices[0].price) / asset.asset_prices[0].price) * 100
      return sum + growth * (prediction.confidence / 100)
    }, 0)

    const allocations = filteredAssets.map((asset) => {
      const prediction = latestPredictions[asset.symbol]
      if (!prediction) return { asset, allocation: 0 }

      const growth = ((prediction.predicted_price - asset.asset_prices[0].price) / asset.asset_prices[0].price) * 100
      const score = growth * (prediction.confidence / 100)

      // Allocate budget proportionally to score
      let allocation = (score / totalScore) * budget

      // Adjust based on risk level
      if (riskLevel > 66) {
        // More aggressive - concentrate on top performers
        allocation *= 1.2
      } else if (riskLevel < 33) {
        // More conservative - more even distribution
        allocation = (allocation + budget / filteredAssets.length) / 2
      }

      return { asset, allocation }
    })

    // Normalize allocations to match budget
    const totalAllocation = allocations.reduce((sum, item) => sum + item.allocation, 0)
    const normalizedAllocations = allocations.map((item) => ({
      ...item,
      allocation: (item.allocation / totalAllocation) * budget,
    }))

    // Clear existing portfolio
    const { error: deleteError } = await supabase.from("portfolio_assets").delete().eq("user_id", userId)

    if (deleteError) {
      throw deleteError
    }

    // Add new assets to portfolio
    for (const item of normalizedAllocations) {
      const price = item.asset.asset_prices[0].price
      const quantity = item.allocation / price

      if (quantity <= 0) continue

      const { error: insertError } = await supabase.from("portfolio_assets").insert({
        user_id: userId,
        asset_id: item.asset.id,
        quantity,
        average_price: price,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (insertError) {
        throw insertError
      }
    }

    // Revalidate portfolio page
    revalidatePath("/dashboard")

    return {
      success: true,
      portfolio: normalizedAllocations.map((item) => ({
        symbol: item.asset.symbol,
        name: item.asset.name,
        quantity: item.allocation / item.asset.asset_prices[0].price,
        price: item.asset.asset_prices[0].price,
        allocation: item.allocation,
      })),
    }
  } catch (error) {
    console.error("Error generating AI portfolio:", error)
    return { success: false, error: String(error) }
  }
}

