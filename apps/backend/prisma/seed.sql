-- Aisly Supabase seed data
-- Backend schema coverage: supermarkets, aisles, layout elements, products.

BEGIN;

DELETE FROM products;
DELETE FROM layout_elements;
DELETE FROM aisles;
DELETE FROM supermarkets;

INSERT INTO supermarkets (id, name, width, height, created_at, updated_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'Aisly Market - Escazu', 60, 40, NOW(), NOW());

INSERT INTO aisles (
  id,
  supermarket_id,
  aisle_number,
  label,
  category,
  position_x,
  position_y,
  width,
  height,
  created_at,
  updated_at
)
VALUES
  ('a1000000-0000-0000-0000-000000000001', '550e8400-e29b-41d4-a716-446655440000', 1,  'Aisle 1',  'Produce & Fresh Herbs',       5,  8, 4, 15, NOW(), NOW()),
  ('a1000000-0000-0000-0000-000000000002', '550e8400-e29b-41d4-a716-446655440000', 2,  'Aisle 2',  'Meat & Seafood',              11, 8, 4, 15, NOW(), NOW()),
  ('a1000000-0000-0000-0000-000000000003', '550e8400-e29b-41d4-a716-446655440000', 3,  'Aisle 3',  'Dairy, Eggs & Cheese',        17, 8, 4, 15, NOW(), NOW()),
  ('a1000000-0000-0000-0000-000000000004', '550e8400-e29b-41d4-a716-446655440000', 4,  'Aisle 4',  'Bakery & Bread',              23, 8, 4, 15, NOW(), NOW()),
  ('a1000000-0000-0000-0000-000000000005', '550e8400-e29b-41d4-a716-446655440000', 5,  'Aisle 5',  'Pasta, Rice & Grains',        29, 8, 4, 15, NOW(), NOW()),
  ('a1000000-0000-0000-0000-000000000006', '550e8400-e29b-41d4-a716-446655440000', 6,  'Aisle 6',  'Canned Goods & Sauces',       35, 8, 4, 15, NOW(), NOW()),
  ('a1000000-0000-0000-0000-000000000007', '550e8400-e29b-41d4-a716-446655440000', 7,  'Aisle 7',  'Oils, Baking & Spices',       41, 8, 4, 15, NOW(), NOW()),
  ('a1000000-0000-0000-0000-000000000008', '550e8400-e29b-41d4-a716-446655440000', 8,  'Aisle 8',  'Beverages',                   47, 8, 4, 15, NOW(), NOW()),
  ('a1000000-0000-0000-0000-000000000009', '550e8400-e29b-41d4-a716-446655440000', 9,  'Aisle 9',  'Breakfast, Coffee & Tea',     5,  26, 4, 12, NOW(), NOW()),
  ('a1000000-0000-0000-0000-00000000000a', '550e8400-e29b-41d4-a716-446655440000', 10, 'Aisle 10', 'Snacks & Sweets',             11, 26, 4, 12, NOW(), NOW()),
  ('a1000000-0000-0000-0000-00000000000b', '550e8400-e29b-41d4-a716-446655440000', 11, 'Aisle 11', 'Frozen Foods',                17, 26, 4, 12, NOW(), NOW()),
  ('a1000000-0000-0000-0000-00000000000c', '550e8400-e29b-41d4-a716-446655440000', 12, 'Aisle 12', 'Household & Personal Care',   23, 26, 4, 12, NOW(), NOW());

INSERT INTO layout_elements (
  id,
  supermarket_id,
  type,
  label,
  category,
  position_x,
  position_y,
  width,
  height,
  orientation,
  metadata,
  created_at,
  updated_at
)
VALUES
  ('fixture-shelf-01', '550e8400-e29b-41d4-a716-446655440000', 'shelf', '1', 'Produce & Fresh Herbs',      5,  8, 4, 15, 'vertical',   '{"shelves":{"left":{"sections":["top","middle","bottom"]},"right":{"sections":["top","middle","bottom"]}}}'::jsonb, NOW(), NOW()),
  ('fixture-shelf-02', '550e8400-e29b-41d4-a716-446655440000', 'shelf', '2', 'Meat & Seafood',             11, 8, 4, 15, 'vertical',   '{"shelves":{"left":{"sections":["top","middle","bottom"]},"right":{"sections":["top","middle","bottom"]}}}'::jsonb, NOW(), NOW()),
  ('fixture-shelf-03', '550e8400-e29b-41d4-a716-446655440000', 'shelf', '3', 'Dairy, Eggs & Cheese',       17, 8, 4, 15, 'vertical',   '{"shelves":{"left":{"sections":["top","middle","bottom"]},"right":{"sections":["top","middle","bottom"]}}}'::jsonb, NOW(), NOW()),
  ('fixture-shelf-04', '550e8400-e29b-41d4-a716-446655440000', 'shelf', '4', 'Bakery & Bread',             23, 8, 4, 15, 'vertical',   '{"shelves":{"left":{"sections":["top","middle","bottom"]},"right":{"sections":["top","middle","bottom"]}}}'::jsonb, NOW(), NOW()),
  ('fixture-shelf-05', '550e8400-e29b-41d4-a716-446655440000', 'shelf', '5', 'Pasta, Rice & Grains',       29, 8, 4, 15, 'vertical',   '{"shelves":{"left":{"sections":["top","middle","bottom"]},"right":{"sections":["top","middle","bottom"]}}}'::jsonb, NOW(), NOW()),
  ('fixture-shelf-06', '550e8400-e29b-41d4-a716-446655440000', 'shelf', '6', 'Canned Goods & Sauces',      35, 8, 4, 15, 'vertical',   '{"shelves":{"left":{"sections":["top","middle","bottom"]},"right":{"sections":["top","middle","bottom"]}}}'::jsonb, NOW(), NOW()),
  ('fixture-shelf-07', '550e8400-e29b-41d4-a716-446655440000', 'shelf', '7', 'Oils, Baking & Spices',      41, 8, 4, 15, 'vertical',   '{"shelves":{"left":{"sections":["top","middle","bottom"]},"right":{"sections":["top","middle","bottom"]}}}'::jsonb, NOW(), NOW()),
  ('fixture-shelf-08', '550e8400-e29b-41d4-a716-446655440000', 'shelf', '8', 'Beverages',                  47, 8, 4, 15, 'vertical',   '{"shelves":{"left":{"sections":["top","middle","bottom"]},"right":{"sections":["top","middle","bottom"]}}}'::jsonb, NOW(), NOW()),
  ('fixture-shelf-09', '550e8400-e29b-41d4-a716-446655440000', 'shelf', '9', 'Breakfast, Coffee & Tea',    5,  26, 4, 12, 'vertical',   '{"shelves":{"left":{"sections":["top","middle","bottom"]},"right":{"sections":["top","middle","bottom"]}}}'::jsonb, NOW(), NOW()),
  ('fixture-shelf-10', '550e8400-e29b-41d4-a716-446655440000', 'shelf', '10','Snacks & Sweets',            11, 26, 4, 12, 'vertical',   '{"shelves":{"left":{"sections":["top","middle","bottom"]},"right":{"sections":["top","middle","bottom"]}}}'::jsonb, NOW(), NOW()),
  ('fixture-freezer-01', '550e8400-e29b-41d4-a716-446655440000', 'freezer', 'Frozen Foods', 'Frozen Foods', 17, 26, 4, 12, 'vertical', '{}'::jsonb, NOW(), NOW()),
  ('fixture-shelf-12', '550e8400-e29b-41d4-a716-446655440000', 'shelf', '12','Household & Personal Care',  23, 26, 4, 12, 'vertical',   '{"shelves":{"left":{"sections":["top","middle","bottom"]},"right":{"sections":["top","middle","bottom"]}}}'::jsonb, NOW(), NOW()),
  ('fixture-zone-produce', '550e8400-e29b-41d4-a716-446655440000', 'special_zone', 'Produce Tables', 'Fresh Produce', 3, 3, 10, 4, 'horizontal', '{"zoneType":"produce_section"}'::jsonb, NOW(), NOW()),
  ('fixture-zone-bakery', '550e8400-e29b-41d4-a716-446655440000', 'special_zone', 'Bakery Counter', 'Bakery', 22, 3, 8, 4, 'horizontal', '{"zoneType":"bakery_section"}'::jsonb, NOW(), NOW()),
  ('fixture-zone-deli', '550e8400-e29b-41d4-a716-446655440000', 'special_zone', 'Deli Counter', 'Prepared Foods', 33, 3, 8, 4, 'horizontal', '{"zoneType":"deli_section"}'::jsonb, NOW(), NOW()),
  ('fixture-checkout-01', '550e8400-e29b-41d4-a716-446655440000', 'checkout', 'Checkout 1', null, 41, 34, 2, 3, 'vertical', '{"checkoutType":"standard"}'::jsonb, NOW(), NOW()),
  ('fixture-checkout-02', '550e8400-e29b-41d4-a716-446655440000', 'checkout', 'Checkout 2', null, 45, 34, 2, 3, 'vertical', '{"checkoutType":"standard"}'::jsonb, NOW(), NOW()),
  ('fixture-checkout-03', '550e8400-e29b-41d4-a716-446655440000', 'checkout', 'Self Checkout', null, 49, 34, 3, 3, 'horizontal', '{"checkoutType":"self"}'::jsonb, NOW(), NOW()),
  ('fixture-entrance', '550e8400-e29b-41d4-a716-446655440000', 'entrance', 'Entrance', null, 28, 1, 4, 2, 'horizontal', '{}'::jsonb, NOW(), NOW()),
  ('fixture-exit', '550e8400-e29b-41d4-a716-446655440000', 'exit', 'Exit', null, 53, 36, 4, 2, 'horizontal', '{}'::jsonb, NOW(), NOW()),
  ('fixture-wall-left', '550e8400-e29b-41d4-a716-446655440000', 'wall', 'Left Wall', null, 0, 0, 1, 40, 'vertical', '{}'::jsonb, NOW(), NOW()),
  ('fixture-wall-right', '550e8400-e29b-41d4-a716-446655440000', 'wall', 'Right Wall', null, 59, 0, 1, 40, 'vertical', '{}'::jsonb, NOW(), NOW());

INSERT INTO products (
  id,
  name,
  barcode,
  category,
  supermarket_id,
  aisle_id,
  aisle_number,
  aisle_segment,
  shelf_side,
  shelf_section,
  grid_x,
  grid_y,
  price,
  created_at,
  updated_at
)
VALUES
  -- Aisle 1: Produce & Fresh Herbs
  ('p0000001-0000-0000-0000-000000000001', 'Yellow Onions 1kg Bag',          '7401000000011', 'Produce',      '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000001', 1, 'A', 'left',  'bottom', 6,  9,  2.19, NOW(), NOW()),
  ('p0000001-0000-0000-0000-000000000002', 'Garlic Bulb',                    '7401000000028', 'Produce',      '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000001', 1, 'A', 'left',  'middle', 6,  11, 0.79, NOW(), NOW()),
  ('p0000001-0000-0000-0000-000000000003', 'Roma Tomatoes 1kg',              '7401000000035', 'Produce',      '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000001', 1, 'B', 'left',  'middle', 6,  13, 2.89, NOW(), NOW()),
  ('p0000001-0000-0000-0000-000000000004', 'Fresh Basil Pack',               '7401000000042', 'Fresh Herbs',  '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000001', 1, 'B', 'left',  'top',    6,  15, 1.99, NOW(), NOW()),
  ('p0000001-0000-0000-0000-000000000005', 'Italian Parsley Bunch',          '7401000000059', 'Fresh Herbs',  '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000001', 1, 'C', 'right', 'top',    8,  17, 1.49, NOW(), NOW()),
  ('p0000001-0000-0000-0000-000000000006', 'Baby Spinach 250g',              '7401000000066', 'Produce',      '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000001', 1, 'C', 'right', 'middle', 8,  19, 3.99, NOW(), NOW()),
  ('p0000001-0000-0000-0000-000000000007', 'Mushrooms 250g',                 '7401000000073', 'Produce',      '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000001', 1, 'D', 'right', 'middle', 8,  21, 3.49, NOW(), NOW()),

  -- Aisle 2: Meat & Seafood
  ('p0000002-0000-0000-0000-000000000001', 'Ground Beef 500g',               '7401000000080', 'Meat',         '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000002', 2, 'A', 'left',  'middle', 12, 9,  6.99, NOW(), NOW()),
  ('p0000002-0000-0000-0000-000000000002', 'Sirloin Steak 500g',             '7401000000097', 'Meat',         '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000002', 2, 'A', 'left',  'middle', 12, 11, 11.99, NOW(), NOW()),
  ('p0000002-0000-0000-0000-000000000003', 'Italian Sausage 400g',           '7401000000103', 'Meat',         '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000002', 2, 'B', 'left',  'middle', 12, 13, 5.99, NOW(), NOW()),
  ('p0000002-0000-0000-0000-000000000004', 'Chicken Breast 1kg',             '7401000000110', 'Meat',         '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000002', 2, 'B', 'left',  'middle', 12, 15, 7.49, NOW(), NOW()),
  ('p0000002-0000-0000-0000-000000000005', 'Salmon Fillet 400g',             '7401000000127', 'Seafood',      '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000002', 2, 'C', 'right', 'middle', 14, 17, 12.99, NOW(), NOW()),
  ('p0000002-0000-0000-0000-000000000006', 'Shrimp 500g',                    '7401000000134', 'Seafood',      '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000002', 2, 'C', 'right', 'middle', 14, 19, 9.99, NOW(), NOW()),

  -- Aisle 3: Dairy, Eggs & Cheese
  ('p0000003-0000-0000-0000-000000000001', 'Whole Milk 1L',                  '7401000000141', 'Dairy',        '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000003', 3, 'A', 'left',  'middle', 18, 9,  2.49, NOW(), NOW()),
  ('p0000003-0000-0000-0000-000000000002', 'Eggs 12 Pack',                   '7401000000158', 'Eggs',         '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000003', 3, 'A', 'left',  'bottom', 18, 11, 3.49, NOW(), NOW()),
  ('p0000003-0000-0000-0000-000000000003', 'Butter 250g',                    '7401000000165', 'Dairy',        '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000003', 3, 'B', 'left',  'middle', 18, 13, 4.49, NOW(), NOW()),
  ('p0000003-0000-0000-0000-000000000004', 'Mozzarella Cheese 300g',         '7401000000172', 'Cheese',       '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000003', 3, 'B', 'left',  'middle', 18, 15, 4.99, NOW(), NOW()),
  ('p0000003-0000-0000-0000-000000000005', 'Ricotta Cheese 425g',            '7401000000189', 'Cheese',       '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000003', 3, 'C', 'right', 'middle', 20, 17, 5.49, NOW(), NOW()),
  ('p0000003-0000-0000-0000-000000000006', 'Parmesan Cheese 200g',           '7401000000196', 'Cheese',       '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000003', 3, 'C', 'right', 'top',    20, 19, 5.99, NOW(), NOW()),
  ('p0000003-0000-0000-0000-000000000007', 'Greek Yogurt 500g',              '7401000000202', 'Dairy',        '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000003', 3, 'D', 'right', 'middle', 20, 21, 3.99, NOW(), NOW()),

  -- Aisle 4: Bakery & Bread
  ('p0000004-0000-0000-0000-000000000001', 'French Baguette',                '7401000000219', 'Bakery',       '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000004', 4, 'A', 'left',  'middle', 24, 9,  2.79, NOW(), NOW()),
  ('p0000004-0000-0000-0000-000000000002', 'Sourdough Loaf',                 '7401000000226', 'Bakery',       '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000004', 4, 'A', 'left',  'middle', 24, 11, 4.49, NOW(), NOW()),
  ('p0000004-0000-0000-0000-000000000003', 'Sandwich Bread',                 '7401000000233', 'Bakery',       '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000004', 4, 'B', 'left',  'middle', 24, 13, 3.29, NOW(), NOW()),
  ('p0000004-0000-0000-0000-000000000004', 'Burger Buns 8 Pack',             '7401000000240', 'Bakery',       '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000004', 4, 'B', 'left',  'middle', 24, 15, 3.99, NOW(), NOW()),
  ('p0000004-0000-0000-0000-000000000005', 'Flour Tortillas 10 Pack',        '7401000000257', 'Bakery',       '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000004', 4, 'C', 'right', 'middle', 26, 17, 2.99, NOW(), NOW()),

  -- Aisle 5: Pasta, Rice & Grains
  ('p0000005-0000-0000-0000-000000000001', 'Lasagna Sheets 500g',            '7401000000264', 'Pasta',        '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000005', 5, 'A', 'left',  'middle', 30, 9,  3.49, NOW(), NOW()),
  ('p0000005-0000-0000-0000-000000000002', 'Spaghetti 500g',                 '7401000000271', 'Pasta',        '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000005', 5, 'A', 'left',  'middle', 30, 11, 2.29, NOW(), NOW()),
  ('p0000005-0000-0000-0000-000000000003', 'Penne Pasta 500g',               '7401000000288', 'Pasta',        '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000005', 5, 'B', 'left',  'middle', 30, 13, 2.29, NOW(), NOW()),
  ('p0000005-0000-0000-0000-000000000004', 'White Rice 2kg',                 '7401000000295', 'Rice',         '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000005', 5, 'B', 'left',  'bottom', 30, 15, 4.99, NOW(), NOW()),
  ('p0000005-0000-0000-0000-000000000005', 'Arborio Rice 1kg',               '7401000000301', 'Rice',         '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000005', 5, 'C', 'right', 'middle', 32, 17, 5.99, NOW(), NOW()),
  ('p0000005-0000-0000-0000-000000000006', 'Quinoa 500g',                    '7401000000318', 'Grains',       '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000005', 5, 'C', 'right', 'top',    32, 19, 6.49, NOW(), NOW()),

  -- Aisle 6: Canned Goods & Sauces
  ('p0000006-0000-0000-0000-000000000001', 'Tomato Sauce 400g',              '7401000000325', 'Sauces',       '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000006', 6, 'A', 'left',  'middle', 36, 9,  1.99, NOW(), NOW()),
  ('p0000006-0000-0000-0000-000000000002', 'Crushed Tomatoes 800g',          '7401000000332', 'Canned Goods', '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000006', 6, 'A', 'left',  'middle', 36, 11, 2.49, NOW(), NOW()),
  ('p0000006-0000-0000-0000-000000000003', 'Tomato Paste 170g',              '7401000000349', 'Sauces',       '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000006', 6, 'B', 'left',  'middle', 36, 13, 1.39, NOW(), NOW()),
  ('p0000006-0000-0000-0000-000000000004', 'Marinara Sauce 650g',            '7401000000356', 'Sauces',       '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000006', 6, 'B', 'left',  'middle', 36, 15, 3.99, NOW(), NOW()),
  ('p0000006-0000-0000-0000-000000000005', 'Black Beans 400g Can',           '7401000000363', 'Canned Goods', '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000006', 6, 'C', 'right', 'middle', 38, 17, 1.49, NOW(), NOW()),
  ('p0000006-0000-0000-0000-000000000006', 'Sweet Corn 400g Can',            '7401000000370', 'Canned Goods', '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000006', 6, 'C', 'right', 'middle', 38, 19, 1.49, NOW(), NOW()),
  ('p0000006-0000-0000-0000-000000000007', 'Tuna Can 170g',                  '7401000000387', 'Canned Goods', '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000006', 6, 'D', 'right', 'middle', 38, 21, 2.99, NOW(), NOW()),

  -- Aisle 7: Oils, Baking & Spices
  ('p0000007-0000-0000-0000-000000000001', 'Extra Virgin Olive Oil 500ml',   '7401000000394', 'Oils',         '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000007', 7, 'A', 'left',  'middle', 42, 9,  8.99, NOW(), NOW()),
  ('p0000007-0000-0000-0000-000000000002', 'All-Purpose Flour 1kg',          '7401000000400', 'Baking',       '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000007', 7, 'A', 'left',  'bottom', 42, 11, 3.99, NOW(), NOW()),
  ('p0000007-0000-0000-0000-000000000003', 'White Sugar 1kg',                '7401000000417', 'Baking',       '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000007', 7, 'B', 'left',  'bottom', 42, 13, 2.99, NOW(), NOW()),
  ('p0000007-0000-0000-0000-000000000004', 'Sea Salt Grinder',               '7401000000424', 'Spices',       '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000007', 7, 'B', 'left',  'middle', 42, 15, 2.49, NOW(), NOW()),
  ('p0000007-0000-0000-0000-000000000005', 'Black Pepper Grinder',           '7401000000431', 'Spices',       '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000007', 7, 'C', 'right', 'middle', 44, 17, 3.49, NOW(), NOW()),
  ('p0000007-0000-0000-0000-000000000006', 'Dried Oregano',                  '7401000000448', 'Spices',       '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000007', 7, 'C', 'right', 'top',    44, 19, 2.99, NOW(), NOW()),
  ('p0000007-0000-0000-0000-000000000007', 'Dried Basil',                    '7401000000455', 'Spices',       '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000007', 7, 'D', 'right', 'top',    44, 21, 2.99, NOW(), NOW()),

  -- Aisle 8: Beverages
  ('p0000008-0000-0000-0000-000000000001', 'Still Water 6 Pack',             '7401000000462', 'Beverages',    '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000008', 8, 'A', 'left',  'bottom', 48, 9,  3.99, NOW(), NOW()),
  ('p0000008-0000-0000-0000-000000000002', 'Sparkling Water 1L',             '7401000000479', 'Beverages',    '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000008', 8, 'A', 'left',  'middle', 48, 11, 1.69, NOW(), NOW()),
  ('p0000008-0000-0000-0000-000000000003', 'Orange Juice 1L',                '7401000000486', 'Beverages',    '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000008', 8, 'B', 'left',  'middle', 48, 13, 3.49, NOW(), NOW()),
  ('p0000008-0000-0000-0000-000000000004', 'Cola 2L',                        '7401000000493', 'Beverages',    '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000008', 8, 'B', 'left',  'middle', 48, 15, 2.99, NOW(), NOW()),
  ('p0000008-0000-0000-0000-000000000005', 'Red Wine 750ml',                 '7401000000509', 'Beverages',    '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000008', 8, 'C', 'right', 'top',    50, 17, 9.99, NOW(), NOW()),
  ('p0000008-0000-0000-0000-000000000006', 'Beer 6 Pack',                    '7401000000516', 'Beverages',    '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000008', 8, 'C', 'right', 'middle', 50, 19, 8.49, NOW(), NOW()),

  -- Aisle 9: Breakfast, Coffee & Tea
  ('p0000009-0000-0000-0000-000000000001', 'Corn Flakes 500g',               '7401000000523', 'Cereal',       '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000009', 9, 'A', 'left',  'middle', 6,  27, 4.49, NOW(), NOW()),
  ('p0000009-0000-0000-0000-000000000002', 'Granola 350g',                   '7401000000530', 'Cereal',       '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000009', 9, 'A', 'left',  'middle', 6,  29, 5.99, NOW(), NOW()),
  ('p0000009-0000-0000-0000-000000000003', 'Ground Coffee 340g',             '7401000000547', 'Coffee',       '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000009', 9, 'B', 'left',  'middle', 6,  31, 6.99, NOW(), NOW()),
  ('p0000009-0000-0000-0000-000000000004', 'Black Tea 40 Bags',              '7401000000554', 'Tea',          '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000009', 9, 'B', 'left',  'middle', 6,  33, 3.99, NOW(), NOW()),
  ('p0000009-0000-0000-0000-000000000005', 'Peanut Butter 500g',             '7401000000561', 'Spreads',      '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000009', 9, 'C', 'right', 'middle', 8,  35, 4.99, NOW(), NOW()),
  ('p0000009-0000-0000-0000-000000000006', 'Strawberry Jam 450g',            '7401000000578', 'Spreads',      '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-000000000009', 9, 'C', 'right', 'middle', 8,  37, 3.99, NOW(), NOW()),

  -- Aisle 10: Snacks & Sweets
  ('p0000010-0000-0000-0000-000000000001', 'Tortilla Chips',                 '7401000000585', 'Snacks',       '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-00000000000a', 10, 'A', 'left',  'middle', 12, 27, 3.49, NOW(), NOW()),
  ('p0000010-0000-0000-0000-000000000002', 'Potato Chips Original',          '7401000000592', 'Snacks',       '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-00000000000a', 10, 'A', 'left',  'middle', 12, 29, 3.99, NOW(), NOW()),
  ('p0000010-0000-0000-0000-000000000003', 'Chocolate Cookies',              '7401000000608', 'Snacks',       '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-00000000000a', 10, 'B', 'left',  'middle', 12, 31, 4.49, NOW(), NOW()),
  ('p0000010-0000-0000-0000-000000000004', 'Dark Chocolate Bar',             '7401000000615', 'Sweets',       '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-00000000000a', 10, 'B', 'left',  'top',    12, 33, 2.99, NOW(), NOW()),
  ('p0000010-0000-0000-0000-000000000005', 'Mixed Nuts 300g',                '7401000000622', 'Snacks',       '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-00000000000a', 10, 'C', 'right', 'middle', 14, 35, 5.99, NOW(), NOW()),

  -- Aisle 11: Frozen Foods
  ('p0000011-0000-0000-0000-000000000001', 'Frozen Peas 500g',               '7401000000639', 'Frozen',       '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-00000000000b', 11, 'A', 'left',  'middle', 18, 27, 2.99, NOW(), NOW()),
  ('p0000011-0000-0000-0000-000000000002', 'Frozen Mixed Vegetables 500g',   '7401000000646', 'Frozen',       '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-00000000000b', 11, 'A', 'left',  'middle', 18, 29, 3.99, NOW(), NOW()),
  ('p0000011-0000-0000-0000-000000000003', 'Frozen Pizza',                   '7401000000653', 'Frozen',       '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-00000000000b', 11, 'B', 'left',  'middle', 18, 31, 6.99, NOW(), NOW()),
  ('p0000011-0000-0000-0000-000000000004', 'Vanilla Ice Cream 1L',           '7401000000660', 'Frozen',       '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-00000000000b', 11, 'B', 'left',  'middle', 18, 33, 4.99, NOW(), NOW()),
  ('p0000011-0000-0000-0000-000000000005', 'Frozen Fries 750g',              '7401000000677', 'Frozen',       '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-00000000000b', 11, 'C', 'right', 'bottom', 20, 35, 3.49, NOW(), NOW()),

  -- Aisle 12: Household & Personal Care
  ('p0000012-0000-0000-0000-000000000001', 'Dish Soap 750ml',                '7401000000684', 'Cleaning',     '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-00000000000c', 12, 'A', 'left',  'middle', 24, 27, 2.99, NOW(), NOW()),
  ('p0000012-0000-0000-0000-000000000002', 'Laundry Detergent 2L',           '7401000000691', 'Cleaning',     '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-00000000000c', 12, 'A', 'left',  'bottom', 24, 29, 8.99, NOW(), NOW()),
  ('p0000012-0000-0000-0000-000000000003', 'Paper Towels 6 Roll',            '7401000000707', 'Household',    '550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-00000000000c', 12, 'B', 'left',  'bottom', 24, 31, 5.49, NOW(), NOW()),
  ('p0000012-0000-0000-0000-000000000004', 'Toothpaste 150ml',               '7401000000714', 'Personal Care','550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-00000000000c', 12, 'B', 'left',  'middle', 24, 33, 3.49, NOW(), NOW()),
  ('p0000012-0000-0000-0000-000000000005', 'Shampoo 400ml',                  '7401000000721', 'Personal Care','550e8400-e29b-41d4-a716-446655440000', 'a1000000-0000-0000-0000-00000000000c', 12, 'C', 'right', 'middle', 26, 35, 5.99, NOW(), NOW());

SELECT 'supermarkets' AS table_name, COUNT(*) AS row_count FROM supermarkets
UNION ALL
SELECT 'aisles', COUNT(*) FROM aisles
UNION ALL
SELECT 'layout_elements', COUNT(*) FROM layout_elements
UNION ALL
SELECT 'products', COUNT(*) FROM products;

COMMIT;

-- Made with Bob
