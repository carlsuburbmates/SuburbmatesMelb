export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      appeals: {
        Row: {
          appeal_deadline: string
          appeal_reason: string
          appeal_type: string
          created_at: string | null
          evidence_urls: string[] | null
          id: string
          outcome: string | null
          related_dispute_id: string | null
          related_suspension_reason: string | null
          review_deadline: string | null
          review_decision: string | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          updated_at: string | null
          vendor_id: string
          vendor_statement: string | null
        }
        Insert: {
          appeal_deadline: string
          appeal_reason: string
          appeal_type: string
          created_at?: string | null
          evidence_urls?: string[] | null
          id?: string
          outcome?: string | null
          related_dispute_id?: string | null
          related_suspension_reason?: string | null
          review_deadline?: string | null
          review_decision?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
          vendor_id: string
          vendor_statement?: string | null
        }
        Update: {
          appeal_deadline?: string
          appeal_reason?: string
          appeal_type?: string
          created_at?: string | null
          evidence_urls?: string[] | null
          id?: string
          outcome?: string | null
          related_dispute_id?: string | null
          related_suspension_reason?: string | null
          review_deadline?: string | null
          review_decision?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
          vendor_id?: string
          vendor_statement?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appeals_related_dispute_id_fkey"
            columns: ["related_dispute_id"]
            isOneToOne: false
            referencedRelation: "disputes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appeals_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appeals_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      business_profiles: {
        Row: {
          business_name: string
          category_id: number | null
          created_at: string | null
          id: string
          images: Json | null
          is_public: boolean | null
          is_vendor: boolean | null
          phone: string | null
          profile_description: string | null
          profile_image_url: string | null
          slug: string
          suburb_id: number | null
          updated_at: string | null
          user_id: string
          vendor_status: string | null
          vendor_tier: string | null
          website: string | null
        }
        Insert: {
          business_name: string
          category_id?: number | null
          created_at?: string | null
          id?: string
          images?: Json | null
          is_public?: boolean | null
          is_vendor?: boolean | null
          phone?: string | null
          profile_description?: string | null
          profile_image_url?: string | null
          slug: string
          suburb_id?: number | null
          updated_at?: string | null
          user_id: string
          vendor_status?: string | null
          vendor_tier?: string | null
          website?: string | null
        }
        Update: {
          business_name?: string
          category_id?: number | null
          created_at?: string | null
          id?: string
          images?: Json | null
          is_public?: boolean | null
          is_vendor?: boolean | null
          phone?: string | null
          profile_description?: string | null
          profile_image_url?: string | null
          slug?: string
          suburb_id?: number | null
          updated_at?: string | null
          user_id?: string
          vendor_status?: string | null
          vendor_tier?: string | null
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
      disputes: {
        Row: {
          admin_id: string | null
          created_at: string | null
          customer_id: string | null
          decision_at: string | null
          decision_by_admin: string | null
          decision_notes: string | null
          evidence_customer: Json | null
          evidence_vendor: Json | null
          id: string
          order_id: string | null
          refund_request_id: string | null
          resolution_notes: string | null
          resolution_type: string | null
          status: string | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          admin_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          decision_at?: string | null
          decision_by_admin?: string | null
          decision_notes?: string | null
          evidence_customer?: Json | null
          evidence_vendor?: Json | null
          id?: string
          order_id?: string | null
          refund_request_id?: string | null
          resolution_notes?: string | null
          resolution_type?: string | null
          status?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          admin_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          decision_at?: string | null
          decision_by_admin?: string | null
          decision_notes?: string | null
          evidence_customer?: Json | null
          evidence_vendor?: Json | null
          id?: string
          order_id?: string | null
          refund_request_id?: string | null
          resolution_notes?: string | null
          resolution_type?: string | null
          status?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "disputes_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_decision_by_admin_fkey"
            columns: ["decision_by_admin"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_refund_request_id_fkey"
            columns: ["refund_request_id"]
            isOneToOne: false
            referencedRelation: "refund_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      featured_queue: {
        Row: {
          business_profile_id: string
          created_at: string | null
          id: string
          joined_at: string | null
          notified_at: string | null
          payment_deadline: string | null
          position: number | null
          region_id: number | null
          status: string | null
          suburb_label: string | null
          vendor_id: string | null
        }
        Insert: {
          business_profile_id: string
          created_at?: string | null
          id?: string
          joined_at?: string | null
          notified_at?: string | null
          payment_deadline?: string | null
          position?: number | null
          region_id?: number | null
          status?: string | null
          suburb_label?: string | null
          vendor_id?: string | null
        }
        Update: {
          business_profile_id?: string
          created_at?: string | null
          id?: string
          joined_at?: string | null
          notified_at?: string | null
          payment_deadline?: string | null
          position?: number | null
          region_id?: number | null
          status?: string | null
          suburb_label?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "featured_queue_business_profile_id_fkey"
            columns: ["business_profile_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "featured_queue_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "featured_queue_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
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
          stripe_payment_intent_id: string | null
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
          stripe_payment_intent_id?: string | null
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
          stripe_payment_intent_id?: string | null
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
      marketplace_sales: {
        Row: {
          amount_cents: number
          created_at: string
          currency: string
          customer_id: string | null
          id: string
          metadata: Json | null
          platform_fee_cents: number
          product_id: string
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string
          vendor_id: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          currency?: string
          customer_id?: string | null
          id?: string
          metadata?: Json | null
          platform_fee_cents: number
          product_id: string
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id: string
          vendor_id: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          currency?: string
          customer_id?: string | null
          id?: string
          metadata?: Json | null
          platform_fee_cents?: number
          product_id?: string
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_sales_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount_cents: number
          commission_cents: number | null
          created_at: string | null
          customer_id: string | null
          download_url: string | null
          id: string
          product_id: string | null
          status: string | null
          stripe_charge_id: string | null
          stripe_payment_intent_id: string | null
          updated_at: string | null
          vendor_id: string | null
          vendor_net_cents: number
        }
        Insert: {
          amount_cents: number
          commission_cents?: number | null
          created_at?: string | null
          customer_id?: string | null
          download_url?: string | null
          id?: string
          product_id?: string | null
          status?: string | null
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
          vendor_id?: string | null
          vendor_net_cents: number
        }
        Update: {
          amount_cents?: number
          commission_cents?: number | null
          created_at?: string | null
          customer_id?: string | null
          download_url?: string | null
          id?: string
          product_id?: string | null
          status?: string | null
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
          vendor_id?: string | null
          vendor_net_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_vendor_id_fkey"
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
          ip_address: string | null
          product_id: string | null
          user_agent: string | null
          vendor_id: string | null
        }
        Insert: {
          clicked_at?: string | null
          id?: string
          ip_address?: string | null
          product_id?: string | null
          user_agent?: string | null
          vendor_id?: string | null
        }
        Update: {
          clicked_at?: string | null
          id?: string
          ip_address?: string | null
          product_id?: string | null
          user_agent?: string | null
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
          category: string | null
          category_id: number | null
          created_at: string | null
          deleted_at: string | null
          description: string | null
          digital_file_url: string | null
          external_url: string
          file_size_bytes: number | null
          id: string
          images: Json | null
          lga_id: number | null
          price: number | null
          published: boolean | null
          slug: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          category?: string | null
          category_id?: number | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          digital_file_url?: string | null
          external_url: string
          file_size_bytes?: number | null
          id?: string
          images?: Json | null
          lga_id?: number | null
          price?: number | null
          published?: boolean | null
          slug?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          category?: string | null
          category_id?: number | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          digital_file_url?: string | null
          external_url?: string
          file_size_bytes?: number | null
          id?: string
          images?: Json | null
          lga_id?: number | null
          price?: number | null
          published?: boolean | null
          slug?: string | null
          thumbnail_url?: string | null
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
      refund_requests: {
        Row: {
          amount_cents: number
          approved_at: string | null
          created_at: string | null
          customer_id: string | null
          description: string | null
          id: string
          order_id: string | null
          processed_at: string | null
          reason: string
          rejected_at: string | null
          rejected_reason: string | null
          status: string | null
          stripe_refund_id: string | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          amount_cents: number
          approved_at?: string | null
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          id?: string
          order_id?: string | null
          processed_at?: string | null
          reason: string
          rejected_at?: string | null
          rejected_reason?: string | null
          status?: string | null
          stripe_refund_id?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          amount_cents?: number
          approved_at?: string | null
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          id?: string
          order_id?: string | null
          processed_at?: string | null
          reason?: string
          rejected_at?: string | null
          rejected_reason?: string | null
          status?: string | null
          stripe_refund_id?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "refund_requests_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refund_requests_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refund_requests_vendor_id_fkey"
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
      reviews: {
        Row: {
          business_id: string | null
          comment: string | null
          created_at: string | null
          customer_id: string | null
          helpful_count: number | null
          id: string
          rating: number
          updated_at: string | null
          verified_purchase: boolean | null
        }
        Insert: {
          business_id?: string | null
          comment?: string | null
          created_at?: string | null
          customer_id?: string | null
          helpful_count?: number | null
          id?: string
          rating: number
          updated_at?: string | null
          verified_purchase?: boolean | null
        }
        Update: {
          business_id?: string | null
          comment?: string | null
          created_at?: string | null
          customer_id?: string | null
          helpful_count?: number | null
          id?: string
          rating?: number
          updated_at?: string | null
          verified_purchase?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
      transactions_log: {
        Row: {
          amount_cents: number
          created_at: string | null
          id: number
          reason: string | null
          stripe_reference: string | null
          type: string
          vendor_id: string | null
        }
        Insert: {
          amount_cents: number
          created_at?: string | null
          id?: number
          reason?: string | null
          stripe_reference?: string | null
          type: string
          vendor_id?: string | null
        }
        Update: {
          amount_cents?: number
          created_at?: string | null
          id?: number
          reason?: string | null
          stripe_reference?: string | null
          type?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_log_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
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
          abn_verified: boolean | null
          abn_verified_at: string | null
          auto_delisted_until: string | null
          bio: string | null
          business_name: string | null
          can_appeal: boolean | null
          can_sell_products: boolean | null
          commission_rate: number | null
          created_at: string | null
          delist_until: string | null
          dispute_count: number
          id: string
          inactivity_flagged_at: string | null
          is_vendor: boolean | null
          last_activity_at: string | null
          last_dispute_at: string | null
          logo_url: string | null
          payment_reversal_count: number | null
          payment_reversal_window_start: string | null
          primary_region_id: number | null
          product_count: number | null
          product_quota: number | null
          profile_color_hex: string | null
          profile_url: string | null
          secondary_regions: number[] | null
          storage_quota_gb: number | null
          storage_used_mb: number | null
          stripe_account_status: string | null
          stripe_onboarding_complete: boolean | null
          suspended_at: string | null
          suspension_reason: string | null
          updated_at: string | null
          user_id: string | null
          vendor_status: string | null
        }
        Insert: {
          abn?: string | null
          abn_verified?: boolean | null
          abn_verified_at?: string | null
          auto_delisted_until?: string | null
          bio?: string | null
          business_name?: string | null
          can_appeal?: boolean | null
          can_sell_products?: boolean | null
          commission_rate?: number | null
          created_at?: string | null
          delist_until?: string | null
          dispute_count?: number
          id?: string
          inactivity_flagged_at?: string | null
          is_vendor?: boolean | null
          last_activity_at?: string | null
          last_dispute_at?: string | null
          logo_url?: string | null
          payment_reversal_count?: number | null
          payment_reversal_window_start?: string | null
          primary_region_id?: number | null
          product_count?: number | null
          product_quota?: number | null
          profile_color_hex?: string | null
          profile_url?: string | null
          secondary_regions?: number[] | null
          storage_quota_gb?: number | null
          storage_used_mb?: number | null
          stripe_account_status?: string | null
          stripe_onboarding_complete?: boolean | null
          suspended_at?: string | null
          suspension_reason?: string | null
          updated_at?: string | null
          user_id?: string | null
          vendor_status?: string | null
        }
        Update: {
          abn?: string | null
          abn_verified?: boolean | null
          abn_verified_at?: string | null
          auto_delisted_until?: string | null
          bio?: string | null
          business_name?: string | null
          can_appeal?: boolean | null
          can_sell_products?: boolean | null
          commission_rate?: number | null
          created_at?: string | null
          delist_until?: string | null
          dispute_count?: number
          id?: string
          inactivity_flagged_at?: string | null
          is_vendor?: boolean | null
          last_activity_at?: string | null
          last_dispute_at?: string | null
          logo_url?: string | null
          payment_reversal_count?: number | null
          payment_reversal_window_start?: string | null
          primary_region_id?: number | null
          product_count?: number | null
          product_quota?: number | null
          profile_color_hex?: string | null
          profile_url?: string | null
          secondary_regions?: number[] | null
          storage_quota_gb?: number | null
          storage_used_mb?: number | null
          stripe_account_status?: string | null
          stripe_onboarding_complete?: boolean | null
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
      auto_reject_expired_appeals: { Args: never; Returns: number }
      fn_try_reserve_featured_slot:
        | {
            Args: {
              p_business_profile_id: string
              p_end_date: string
              p_lga_cap: number
              p_lga_id: number
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
      fn_unpublish_oldest_products: {
        Args: { p_to_unpublish: number; p_vendor_id: string }
        Returns: undefined
      }
      get_vendor_status: { Args: { vendor_uuid: string }; Returns: string }
      get_vendor_tier: { Args: { vendor_uuid: string }; Returns: string }
      is_appeal_within_deadline: {
        Args: { suspension_date: string; vendor_uuid: string }
        Returns: boolean
      }
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

