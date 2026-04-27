-- Plans table: stores AI-generated itinerary plans
CREATE TABLE plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  prompt TEXT,
  itinerary JSONB NOT NULL DEFAULT '[]',
  checklist JSONB DEFAULT '[]',
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

-- Users can CRUD their own plans
CREATE POLICY "Users can manage own plans" ON plans
  FOR ALL USING (auth.uid() = user_id);
