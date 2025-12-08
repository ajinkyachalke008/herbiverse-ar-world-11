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
      community_discoveries: {
        Row: {
          comments_count: number | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string
          likes_count: number | null
          location: string | null
          plant_name: string | null
          scan_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          comments_count?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url: string
          likes_count?: number | null
          location?: string | null
          plant_name?: string | null
          scan_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          comments_count?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string
          likes_count?: number | null
          location?: string | null
          plant_name?: string | null
          scan_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_discoveries_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "plant_scans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_discoveries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      discovery_comments: {
        Row: {
          comment: string
          created_at: string | null
          discovery_id: string
          id: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string | null
          discovery_id: string
          id?: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string | null
          discovery_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discovery_comments_discovery_id_fkey"
            columns: ["discovery_id"]
            isOneToOne: false
            referencedRelation: "community_discoveries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discovery_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      discovery_likes: {
        Row: {
          created_at: string | null
          discovery_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          discovery_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          discovery_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discovery_likes_discovery_id_fkey"
            columns: ["discovery_id"]
            isOneToOne: false
            referencedRelation: "community_discoveries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discovery_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      plant_scans: {
        Row: {
          active_compounds: Json | null
          common_name: string | null
          confidence: string | null
          conservation_status: string | null
          created_at: string | null
          cultural_significance: string | null
          dosage: string | null
          family: string | null
          habitat: string | null
          id: string
          identification: string | null
          is_favorite: boolean | null
          is_public: boolean | null
          medicinal_uses: Json | null
          plant_image_url: string
          preparation: Json | null
          safety_warnings: Json | null
          scan_location: string | null
          scientific_name: string | null
          user_id: string
        }
        Insert: {
          active_compounds?: Json | null
          common_name?: string | null
          confidence?: string | null
          conservation_status?: string | null
          created_at?: string | null
          cultural_significance?: string | null
          dosage?: string | null
          family?: string | null
          habitat?: string | null
          id?: string
          identification?: string | null
          is_favorite?: boolean | null
          is_public?: boolean | null
          medicinal_uses?: Json | null
          plant_image_url: string
          preparation?: Json | null
          safety_warnings?: Json | null
          scan_location?: string | null
          scientific_name?: string | null
          user_id: string
        }
        Update: {
          active_compounds?: Json | null
          common_name?: string | null
          confidence?: string | null
          conservation_status?: string | null
          created_at?: string | null
          cultural_significance?: string | null
          dosage?: string | null
          family?: string | null
          habitat?: string | null
          id?: string
          identification?: string | null
          is_favorite?: boolean | null
          is_public?: boolean | null
          medicinal_uses?: Json | null
          plant_image_url?: string
          preparation?: Json | null
          safety_warnings?: Json | null
          scan_location?: string | null
          scientific_name?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plant_scans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          favorite_herb: string | null
          full_name: string | null
          id: string
          joined_date: string | null
          location: string | null
          total_discoveries: number | null
          total_scans: number | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          favorite_herb?: string | null
          full_name?: string | null
          id: string
          joined_date?: string | null
          location?: string | null
          total_discoveries?: number | null
          total_scans?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          favorite_herb?: string | null
          full_name?: string | null
          id?: string
          joined_date?: string | null
          location?: string | null
          total_discoveries?: number | null
          total_scans?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      symptom_queries: {
        Row: {
          created_at: string
          id: string
          parsed_symptoms: Json | null
          raw_query: string
          recommendations: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          parsed_symptoms?: Json | null
          raw_query: string
          recommendations?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          parsed_symptoms?: Json | null
          raw_query?: string
          recommendations?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          added_at: string | null
          herb_id: string
          herb_name: string | null
          herb_scientific_name: string | null
          id: string
          user_id: string
        }
        Insert: {
          added_at?: string | null
          herb_id: string
          herb_name?: string | null
          herb_scientific_name?: string | null
          id?: string
          user_id: string
        }
        Update: {
          added_at?: string | null
          herb_id?: string
          herb_name?: string | null
          herb_scientific_name?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
