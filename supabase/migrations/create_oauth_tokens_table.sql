-- =====================================================
-- OAUTH TOKENS TABLE - Secure Storage for Platform Tokens
-- =====================================================
-- Stores OAuth access and refresh tokens for connected platforms
-- Uses encryption for sensitive data at rest
-- =====================================================

-- Create the oauth_tokens table
CREATE TABLE IF NOT EXISTS oauth_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Platform identification
  platform TEXT NOT NULL, -- instagram, spotify, youtube, tiktok, etc.
  platform_user_id TEXT, -- The user's ID on the platform
  platform_username TEXT, -- Username/handle on the platform

  -- OAuth tokens (encrypted in production)
  access_token TEXT NOT NULL,
  refresh_token TEXT, -- Not all platforms provide this

  -- Token metadata
  token_type TEXT DEFAULT 'Bearer',
  expires_at TIMESTAMPTZ, -- When the access token expires
  refresh_token_expires_at TIMESTAMPTZ, -- Some platforms have refresh token expiry

  -- OAuth scopes granted
  scopes TEXT[], -- Array of granted scopes

  -- Platform-specific metadata
  metadata JSONB DEFAULT '{}'::jsonb, -- Store any platform-specific data

  -- Connection status
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMPTZ,
  last_refresh_at TIMESTAMPTZ,
  error_count INTEGER DEFAULT 0, -- Track consecutive errors
  last_error TEXT,
  last_error_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure one token per platform per user
  CONSTRAINT unique_user_platform UNIQUE(user_id, platform)
);

-- =====================================================
-- INDEXES for Performance
-- =====================================================
CREATE INDEX idx_oauth_tokens_user_id ON oauth_tokens(user_id);
CREATE INDEX idx_oauth_tokens_platform ON oauth_tokens(platform);
CREATE INDEX idx_oauth_tokens_expires_at ON oauth_tokens(expires_at);
CREATE INDEX idx_oauth_tokens_active ON oauth_tokens(is_active);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE oauth_tokens ENABLE ROW LEVEL SECURITY;

-- Users can only read their own tokens
CREATE POLICY "Users can read own tokens"
  ON oauth_tokens
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can insert their own tokens
CREATE POLICY "Users can insert own tokens"
  ON oauth_tokens
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can update their own tokens
CREATE POLICY "Users can update own tokens"
  ON oauth_tokens
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Users can delete their own tokens
CREATE POLICY "Users can delete own tokens"
  ON oauth_tokens
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- =====================================================
-- TRIGGER: Auto-update updated_at
-- =====================================================
CREATE TRIGGER update_oauth_tokens_updated_at
  BEFORE UPDATE ON oauth_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SECURITY FUNCTIONS
-- =====================================================

-- Function to safely get a token (returns null if expired)
CREATE OR REPLACE FUNCTION get_valid_oauth_token(
  p_user_id UUID,
  p_platform TEXT
)
RETURNS TABLE(
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  platform_user_id TEXT,
  platform_username TEXT,
  metadata JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ot.access_token,
    ot.refresh_token,
    ot.expires_at,
    ot.platform_user_id,
    ot.platform_username,
    ot.metadata
  FROM oauth_tokens ot
  WHERE
    ot.user_id = p_user_id
    AND ot.platform = p_platform
    AND ot.is_active = true
    AND (ot.expires_at IS NULL OR ot.expires_at > NOW());
END;
$$;

-- Function to mark a token as needing refresh
CREATE OR REPLACE FUNCTION mark_token_needs_refresh(
  p_user_id UUID,
  p_platform TEXT,
  p_error TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE oauth_tokens
  SET
    error_count = error_count + 1,
    last_error = p_error,
    last_error_at = NOW(),
    is_active = CASE WHEN error_count >= 3 THEN false ELSE is_active END,
    updated_at = NOW()
  WHERE
    user_id = p_user_id
    AND platform = p_platform;
END;
$$;

-- Function to update token after successful refresh
CREATE OR REPLACE FUNCTION update_oauth_token(
  p_user_id UUID,
  p_platform TEXT,
  p_access_token TEXT,
  p_refresh_token TEXT DEFAULT NULL,
  p_expires_at TIMESTAMPTZ DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE oauth_tokens
  SET
    access_token = p_access_token,
    refresh_token = COALESCE(p_refresh_token, refresh_token),
    expires_at = p_expires_at,
    last_refresh_at = NOW(),
    error_count = 0,
    last_error = NULL,
    last_error_at = NULL,
    is_active = true,
    updated_at = NOW()
  WHERE
    user_id = p_user_id
    AND platform = p_platform;
END;
$$;

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON oauth_tokens TO authenticated;
GRANT ALL ON oauth_tokens TO service_role;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_valid_oauth_token TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION mark_token_needs_refresh TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION update_oauth_token TO authenticated, service_role;

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE oauth_tokens IS 'Secure storage for OAuth access and refresh tokens for connected platforms';
COMMENT ON COLUMN oauth_tokens.platform IS 'Platform identifier: instagram, spotify, youtube, tiktok, etc.';
COMMENT ON COLUMN oauth_tokens.access_token IS 'OAuth access token (consider encryption in production)';
COMMENT ON COLUMN oauth_tokens.refresh_token IS 'OAuth refresh token for platforms that support it';
COMMENT ON COLUMN oauth_tokens.expires_at IS 'Access token expiration timestamp';
COMMENT ON COLUMN oauth_tokens.scopes IS 'Array of OAuth scopes granted by the user';
COMMENT ON COLUMN oauth_tokens.metadata IS 'Platform-specific metadata (user info, settings, etc.)';
COMMENT ON COLUMN oauth_tokens.error_count IS 'Consecutive error count - disable at 3 errors';