-- Finance Tracker Database Schema
-- Run this in your Supabase SQL Editor

-- Income Sources Table
CREATE TABLE IF NOT EXISTS income_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('salary', 'freelance', 'business', 'investment', 'other')),
  is_active BOOLEAN DEFAULT true,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Income Entries Table
CREATE TABLE IF NOT EXISTS income_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  week INTEGER CHECK (week >= 1 AND week <= 5),
  month INTEGER CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  source_id UUID REFERENCES income_sources(id) ON DELETE CASCADE,
  gross_amount DECIMAL(12, 2) NOT NULL CHECK (gross_amount >= 0),
  net_amount DECIMAL(12, 2) NOT NULL CHECK (net_amount >= 0),
  currency TEXT DEFAULT 'PHP',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payout Categories Table
CREATE TABLE IF NOT EXISTS payout_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('savings', 'obligation', 'personal', 'expense', 'other')),
  target_amount DECIMAL(12, 2),
  color TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payouts Table
CREATE TABLE IF NOT EXISTS payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  month INTEGER CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  category_id UUID REFERENCES payout_categories(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('paid', 'partially_paid', 'not_paid', 'pending')),
  due_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_income_entries_date ON income_entries(date);
CREATE INDEX IF NOT EXISTS idx_income_entries_year_month ON income_entries(year, month);
CREATE INDEX IF NOT EXISTS idx_income_entries_source ON income_entries(source_id);
CREATE INDEX IF NOT EXISTS idx_payouts_date ON payouts(date);
CREATE INDEX IF NOT EXISTS idx_payouts_year_month ON payouts(year, month);
CREATE INDEX IF NOT EXISTS idx_payouts_category ON payouts(category_id);

-- Enable Row Level Security (RLS)
ALTER TABLE income_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE income_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;

-- Policies (allow all operations for now - add auth later)
CREATE POLICY "Allow all operations on income_sources" ON income_sources FOR ALL USING (true);
CREATE POLICY "Allow all operations on income_entries" ON income_entries FOR ALL USING (true);
CREATE POLICY "Allow all operations on payout_categories" ON payout_categories FOR ALL USING (true);
CREATE POLICY "Allow all operations on payouts" ON payouts FOR ALL USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for auto-updating updated_at
CREATE TRIGGER update_income_sources_updated_at BEFORE UPDATE ON income_sources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_income_entries_updated_at BEFORE UPDATE ON income_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payout_categories_updated_at BEFORE UPDATE ON payout_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payouts_updated_at BEFORE UPDATE ON payouts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default payout categories
INSERT INTO payout_categories (name, type, target_amount, color) VALUES
  ('Savings', 'savings', 20000.00, '#22C55E'),
  ('Parents', 'obligation', 9000.00, '#3B82F6'),
  ('Pocket Money', 'personal', NULL, '#F59E0B')
ON CONFLICT DO NOTHING;
