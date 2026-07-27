CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

REVOKE EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

-- profiles
DROP POLICY IF EXISTS "own profile select" ON public.profiles;
CREATE POLICY "own profile select" ON public.profiles FOR SELECT TO authenticated
  USING ((auth.uid() = id) OR private.has_role(auth.uid(), 'admin'::public.app_role));

-- user_roles
DROP POLICY IF EXISTS "roles read" ON public.user_roles;
CREATE POLICY "roles read" ON public.user_roles FOR SELECT TO authenticated
  USING ((user_id = auth.uid()) OR private.has_role(auth.uid(), 'admin'::public.app_role));

-- incomes
DROP POLICY IF EXISTS "incomes owner all" ON public.incomes;
CREATE POLICY "incomes owner all" ON public.incomes FOR ALL TO authenticated
  USING ((auth.uid() = user_id) OR private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (auth.uid() = user_id);

-- expenses
DROP POLICY IF EXISTS "expenses owner all" ON public.expenses;
CREATE POLICY "expenses owner all" ON public.expenses FOR ALL TO authenticated
  USING ((auth.uid() = user_id) OR private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (auth.uid() = user_id);

-- savings_goals
DROP POLICY IF EXISTS "goals owner all" ON public.savings_goals;
CREATE POLICY "goals owner all" ON public.savings_goals FOR ALL TO authenticated
  USING ((auth.uid() = user_id) OR private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (auth.uid() = user_id);

-- investments
DROP POLICY IF EXISTS "investments owner all" ON public.investments;
CREATE POLICY "investments owner all" ON public.investments FOR ALL TO authenticated
  USING ((auth.uid() = user_id) OR private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (auth.uid() = user_id);

-- habits
DROP POLICY IF EXISTS "habits owner all" ON public.habits;
CREATE POLICY "habits owner all" ON public.habits FOR ALL TO authenticated
  USING ((auth.uid() = user_id) OR private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (auth.uid() = user_id);

-- habit_logs
DROP POLICY IF EXISTS "habit_logs owner all" ON public.habit_logs;
CREATE POLICY "habit_logs owner all" ON public.habit_logs FOR ALL TO authenticated
  USING ((auth.uid() = user_id) OR private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (auth.uid() = user_id);

-- feedback
DROP POLICY IF EXISTS "feedback owner read" ON public.feedback;
CREATE POLICY "feedback owner read" ON public.feedback FOR SELECT TO authenticated
  USING ((auth.uid() = user_id) OR private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "feedback admin update" ON public.feedback;
CREATE POLICY "feedback admin update" ON public.feedback FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- Now safe to remove the public-schema function
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);