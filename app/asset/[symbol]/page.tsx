import { redirect } from "next/navigation"

export default function AssetDetailPage({ params }: { params: { symbol: string } }) {
  // In a real implementation, this would fetch data for the specific asset
  // For now, we'll redirect to the dashboard with a search query
  redirect(`/dashboard?search=${params.symbol}`)
}

