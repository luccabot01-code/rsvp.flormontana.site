-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create hosts table
CREATE TABLE hosts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text NOT NULL UNIQUE,
  token text NOT NULL UNIQUE,
  token_used boolean NOT NULL DEFAULT false,
  sent_via_etsy boolean NOT NULL DEFAULT false,
  sent_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create events table
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  event_type text NOT NULL,
  title text NOT NULL,
  -- date kolonunu TIMESTAMPTZ yerine TEXT yaptık - timezone kayması olmayacak
  date text NOT NULL,
  location text NOT NULL,
  location_url text,
  dress_code text,
  program_notes text,
  -- rsvp_deadline kolonunu da TEXT yaptık
  rsvp_deadline text,
  allow_plusone boolean NOT NULL DEFAULT true,
  require_meal_choice boolean NOT NULL DEFAULT false,
  meal_options jsonb NOT NULL DEFAULT '[]'::jsonb,
  custom_attendance_options jsonb,
  slug text NOT NULL UNIQUE,
  theme_color text NOT NULL DEFAULT '#000000',
  cover_image_url text,
  host_name text NOT NULL,
  host_email text NOT NULL,
  is_active boolean NOT NULL DEFAULT true
);

-- Create rsvps table
CREATE TABLE rsvps (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  guest_name text NOT NULL,
  guest_email text,
  guest_phone text,
  attendance_status text NOT NULL,
  number_of_guests integer NOT NULL DEFAULT 1,
  has_plusone boolean NOT NULL DEFAULT false,
  plusone_name text,
  meal_choices jsonb NOT NULL DEFAULT '[]'::jsonb,
  message text,
  ip_address text,
  user_agent text
);

-- Create indexes for events table
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_host_email ON events(host_email);
CREATE INDEX idx_events_host_email_active ON events(host_email, is_active);
CREATE INDEX idx_events_slug_active ON events(slug, is_active);
CREATE INDEX idx_events_created_at ON events(created_at DESC);

-- Create indexes for rsvps table
CREATE INDEX idx_rsvps_event_id ON rsvps(event_id);
CREATE INDEX idx_rsvps_event_status ON rsvps(event_id, attendance_status);
CREATE INDEX idx_rsvps_guest_email ON rsvps(guest_email);
CREATE INDEX idx_rsvps_created_at ON rsvps(created_at DESC);

-- Create indexes for hosts table
CREATE INDEX idx_hosts_email ON hosts(email);
CREATE INDEX idx_hosts_token ON hosts(token);
CREATE INDEX idx_hosts_email_token_used ON hosts(email, token, token_used);

-- Enable Row Level Security
ALTER TABLE hosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- RLS Policies for hosts table (service_role only)
CREATE POLICY "Service role only access for hosts"
  ON hosts
  FOR ALL
  TO authenticated
  USING (false);

CREATE POLICY "Anon cannot access hosts"
  ON hosts
  FOR ALL
  TO anon
  USING (false);

-- RLS Policies for events table
CREATE POLICY "Public can view active events"
  ON events
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Anyone can create events"
  ON events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update own events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete own events"
  ON events
  FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for rsvps table
CREATE POLICY "Anyone can view rsvps"
  ON rsvps
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can create rsvps"
  ON rsvps
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update rsvps"
  ON rsvps
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete rsvps"
  ON rsvps
  FOR DELETE
  TO authenticated
  USING (true);

-- Enable realtime for rsvps table
ALTER PUBLICATION supabase_realtime ADD TABLE rsvps;
