export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type QuoteStatus = "new" | "contacted" | "converted" | "lost";
export type QuoteUrgency = "low" | "medium" | "high";

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string;
          slug: string;
          name: string;
          plan: string;
          settings: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          plan?: string;
          settings?: Json;
        };
        Update: {
          slug?: string;
          name?: string;
          plan?: string;
          settings?: Json;
        };
        Relationships: [];
      };
      universes: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          slug: string;
          description: string | null;
          theme: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          name: string;
          slug: string;
          description?: string | null;
          theme?: string | null;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          theme?: string | null;
          is_active?: boolean;
        };
        Relationships: [];
      };
      product_categories: {
        Row: {
          id: string;
          tenant_id: string;
          universe_id: string | null;
          name: string;
          slug: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          universe_id?: string | null;
          name: string;
          slug: string;
          is_active?: boolean;
        };
        Update: {
          universe_id?: string | null;
          name?: string;
          slug?: string;
          is_active?: boolean;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          tenant_id: string;
          category_id: string | null;
          name: string;
          slug: string;
          description: string | null;
          base_price: number | null;
          images: string[];
          is_active: boolean;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          category_id?: string | null;
          name: string;
          slug: string;
          description?: string | null;
          base_price?: number | null;
          images?: string[];
          is_active?: boolean;
          metadata?: Json;
        };
        Update: {
          category_id?: string | null;
          name?: string;
          slug?: string;
          description?: string | null;
          base_price?: number | null;
          images?: string[];
          is_active?: boolean;
          metadata?: Json;
        };
        Relationships: [];
      };
      quotes: {
        Row: {
          id: string;
          tenant_id: string;
          budget_range: string | null;
          use_type: "personal" | "business" | null;
          name: string;
          email: string;
          phone: string | null;
          whatsapp: string | null;
          description: string;
          size: string | null;
          material: string | null;
          urgency: QuoteUrgency;
          quantity: number;
          status: QuoteStatus;
          lead_score: number;
          admin_notes: string | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          whatsapp?: string | null;
          description: string;
          size?: string | null;
          material?: string | null;
          urgency?: QuoteUrgency;
          quantity?: number;
          status?: QuoteStatus;
          lead_score?: number;
          admin_notes?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          budget_range?: string | null;
          use_type?: "personal" | "business" | null;
        };
        Update: {
          status?: QuoteStatus;
          lead_score?: number;
          admin_notes?: string | null;
          urgency?: QuoteUrgency;
        };
        Relationships: [];
      };
      works: {
        Row: {
          id: string;
          tenant_id: string;
          title: string;
          description: string | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          title: string;
          description?: string | null;
          is_published?: boolean;
        };
        Update: {
          title?: string;
          description?: string | null;
          is_published?: boolean;
        };
        Relationships: [];
      };
      work_images: {
        Row: {
          id: string;
          work_id: string;
          storage_path: string;
          original_name: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          work_id: string;
          storage_path: string;
          original_name: string;
          display_order?: number;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      quote_files: {
        Row: {
          id: string;
          quote_id: string;
          storage_path: string;
          original_name: string;
          file_type: string;
          size_bytes: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          quote_id: string;
          storage_path: string;
          original_name: string;
          file_type: string;
          size_bytes: number;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      quote_status: QuoteStatus;
      quote_urgency: QuoteUrgency;
    };
  };
}
