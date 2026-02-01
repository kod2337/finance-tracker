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
      }
      income_entries: {
        Row: {
          id: string
          date: string
          week: number
          month: number
          year: number
          source_id: string
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
          gross_amount?: number
          net_amount?: number
          currency?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
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
      }
    }
  }
}
