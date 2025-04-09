/**
 * This file provides a comprehensive overview of the front-end to back-end connection strategy
 * for the AI Prophet application. It's not meant to be used in the actual application but serves
 * as documentation for the development team.
 */

// Application Architecture Overview
const applicationArchitecture = {
  frontendFramework: "Next.js (App Router)",
  backendServices: [
    "Supabase (Database, Authentication, Storage)",
    "API Routes (Next.js)",
    "Server Actions (Next.js)",
    "Cron Jobs (Vercel)",
  ],
  stateManagement: "React Hooks + Context",
  authentication: "Email-based Auth via Supabase",
  dataFetching: "Server Components + Client-side API calls",
  realTimeUpdates: "Supabase Realtime + Polling",
}

// Database Schema (Tables required by the front-end)
const databaseSchema = {
  users: {
    id: "UUID (Primary Key)",
    email: "String (Unique)",
    created_at: "Timestamp",
    last_sign_in: "Timestamp",
    settings: "JSON",
  },
  assets: {
    id: "UUID (Primary Key)",
    symbol: "String (Unique)",
    name: "String",
    type: "String (Stock, Crypto, Commodity, etc.)",
    coin_id: "String (Optional, for crypto)",
    created_at: "Timestamp",
    created_by: "UUID (Foreign Key to users)",
  },
  asset_prices: {
    id: "UUID (Primary Key)",
    asset_id: "UUID (Foreign Key to assets)",
    price: "Decimal",
    previous_close: "Decimal (Optional)",
    change: "Decimal (Optional)",
    change_percent: "Decimal (Optional)",
    volume: "Decimal (Optional)",
    is_latest: "Boolean",
    timestamp: "Timestamp",
  },
  predictions: {
    id: "UUID (Primary Key)",
    asset_symbol: "String (Foreign Key to assets.symbol)",
    predicted_price: "Decimal",
    timeframe: "String (e.g., '7d', '30d', '90d')",
    confidence: "Decimal (0-100)",
    factors: "String[] (Optional)",
    created_at: "Timestamp",
    created_by: "UUID (Foreign Key to users)",
  },
  portfolio_assets: {
    id: "UUID (Primary Key)",
    user_id: "UUID (Foreign Key to users)",
    asset_id: "UUID (Foreign Key to assets)",
    quantity: "Decimal",
    average_price: "Decimal",
    created_at: "Timestamp",
    updated_at: "Timestamp",
  },
  portfolio_history: {
    id: "UUID (Primary Key)",
    user_id: "UUID (Foreign Key to users)",
    value: "Decimal",
    date: "Date",
  },
  variables: {
    id: "UUID (Primary Key)",
    name: "String",
    description: "String",
    value: "Decimal",
    category: "String",
    is_active: "Boolean",
    created_at: "Timestamp",
    updated_at: "Timestamp",
  },
  news: {
    id: "UUID (Primary Key)",
    title: "String",
    content: "String",
    source: "String",
    url: "String",
    published_at: "Timestamp",
    sentiment: "String (Positive, Negative, Neutral)",
    related_assets: "String[] (Optional)",
  },
}

// API Endpoints
const apiEndpoints = {
  // Authentication
  auth: {
    signIn: {
      endpoint: "/api/auth/signin",
      method: "POST",
      body: { email: "string", password: "string" },
      response: { user: "object", session: "object" },
      implementation: "Supabase Auth",
    },
    signUp: {
      endpoint: "/api/auth/signup",
      method: "POST",
      body: { email: "string", password: "string" },
      response: { user: "object", session: "object" },
      implementation: "Supabase Auth",
    },
    signOut: {
      endpoint: "/api/auth/signout",
      method: "POST",
      response: { success: "boolean" },
      implementation: "Supabase Auth",
    },
    resetPassword: {
      endpoint: "/api/auth/reset-password",
      method: "POST",
      body: { email: "string" },
      response: { success: "boolean" },
      implementation: "Supabase Auth",
    },
  },

  // Assets
  assets: {
    getAll: {
      endpoint: "/api/assets",
      method: "GET",
      query: { type: "string (optional)", limit: "number (optional)" },
      response: { data: "Asset[]" },
      implementation: "Supabase Query",
    },
    getBySymbol: {
      endpoint: "/api/assets/:symbol",
      method: "GET",
      response: { data: "Asset" },
      implementation: "Supabase Query",
    },
    getPriceHistory: {
      endpoint: "/api/assets/:symbol/history",
      method: "GET",
      query: { timeframe: "string (e.g., '1d', '7d', '30d', '90d', '1y')" },
      response: { data: "PricePoint[]" },
      implementation: "Supabase Query + External API",
    },
  },

  // Predictions
  predictions: {
    getAll: {
      endpoint: "/api/predictions",
      method: "GET",
      query: {
        symbol: "string (optional)",
        timeframe: "string (optional)",
        limit: "number (optional)",
      },
      response: { data: "Prediction[]" },
      implementation: "Supabase Query",
    },
    create: {
      endpoint: "/api/predictions",
      method: "POST",
      body: {
        symbol: "string",
        timeframe: "string",
        currentPrice: "number (optional)",
      },
      response: {
        id: "string",
        assetSymbol: "string",
        predictedPrice: "number",
        timeframe: "string",
        confidence: "number",
        factors: "string[]",
        createdAt: "string (ISO date)",
      },
      implementation: "Supabase Insert + ML Model API Call",
    },
    getByAsset: {
      endpoint: "/api/predictions/:symbol",
      method: "GET",
      response: { data: "Prediction[]" },
      implementation: "Supabase Query",
    },
  },

  // Portfolio
  portfolio: {
    getUserPortfolio: {
      endpoint: "/api/portfolio",
      method: "GET",
      response: {
        assets: "PortfolioAsset[]",
        totalValue: "number",
        dailyChange: "number",
        dailyChangePercent: "number",
      },
      implementation: "Supabase Query",
    },
    addAsset: {
      endpoint: "/api/portfolio",
      method: "POST",
      body: {
        assetId: "string",
        quantity: "number",
        price: "number",
      },
      response: { success: "boolean", asset: "PortfolioAsset" },
      implementation: "Supabase Insert",
    },
    updateAsset: {
      endpoint: "/api/portfolio/:assetId",
      method: "PUT",
      body: { quantity: "number", price: "number" },
      response: { success: "boolean", asset: "PortfolioAsset" },
      implementation: "Supabase Update",
    },
    removeAsset: {
      endpoint: "/api/portfolio/:assetId",
      method: "DELETE",
      response: { success: "boolean" },
      implementation: "Supabase Delete",
    },
    getHistory: {
      endpoint: "/api/portfolio/history",
      method: "GET",
      query: { days: "number (default: 30)" },
      response: { data: "PortfolioHistoryPoint[]" },
      implementation: "Supabase Query",
    },
  },

  // Variables
  variables: {
    getAll: {
      endpoint: "/api/variables",
      method: "GET",
      query: { category: "string (optional)" },
      response: { data: "Variable[]" },
      implementation: "Supabase Query",
    },
    create: {
      endpoint: "/api/variables",
      method: "POST",
      body: {
        name: "string",
        description: "string",
        value: "number",
        category: "string",
        isActive: "boolean",
      },
      response: { success: "boolean", variable: "Variable" },
      implementation: "Supabase Insert",
    },
    update: {
      endpoint: "/api/variables/:id",
      method: "PUT",
      body: {
        name: "string (optional)",
        description: "string (optional)",
        value: "number (optional)",
        category: "string (optional)",
        isActive: "boolean (optional)",
      },
      response: { success: "boolean", variable: "Variable" },
      implementation: "Supabase Update",
    },
    delete: {
      endpoint: "/api/variables/:id",
      method: "DELETE",
      response: { success: "boolean" },
      implementation: "Supabase Delete",
    },
  },

  // News
  news: {
    getLatest: {
      endpoint: "/api/news",
      method: "GET",
      query: {
        limit: "number (optional)",
        relatedTo: "string (optional, asset symbol)",
      },
      response: { data: "NewsItem[]" },
      implementation: "Supabase Query + External News API",
    },
  },

  // Cron Jobs
  cron: {
    updateMarketData: {
      endpoint: "/api/cron/update-market-data",
      method: "POST",
      headers: { "x-cron-secret": "string (environment variable)" },
      response: { success: "boolean", updated: "number" },
      implementation: "External API Calls + Supabase Batch Insert",
      schedule: "Every 15 minutes during market hours",
    },
    updatePredictions: {
      endpoint: "/api/cron/update-predictions",
      method: "POST",
      headers: { "x-cron-secret": "string (environment variable)" },
      response: { success: "boolean", updated: "number" },
      implementation: "ML Model API Calls + Supabase Batch Insert",
      schedule: "Daily at 00:00 UTC",
    },
  },

  // AI Chat
  chat: {
    sendMessage: {
      endpoint: "/api/chat",
      method: "POST",
      body: { message: "string" },
      response: {
        id: "string",
        content: "string",
        createdAt: "string (ISO date)",
      },
      implementation: "OpenAI API + Context Management",
    },
    getHistory: {
      endpoint: "/api/chat/history",
      method: "GET",
      response: { messages: "ChatMessage[]" },
      implementation: "Supabase Query",
    },
  },
}

// Server Actions
const serverActions = {
  portfolio: {
    addAsset: {
      path: "actions/portfolio-actions.ts",
      function: "addAssetToPortfolio",
      parameters: { assetId: "string", quantity: "number", price: "number" },
      returns: "Promise<{ success: boolean, asset?: PortfolioAsset, error?: string }>",
      implementation: "Supabase RPC",
    },
    updateAsset: {
      path: "actions/portfolio-actions.ts",
      function: "updatePortfolioAsset",
      parameters: { assetId: "string", quantity: "number", price: "number" },
      returns: "Promise<{ success: boolean, asset?: PortfolioAsset, error?: string }>",
      implementation: "Supabase RPC",
    },
    removeAsset: {
      path: "actions/portfolio-actions.ts",
      function: "removeAssetFromPortfolio",
      parameters: { assetId: "string" },
      returns: "Promise<{ success: boolean, error?: string }>",
      implementation: "Supabase RPC",
    },
  },
  predictions: {
    generatePrediction: {
      path: "actions/prediction-actions.ts",
      function: "generatePrediction",
      parameters: { symbol: "string", timeframe: "string" },
      returns: "Promise<{ success: boolean, prediction?: Prediction, error?: string }>",
      implementation: "ML Model API Call + Supabase Insert",
    },
  },
  variables: {
    updateVariable: {
      path: "actions/variable-actions.ts",
      function: "updateVariable",
      parameters: { id: "string", value: "number", isActive: "boolean" },
      returns: "Promise<{ success: boolean, error?: string }>",
      implementation: "Supabase Update",
    },
  },
}

// Pages and Components
const pages = {
  // Main Pages
  dashboard: {
    path: "/dashboard",
    component: "app/dashboard/page.tsx",
    description: "Main dashboard with portfolio overview, predictions, and news",
    dataRequirements: ["User portfolio summary", "Top predictions", "Latest news", "Market indices"],
    apiCalls: [apiEndpoints.portfolio.getUserPortfolio, apiEndpoints.predictions.getAll, apiEndpoints.news.getLatest],
  },
  portfolio: {
    path: "/dashboard/portfolio",
    component: "components/portfolio-page.tsx",
    description: "Detailed portfolio management page",
    dataRequirements: ["User portfolio assets", "Portfolio history", "Asset predictions"],
    apiCalls: [
      apiEndpoints.portfolio.getUserPortfolio,
      apiEndpoints.portfolio.getHistory,
      apiEndpoints.predictions.getAll,
    ],
    actions: [
      serverActions.portfolio.addAsset,
      serverActions.portfolio.updateAsset,
      serverActions.portfolio.removeAsset,
    ],
  },
  analyze: {
    path: "/dashboard/analyze",
    component: "components/analyze-page.tsx",
    description: "Asset analysis tool with AI-powered insights",
    dataRequirements: ["Asset details", "Price history", "Predictions", "News related to asset"],
    apiCalls: [
      apiEndpoints.assets.getBySymbol,
      apiEndpoints.assets.getPriceHistory,
      apiEndpoints.predictions.getByAsset,
      apiEndpoints.news.getLatest,
    ],
  },
  predict: {
    path: "/dashboard/predict",
    component: "components/predict-page.tsx",
    description: "Generate and view predictions for assets",
    dataRequirements: ["Assets list", "Existing predictions"],
    apiCalls: [apiEndpoints.assets.getAll, apiEndpoints.predictions.getAll],
    actions: [serverActions.predictions.generatePrediction],
  },
  variables: {
    path: "/dashboard/variables",
    component: "components/variables-panel.tsx",
    description: "Manage trading variables and parameters",
    dataRequirements: ["Variables list by category"],
    apiCalls: [apiEndpoints.variables.getAll],
    actions: [serverActions.variables.updateVariable],
  },
  assistant: {
    path: "/dashboard/assistant",
    component: "components/chat-interface.tsx",
    description: "AI assistant for financial advice",
    dataRequirements: ["Chat history"],
    apiCalls: [apiEndpoints.chat.getHistory, apiEndpoints.chat.sendMessage],
  },
  market: {
    path: "/dashboard/market",
    component: "components/market-data-page.tsx",
    description: "Market data overview with indices and trends",
    dataRequirements: ["Market indices", "Top movers", "Sector performance"],
    apiCalls: [apiEndpoints.assets.getAll, apiEndpoints.assets.getPriceHistory],
  },
  trading: {
    path: "/dashboard/trading",
    component: "components/paper-trading-page.tsx",
    description: "Paper trading simulation",
    dataRequirements: ["User paper trading portfolio", "Asset price data", "Trading history"],
    apiCalls: [
      // Custom endpoints for paper trading
    ],
  },
  categories: {
    path: "/dashboard/categories",
    component: "components/categories-page.tsx",
    description: "Asset categories and sector analysis",
    dataRequirements: ["Asset categories", "Category performance"],
    apiCalls: [apiEndpoints.assets.getAll],
  },
  proof: {
    path: "/dashboard/proof",
    component: "components/proof-page.tsx",
    description: "Performance proof and verification",
    dataRequirements: ["Prediction history", "Accuracy metrics", "Strategy performance"],
    apiCalls: [apiEndpoints.predictions.getAll],
  },
  settings: {
    path: "/dashboard/settings",
    component: "components/settings-panel.tsx",
    description: "User settings and preferences",
    dataRequirements: ["User profile", "User settings"],
    apiCalls: [
      // Custom endpoints for user settings
    ],
  },
}

// Key Components and Their Data Requirements
const components = {
  portfolioPredictions: {
    path: "components/portfolio-predictions.tsx",
    description: "Portfolio performance chart with predictions",
    dataRequirements: ["Portfolio history", "Portfolio predictions"],
    apiCalls: [apiEndpoints.portfolio.getHistory],
  },
  assetCard: {
    path: "components/asset-card.tsx",
    description: "Card displaying asset details and predictions",
    props: {
      symbol: "string",
      name: "string",
      type: "string",
      currentPrice: "number",
      predictedPrice: "number",
      change: "number",
      confidence: "number",
      showRemove: "boolean (optional)",
    },
  },
  topPredictions: {
    path: "components/top-predictions.tsx",
    description: "Display top predictions with highest confidence",
    dataRequirements: ["Top predictions"],
    apiCalls: [apiEndpoints.predictions.getAll],
    props: {
      setActiveTab: "function",
    },
  },
  newsFeed: {
    path: "components/news-feed.tsx",
    description: "Display latest financial news",
    dataRequirements: ["Latest news"],
    apiCalls: [apiEndpoints.news.getLatest],
    props: {
      portfolioOnly: "boolean (optional)",
    },
  },
  chatInterface: {
    path: "components/chat-interface.tsx",
    description: "AI chat interface for financial assistance",
    dataRequirements: ["Chat history"],
    apiCalls: [apiEndpoints.chat.sendMessage],
    props: {
      compact: "boolean (optional)",
    },
  },
  instantPredictions: {
    path: "components/instant-predictions.tsx",
    description: "Generate instant predictions for assets",
    dataRequirements: ["Assets list"],
    apiCalls: [apiEndpoints.assets.getAll, apiEndpoints.predictions.create],
  },
}

// Custom Hooks
const hooks = {
  usePrediction: {
    path: "hooks/use-prediction.ts",
    description: "Hook for fetching and managing predictions",
    returns: {
      getPrediction: "function(symbol: string, strategy?: string) => Promise<PredictionData | null>",
      predictionData: "PredictionData | null",
      isLoading: "boolean",
      error: "string | null",
    },
    implementation: "API call to predictions endpoint",
  },
  useStrategySuggestion: {
    path: "hooks/use-strategy-suggestion.ts",
    description: "Hook for getting trading strategy suggestions",
    returns: {
      suggestStrategies: "function(symbol: string) => Promise<void>",
      strategies: "Strategy[]",
      isLoading: "boolean",
    },
    implementation: "API call to strategy suggestion endpoint",
  },
  useMobile: {
    path: "hooks/use-mobile.tsx",
    description: "Hook for responsive design and mobile detection",
    returns: {
      isMobile: "boolean",
    },
    implementation: "Window resize event listener",
  },
}

// Authentication Flow
const authFlow = {
  signIn: {
    component: "components/sign-in-modal.tsx",
    description: "Email-based sign in modal",
    flow: [
      "User enters email",
      "Backend sends magic link or password prompt",
      "User authenticates",
      "JWT token stored in cookies",
      "User redirected to dashboard",
    ],
    implementation: "Supabase Auth",
  },
  signUp: {
    component: "components/sign-in-modal.tsx",
    description: "Email-based sign up modal",
    flow: [
      "User enters email and password",
      "Backend creates user account",
      "Email verification sent",
      "User verifies email",
      "User redirected to dashboard",
    ],
    implementation: "Supabase Auth",
  },
  signOut: {
    component: "components/dashboard.tsx",
    description: "Sign out button in dashboard",
    flow: ["User clicks sign out", "JWT token removed", "User redirected to home page"],
    implementation: "Supabase Auth",
  },
  sessionCheck: {
    component: "lib/auth.ts",
    description: "Check if user is authenticated",
    flow: [
      "Check for valid JWT token",
      "If valid, allow access to protected routes",
      "If invalid, redirect to sign in",
    ],
    implementation: "Supabase Auth + Next.js Middleware",
  },
}

// Cron Jobs
const cronJobs = {
  updateMarketData: {
    endpoint: "/api/cron/update-market-data",
    description: "Update asset prices and market data",
    schedule: "Every 15 minutes during market hours",
    implementation: "Vercel Cron + External API Calls",
    flow: [
      "Fetch latest prices from external APIs",
      "Update asset_prices table",
      "Mark latest prices with is_latest=true",
      "Update previous prices with is_latest=false",
    ],
  },
  updatePredictions: {
    endpoint: "/api/cron/update-predictions",
    description: "Generate new predictions for assets",
    schedule: "Daily at 00:00 UTC",
    implementation: "Vercel Cron + ML Model API Calls",
    flow: ["Get assets that need new predictions", "Call ML model API for each asset", "Store predictions in database"],
  },
}

// Data Flow Diagram
const dataFlow = {
  userInteraction: [
    "User interacts with UI",
    "React component handles interaction",
    "API call or Server Action triggered",
    "Backend processes request",
    "Database updated (if needed)",
    "Response returned to frontend",
    "UI updated with new data",
  ],
  realTimeUpdates: [
    "Supabase Realtime subscription established",
    "Database changes trigger events",
    "Frontend receives events",
    "UI updated with new data",
  ],
  cronJobs: [
    "Cron job triggered at scheduled time",
    "API endpoint called",
    "External data fetched",
    "Database updated",
    "UI updated on next user interaction or page load",
  ],
}

// Export the connection strategy
export const connectionStrategy = {
  applicationArchitecture,
  databaseSchema,
  apiEndpoints,
  serverActions,
  pages,
  components,
  hooks,
  authFlow,
  cronJobs,
  dataFlow,
}

