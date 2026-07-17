UPDATE produit SET image_url = CASE id
  WHEN 1 THEN 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80'
  WHEN 2 THEN 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80'
  WHEN 3 THEN 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&q=80'
  WHEN 4 THEN 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80'
  WHEN 5 THEN 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80'
  WHEN 6 THEN 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80'
  WHEN 7 THEN 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=400&q=80'
  WHEN 8 THEN 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=400&q=80'
  WHEN 9 THEN 'https://images.unsplash.com/photo-1615478503562-ec2d8aa0e24e?w=400&q=80'
  WHEN 10 THEN 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&q=80'
END WHERE id BETWEEN 1 AND 10;
