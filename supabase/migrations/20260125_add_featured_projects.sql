-- Add MC Sim Racing and Coleman Prime Story to featured portfolio projects
-- These will appear in the homepage "Recent Work" carousel

-- MC Sim Racing (sort_order 1 - first position)
INSERT INTO portfolio_projects (
  title,
  client,
  client_name,
  client_logo_url,
  category,
  location,
  year,
  description,
  short_description,
  full_description,
  cloudflare_stream_id,
  thumbnail_url,
  video_url,
  featured,
  published,
  sort_order,
  slug
) VALUES (
  'MC SIM RACING',
  'MC Sim Racing',
  'MC Sim Racing',
  'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/logoMCSimRacing.png',
  'Brand Video',
  'Fort Wayne, IN',
  2025,
  'A dynamic brand video showcasing the immersive sim racing experience.',
  'A dynamic brand video showcasing the immersive sim racing experience.',
  'MC Sim Racing brings professional-grade racing simulation to Fort Wayne. This brand video captures the excitement and immersion of their state-of-the-art sim racing facility, showcasing the thrill of competitive racing in a controlled environment.',
  'a279eed7ef4ceef1b3b257b0fb4dfc67',
  'https://customer-w6h9o08eg118alny.cloudflarestream.com/a279eed7ef4ceef1b3b257b0fb4dfc67/thumbnails/thumbnail.jpg?time=1s&height=600',
  'https://iframe.videodelivery.net/a279eed7ef4ceef1b3b257b0fb4dfc67',
  true,
  true,
  1,
  'mc-sim-racing'
) ON CONFLICT (slug) DO UPDATE SET
  featured = true,
  sort_order = 1,
  thumbnail_url = EXCLUDED.thumbnail_url,
  client_logo_url = EXCLUDED.client_logo_url;

-- The Coleman Prime Story (sort_order 2 - second position)
INSERT INTO portfolio_projects (
  title,
  client,
  client_name,
  client_logo_url,
  category,
  location,
  year,
  description,
  short_description,
  full_description,
  cloudflare_stream_id,
  thumbnail_url,
  video_url,
  featured,
  published,
  sort_order,
  slug
) VALUES (
  'THE COLEMAN PRIME STORY',
  'Coleman Prime',
  'Coleman Prime',
  'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/Primedealerequityfundlogoblack.png',
  'Brand Trailer',
  'Spirit Lake, Iowa',
  2025,
  'A cinematic brand story capturing the essence of Coleman Prime.',
  'A cinematic brand story capturing the essence of Coleman Prime.',
  'The Coleman Prime Story is a compelling brand trailer that showcases the partnership and vision behind Coleman Prime. Through cinematic storytelling, we captured the essence of the brand and its commitment to excellence.',
  'd08682649901944d9bbec1dcfb8bde88',
  'https://customer-w6h9o08eg118alny.cloudflarestream.com/d08682649901944d9bbec1dcfb8bde88/thumbnails/thumbnail.jpg?time=89s&height=600',
  'https://iframe.videodelivery.net/d08682649901944d9bbec1dcfb8bde88',
  true,
  true,
  2,
  'the-coleman-prime-story'
) ON CONFLICT (slug) DO UPDATE SET
  featured = true,
  sort_order = 2,
  thumbnail_url = EXCLUDED.thumbnail_url,
  client_logo_url = EXCLUDED.client_logo_url;

-- Update existing projects to have higher sort_order so new projects appear first
UPDATE portfolio_projects
SET sort_order = sort_order + 2
WHERE slug NOT IN ('mc-sim-racing', 'the-coleman-prime-story')
AND featured = true;
