-- Update all Visit Fort Wayne logo references to City of Fort Wayne in portfolio_projects
UPDATE portfolio_projects
SET client_logo_url = 'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/CityofFortWayneLogo.png'
WHERE client_logo_url = 'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/VisitFortWayneLogo.png';

-- Update Summit City Vintage logo from .jpg to .png in portfolio_projects
UPDATE portfolio_projects
SET client_logo_url = 'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SummitCityVintageLogo.png'
WHERE client_logo_url = 'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SummitCityVintageLogo.jpg';
