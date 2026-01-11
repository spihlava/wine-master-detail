export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      bottle_movements: {
        Row: {
          bottle_id: string
          created_at: string
          from_bin: string | null
          from_location: string | null
          id: string
          moved_at: string
          notes: string | null
          reason: string | null
          to_bin: string | null
          to_location: string
        }
        Insert: {
          bottle_id: string
          created_at?: string
          from_bin?: string | null
          from_location?: string | null
          id?: string
          moved_at?: string
          notes?: string | null
          reason?: string | null
          to_bin?: string | null
          to_location: string
        }
        Update: {
          bottle_id?: string
          created_at?: string
          from_bin?: string | null
          from_location?: string | null
          id?: string
          moved_at?: string
          notes?: string | null
          reason?: string | null
          to_bin?: string | null
          to_location?: string
        }
        Relationships: [
          {
            foreignKeyName: "bottle_movements_bottle_id_fkey"
            columns: ["bottle_id"]
            isOneToOne: false
            referencedRelation: "bottles"
            referencedColumns: ["id"]
          },
        ]
      }
      bottle_tastings: {
        Row: {
          bottle_id: string
          created_at: string
          food_pairing: string | null
          id: string
          notes: string | null
          occasion: string | null
          rating: number | null
          tasted_at: string
          tasting_stage: string
        }
        Insert: {
          bottle_id: string
          created_at?: string
          food_pairing?: string | null
          id?: string
          notes?: string | null
          occasion?: string | null
          rating?: number | null
          tasted_at: string
          tasting_stage?: string
        }
        Update: {
          bottle_id?: string
          created_at?: string
          food_pairing?: string | null
          id?: string
          notes?: string | null
          occasion?: string | null
          rating?: number | null
          tasted_at?: string
          tasting_stage?: string
        }
        Relationships: [
          {
            foreignKeyName: "bottle_tastings_bottle_id_fkey"
            columns: ["bottle_id"]
            isOneToOne: false
            referencedRelation: "bottles"
            referencedColumns: ["id"]
          },
        ]
      }
      bottle_transactions: {
        Row: {
          bottle_id: string
          counterparty: string | null
          created_at: string
          id: string
          notes: string | null
          price: number | null
          transaction_date: string
          transaction_type: string
        }
        Insert: {
          bottle_id: string
          counterparty?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          price?: number | null
          transaction_date: string
          transaction_type: string
        }
        Update: {
          bottle_id?: string
          counterparty?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          price?: number | null
          transaction_date?: string
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "bottle_transactions_bottle_id_fkey"
            columns: ["bottle_id"]
            isOneToOne: false
            referencedRelation: "bottles"
            referencedColumns: ["id"]
          },
        ]
      }
      bottles: {
        Row: {
          barcode: string | null
          bin: string | null
          consumed_date: string | null
          created_at: string
          id: string
          location: string | null
          my_notes: string | null
          my_rating: number | null
          price: number | null
          purchase_date: string | null
          purchase_location: string | null
          purchase_price: number | null
          size: string | null
          status: string
          updated_at: string
          wine_id: string
        }
        Insert: {
          barcode?: string | null
          bin?: string | null
          consumed_date?: string | null
          created_at?: string
          id?: string
          location?: string | null
          my_notes?: string | null
          my_rating?: number | null
          price?: number | null
          purchase_date?: string | null
          purchase_location?: string | null
          purchase_price?: number | null
          size?: string | null
          status?: string
          updated_at?: string
          wine_id: string
        }
        Update: {
          barcode?: string | null
          bin?: string | null
          consumed_date?: string | null
          created_at?: string
          id?: string
          location?: string | null
          my_notes?: string | null
          my_rating?: number | null
          price?: number | null
          purchase_date?: string | null
          purchase_location?: string | null
          purchase_price?: number | null
          size?: string | null
          status?: string
          updated_at?: string
          wine_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bottles_wine_id_fkey"
            columns: ["wine_id"]
            isOneToOne: false
            referencedRelation: "wines"
            referencedColumns: ["id"]
          },
        ]
      }
      wines: {
        Row: {
          abv: number | null
          appellation: string | null
          begin_consume: number | null
          country: string | null
          created_at: string
          end_consume: number | null
          food_pairing: string | null
          id: string
          image_url: string | null
          master_varietal: string | null
          name: string
          producer: string | null
          rating_max: number | null
          rating_min: number | null
          rating_notes: string | null
          region: string | null
          sub_region: string | null
          type: string | null
          updated_at: string
          varietal: string | null
          vintage: number | null
        }
        Insert: {
          abv?: number | null
          appellation?: string | null
          begin_consume?: number | null
          country?: string | null
          created_at?: string
          end_consume?: number | null
          food_pairing?: string | null
          id?: string
          image_url?: string | null
          master_varietal?: string | null
          name: string
          producer?: string | null
          rating_max?: number | null
          rating_min?: number | null
          rating_notes?: string | null
          region?: string | null
          sub_region?: string | null
          type?: string | null
          updated_at?: string
          varietal?: string | null
          vintage?: number | null
        }
        Update: {
          abv?: number | null
          appellation?: string | null
          begin_consume?: number | null
          country?: string | null
          created_at?: string
          end_consume?: number | null
          food_pairing?: string | null
          id?: string
          image_url?: string | null
          master_varietal?: string | null
          name?: string
          producer?: string | null
          rating_max?: number | null
          rating_min?: number | null
          rating_notes?: string | null
          region?: string | null
          sub_region?: string | null
          type?: string | null
          updated_at?: string
          varietal?: string | null
          vintage?: number | null
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
