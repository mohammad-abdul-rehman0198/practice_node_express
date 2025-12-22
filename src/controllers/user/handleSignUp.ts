import { eq } from "drizzle-orm";
import validator from "validator";
import { Request, Response } from "express";

import { db } from "@/db/index";
import { users } from "@/db/schemas/user";
import { createSupabaseServer } from "@/db/supabase/server";
import { NOTIFY_MESSAGES } from "@/utils/constants/notifyMessages";

export const handleSignup = async (req: Request, res: Response) => {
  try {
    const { email, password, confirmPassword, name } = req.body;

    const supabase = createSupabaseServer(req);

    if (
      !email ||
      !password ||
      !name ||
      !validator.isEmail(email) ||
      password.length < 6 ||
      password !== confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: NOTIFY_MESSAGES.ALL_FIELDS_REQUIRED,
      });
    }

    const emailExists = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (emailExists.length > 0) {
      return res.status(400).json({
        success: false,
        message: NOTIFY_MESSAGES.EMAIL_ALREADY_EXISTS,
      });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          imageUrl: "",
        },
      },
    });

    if (error) {
      return res.status(401).json({
        success: false,
        message: error.message || NOTIFY_MESSAGES.SIGNUP_FAILED,
      });
    }

    await db.insert(users).values({
      id: data.user?.id,
      name: name,
      email: email,
      imageUrl: "",
      createdBy: data.user?.id,
      createdAt: new Date(),
      updatedBy: null,
      updatedAt: null,
      deletedBy: null,
      deletedAt: null,
    });

    return res.status(201).json({
      success: true,
      user: data.user,
      message: NOTIFY_MESSAGES.SIGNUP_SUCCESSFUL,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: NOTIFY_MESSAGES.SERVER_ERROR,
    });
  }
};
