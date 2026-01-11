-- Create hosts table for token-based authentication
CREATE TABLE IF NOT EXISTS hosts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  token TEXT UNIQUE NOT NULL,
  token_used BOOLEAN DEFAULT FALSE,
  sent_via_etsy BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_hosts_email ON hosts(email);
CREATE INDEX IF NOT EXISTS idx_hosts_token ON hosts(token);
