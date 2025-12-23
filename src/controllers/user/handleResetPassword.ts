import { Request, Response } from "express";

import { createSupabaseServer } from "@/db/supabase/server";
import { NOTIFY_MESSAGES } from "@/utils/constants/notifyMessages";
import { RequestWithUserId } from "@/utils/interfaces/requestWithUserId";

export const handleResetPassword = async (req: Request, res: Response) => {
  try {
    const { password, confirmPassword } = req.body;
    if (
      !password ||
      !confirmPassword ||
      password.length < 6 ||
      password !== confirmPassword
    ) {
      return res
        .status(400)
        .json({ success: false, message: NOTIFY_MESSAGES.ALL_FIELDS_REQUIRED });
    }

    const supabase = createSupabaseServer(req);

    const { error: sessionError} = await supabase.auth.setSession({
      access_token: req.cookies["sb-access-token"],
      refresh_token: req.cookies["sb-refresh-token"],
    });

    if (sessionError) {
      return res.status(401).json({ success: false, message: NOTIFY_MESSAGES.UNAUTHORIZED });
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message || NOTIFY_MESSAGES.PASSWORD_RESET_FAILED,
      });
    }

    res.clearCookie("sb-access-token");
    res.clearCookie("sb-refresh-token");

    return res
      .status(200)
      .json({ success: true, message: NOTIFY_MESSAGES.PASSWORD_RESET_SUCCESS });
  } catch {
    return res
      .status(500)
      .json({ success: false, message: NOTIFY_MESSAGES.SERVER_ERROR });
  }
};
