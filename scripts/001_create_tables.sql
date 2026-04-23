-- Create agents table
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'offline')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create session_logs table  
CREATE TABLE IF NOT EXISTS session_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  log_type TEXT DEFAULT 'info' CHECK (log_type IN ('info', 'success', 'warning', 'error')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  blob_url TEXT NOT NULL,
  blob_pathname TEXT NOT NULL,
  status TEXT DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create builds table
CREATE TABLE IF NOT EXISTS builds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'building', 'completed', 'failed')),
  progress INTEGER DEFAULT 0,
  result TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Insert default agents
INSERT INTO agents (name, status) VALUES
  ('AGENT SKRIP VIRAL', 'online'),
  ('AGENT FINISHING', 'online'),
  ('AGENT DISTRIBUSI', 'offline')
ON CONFLICT DO NOTHING;

-- Insert initial log
INSERT INTO session_logs (message, log_type) VALUES
  ('System Public Link Established. Ready.', 'info');
