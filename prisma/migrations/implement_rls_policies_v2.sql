-- RLS Policies for Stack Auth 
-- Security model: RLS enforcement at application layer via Prisma filters
-- This file enables RLS and creates performance indexes

-- ==========================================
-- Enable RLS on all tables
-- ==========================================

ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_environments ENABLE ROW LEVEL SECURITY;
ALTER TABLE productions ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- CREATE INDEXES FOR PERFORMANCE
-- ==========================================

-- Clients
CREATE INDEX IF NOT EXISTS idx_clients_account_type ON clients(account_id, type);
CREATE INDEX IF NOT EXISTS idx_clients_account_name ON clients(account_id, name);

-- Quotes
CREATE INDEX IF NOT EXISTS idx_quotes_account_status ON quotes(account_id, status);
CREATE INDEX IF NOT EXISTS idx_quotes_client_status ON quotes(client_id, status);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at DESC);

-- Productions
CREATE INDEX IF NOT EXISTS idx_productions_account_status_deadline ON productions(account_id, status, deadline);

-- Transactions
CREATE INDEX IF NOT EXISTS idx_transactions_account_date_type ON transactions(account_id, date, type);
CREATE INDEX IF NOT EXISTS idx_transactions_account_category ON transactions(account_id, category_id);

-- Account Users
CREATE INDEX IF NOT EXISTS idx_account_users_user_id ON account_users(user_id);
CREATE INDEX IF NOT EXISTS idx_account_users_account_id ON account_users(account_id);

-- ==========================================
-- CREATE HELPER FUNCTION FOR AUDIT
-- ==========================================

CREATE OR REPLACE FUNCTION get_user_accounts(user_id UUID)
RETURNS TABLE(account_id UUID) AS $$
BEGIN
  RETURN QUERY
  SELECT au.account_id FROM account_users au
  WHERE au.user_id = user_id;
END;
$$ LANGUAGE plpgsql;
