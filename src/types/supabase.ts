export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string
          profile_id: string
          order_number: string
          status: string
          total_amount: number
          subtotal: number
          tax: number
          shipping_cost: number
          discount: number
          promo_code: string | null
          payment_status: string
          payment_method: string
          shipping_method: string
          shipping_address: Json
          payment_info: Json | null
          payment_intent_id: string
          tracking_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          profile_id: string
          order_number: string
          status: string
          total_amount: number
          subtotal: number
          tax: number
          shipping_cost: number
          discount: number
          promo_code?: string | null
          payment_status: string
          payment_method: string
          shipping_method: string
          shipping_address: Json
          payment_info?: Json | null
          payment_intent_id: string
          tracking_number?: string | null
          created_at: string
          updated_at: string
        }
        Update: {
          id?: string
          profile_id?: string
          order_number?: string
          status?: string
          total_amount?: number
          subtotal?: number
          tax?: number
          shipping_cost?: number
          discount?: number
          promo_code?: string | null
          payment_status?: string
          payment_method?: string
          shipping_method?: string
          shipping_address?: Json
          payment_info?: Json | null
          payment_intent_id?: string
          tracking_number?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          product_name: string
          product_image: string
          quantity: number
          price: number
          size: string | null
          color: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          order_id: string
          product_id: string
          product_name: string
          product_image: string
          quantity: number
          price: number
          size?: string | null
          color?: string | null
          created_at: string
          updated_at: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          product_name?: string
          product_image?: string
          quantity?: number
          price?: number
          size?: string | null
          color?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          avatar_url?: string | null
          created_at: string
          updated_at: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      profile_users: {
        Row: {
          id: number
          profile_id: string
          phone: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          profile_id: string
          phone?: string | null
          address?: string | null
          created_at: string
          updated_at: string
        }
        Update: {
          id?: number
          profile_id?: string
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
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
  }
}
