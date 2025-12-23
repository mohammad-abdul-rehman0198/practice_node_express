import validator from "validator";
import { Request, Response } from "express";

import { createSupabaseServer } from "@/db/supabase/server";
import { NOTIFY_MESSAGES } from "@/utils/constants/notifyMessages";

export const handleLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const supabase = createSupabaseServer(req);

    if (!email || !password || !validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: NOTIFY_MESSAGES.ALL_FIELDS_REQUIRED,
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }

    res.cookie("sb-access-token", data.session?.access_token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    res.cookie("sb-refresh-token", data.session?.refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      user: data.user,
      message: NOTIFY_MESSAGES.LOGIN_SUCCESSFUL,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: NOTIFY_MESSAGES.SERVER_ERROR,
    });
  }
};
