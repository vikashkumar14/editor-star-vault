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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      content: {
        Row: {
          author: string | null
          category: string | null
          content_type: string
          created_at: string
          css_code: string | null
          css_introduction: string | null
          description: string | null
          downloads_count: number | null
          file_name: string | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          generated_thumbnail_url: string | null
          html_code: string | null
          html_introduction: string | null
          id: string
          is_featured: boolean | null
          is_premium: boolean | null
          js_code: string | null
          js_introduction: string | null
          price: number | null
          rating: number | null
          software_compatibility:
            | Database["public"]["Enums"]["software_type"][]
            | null
          status: string | null
          tags: string[] | null
          thumbnail_auto_generated: boolean | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          youtube_url: string | null
        }
        Insert: {
          author?: string | null
          category?: string | null
          content_type: string
          created_at?: string
          css_code?: string | null
          css_introduction?: string | null
          description?: string | null
          downloads_count?: number | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          generated_thumbnail_url?: string | null
          html_code?: string | null
          html_introduction?: string | null
          id?: string
          is_featured?: boolean | null
          is_premium?: boolean | null
          js_code?: string | null
          js_introduction?: string | null
          price?: number | null
          rating?: number | null
          software_compatibility?:
            | Database["public"]["Enums"]["software_type"][]
            | null
          status?: string | null
          tags?: string[] | null
          thumbnail_auto_generated?: boolean | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          youtube_url?: string | null
        }
        Update: {
          author?: string | null
          category?: string | null
          content_type?: string
          created_at?: string
          css_code?: string | null
          css_introduction?: string | null
          description?: string | null
          downloads_count?: number | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          generated_thumbnail_url?: string | null
          html_code?: string | null
          html_introduction?: string | null
          id?: string
          is_featured?: boolean | null
          is_premium?: boolean | null
          js_code?: string | null
          js_introduction?: string | null
          price?: number | null
          rating?: number | null
          software_compatibility?:
            | Database["public"]["Enums"]["software_type"][]
            | null
          status?: string | null
          tags?: string[] | null
          thumbnail_auto_generated?: boolean | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          youtube_url?: string | null
        }
        Relationships: []
      }
      content_interactions: {
        Row: {
          comment_text: string | null
          content_id: string
          created_at: string
          id: string
          interaction_type: string
          user_id: string | null
          user_ip: string | null
        }
        Insert: {
          comment_text?: string | null
          content_id: string
          created_at?: string
          id?: string
          interaction_type: string
          user_id?: string | null
          user_ip?: string | null
        }
        Update: {
          comment_text?: string | null
          content_id?: string
          created_at?: string
          id?: string
          interaction_type?: string
          user_id?: string | null
          user_ip?: string | null
        }
        Relationships: []
      }
      content_stats: {
        Row: {
          comments_count: number | null
          content_id: string
          likes_count: number | null
          shares_count: number | null
          updated_at: string
          views_count: number | null
        }
        Insert: {
          comments_count?: number | null
          content_id: string
          likes_count?: number | null
          shares_count?: number | null
          updated_at?: string
          views_count?: number | null
        }
        Update: {
          comments_count?: number | null
          content_id?: string
          likes_count?: number | null
          shares_count?: number | null
          updated_at?: string
          views_count?: number | null
        }
        Relationships: []
      }
      downloads: {
        Row: {
          content_id: string | null
          downloaded_at: string | null
          id: string
          user_agent: string | null
          user_ip: string | null
        }
        Insert: {
          content_id?: string | null
          downloaded_at?: string | null
          id?: string
          user_agent?: string | null
          user_ip?: string | null
        }
        Update: {
          content_id?: string | null
          downloaded_at?: string | null
          id?: string
          user_agent?: string | null
          user_ip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "downloads_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          subject?: string
        }
        Relationships: []
      }
      "html java css": {
        Row: {
          "-- Add code columns to content table for HTML": string
          "and JavaScript code storage": string
          CSS: string
        }
        Insert: {
          "-- Add code columns to content table for HTML": string
          "and JavaScript code storage": string
          CSS: string
        }
        Update: {
          "-- Add code columns to content table for HTML"?: string
          "and JavaScript code storage"?: string
          CSS?: string
        }
        Relationships: []
      }
      material_interactions: {
        Row: {
          comment_text: string | null
          created_at: string
          id: string
          interaction_type: string
          material_id: string
          rating_value: number | null
          user_ip: string | null
        }
        Insert: {
          comment_text?: string | null
          created_at?: string
          id?: string
          interaction_type: string
          material_id: string
          rating_value?: number | null
          user_ip?: string | null
        }
        Update: {
          comment_text?: string | null
          created_at?: string
          id?: string
          interaction_type?: string
          material_id?: string
          rating_value?: number | null
          user_ip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "material_interactions_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
        ]
      }
      table_name: {
        Row: {
          data: Json | null
          id: number
          inserted_at: string
          name: string | null
          updated_at: string
        }
        Insert: {
          data?: Json | null
          id?: number
          inserted_at?: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          data?: Json | null
          id?: number
          inserted_at?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_download_count: {
        Args: { content_uuid: string }
        Returns: undefined
      }
    }
    Enums: {
      content_category:
        | "overlays"
        | "luts"
        | "presets"
        | "sfx"
        | "transitions"
        | "templates"
        | "other"
      software_type:
        | "premiere_pro"
        | "after_effects"
        | "davinci_resolve"
        | "final_cut_pro"
        | "photoshop"
        | "other"
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
    Enums: {
      content_category: [
        "overlays",
        "luts",
        "presets",
        "sfx",
        "transitions",
        "templates",
        "other",
      ],
      software_type: [
        "premiere_pro",
        "after_effects",
        "davinci_resolve",
        "final_cut_pro",
        "photoshop",
        "other",
      ],
    },
  },
} as const
