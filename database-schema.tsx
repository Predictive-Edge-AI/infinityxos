/**
 * This file defines the database schema required by the front-end components.
 * It serves as a reference for the back-end developer to ensure all necessary tables and fields are created.
 */

export const databaseSchema = {
  // Users table - stores user information
  users: {
    fields: {
      id: "UUID PRIMARY KEY DEFAULT uuid_generate_v4()",
      email: "TEXT UNIQUE NOT NULL",
      created_at: "TIMESTAMP WITH TIME ZONE DEFAULT NOW()",
      last_sign_in: "TIMESTAMP WITH TIME ZONE",
      settings: "JSONB DEFAULT '{}'::jsonb",
    },
    indexes: ["CREATE INDEX users_email_idx ON users(email)"],
    description: "Stores user account information",
    requiredBy: ["Authentication flow", "User settings", "Portfolio management"],
  },

  // Assets table - stores information about financial assets
  assets: {
    fields: {
      id: "UUID PRIMARY KEY DEFAULT uuid_generate_v4()",
      symbol: "TEXT UNIQUE NOT NULL",
      name: "TEXT NOT NULL",
      type: "TEXT NOT NULL", // Stock, Crypto, Commodity, etc.
      coin_id: "TEXT", // For cryptocurrencies, used with external APIs
      created_at: "TIMESTAMP WITH TIME ZONE DEFAULT NOW()",
      created_by: "UUID REFERENCES users(id)",
    },
    indexes: ["CREATE INDEX assets_symbol_idx ON assets(symbol)", "CREATE INDEX assets_type_idx ON assets(type)"],
    description: "Stores information about financial assets",
    requiredBy: ["Asset search", "Portfolio management", "Market data page", "Analysis page"],
  },

  // Asset prices table - stores historical and current prices
  asset_prices: {
    fields: {
      id: "UUID PRIMARY KEY DEFAULT uuid_generate_v4()",
      asset_id: "UUID REFERENCES assets(id) NOT NULL",
      price: "DECIMAL NOT NULL",
      previous_close: "DECIMAL",
      change: "DECIMAL",
      change_percent: "DECIMAL",
      volume: "DECIMAL",
      is_latest: "BOOLEAN DEFAULT FALSE",
      timestamp: "TIMESTAMP WITH TIME ZONE DEFAULT NOW()",
    },
    indexes: [
      "CREATE INDEX asset_prices_asset_id_idx ON asset_prices(asset_id)",
      "CREATE INDEX asset_prices_is_latest_idx ON asset_prices(is_latest)",
      "CREATE INDEX asset_prices_timestamp_idx ON asset_prices(timestamp)",
    ],
    description: "Stores historical and current asset prices",
    requiredBy: ["Price charts", "Portfolio valuation", "Asset cards", "Market data page"],
  },

  // Predictions table - stores AI-generated predictions
  predictions: {
    fields: {
      id: "UUID PRIMARY KEY DEFAULT uuid_generate_v4()",
      asset_symbol: "TEXT REFERENCES assets(symbol) NOT NULL",
      predicted_price: "DECIMAL NOT NULL",
      timeframe: "TEXT NOT NULL", // e.g., '7d', '30d', '90d'
      confidence: "DECIMAL NOT NULL", // 0-100
      factors: "TEXT[]", // Factors that influenced the prediction
      created_at: "TIMESTAMP WITH TIME ZONE DEFAULT NOW()",
      created_by: "UUID REFERENCES users(id)",
    },
    indexes: [
      "CREATE INDEX predictions_asset_symbol_idx ON predictions(asset_symbol)",
      "CREATE INDEX predictions_created_at_idx ON predictions(created_at)",
      "CREATE INDEX predictions_timeframe_idx ON predictions(timeframe)",
    ],
    description: "Stores AI-generated price predictions",
    requiredBy: ["Top predictions component", "Asset analysis page", "Prediction history page", "Proof page"],
  },

  // Portfolio assets table - stores user portfolio holdings
  portfolio_assets: {
    fields: {
      id: "UUID PRIMARY KEY DEFAULT uuid_generate_v4()",
      user_id: "UUID REFERENCES users(id) NOT NULL",
      asset_id: "UUID REFERENCES assets(id) NOT NULL",
      quantity: "DECIMAL NOT NULL",
      average_price: "DECIMAL NOT NULL",
      created_at: "TIMESTAMP WITH TIME ZONE DEFAULT NOW()",
      updated_at: "TIMESTAMP WITH TIME ZONE DEFAULT NOW()",
    },
    indexes: [
      "CREATE INDEX portfolio_assets_user_id_idx ON portfolio_assets(user_id)",
      "CREATE INDEX portfolio_assets_asset_id_idx ON portfolio_assets(asset_id)",
      "CREATE UNIQUE INDEX portfolio_assets_user_asset_idx ON portfolio_assets(user_id, asset_id)",
    ],
    description: "Stores user portfolio holdings",
    requiredBy: ["Portfolio page", "Dashboard overview", "Portfolio predictions"],
  },

  // Portfolio history table - stores historical portfolio values
  portfolio_history: {
    fields: {
      id: "UUID PRIMARY KEY DEFAULT uuid_generate_v4()",
      user_id: "UUID REFERENCES users(id) NOT NULL",
      value: "DECIMAL NOT NULL",
      date: "DATE NOT NULL",
    },
    indexes: [
      "CREATE INDEX portfolio_history_user_id_idx ON portfolio_history(user_id)",
      "CREATE INDEX portfolio_history_date_idx ON portfolio_history(date)",
      "CREATE UNIQUE INDEX portfolio_history_user_date_idx ON portfolio_history(user_id, date)",
    ],
    description: "Stores historical portfolio values",
    requiredBy: ["Portfolio performance chart", "Portfolio predictions"],
  },

  // Variables table - stores trading variables and parameters
  variables: {
    fields: {
      id: "UUID PRIMARY KEY DEFAULT uuid_generate_v4()",
      name: "TEXT NOT NULL",
      description: "TEXT",
      value: "DECIMAL NOT NULL",
      category: "TEXT NOT NULL",
      is_active: "BOOLEAN DEFAULT TRUE",
      created_at: "TIMESTAMP WITH TIME ZONE DEFAULT NOW()",
      updated_at: "TIMESTAMP WITH TIME ZONE DEFAULT NOW()",
    },
    indexes: [
      "CREATE INDEX variables_category_idx ON variables(category)",
      "CREATE INDEX variables_is_active_idx ON variables(is_active)",
    ],
    description: "Stores trading variables and parameters",
    requiredBy: ["Variables panel", "Prediction generation"],
  },

  // News table - stores financial news articles
  news: {
    fields: {
      id: "UUID PRIMARY KEY DEFAULT uuid_generate_v4()",
      title: "TEXT NOT NULL",
      content: "TEXT NOT NULL",
      source: "TEXT NOT NULL",
      url: "TEXT NOT NULL",
      published_at: "TIMESTAMP WITH TIME ZONE NOT NULL",
      sentiment: "TEXT", // Positive, Negative, Neutral
      related_assets: "TEXT[]", // Asset symbols related to the news
    },
    indexes: [
      "CREATE INDEX news_published_at_idx ON news(published_at)",
      "CREATE INDEX news_sentiment_idx ON news(sentiment)",
      "CREATE INDEX news_related_assets_idx ON news USING GIN(related_assets)",
    ],
    description: "Stores financial news articles",
    requiredBy: ["News feed component", "Asset analysis page"],
  },

  // Chat messages table - stores AI assistant chat history
  chat_messages: {
    fields: {
      id: "UUID PRIMARY KEY DEFAULT uuid_generate_v4()",
      user_id: "UUID REFERENCES users(id) NOT NULL",
      role: "TEXT NOT NULL", // 'user' or 'assistant'
      content: "TEXT NOT NULL",
      created_at: "TIMESTAMP WITH TIME ZONE DEFAULT NOW()",
    },
    indexes: [
      "CREATE INDEX chat_messages_user_id_idx ON chat_messages(user_id)",
      "CREATE INDEX chat_messages_created_at_idx ON chat_messages(created_at)",
    ],
    description: "Stores AI assistant chat history",
    requiredBy: ["Chat interface component"],
  },

  // Paper trading accounts table - stores paper trading account information
  paper_trading_accounts: {
    fields: {
      id: "UUID PRIMARY KEY DEFAULT uuid_generate_v4()",
      user_id: "UUID REFERENCES users(id) NOT NULL",
      balance: "DECIMAL NOT NULL",
      initial_balance: "DECIMAL NOT NULL",
      created_at: "TIMESTAMP WITH TIME ZONE DEFAULT NOW()",
      updated_at: "TIMESTAMP WITH TIME ZONE DEFAULT NOW()",
    },
    indexes: ["CREATE INDEX paper_trading_accounts_user_id_idx ON paper_trading_accounts(user_id)"],
    description: "Stores paper trading account information",
    requiredBy: ["Paper trading page"],
  },

  // Paper trading positions table - stores paper trading positions
  paper_trading_positions: {
    fields: {
      id: "UUID PRIMARY KEY DEFAULT uuid_generate_v4()",
      account_id: "UUID REFERENCES paper_trading_accounts(id) NOT NULL",
      asset_id: "UUID REFERENCES assets(id) NOT NULL",
      quantity: "DECIMAL NOT NULL",
      average_price: "DECIMAL NOT NULL",
      created_at: "TIMESTAMP WITH TIME ZONE DEFAULT NOW()",
      updated_at: "TIMESTAMP WITH TIME ZONE DEFAULT NOW()",
    },
    indexes: [
      "CREATE INDEX paper_trading_positions_account_id_idx ON paper_trading_positions(account_id)",
      "CREATE INDEX paper_trading_positions_asset_id_idx ON paper_trading_positions(asset_id)",
    ],
    description: "Stores paper trading positions",
    requiredBy: ["Paper trading page"],
  },

  // Paper trading transactions table - stores paper trading transactions
  paper_trading_transactions: {
    fields: {
      id: "UUID PRIMARY KEY DEFAULT uuid_generate_v4()",
      account_id: "UUID REFERENCES paper_trading_accounts(id) NOT NULL",
      asset_id: "UUID REFERENCES assets(id) NOT NULL",
      type: "TEXT NOT NULL", // 'buy' or 'sell'
      quantity: "DECIMAL NOT NULL",
      price: "DECIMAL NOT NULL",
      total: "DECIMAL NOT NULL",
      created_at: "TIMESTAMP WITH TIME ZONE DEFAULT NOW()",
    },
    indexes: [
      "CREATE INDEX paper_trading_transactions_account_id_idx ON paper_trading_transactions(account_id)",
      "CREATE INDEX paper_trading_transactions_asset_id_idx ON paper_trading_transactions(asset_id)",
      "CREATE INDEX paper_trading_transactions_created_at_idx ON paper_trading_transactions(created_at)",
    ],
    description: "Stores paper trading transactions",
    requiredBy: ["Paper trading page"],
  },

  // Strategy portfolios table - stores predefined strategy portfolios
  strategy_portfolios: {
    fields: {
      id: "UUID PRIMARY KEY DEFAULT uuid_generate_v4()",
      name: "TEXT NOT NULL",
      description: "TEXT",
      risk_level: "TEXT NOT NULL", // Low, Medium, High
      performance: "DECIMAL",
      assets: "JSONB NOT NULL", // Array of asset symbols and weights
      created_at: "TIMESTAMP WITH TIME ZONE DEFAULT NOW()",
      updated_at: "TIMESTAMP WITH TIME ZONE DEFAULT NOW()",
    },
    indexes: ["CREATE INDEX strategy_portfolios_risk_level_idx ON strategy_portfolios(risk_level)"],
    description: "Stores predefined strategy portfolios",
    requiredBy: ["Proof page", "Portfolio page"],
  },
}

// SQL to create all tables
export const createTablesSQL = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_sign_in TIMESTAMP WITH TIME ZONE,
  settings JSONB DEFAULT '{}'::jsonb
);

-- Assets table
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  symbol TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  coin_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Asset prices table
CREATE TABLE IF NOT EXISTS asset_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id UUID REFERENCES assets(id) NOT NULL,
  price DECIMAL NOT NULL,
  previous_close DECIMAL,
  change DECIMAL,
  change_percent DECIMAL,
  volume DECIMAL,
  is_latest BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Predictions table
CREATE TABLE IF NOT EXISTS predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_symbol TEXT NOT NULL,
  predicted_price DECIMAL NOT NULL,
  timeframe TEXT NOT NULL,
  confidence DECIMAL NOT NULL,
  factors TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  FOREIGN KEY (asset_symbol) REFERENCES assets(symbol)
);

-- Portfolio assets table
CREATE TABLE IF NOT EXISTS portfolio_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  asset_id UUID REFERENCES assets(id) NOT NULL,
  quantity DECIMAL NOT NULL,
  average_price DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, asset_id)
);

-- Portfolio history table
CREATE TABLE IF NOT EXISTS portfolio_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  value DECIMAL NOT NULL,
  date DATE NOT NULL,
  UNIQUE(user_id, date)
);

-- Variables table
CREATE TABLE IF NOT EXISTS variables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  value DECIMAL NOT NULL,
  category TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News table
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source TEXT NOT NULL,
  url TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  sentiment TEXT,
  related_assets TEXT[]
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Paper trading accounts table
CREATE TABLE IF NOT EXISTS paper_trading_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  balance DECIMAL NOT NULL,
  initial_balance DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Paper trading positions table
CREATE TABLE IF NOT EXISTS paper_trading_positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES paper_trading_accounts(id) NOT NULL,
  asset_id UUID REFERENCES assets(id) NOT NULL,
  quantity DECIMAL NOT NULL,
  average_price DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Paper trading transactions table
CREATE TABLE IF NOT EXISTS paper_trading_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES paper_trading_accounts(id) NOT NULL,
  asset_id UUID REFERENCES assets(id) NOT NULL,
  type TEXT NOT NULL,
  quantity DECIMAL NOT NULL,
  price DECIMAL NOT NULL,
  total DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Strategy portfolios table
CREATE TABLE IF NOT EXISTS strategy_portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  risk_level TEXT NOT NULL,
  performance DECIMAL,
  assets JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);

CREATE INDEX IF NOT EXISTS assets_symbol_idx ON assets(symbol);
CREATE INDEX IF NOT EXISTS assets_type_idx ON assets(type);

CREATE INDEX IF NOT EXISTS asset_prices_asset_id_idx ON asset_prices(asset_id);
CREATE INDEX IF NOT EXISTS asset_prices_is_latest_idx ON asset_prices(is_latest);
CREATE INDEX IF NOT EXISTS asset_prices_timestamp_idx ON asset_prices(timestamp);

CREATE INDEX IF NOT EXISTS predictions_asset_symbol_idx ON predictions(asset_symbol);
CREATE INDEX IF NOT EXISTS predictions_created_at_idx ON predictions(created_at);
CREATE INDEX IF NOT EXISTS predictions_timeframe_idx ON predictions(timeframe);

CREATE INDEX IF NOT EXISTS portfolio_assets_user_id_idx ON portfolio_assets(user_id);
CREATE INDEX IF NOT EXISTS portfolio_assets_asset_id_idx ON portfolio_assets(asset_id);

CREATE INDEX IF NOT EXISTS portfolio_history_user_id_idx ON portfolio_history(user_id);
CREATE INDEX IF NOT EXISTS portfolio_history_date_idx ON portfolio_history(date);

CREATE INDEX IF NOT EXISTS variables_category_idx ON variables(category);
CREATE INDEX IF NOT EXISTS variables_is_active_idx ON variables(is_active);

CREATE INDEX IF NOT EXISTS news_published_at_idx ON news(published_at);
CREATE INDEX IF NOT EXISTS news_sentiment_idx ON news(sentiment);
CREATE INDEX IF NOT EXISTS news_related_assets_idx ON news USING GIN(related_assets);

CREATE INDEX IF NOT EXISTS chat_messages_user_id_idx ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS chat_messages_created_at_idx ON chat_messages(created_at);

CREATE INDEX IF NOT EXISTS paper_trading_accounts_user_id_idx ON paper_trading_accounts(user_id);

CREATE INDEX IF NOT EXISTS paper_trading_positions_account_id_idx ON paper_trading_positions(account_id);
CREATE INDEX IF NOT EXISTS paper_trading_positions_asset_id_idx ON paper_trading_positions(asset_id);

CREATE INDEX IF NOT EXISTS paper_trading_transactions_account_id_idx ON paper_trading_transactions(account_id);
CREATE INDEX IF NOT EXISTS paper_trading_transactions_asset_id_idx ON paper_trading_transactions(asset_id);
CREATE INDEX IF NOT EXISTS paper_trading_transactions_created_at_idx ON paper_trading_transactions(created_at);

CREATE INDEX IF NOT EXISTS strategy_portfolios_risk_level_idx ON strategy_portfolios(risk_level);
`

