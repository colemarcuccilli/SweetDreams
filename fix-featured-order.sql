-- Fix the featured carousel order to: Nissan, Fort Wayne Hyperlapse, Kissel, Indianapolis, Aegis, Brookfield, Wake Up Blind

-- 1. Nissan Commercial (was 7, now 1)
UPDATE portfolio_projects
SET sort_order = 1
WHERE slug = 'nissan-warsaw-dealership';

-- 2. Fort Wayne Hyperlapse (was 4, now 2)
UPDATE portfolio_projects
SET sort_order = 2
WHERE slug = 'fort-wayne-hyperlapse-showcase';

-- 3. Kissel Entertainment (was 2, now 3)
UPDATE portfolio_projects
SET sort_order = 3
WHERE slug = 'knoxville-carnival-coverage';

-- 4. Indianapolis Children's Museum (was 3, now 4)
UPDATE portfolio_projects
SET sort_order = 4
WHERE slug = 'indianapolis-childrens-museum-ferris-wheel';

-- 5. Aegis Dental (was 6, now 5)
UPDATE portfolio_projects
SET sort_order = 5
WHERE slug = 'aegis-dental-trusted-dentistry';

-- 6. Brookfield Zoo (was 1, now 6)
UPDATE portfolio_projects
SET sort_order = 6
WHERE slug = 'brookfield-zoo-ferris-wheel';

-- 7. Wake Up Blind (was 5, now 7)
UPDATE portfolio_projects
SET sort_order = 7
WHERE slug = 'wake-up-blind-music-video';
h