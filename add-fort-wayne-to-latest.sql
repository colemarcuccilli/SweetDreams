-- Add Fort Wayne Hyperlapse to the Latest section (featured projects)
UPDATE portfolio_projects
SET featured = true
WHERE slug = 'fort-wayne-hyperlapse-showcase';

-- Optionally, you can also set a sort_order to control where it appears
-- Lower numbers appear first
UPDATE portfolio_projects
SET sort_order = 1
WHERE slug = 'fort-wayne-hyperlapse-showcase';
