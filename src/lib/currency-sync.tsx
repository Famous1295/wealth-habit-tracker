import { useEffect, useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { getAppCurrency, setAppCurrency, subscribeCurrency } from "@/lib/format";

export function useCurrency() {
  return useSyncExternalStore(subscribeCurrency, getAppCurrency, getAppCurrency);
}

export function CurrencySync() {
  const { user } = useAuth();
  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("currency")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.currency) setAppCurrency(data.currency);
      });
  }, [user?.id]);
  return null;
}
