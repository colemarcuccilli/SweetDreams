-- Fix Fort Wayne Hyperlapse City Showcase logo specifically
UPDATE portfolio_projects
SET client_logo_url = 'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/CityofFortWayneLogo.png'
WHERE slug = 'fort-wayne-hyperlapse-showcase';

-- Also update any other projects that still have Visit Fort Wayne logo
UPDATE portfolio_projects
SET client_logo_url = 'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/CityofFortWayneLogo.png'
WHERE client_logo_url = 'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/VisitFortWayneLogo.png';

-- Update Heaven in Fort Wayne too if it has Visit Fort Wayne logo
UPDATE portfolio_projects
SET client_logo_url = 'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/CityofFortWayneLogo.png'
WHERE slug = 'heaven-in-fort-wayne';
