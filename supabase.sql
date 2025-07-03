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
    user_id UUID REFERENCES users(id),
    lounge_id UUID REFERENCES lounges(id),
    UNIQUE (user_id, lounge_id)
);

-- Enable RLS on memberships
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

-- Policy: Only allow insert if user_id = auth.uid()
CREATE POLICY "Allow user to join lounge" ON memberships
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Policy: Only allow delete if user_id = auth.uid()
CREATE POLICY "Allow user to leave lounge" ON memberships
  FOR DELETE USING (user_id = auth.uid());

-- Policy: Allow users to read their own memberships
CREATE POLICY "Allow user to read own memberships" ON memberships
  FOR SELECT USING (user_id = auth.uid());

-- Policy: Allow reading all memberships for member counts (public data)
CREATE POLICY "Allow reading member counts" ON memberships
  FOR SELECT USING (true);

-- Function to get member counts by lounge_id
CREATE OR REPLACE FUNCTION get_lounge_member_counts()
RETURNS TABLE(lounge_id UUID, count BIGINT)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    lounge_id,
    COUNT(*) as count
  FROM memberships
  GROUP BY lounge_id
  ORDER BY count DESC;
$$;

-- Function to get lounges with user membership status and member count
CREATE OR REPLACE FUNCTION get_lounges_with_user_membership(user_id UUID DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  image_url TEXT,
  slug TEXT,
  is_member BOOLEAN,
  member_count INTEGER
)
LANGUAGE SQL
AS $$
  SELECT 
    l.id,
    l.title,
    l.description,
    l.image_url,
    l.slug,
    CASE 
      WHEN user_id IS NOT NULL AND m.user_id IS NOT NULL THEN true
      ELSE false
    END as is_member,
    coalesce(mc.member_count, 0) as member_count
  FROM lounges l
  LEFT JOIN memberships m 
    ON l.id = m.lounge_id AND m.user_id = user_id
  LEFT JOIN (
    SELECT lounge_id, COUNT(*) as member_count
    FROM memberships
    GROUP BY lounge_id
  ) mc ON l.id = mc.lounge_id;
$$;

-- Function to get a user's lounges
create or replace function get_my_lounges()
returns table (
  id uuid,
  title text,
  description text,
  image_url text,
  slug text,
  is_member boolean,
  member_count integer
)
language sql
as $$
  select 
    l.id,
    l.title,
    l.description,
    l.image_url,
    l.slug,
    true as is_member,
    coalesce(mc.member_count, 0) as member_count
  from memberships m
  join lounges l on m.lounge_id = l.id
  left join (
    select lounge_id, count(*) as member_count
    from memberships
    group by lounge_id
  ) mc on l.id = mc.lounge_id
  where m.user_id = auth.uid();
$$;

-- Function to get lounge data by slug
create or replace function get_lounge_by_slug(slug text)
returns table (
  id uuid,
  title text,
  description text,
  image_url text,
  slug text,
  is_member boolean,
  member_count integer
)
language sql
as $$
  select 
    l.id,
    l.title,
    l.description,
    l.image_url,
    l.slug,
    case
      when m.user_id is not null then true
      else false
    end as is_member,
    coalesce(mc.member_count, 0) as member_count
  from lounges l
  left join (
    select *
    from memberships
    where user_id = auth.uid()
  ) m on l.id = m.lounge_id
  left join (
    select lounge_id, count(*) as member_count
    from memberships
    group by lounge_id
  ) mc on l.id = mc.lounge_id
  where l.slug = get_lounge_by_slug.slug
  limit 1;
$$;




-- Seed lounges
INSERT INTO lounges (slug, title, image_url, description) VALUES
    ('tech-talk', 'Tech Talk', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6', 'A lounge for tech enthusiasts to discuss the latest in technology.'),
    ('book-club', 'Book Club', 'https://images.unsplash.com/photo-1519681393784-d120267933ba', 'Join us to share and discuss your favorite books.'),
    ('movie-night', 'Movie Night', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', 'A place to chat about movies, old and new.'); 