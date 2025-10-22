-- Move Fort Wayne Hyperlapse to the first position in Latest section
UPDATE portfolio_projects
SET sort_order = 0
WHERE slug = 'fort-wayne-hyperlapse-showcase';

-- Ensure it's marked as featured (so it appears in Latest)
UPDATE portfolio_projects
SET featured = true
WHERE slug = 'fort-wayne-hyperlapse-showcase';
