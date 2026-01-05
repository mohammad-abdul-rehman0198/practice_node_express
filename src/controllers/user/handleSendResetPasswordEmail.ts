import validator from "validator";
import { Request, Response } from "express";

import { createSupabaseServer } from "@/db/supabase/server";
import { NOTIFY_MESSAGES } from "@/utils/constants/notifyMessages";

export const handleSendResetPasswordEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const supabase = createSupabaseServer(req);

    if (!email || !validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: NOTIFY_MESSAGES.ALL_FIELDS_REQUIRED });
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.CLIENT_URL}/auth/resetPassword`,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message || NOTIFY_MESSAGES.PASSWORD_RESET_EMAIL_NOT_SENT,
      });
    }

    return res.status(200).json({
      success: true,
      message: NOTIFY_MESSAGES.PASSWORD_RESET_EMAIL_SENT,
    });
  } catch {
    return res
      .status(500)
      .json({ success: false, message: NOTIFY_MESSAGES.SERVER_ERROR });
  }
};
