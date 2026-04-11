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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      business_profiles: {
        Row: {
          business_name: string
          category_id: number | null
          created_at: string | null
          id: string
          images: Json | null
          is_public: boolean | null
          phone: string | null
          profile_description: string | null
          profile_image_url: string | null
          slug: string
          suburb_id: number | null
          updated_at: string | null
          user_id: string
          vendor_status: string | null
          website: string | null
        }
        Insert: {
          business_name: string
          category_id?: number | null
          created_at?: string | null
          id?: string
          images?: Json | null
          is_public?: boolean | null
          phone?: string | null
          profile_description?: string | null
          profile_image_url?: string | null
          slug: string
          suburb_id?: number | null
          updated_at?: string | null
          user_id: string
          vendor_status?: string | null
          website?: string | null
        }
        Update: {
          business_name?: string
          category_id?: number | null
          created_at?: string | null
          id?: string
          images?: Json | null
          is_public?: boolean | null
          phone?: string | null
          profile_description?: string | null
          profile_image_url?: string | null
          slug?: string
          suburb_id?: number | null
          updated_at?: string | null
          user_id?: string
          vendor_status?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_profiles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          icon_url: string | null
          id: number
          name: string
          slug: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: number
          name: string
          slug?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: number
          name?: string
          slug?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          metadata: Json | null
          name: string
          status: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          metadata?: Json | null
          name: string
          status?: string
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          metadata?: Json | null
          name?: string
          status?: string
          subject?: string
        }
        Relationships: []
      }
      featured_slot_reminders: {
        Row: {
          error: string | null
          featured_slot_id: string
          id: string
          reminder_window: number
          sent_at: string
          status: string
          vendor_id: string
        }
        Insert: {
          error?: string | null
          featured_slot_id: string
          id?: string
          reminder_window: number
          sent_at?: string
          status?: string
          vendor_id: string
        }
        Update: {
          error?: string | null
          featured_slot_id?: string
          id?: string
          reminder_window?: number
          sent_at?: string
          status?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "featured_slot_reminders_featured_slot_id_fkey"
            columns: ["featured_slot_id"]
            isOneToOne: false
            referencedRelation: "featured_slots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "featured_slot_reminders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      featured_slots: {
        Row: {
          business_profile_id: string
          charged_amount_cents: number
          created_at: string | null
          end_date: string
          id: string
          region_id: number | null
          start_date: string
          status: string | null
          suburb_label: string | null
          vendor_id: string | null
        }
        Insert: {
          business_profile_id: string
          charged_amount_cents?: number
          created_at?: string | null
          end_date: string
          id?: string
          region_id?: number | null
          start_date: string
          status?: string | null
          suburb_label?: string | null
          vendor_id?: string | null
        }
        Update: {
          business_profile_id?: string
          charged_amount_cents?: number
          created_at?: string | null
          end_date?: string
          id?: string
          region_id?: number | null
          start_date?: string
          status?: string | null
          suburb_label?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "featured_slots_business_profile_id_fkey"
            columns: ["business_profile_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "featured_slots_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "featured_slots_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_featured_vendor"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      outbound_clicks: {
        Row: {
          clicked_at: string | null
          id: string
          product_id: string | null
          vendor_id: string | null
        }
        Insert: {
          clicked_at?: string | null
          id?: string
          product_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          clicked_at?: string | null
          id?: string
          product_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "outbound_clicks_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outbound_clicks_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: number | null
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string
          image_urls: string[] | null
          is_active: boolean | null
          is_archived: boolean | null
          price: number | null
          product_url: string
          slug: string | null
          title: string
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          image_urls?: string[] | null
          is_active?: boolean | null
          is_archived?: boolean | null
          price?: number | null
          product_url: string
          slug?: string | null
          title: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          category_id?: number | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          image_urls?: string[] | null
          is_active?: boolean | null
          is_archived?: boolean | null
          price?: number | null
          product_url?: string
          slug?: string | null
          title?: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      regions: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: number
          name: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: number
          name: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      search_logs: {
        Row: {
          created_at: string | null
          filters: Json | null
          hashed_query: string
          id: string
          result_count: number | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          filters?: Json | null
          hashed_query: string
          id?: string
          result_count?: number | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          filters?: Json | null
          hashed_query?: string
          id?: string
          result_count?: number | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "search_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_as_business_owner_at: string | null
          created_at: string | null
          deleted_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string | null
          user_type: string | null
        }
        Insert: {
          created_as_business_owner_at?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Update: {
          created_as_business_owner_at?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Relationships: []
      }
      vendors: {
        Row: {
          abn: string | null
          bio: string | null
          business_name: string | null
          can_appeal: boolean | null
          created_at: string | null
          id: string
          inactivity_flagged_at: string | null
          last_activity_at: string | null
          logo_url: string | null
          primary_region_id: number | null
          product_count: number | null
          secondary_regions: number[] | null
          suspended_at: string | null
          suspension_reason: string | null
          updated_at: string | null
          user_id: string | null
          vendor_status: string | null
        }
        Insert: {
          abn?: string | null
          bio?: string | null
          business_name?: string | null
          can_appeal?: boolean | null
          created_at?: string | null
          id?: string
          inactivity_flagged_at?: string | null
          last_activity_at?: string | null
          logo_url?: string | null
          primary_region_id?: number | null
          product_count?: number | null
          secondary_regions?: number[] | null
          suspended_at?: string | null
          suspension_reason?: string | null
          updated_at?: string | null
          user_id?: string | null
          vendor_status?: string | null
        }
        Update: {
          abn?: string | null
          bio?: string | null
          business_name?: string | null
          can_appeal?: boolean | null
          created_at?: string | null
          id?: string
          inactivity_flagged_at?: string | null
          last_activity_at?: string | null
          logo_url?: string | null
          primary_region_id?: number | null
          product_count?: number | null
          secondary_regions?: number[] | null
          suspended_at?: string | null
          suspension_reason?: string | null
          updated_at?: string | null
          user_id?: string | null
          vendor_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendors_primary_region_id_fkey"
            columns: ["primary_region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          payload: Json | null
          processed_at: string | null
          stripe_event_id: string
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          payload?: Json | null
          processed_at?: string | null
          stripe_event_id: string
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          payload?: Json | null
          processed_at?: string | null
          stripe_event_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      fn_try_reserve_featured_slot:
        | {
            Args: {
              p_business_profile_id: string
              p_end_date: string
              p_region_cap: number
              p_region_id: number
              p_start_date: string
              p_suburb_label: string
              p_vendor_cap: number
              p_vendor_id: string
            }
            Returns: string
          }
        | {
            Args: {
              p_end_date: string
              p_lga_id: number
              p_start_date: string
              p_suburb_label: string
              p_vendor_id: string
            }
            Returns: string
          }
      get_daily_shuffle_products: {
        Args: { p_limit?: number }
        Returns: {
          business_name: string
          business_slug: string
          created_at: string
          description: string
          id: string
          image_urls: string[]
          product_url: string
          title: string
          vendor_id: string
        }[]
      }
      get_vendor_status: { Args: { vendor_uuid: string }; Returns: string }
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
