-- Supprimer la transaction de crédit incorrecte de 900 DA générée pour une formule mensuelle
DELETE FROM credit_transactions 
WHERE id = '0a72d50b-3065-48de-97d0-936f1b773b75';

-- Réinitialiser le solde de crédit du parrain
UPDATE referral_credits 
SET balance_euros = 0,
    balance_percentage = 0,
    last_updated = now()
WHERE user_id = 'aa4d10dd-78b5-497e-b643-0e0827186fdb';

-- Supprimer le code promo généré avec ce crédit incorrect (s'il existe)
DELETE FROM promo_codes
WHERE user_id = 'aa4d10dd-78b5-497e-b643-0e0827186fdb'
AND discount_euros = 900
AND used = false;