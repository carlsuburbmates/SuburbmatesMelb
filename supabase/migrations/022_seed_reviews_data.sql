-- Seed reviews for the first business profile found
DO $$
DECLARE
  v_business_id UUID;
  v_user_id UUID;
BEGIN
  SELECT id INTO v_business_id FROM business_profiles LIMIT 1;
  SELECT id INTO v_user_id FROM users LIMIT 1;

  IF v_business_id IS NOT NULL AND v_user_id IS NOT NULL THEN
    INSERT INTO reviews (business_id, customer_id, rating, comment, verified_purchase, helpful_count, created_at)
    VALUES
      (v_business_id, v_user_id, 5, 'Great service! Highly recommended.', true, 2, NOW() - INTERVAL '1 day'),
      (v_business_id, v_user_id, 4, 'Good, but could be better.', false, 0, NOW() - INTERVAL '5 days'),
      (v_business_id, v_user_id, 5, 'Excellent experience from start to finish.', true, 5, NOW() - INTERVAL '10 days');
  END IF;
END $$;
