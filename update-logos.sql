-- Update Kissel Entertainment project
UPDATE portfolio_projects
SET 
  title = 'Kissel Entertainment',
  client_logo_url = 'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/KisselLogo.png'
WHERE slug = 'knoxville-carnival-coverage';

-- Update Wake Up Blind Music Video
UPDATE portfolio_projects
SET 
  client_logo_url = 'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SWEETDREAMSLOGO_1.jpg'
WHERE slug = 'wake-up-blind-music-video';

-- Replace Visit Fort Wayne logo with City of Fort Wayne logo
UPDATE portfolio_projects
SET 
  client_logo_url = 'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/CityofFortWayneLogo.png'
WHERE client_logo_url = 'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/VisitFortWayneLogo.png';
