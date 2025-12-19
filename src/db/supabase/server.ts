import { Request } from "express";
import { createClient } from "@supabase/supabase-js";

export const createSupabaseServer = (req: Request) => {
  const supabase = createClient(
    process.env['SUPABASE_URL']!,
    process.env['SUPABASE_ANON_KEY']!,
    {
      global: {
        headers: {
          cookie: req.headers.cookie || "",
        },
      },
    }
  );

  return supabase;
};
