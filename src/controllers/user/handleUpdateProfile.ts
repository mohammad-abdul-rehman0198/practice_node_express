import { eq } from "drizzle-orm";
import { Request, Response } from "express";

import { db } from "@/db/index";
import { users } from "@/db/schemas/user";
import { createSupabaseServer } from "@/db/supabase/server";
import { NOTIFY_MESSAGES } from "@/utils/constants/notifyMessages";
import { RequestWithUserId } from "@/utils/interfaces/requestWithUserId";

export const handleUpdateProfile = async (req: Request, res: Response) => {
  try {
    const { name, imageUrl } = req.body;
    const userId = (req as RequestWithUserId).userId;

    const supabase = createSupabaseServer(req);

    if (!name || !imageUrl || !userId) {
      return res.status(400).json({
        success: false,
        message: NOTIFY_MESSAGES.ALL_FIELDS_REQUIRED,
      });
    }

    const { data, error } = await supabase.auth.updateUser({
      data: {
        name,
        imageUrl,
      },
    });

    if (error) {
      return {
        success: false,
        message: error.message || NOTIFY_MESSAGES.PROFILE_UPDATE_FAILED,
      };
    }

    await db
      .update(users)
      .set({
        name,
        imageUrl,
        updatedAt: new Date(),
        updatedBy: userId,
      })
      .where(eq(users.id, userId));

    return res.status(200).json({
      success: true,
      user: {
        name,
        imageUrl,
        id: userId,
        email: data.user?.email,
      },
      message: NOTIFY_MESSAGES.PROFILE_UPDATED_SUCCESS,
    });
  } catch {
    return res
      .status(500)
      .json({ success: false, message: NOTIFY_MESSAGES.SERVER_ERROR });
  }
};
