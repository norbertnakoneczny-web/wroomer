-- WROOMER.PL / projekt funkcji zarządzania rolami.
-- UWAGA: baza testowa i produkcyjna są wspólne. Plik nie jest automatycznie uruchamiany.
-- Wykonaj dopiero po zatwierdzeniu wdrożenia.
CREATE OR REPLACE FUNCTION public.wroomer_change_role(target_id uuid, requested_role text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF auth.uid() IS DISTINCT FROM 'a3f908b0-71dc-4c55-8f76-79294e167159'::uuid
     OR NOT public.is_wroomer_admin() THEN
    RAISE EXCEPTION 'Brak uprawnień';
  END IF;
  IF target_id IS NULL OR target_id = auth.uid() THEN
    RAISE EXCEPTION 'Nie można zmienić własnej roli';
  END IF;
  IF requested_role IS NULL OR requested_role NOT IN ('user', 'moderator', 'admin') THEN
    RAISE EXCEPTION 'Nieprawidłowa rola';
  END IF;
  UPDATE public.profiles SET role = requested_role WHERE id = target_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Nie znaleziono użytkownika';
  END IF;
END;
$$;
REVOKE ALL ON FUNCTION public.wroomer_change_role(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.wroomer_change_role(uuid, text) TO authenticated;
