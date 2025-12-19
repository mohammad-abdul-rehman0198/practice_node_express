import { Request, Response } from "express";

import { createSupabaseServer } from "@/db/supabase/server";
import { NOTIFY_MESSAGES } from "@/utils/constants/notifyMessages";

export const handleLogout = async (req: Request, res: Response) => {
  try {
    const supabase = createSupabaseServer(req);

    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.clearCookie("sb-access-token");
    res.clearCookie("sb-refresh-token");

    return res.status(200).json({
      success: true,
      message: NOTIFY_MESSAGES.LOGOUT_SUCCESSFUL,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: NOTIFY_MESSAGES.SERVER_ERROR,
    });
  }
};
