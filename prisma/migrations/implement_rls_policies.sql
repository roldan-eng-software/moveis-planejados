-- Enable RLS and create policies for all tables

-- ==========================================
-- 1. ACCOUNTS TABLE RLS
-- ==========================================
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

-- Only account owners and admins can view their account
CREATE POLICY "accounts_select_own"
  ON accounts FOR SELECT
  USING (
    id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

-- Only account owners can update
CREATE POLICY "accounts_update_own"
  ON accounts FOR UPDATE
  USING (
    id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid() 
      AND role = 'owner'
    )
  );

-- Only account owners can delete
CREATE POLICY "accounts_delete_own"
  ON accounts FOR DELETE
  USING (
    id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid() 
      AND role = 'owner'
    )
  );

-- ==========================================
-- 2. ACCOUNT_USERS TABLE RLS
-- ==========================================
ALTER TABLE account_users ENABLE ROW LEVEL SECURITY;

-- Users can view members in their account
CREATE POLICY "account_users_select_own"
  ON account_users FOR SELECT
  USING (
    account_id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid()
    )
  );

-- Only account owners can insert new users
CREATE POLICY "account_users_insert_own"
  ON account_users FOR INSERT
  WITH CHECK (
    account_id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid() 
      AND role = 'owner'
    )
  );

-- Users can update their own profile, admins can update others
CREATE POLICY "account_users_update_own"
  ON account_users FOR UPDATE
  USING (
    user_id = auth.uid() 
    OR account_id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

-- Only account owners can delete users
CREATE POLICY "account_users_delete_own"
  ON account_users FOR DELETE
  USING (
    account_id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid() 
      AND role = 'owner'
    )
  );

-- ==========================================
-- 3. CLIENTS TABLE RLS
-- ==========================================
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clients_select_own"
  ON clients FOR SELECT
  USING (
    account_id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "clients_insert_own"
  ON clients FOR INSERT
  WITH CHECK (
    account_id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "clients_update_own"
  ON clients FOR UPDATE
  USING (
    account_id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "clients_delete_own"
  ON clients FOR DELETE
  USING (
    account_id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid()
    )
  );

-- ==========================================
-- 4. QUOTES TABLE RLS
-- ==========================================
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quotes_select_own"
  ON quotes FOR SELECT
  USING (
    account_id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "quotes_insert_own"
  ON quotes FOR INSERT
  WITH CHECK (
    account_id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "quotes_update_own"
  ON quotes FOR UPDATE
  USING (
    account_id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "quotes_delete_own"
  ON quotes FOR DELETE
  USING (
    account_id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid()
    )
  );

-- ==========================================
-- 5. QUOTE_ITEMS TABLE RLS
-- ==========================================
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quote_items_select_own"
  ON quote_items FOR SELECT
  USING (
    quote_id IN (
      SELECT id FROM quotes WHERE account_id IN (
        SELECT account_id FROM account_users 
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "quote_items_insert_own"
  ON quote_items FOR INSERT
  WITH CHECK (
    quote_id IN (
      SELECT id FROM quotes WHERE account_id IN (
        SELECT account_id FROM account_users 
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "quote_items_update_own"
  ON quote_items FOR UPDATE
  USING (
    quote_id IN (
      SELECT id FROM quotes WHERE account_id IN (
        SELECT account_id FROM account_users 
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "quote_items_delete_own"
  ON quote_items FOR DELETE
  USING (
    quote_id IN (
      SELECT id FROM quotes WHERE account_id IN (
        SELECT account_id FROM account_users 
        WHERE user_id = auth.uid()
      )
    )
  );

-- ==========================================
-- 6. QUOTE_ENVIRONMENTS TABLE RLS
-- ==========================================
ALTER TABLE quote_environments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quote_environments_select_own"
  ON quote_environments FOR SELECT
  USING (
    quote_id IN (
      SELECT id FROM quotes WHERE account_id IN (
        SELECT account_id FROM account_users 
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "quote_environments_insert_own"
  ON quote_environments FOR INSERT
  WITH CHECK (
    quote_id IN (
      SELECT id FROM quotes WHERE account_id IN (
        SELECT account_id FROM account_users 
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "quote_environments_update_own"
  ON quote_environments FOR UPDATE
  USING (
    quote_id IN (
      SELECT id FROM quotes WHERE account_id IN (
        SELECT account_id FROM account_users 
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "quote_environments_delete_own"
  ON quote_environments FOR DELETE
  USING (
    quote_id IN (
      SELECT id FROM quotes WHERE account_id IN (
        SELECT account_id FROM account_users 
        WHERE user_id = auth.uid()
      )
    )
  );

-- ==========================================
-- 7. PRODUCTIONS TABLE RLS
-- ==========================================
ALTER TABLE productions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "productions_select_own"
  ON productions FOR SELECT
  USING (
    account_id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "productions_insert_own"
  ON productions FOR INSERT
  WITH CHECK (
    account_id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "productions_update_own"
  ON productions FOR UPDATE
  USING (
    account_id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "productions_delete_own"
  ON productions FOR DELETE
  USING (
    account_id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid()
    )
  );

-- ==========================================
-- 8. PRODUCTION_STAGES TABLE RLS
-- ==========================================
ALTER TABLE production_stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "production_stages_select_own"
  ON production_stages FOR SELECT
  USING (
    production_id IN (
      SELECT id FROM productions WHERE account_id IN (
        SELECT account_id FROM account_users 
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "production_stages_insert_own"
  ON production_stages FOR INSERT
  WITH CHECK (
    production_id IN (
      SELECT id FROM productions WHERE account_id IN (
        SELECT account_id FROM account_users 
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "production_stages_update_own"
  ON production_stages FOR UPDATE
  USING (
    production_id IN (
      SELECT id FROM productions WHERE account_id IN (
        SELECT account_id FROM account_users 
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "production_stages_delete_own"
  ON production_stages FOR DELETE
  USING (
    production_id IN (
      SELECT id FROM productions WHERE account_id IN (
        SELECT account_id FROM account_users 
        WHERE user_id = auth.uid()
      )
    )
  );

-- ==========================================
-- 9. CONTRACTS TABLE RLS
-- ==========================================
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contracts_select_own"
  ON contracts FOR SELECT
  USING (
    account_id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "contracts_insert_own"
  ON contracts FOR INSERT
  WITH CHECK (
    account_id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "contracts_update_own"
  ON contracts FOR UPDATE
  USING (
    account_id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "contracts_delete_own"
  ON contracts FOR DELETE
  USING (
    account_id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid()
    )
  );

-- ==========================================
-- 10. TRANSACTIONS TABLE RLS
-- ==========================================
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "transactions_select_own"
  ON transactions FOR SELECT
  USING (
    account_id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "transactions_insert_own"
  ON transactions FOR INSERT
  WITH CHECK (
    account_id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "transactions_update_own"
  ON transactions FOR UPDATE
  USING (
    account_id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "transactions_delete_own"
  ON transactions FOR DELETE
  USING (
    account_id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid()
    )
  );

-- ==========================================
-- 11. TRANSACTION_CATEGORIES TABLE RLS
-- ==========================================
ALTER TABLE transaction_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "transaction_categories_select_own"
  ON transaction_categories FOR SELECT
  USING (
    account_id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "transaction_categories_insert_own"
  ON transaction_categories FOR INSERT
  WITH CHECK (
    account_id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "transaction_categories_update_own"
  ON transaction_categories FOR UPDATE
  USING (
    account_id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "transaction_categories_delete_own"
  ON transaction_categories FOR DELETE
  USING (
    account_id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid()
    )
  );

-- ==========================================
-- 12. TEMPLATES TABLE RLS
-- ==========================================
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "templates_select_own"
  ON templates FOR SELECT
  USING (
    account_id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "templates_insert_own"
  ON templates FOR INSERT
  WITH CHECK (
    account_id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "templates_update_own"
  ON templates FOR UPDATE
  USING (
    account_id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "templates_delete_own"
  ON templates FOR DELETE
  USING (
    account_id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid()
    )
  );

-- ==========================================
-- 13. SETTINGS TABLE RLS
-- ==========================================
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "settings_select_own"
  ON settings FOR SELECT
  USING (
    account_id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "settings_insert_own"
  ON settings FOR INSERT
  WITH CHECK (
    account_id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "settings_update_own"
  ON settings FOR UPDATE
  USING (
    account_id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "settings_delete_own"
  ON settings FOR DELETE
  USING (
    account_id IN (
      SELECT account_id FROM account_users 
      WHERE user_id = auth.uid() 
      AND role = 'owner'
    )
  );

-- ==========================================
-- 14. CREATE INDEXES FOR PERFORMANCE
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
