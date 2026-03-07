-- ============================================================
-- Plotter — Supabase Schema
-- Run this in your Supabase SQL editor → New Query
-- ============================================================

-- Incidents table
CREATE TABLE IF NOT EXISTS incidents (
  id                UUID             DEFAULT gen_random_uuid() PRIMARY KEY,
  title             TEXT             NOT NULL,
  description       TEXT,
  category          TEXT             NOT NULL CHECK (category IN ('accident','fire','medical','crime','weather','other')),
  severity          TEXT             NOT NULL CHECK (severity IN ('low','medium','high','critical')),
  status            TEXT             NOT NULL DEFAULT 'active' CHECK (status IN ('active','investigating','resolved')),
  latitude          DOUBLE PRECISION NOT NULL,
  longitude         DOUBLE PRECISION NOT NULL,
  address           TEXT,
  reported_by       UUID             REFERENCES auth.users(id) ON DELETE SET NULL,
  reported_by_email TEXT,
  created_at        TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS incidents_category_idx   ON incidents (category);
CREATE INDEX IF NOT EXISTS incidents_severity_idx   ON incidents (severity);
CREATE INDEX IF NOT EXISTS incidents_status_idx     ON incidents (status);
CREATE INDEX IF NOT EXISTS incidents_reported_by_idx ON incidents (reported_by);
CREATE INDEX IF NOT EXISTS incidents_created_at_idx ON incidents (created_at DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_incidents_updated_at
  BEFORE UPDATE ON incidents
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous) can read incidents
CREATE POLICY "public_read_incidents"
  ON incidents FOR SELECT
  USING (true);

-- Authenticated users can insert (must own the record)
CREATE POLICY "authenticated_insert_incidents"
  ON incidents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reported_by);

-- Owners can update their own incidents
CREATE POLICY "owner_update_incidents"
  ON incidents FOR UPDATE
  TO authenticated
  USING (auth.uid() = reported_by)
  WITH CHECK (auth.uid() = reported_by);

-- Owners can delete their own incidents
CREATE POLICY "owner_delete_incidents"
  ON incidents FOR DELETE
  TO authenticated
  USING (auth.uid() = reported_by);
