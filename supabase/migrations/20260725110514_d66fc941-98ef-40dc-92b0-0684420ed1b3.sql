
CREATE TYPE public.recurrence AS ENUM ('daily','weekly','monthly','yearly');

ALTER TABLE public.expenses
  ADD COLUMN is_recurring BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN recurring_frequency public.recurrence;

ALTER TABLE public.incomes
  ADD COLUMN is_recurring BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN recurring_frequency public.recurrence;
