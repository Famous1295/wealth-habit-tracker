# Habit Grow Wealth

A personal finance and habit-tracking app.

## Development

You need Node.js (or Bun) installed.

```sh
git clone https://github.com/Famous1295/habit-grow-wealth.git
cd habit-grow-wealth
bun install   # or: npm i
bun run dev   # or: npm run dev
```

## Environment variables

- Supabase connection vars (see `src/integrations/supabase/client.ts` for the required keys)
- `AI_API_KEY` (optional) — enables AI-generated financial insights. Also supports
  `AI_API_BASE_URL` and `AI_MODEL` to point at any OpenAI-compatible provider.

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS
- Supabase
