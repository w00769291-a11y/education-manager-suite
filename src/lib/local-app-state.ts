// Browser-only stand-in for the shared "app_state" table: keeps each key in localStorage.
type Row = { key: string; value: unknown };
const PREFIX = "app_state:";

function read(key: string): Row | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(PREFIX + key);
  return raw ? { key, value: JSON.parse(raw) } : null;
}

export const supabase = {
  from(_table: string) {
    return {
      select(_cols: string) {
        return {
          eq(_col: string, key: string) {
            return {
              maybeSingle: async () => ({ data: read(key), error: null as Error | null }),
            };
          },
        };
      },
      upsert: async (row: { key: string; value: unknown } & Record<string, unknown>) => {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(PREFIX + row.key, JSON.stringify(row.value));
        }
        return { data: null, error: null as Error | null };
      },
    };
  },
};
