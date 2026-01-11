-- Cette fonction doit être exécutée dans le SQL Editor de Supabase
-- Elle permet aux admins de réinitialiser les mots de passe

-- Étape 0: Activer l'extension pgcrypto dans le schema extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Étape 1: Créer la fonction qui change le mot de passe
CREATE OR REPLACE FUNCTION admin_reset_user_password(
  target_user_id UUID,
  new_password TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER -- Execute avec les privilèges du créateur (postgres)
SET search_path = public, extensions
AS $$
DECLARE
  result JSON;
BEGIN
  -- Vérifier que l'utilisateur qui appelle est admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Permission refusée. Seuls les admins peuvent réinitialiser les mots de passe.';
  END IF;

  -- Mettre à jour le mot de passe de l'utilisateur cible dans auth.users
  UPDATE auth.users
  SET 
    encrypted_password = extensions.crypt(new_password, extensions.gen_salt('bf')),
    updated_at = NOW()
  WHERE id = target_user_id;

  -- Marquer que l'utilisateur doit changer son mot de passe
  UPDATE profiles
  SET 
    must_change_password = TRUE,
    temp_password = new_password
  WHERE id = target_user_id;

  result := json_build_object(
    'success', true,
    'message', 'Mot de passe réinitialisé avec succès'
  );

  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- Donner les permissions nécessaires
GRANT EXECUTE ON FUNCTION admin_reset_user_password(UUID, TEXT) TO authenticated;

-- Étape 2: S'assurer que les colonnes existent dans profiles
-- (Exécute ces lignes seulement si les colonnes n'existent pas déjà)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS temp_password TEXT;
