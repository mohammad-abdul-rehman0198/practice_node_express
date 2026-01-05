import { Request, Response } from "express";

import { createSupabaseServer } from "@/db/supabase/server";
import { NOTIFY_MESSAGES } from "@/utils/constants/notifyMessages";

export const handleGetUser = async (req: Request, res: Response) => {
  try {
    const supabase = createSupabaseServer(req);

    const { data: { user }, error } = await supabase.auth.getUser(req.cookies["sb-access-token"]);

    if (!user || error) {
      return res.status(401).json({
        success: false,
        message: NOTIFY_MESSAGES.UNAUTHORIZED,
      });
    }

    const userData = {
      id: user.id,
      name: user.user_metadata?.name || "",
      email: user.email || "",
      imageUrl: user.user_metadata?.imageUrl || "",
    };

    return res.status(200).json({
      success: true,
      user: userData,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: NOTIFY_MESSAGES.SERVER_ERROR,
    });
  }
};
