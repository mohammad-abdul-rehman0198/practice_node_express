import { Request } from "express";

import { createSupabaseServer } from "@/db/supabase/server";

export const getUser = async (req: Request, accessToken: string) => {
  const supabase = createSupabaseServer(req);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(accessToken);

  return { user, error };
};
