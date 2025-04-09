// Helper function to handle API responses
export async function fetchWithErrorHandling(url: string, options?: RequestInit) {
  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("API fetch error:", error)
    throw error
  }
}

// Format currency values
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

// Format percentage values
export function formatPercentage(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`
}

// Calculate time difference for "time ago" display
export function timeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

  let interval = seconds / 31536000
  if (interval > 1) return Math.floor(interval) + "y ago"

  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + "mo ago"

  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + "d ago"

  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + "h ago"

  interval = seconds / 60
  if (interval > 1) return Math.floor(interval) + "m ago"

  return Math.floor(seconds) + "s ago"
}

