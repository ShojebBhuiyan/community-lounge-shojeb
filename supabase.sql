-- Drop tables if they exist (for idempotency during development)
DROP TABLE IF EXISTS memberships;
DROP TABLE IF EXISTS lounges;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL
);

-- Lounges table
CREATE TABLE lounges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    image_url TEXT,
    description TEXT
);

-- Memberships table
CREATE TABLE memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    lounge_id UUID REFERENCES lounges(id) ON DELETE CASCADE,
    UNIQUE (user_id, lounge_id)
);

-- Enable RLS on memberships
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

-- Policy: Only allow insert if user_id = auth.uid()
CREATE POLICY "Allow user to join lounge" ON memberships
  FOR INSERT USING (user_id = auth.uid());

-- Policy: Only allow delete if user_id = auth.uid()
CREATE POLICY "Allow user to leave lounge" ON memberships
  FOR DELETE USING (user_id = auth.uid());

-- Seed lounges
INSERT INTO lounges (slug, title, image_url, description) VALUES
    ('tech-talk', 'Tech Talk', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6', 'A lounge for tech enthusiasts to discuss the latest in technology.'),
    ('book-club', 'Book Club', 'https://images.unsplash.com/photo-1519681393784-d120267933ba', 'Join us to share and discuss your favorite books.'),
    ('movie-night', 'Movie Night', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', 'A place to chat about movies, old and new.'); 