-- Corriger la fonction pour appliquer la réduction de 5% au filleul uniquement sur les formules annuelles
CREATE OR REPLACE FUNCTION public.activate_referral_on_first_payment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_referee_id UUID;
  v_referrer_id UUID;
  v_referral_id UUID;
  v_discount_percentage NUMERIC := 5;
  v_discount_amount NUMERIC;
  v_final_amount NUMERIC;
  v_plan_billing_period text;
BEGIN
  IF NEW.status = 'paid' THEN
    -- Récupérer l'ID du filleul
    SELECT s.user_id INTO v_referee_id
    FROM subscriptions s
    WHERE s.id = NEW.subscription_id;
    
    -- Vérifier si c'est le premier paiement du filleul
    IF NOT EXISTS (
      SELECT 1 
      FROM subscription_payments sp
      JOIN subscriptions s ON s.id = sp.subscription_id
      WHERE s.user_id = v_referee_id 
      AND sp.status = 'paid'
      AND sp.id != NEW.id
    ) THEN
      -- Vérifier s'il y a un parrainage actif pour ce filleul
      SELECT r.id, r.referrer_id INTO v_referral_id, v_referrer_id
      FROM referrals r
      WHERE r.referee_id = v_referee_id
      AND r.status = 'active'
      AND r.first_payment_date IS NULL
      LIMIT 1;
      
      IF v_referrer_id IS NOT NULL THEN
        -- Récupérer le type de formule
        SELECT sp.billing_period INTO v_plan_billing_period
        FROM subscription_plans sp
        WHERE sp.id = (SELECT plan_id FROM subscriptions WHERE id = NEW.subscription_id);
        
        -- Appliquer la réduction UNIQUEMENT pour les formules annuelles
        IF v_plan_billing_period = 'annual' THEN
          -- Calculer la réduction de 5%
          v_discount_amount := ROUND(NEW.amount_paid * (v_discount_percentage / 100), 2);
          v_final_amount := NEW.amount_paid - v_discount_amount;
          
          -- Mettre à jour le referral
          UPDATE referrals
          SET 
            first_payment_date = NEW.payment_date,
            first_subscription_id = NEW.subscription_id,
            pending_validation = TRUE,
            referee_discount_applied = v_discount_amount,
            discount_applied_referee = TRUE
          WHERE id = v_referral_id;
          
          -- Enregistrer dans l'historique
          INSERT INTO referral_discount_history (
            referrer_id,
            referee_id,
            subscription_payment_id,
            original_price,
            discount_percentage,
            discount_amount,
            final_price,
            notes
          ) VALUES (
            v_referrer_id,
            v_referee_id,
            NEW.id,
            NEW.amount_paid,
            v_discount_percentage,
            v_discount_amount,
            v_final_amount,
            'Réduction de 5% appliquée au filleul lors de son premier paiement (formule annuelle)'
          );
          
          -- Mettre à jour le montant du paiement avec la réduction
          NEW.amount_paid := v_final_amount;
          NEW.notes := COALESCE(NEW.notes || ' | ', '') || 'Réduction parrainage filleul: -' || v_discount_amount || ' DA';
        ELSE
          -- Pour les formules mensuelles, juste enregistrer le premier paiement sans réduction
          UPDATE referrals
          SET 
            first_payment_date = NEW.payment_date,
            first_subscription_id = NEW.subscription_id,
            pending_validation = TRUE
          WHERE id = v_referral_id;
        END IF;
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;