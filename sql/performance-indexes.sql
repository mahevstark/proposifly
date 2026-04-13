-- Performance indexes for 10K+ concurrent users
-- Run this against your PostgreSQL database

-- Proposals table
CREATE INDEX IF NOT EXISTS idx_proposals_user_id ON proposals(user_id);
CREATE INDEX IF NOT EXISTS idx_proposals_created_at ON proposals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_proposals_tone ON proposals(tone);
CREATE INDEX IF NOT EXISTS idx_proposals_user_created ON proposals(user_id, created_at DESC);

-- Portfolio links
CREATE INDEX IF NOT EXISTS idx_portfolio_links_user_id ON portfolio_links(user_id);

-- User profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- User preferences
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- Site settings
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);

-- API keys
CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON api_keys(is_active);

-- PRDs
CREATE INDEX IF NOT EXISTS idx_prds_proposal_id ON prds(proposal_id);
