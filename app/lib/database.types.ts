export interface Database {
  public: {
    Tables: {
      subscribers: {
        Row: {
          id: number
          email: string
          created_at: string
          deal_type: 'flights' | 'hotels' | 'airbnb' | 'all'
        }
        Insert: {
          email: string
          deal_type?: 'flights' | 'hotels' | 'airbnb' | 'all'
        }
        Update: {
          email?: string
          deal_type?: 'flights' | 'hotels' | 'airbnb' | 'all'
        }
        Relationships: []
      }
      flight_deals: {
        Row: {
          id: number
          from_location: string
          to_location: string
          price: number
          original_price: number
          airline: string
          dates: string
          savings: number
          featured: boolean
          created_at: string
          active: boolean
        }
        Insert: {
          from_location: string
          to_location: string
          price: number
          original_price: number
          airline: string
          dates: string
          savings: number
          featured?: boolean
          active?: boolean
        }
        Update: {
          from_location?: string
          to_location?: string
          price?: number
          original_price?: number
          airline?: string
          dates?: string
          savings?: number
          featured?: boolean
          active?: boolean
        }
        Relationships: []
      }
      hotel_deals: {
        Row: {
          id: number
          hotel: string
          location: string
          price: number
          original_price: number
          rating: number
          dates: string
          savings: number
          featured: boolean
          created_at: string
          active: boolean
          booking_url: string | null
        }
        Insert: {
          hotel: string
          location: string
          price: number
          original_price: number
          rating: number
          dates: string
          savings: number
          featured?: boolean
          active?: boolean
          booking_url?: string | null
        }
        Update: {
          hotel?: string
          location?: string
          price?: number
          original_price?: number
          rating?: number
          dates?: string
          savings?: number
          featured?: boolean
          active?: boolean
          booking_url?: string | null
        }
        Relationships: []
      }
      airbnb_deals: {
        Row: {
          id: number
          name: string
          location: string
          price: number
          original_price: number
          rating: number
          reviews: number
          dates: string
          savings: number
          featured: boolean
          property_type: string
          guests: number
          created_at: string
          active: boolean
          booking_url: string | null
        }
        Insert: {
          name: string
          location: string
          price: number
          original_price: number
          rating: number
          reviews: number
          dates: string
          savings: number
          featured?: boolean
          property_type: string
          guests: number
          active?: boolean
          booking_url?: string | null
        }
        Update: {
          name?: string
          location?: string
          price?: number
          original_price?: number
          rating?: number
          reviews?: number
          dates?: string
          savings?: number
          featured?: boolean
          property_type?: string
          guests?: number
          active?: boolean
          booking_url?: string | null
        }
        Relationships: []
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

// Helper types for easier use
export type Subscriber = Database['public']['Tables']['subscribers']['Row']
export type FlightDeal = Database['public']['Tables']['flight_deals']['Row']
export type HotelDeal = Database['public']['Tables']['hotel_deals']['Row']
export type AirbnbDeal = Database['public']['Tables']['airbnb_deals']['Row']

// Insert types
export type FlightDealInsert = Database['public']['Tables']['flight_deals']['Insert']
export type FlightDealUpdate = Database['public']['Tables']['flight_deals']['Update']
