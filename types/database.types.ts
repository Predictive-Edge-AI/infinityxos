export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      assets: {
        Row: {
          id: string
          symbol: string
          name: string
          type: string
          coin_id: string | null
          created_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          symbol: string
          name: string
          type: string
          coin_id?: string | null
          created_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          symbol?: string
          name?: string
          type?: string
          coin_id?: string | null
          created_at?: string
          created_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_prices: {
        Row: {
          id: string
          asset_id: string
          price: number
          previous_close: number | null
          change: number | null
          change_percent: number | null
          volume: number | null
          is_latest: boolean
          timestamp: string
        }
        Insert: {
          id?: string
          asset_id: string
          price: number
          previous_close?: number | null
          change?: number | null
          change_percent?: number | null
          volume?: number | null
          is_latest?: boolean
          timestamp?: string
        }
        Update: {
          id?: string
          asset_id?: string
          price?: number
          previous_close?: number | null
          change?: number | null
          change_percent?: number | null
          volume?: number | null
          is_latest?: boolean
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "asset_prices_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      predictions: {
        Row: {
          id: string
          asset_symbol: string
          predicted_price: number
          timeframe: string
          confidence: number
          factors: string[] | null
          created_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          asset_symbol: string
          predicted_price: number
          timeframe: string
          confidence: number
          factors?: string[] | null
          created_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          asset_symbol?: string
          predicted_price?: number
          timeframe?: string
          confidence?: number
          factors?: string[] | null
          created_at?: string
          created_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "predictions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_assets: {
        Row: {
          id: string
          user_id: string
          asset_id: string
          quantity: number
          average_price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          asset_id: string
          quantity: number
          average_price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          asset_id?: string
          quantity?: number
          average_price?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_assets_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolio_assets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_history: {
        Row: {
          id: string
          user_id: string
          value: number
          date: string
        }
        Insert: {
          id?: string
          user_id: string
          value: number
          date?: string
        }
        Update: {
          id?: string
          user_id?: string
          value?: number
          date?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

