/**
 * This file maps each UI component to its required API endpoints and data dependencies.
 * It serves as a reference for front-end to back-end integration.
 */

// Dashboard Components
export const dashboardComponentMapping = {
  // Main Dashboard
  Dashboard: {
    component: "components/dashboard.tsx",
    apiEndpoints: [
      "/api/portfolio", // Get user portfolio
      "/api/predictions?limit=5", // Get top predictions
      "/api/news?limit=5", // Get latest news
    ],
    stateManagement: "Local state with useState",
    dataRefreshStrategy: "Polling every 60 seconds + manual refresh button",
    interactiveElements: [
      {
        element: "Refresh button",
        action: "Manually refresh all data",
        implementation: "refreshAllData function",
      },
      {
        element: "Tab navigation",
        action: "Switch between dashboard sections",
        implementation: "handleTabChange function",
      },
      {
        element: "Sign out button",
        action: "Sign out user",
        implementation: "Supabase auth.signOut()",
      },
    ],
  },

  // Portfolio Predictions
  PortfolioPredictions: {
    component: "components/portfolio-predictions.tsx",
    apiEndpoints: [
      "/api/portfolio/history", // Get portfolio history
      "/api/portfolio", // Get current portfolio value
    ],
    stateManagement: "Local state with useState",
    dataRefreshStrategy: "Parent component refresh",
    interactiveElements: [
      {
        element: "Timeframe buttons",
        action: "Change chart timeframe",
        implementation: "setTimeframe function",
      },
      {
        element: "Chart hover",
        action: "Show value at specific point",
        implementation: "Custom tooltip with position tracking",
      },
    ],
  },

  // Top Predictions
  TopPredictions: {
    component: "components/top-predictions.tsx",
    apiEndpoints: [
      "/api/predictions?limit=5", // Get top predictions
    ],
    stateManagement: "Props from parent + local state",
    dataRefreshStrategy: "Parent component refresh",
    interactiveElements: [
      {
        element: "View All button",
        action: "Navigate to prediction history",
        implementation: "setActiveTab function passed as prop",
      },
      {
        element: "Prediction items",
        action: "Click to view detailed analysis",
        implementation: "Navigation to asset detail page",
      },
    ],
  },

  // News Feed
  NewsFeed: {
    component: "components/news-feed.tsx",
    apiEndpoints: [
      "/api/news?limit=10", // Get latest news
      "/api/news?relatedTo=:symbol", // Get news related to specific asset
    ],
    stateManagement: "Local state with useState",
    dataRefreshStrategy: "Parent component refresh + manual refresh",
    interactiveElements: [
      {
        element: "News item",
        action: "Open news article",
        implementation: "External link with target='_blank'",
      },
      {
        element: "Category filter",
        action: "Filter news by category",
        implementation: "setCategory function",
      },
    ],
  },

  // Chat Interface
  ChatInterface: {
    component: "components/chat-interface.tsx",
    apiEndpoints: [
      "/api/chat", // Send message to AI assistant
      "/api/chat/history", // Get chat history
    ],
    stateManagement: "Local state with useState",
    dataRefreshStrategy: "Real-time updates on message send/receive",
    interactiveElements: [
      {
        element: "Message input",
        action: "Type message",
        implementation: "setInput function",
      },
      {
        element: "Send button",
        action: "Send message to AI",
        implementation: "handleSend function",
      },
      {
        element: "Message list",
        action: "Display conversation",
        implementation: "Auto-scroll to bottom on new message",
      },
    ],
  },

  // Asset Card
  AssetCard: {
    component: "components/asset-card.tsx",
    apiEndpoints: [], // Data passed via props
    stateManagement: "Props only",
    dataRefreshStrategy: "Parent component refresh",
    interactiveElements: [
      {
        element: "Remove button",
        action: "Remove asset from portfolio",
        implementation: "Only shown when showRemove=true, calls parent handler",
      },
      {
        element: "Card click",
        action: "View detailed analysis",
        implementation: "Navigation to asset detail page",
      },
    ],
  },
}

// Analysis Page Components
export const analysisComponentMapping = {
  AnalyzePage: {
    component: "components/analyze-page.tsx",
    apiEndpoints: [
      "/api/assets/:symbol", // Get asset details
      "/api/assets/:symbol/history", // Get price history
      "/api/predictions/:symbol", // Get predictions for asset
      "/api/news?relatedTo=:symbol", // Get news related to asset
    ],
    stateManagement: "Complex local state with useState",
    dataRefreshStrategy: "On search + manual refresh",
    interactiveElements: [
      {
        element: "Search input",
        action: "Search for asset",
        implementation: "handleSearchInput + handleSearch functions",
      },
      {
        element: "Analysis buttons",
        action: "Run different types of analysis",
        implementation: "handleAnalysisButtonClick function",
      },
      {
        element: "Risk category buttons",
        action: "Filter by risk category",
        implementation: "handleRiskCategorySelect function",
      },
      {
        element: "Asset recommendation buttons",
        action: "Select recommended asset",
        implementation: "handleAssetSelect function",
      },
      {
        element: "Chat interface",
        action: "Ask questions about asset",
        implementation: "Embedded ChatInterface component",
      },
    ],
  },
}

// Variables Panel Components
export const variablesComponentMapping = {
  VariablesPanel: {
    component: "components/variables-panel.tsx",
    apiEndpoints: [
      "/api/variables", // Get all variables
      "/api/variables/:id", // Update variable
    ],
    serverActions: [
      "updateVariable", // Server action to update variable
    ],
    stateManagement: "Local state with useState + useReducer for complex state",
    dataRefreshStrategy: "On mount + after updates",
    interactiveElements: [
      {
        element: "Category tabs",
        action: "Filter variables by category",
        implementation: "setActiveCategory function",
      },
      {
        element: "Variable sliders",
        action: "Adjust variable values",
        implementation: "handleVariableChange function",
      },
      {
        element: "Toggle switches",
        action: "Enable/disable variables",
        implementation: "handleVariableToggle function",
      },
      {
        element: "Reset buttons",
        action: "Reset variables to default values",
        implementation: "handleResetVariables function",
      },
      {
        element: "Save button",
        action: "Save all variable changes",
        implementation: "handleSaveChanges function calling server action",
      },
    ],
  },
}

// Portfolio Page Components
export const portfolioComponentMapping = {
  PortfolioPage: {
    component: "components/portfolio-page.tsx",
    apiEndpoints: [
      "/api/portfolio", // Get user portfolio
      "/api/portfolio/history", // Get portfolio history
      "/api/assets", // Get available assets
    ],
    serverActions: [
      "addAssetToPortfolio", // Add asset to portfolio
      "updatePortfolioAsset", // Update asset in portfolio
      "removeAssetFromPortfolio", // Remove asset from portfolio
    ],
    stateManagement: "Local state with useState + context for portfolio data",
    dataRefreshStrategy: "On mount + after portfolio changes + manual refresh",
    interactiveElements: [
      {
        element: "Add Asset button",
        action: "Open add asset modal",
        implementation: "setShowAddAssetModal function",
      },
      {
        element: "Asset search in modal",
        action: "Search for assets to add",
        implementation: "handleAssetSearch function",
      },
      {
        element: "Quantity/Price inputs",
        action: "Set purchase details",
        implementation: "handleQuantityChange and handlePriceChange functions",
      },
      {
        element: "Add button in modal",
        action: "Add asset to portfolio",
        implementation: "handleAddAsset function calling server action",
      },
      {
        element: "Remove asset button",
        action: "Remove asset from portfolio",
        implementation: "handleRemoveAsset function calling server action",
      },
      {
        element: "Edit asset button",
        action: "Edit asset details",
        implementation: "handleEditAsset function",
      },
      {
        element: "Timeframe buttons",
        action: "Change chart timeframe",
        implementation: "setTimeframe function",
      },
    ],
  },
}

// Proof Page Components
export const proofComponentMapping = {
  ProofPage: {
    component: "components/proof-page.tsx",
    apiEndpoints: [
      "/api/predictions", // Get all predictions for verification
    ],
    stateManagement: "Complex local state with useState",
    dataRefreshStrategy: "On mount + manual refresh",
    interactiveElements: [
      {
        element: "Refresh Data button",
        action: "Refresh prediction data",
        implementation: "generateMockData function",
      },
      {
        element: "Strategy portfolio cards",
        action: "View strategy details",
        implementation: "setSelectedStrategy function",
      },
      {
        element: "Close Details button",
        action: "Close strategy details",
        implementation: "setSelectedStrategy(null)",
      },
      {
        element: "Portfolio/Predictions tabs",
        action: "Switch between views",
        implementation: "setActiveTab function",
      },
      {
        element: "Time Range slider",
        action: "Filter by time range",
        implementation: "setTimeRangeFilter function",
      },
      {
        element: "Hold Time dropdown",
        action: "Filter by hold time",
        implementation: "setSelectedHoldTime function",
      },
      {
        element: "View Detailed Analytics button",
        action: "Open detailed analytics dialog",
        implementation: "setShowDetailedHistory function",
      },
      {
        element: "Export Data button",
        action: "Export prediction data",
        implementation: "Download function (not implemented in demo)",
      },
    ],
  },
}

// Settings Panel Components
export const settingsComponentMapping = {
  SettingsPanel: {
    component: "components/settings-panel.tsx",
    apiEndpoints: [
      // Custom endpoints for user settings
    ],
    stateManagement: "Local state with useState",
    dataRefreshStrategy: "On mount + after settings changes",
    interactiveElements: [
      {
        element: "Theme toggle",
        action: "Switch between light/dark mode",
        implementation: "handleThemeChange function",
      },
      {
        element: "Notification toggles",
        action: "Enable/disable notifications",
        implementation: "handleNotificationToggle function",
      },
      {
        element: "Email input",
        action: "Update email address",
        implementation: "handleEmailChange function",
      },
      {
        element: "Password inputs",
        action: "Change password",
        implementation: "handlePasswordChange function",
      },
      {
        element: "Save button",
        action: "Save settings changes",
        implementation: "handleSaveSettings function",
      },
    ],
  },
}

// AI Chat Components
export const chatComponentMapping = {
  ChatPage: {
    component: "components/chat-interface.tsx (full page version)",
    apiEndpoints: [
      "/api/chat", // Send message to AI assistant
      "/api/chat/history", // Get chat history
    ],
    stateManagement: "Local state with useState + context for chat history",
    dataRefreshStrategy: "Real-time updates on message send/receive",
    interactiveElements: [
      {
        element: "Message input",
        action: "Type message",
        implementation: "setInput function",
      },
      {
        element: "Send button",
        action: "Send message to AI",
        implementation: "handleSend function",
      },
      {
        element: "Clear chat button",
        action: "Clear chat history",
        implementation: "handleClearChat function",
      },
      {
        element: "Suggestion buttons",
        action: "Use suggested prompts",
        implementation: "handleSuggestionClick function",
      },
    ],
  },
}

// Prediction History Components
export const predictionHistoryComponentMapping = {
  PredictionHistoryPage: {
    component: "components/prediction-history.tsx",
    apiEndpoints: [
      "/api/predictions", // Get all predictions
    ],
    stateManagement: "Local state with useState",
    dataRefreshStrategy: "On mount + manual refresh",
    interactiveElements: [
      {
        element: "Refresh button",
        action: "Refresh prediction data",
        implementation: "handleRefresh function",
      },
      {
        element: "Filter dropdown",
        action: "Filter predictions by asset/timeframe",
        implementation: "handleFilterChange function",
      },
      {
        element: "Sort buttons",
        action: "Sort predictions by different criteria",
        implementation: "handleSort function",
      },
      {
        element: "Pagination controls",
        action: "Navigate between pages of predictions",
        implementation: "handlePageChange function",
      },
      {
        element: "Prediction item",
        action: "View detailed prediction",
        implementation: "handlePredictionSelect function",
      },
    ],
  },
}

// Instant Predictions Components
export const instantPredictionsComponentMapping = {
  InstantPredictions: {
    component: "components/instant-predictions.tsx",
    apiEndpoints: [
      "/api/assets", // Get available assets
      "/api/predictions", // Create new predictions
    ],
    stateManagement: "Local state with useState",
    dataRefreshStrategy: "On mount + after new predictions",
    interactiveElements: [
      {
        element: "Asset search",
        action: "Search for assets",
        implementation: "handleSearch function",
      },
      {
        element: "Timeframe selection",
        action: "Select prediction timeframe",
        implementation: "setTimeframe function",
      },
      {
        element: "Generate button",
        action: "Generate new prediction",
        implementation: "handleGeneratePrediction function",
      },
      {
        element: "Strategy selection",
        action: "Select prediction strategy",
        implementation: "setStrategy function",
      },
      {
        element: "Prediction card",
        action: "View detailed prediction",
        implementation: "handlePredictionSelect function",
      },
    ],
  },
}

// Market Data Components
export const marketDataComponentMapping = {
  MarketDataPage: {
    component: "components/market-data-page.tsx",
    apiEndpoints: [
      "/api/assets", // Get market indices
      "/api/assets/:symbol/history", // Get price history
    ],
    stateManagement: "Local state with useState",
    dataRefreshStrategy: "On mount + periodic refresh",
    interactiveElements: [
      {
        element: "Market index tabs",
        action: "Switch between market indices",
        implementation: "setActiveIndex function",
      },
      {
        element: "Timeframe buttons",
        action: "Change chart timeframe",
        implementation: "setTimeframe function",
      },
      {
        element: "Sector filter",
        action: "Filter by market sector",
        implementation: "setSector function",
      },
      {
        element: "Asset card",
        action: "View detailed asset analysis",
        implementation: "handleAssetSelect function",
      },
    ],
  },
}

// Paper Trading Components
export const paperTradingComponentMapping = {
  PaperTradingPage: {
    component: "components/paper-trading-page.tsx",
    apiEndpoints: [
      // Custom endpoints for paper trading
    ],
    stateManagement: "Complex local state with useReducer",
    dataRefreshStrategy: "On mount + after trades + periodic refresh",
    interactiveElements: [
      {
        element: "Asset search",
        action: "Search for assets to trade",
        implementation: "handleSearch function",
      },
      {
        element: "Buy/Sell buttons",
        action: "Execute paper trades",
        implementation: "handleBuy and handleSell functions",
      },
      {
        element: "Quantity input",
        action: "Set trade quantity",
        implementation: "setQuantity function",
      },
      {
        element: "Order type selection",
        action: "Select order type (market, limit)",
        implementation: "setOrderType function",
      },
      {
        element: "Price input",
        action: "Set limit price",
        implementation: "setLimitPrice function",
      },
      {
        element: "Portfolio tab",
        action: "View paper trading portfolio",
        implementation: "setActiveTab function",
      },
      {
        element: "History tab",
        action: "View trading history",
        implementation: "setActiveTab function",
      },
      {
        element: "Reset button",
        action: "Reset paper trading account",
        implementation: "handleReset function",
      },
    ],
  },
}

// Categories Page Components
export const categoriesComponentMapping = {
  CategoriesPage: {
    component: "components/categories-page.tsx",
    apiEndpoints: [
      "/api/assets", // Get assets by category
    ],
    stateManagement: "Local state with useState",
    dataRefreshStrategy: "On mount + category change",
    interactiveElements: [
      {
        element: "Category cards",
        action: "Select asset category",
        implementation: "handleCategorySelect function",
      },
      {
        element: "Asset cards",
        action: "View detailed asset analysis",
        implementation: "handleAssetSelect function",
      },
      {
        element: "Sort dropdown",
        action: "Sort assets in category",
        implementation: "handleSort function",
      },
      {
        element: "Filter input",
        action: "Filter assets in category",
        implementation: "handleFilter function",
      },
    ],
  },
}

// Export all component mappings
export const allComponentMappings = {
  dashboardComponentMapping,
  analysisComponentMapping,
  variablesComponentMapping,
  portfolioComponentMapping,
  proofComponentMapping,
  settingsComponentMapping,
  chatComponentMapping,
  predictionHistoryComponentMapping,
  instantPredictionsComponentMapping,
  marketDataComponentMapping,
  paperTradingComponentMapping,
  categoriesComponentMapping,
}

