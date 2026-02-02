export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      income_sources: {
        Row: {
          id: string
          name: string
          type: 'salary' | 'freelance' | 'business' | 'investment' | 'other'
          is_active: boolean
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'salary' | 'freelance' | 'business' | 'investment' | 'other'
          is_active?: boolean
          color: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'salary' | 'freelance' | 'business' | 'investment' | 'other'
          is_active?: boolean
          color?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      income_entries: {
        Row: {
          id: string
          date: string
          week: number
          month: number
          year: number
          source_id: string
          payment_frequency: 'weekly' | 'bi_weekly' | 'monthly'
          gross_amount: number
          net_amount: number
          currency: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          date: string
          week: number
          month: number
          year: number
          source_id: string
          payment_frequency?: 'weekly' | 'bi_weekly' | 'monthly'
          gross_amount: number
          net_amount: number
          currency?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          date?: string
          week?: number
          month?: number
          year?: number
          source_id?: string
          payment_frequency?: 'weekly' | 'bi_weekly' | 'monthly'
          gross_amount?: number
          net_amount?: number
          currency?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "income_entries_source_id_fkey"
            columns: ["source_id"]
            referencedRelation: "income_sources"
            referencedColumns: ["id"]
          }
        ]
      }
      payout_categories: {
        Row: {
          id: string
          name: string
          type: 'savings' | 'obligation' | 'personal' | 'expense' | 'other'
          target_amount: number | null
          color: string
          icon: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'savings' | 'obligation' | 'personal' | 'expense' | 'other'
          target_amount?: number | null
          color: string
          icon?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'savings' | 'obligation' | 'personal' | 'expense' | 'other'
          target_amount?: number | null
          color?: string
          icon?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      payouts: {
        Row: {
          id: string
          date: string
          month: number
          year: number
          category_id: string
          amount: number
          status: 'paid' | 'partially_paid' | 'not_paid' | 'pending'
          due_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          date: string
          month: number
          year: number
          category_id: string
          amount: number
          status: 'paid' | 'partially_paid' | 'not_paid' | 'pending'
          due_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          date?: string
          month?: number
          year?: number
          category_id?: string
          amount?: number
          status?: 'paid' | 'partially_paid' | 'not_paid' | 'pending'
          due_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payouts_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "payout_categories"
            referencedColumns: ["id"]
          }
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
  }
}
