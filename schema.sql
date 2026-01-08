-- Heistline Database Schema for Cloudflare D1

-- Table to store access codes and purchases
CREATE TABLE IF NOT EXISTS access_codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  heist_name TEXT NOT NULL,
  email TEXT NOT NULL,
  payment_intent_id TEXT UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  used_at DATETIME,
  is_active BOOLEAN DEFAULT 1
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_code ON access_codes(code);
CREATE INDEX IF NOT EXISTS idx_email ON access_codes(email);
CREATE INDEX IF NOT EXISTS idx_heist ON access_codes(heist_name);
CREATE INDEX IF NOT EXISTS idx_payment_intent ON access_codes(payment_intent_id);
