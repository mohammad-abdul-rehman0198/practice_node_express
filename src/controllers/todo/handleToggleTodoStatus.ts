import { and, eq } from "drizzle-orm";
import { Request, Response } from "express";

import { db } from "@/db/index";
import { todos } from "@/db/schemas/todo";
import { NOTIFY_MESSAGES } from "@/utils/constants/notifyMessages";
import { RequestWithUserId } from "@/utils/interfaces/requestWithUserId";

export const toggleTodoStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as RequestWithUserId).userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: NOTIFY_MESSAGES.UNAUTHORIZED,
      });
    }

    const [existingTodo] = await db
      .select()
      .from(todos)
      .where(and(eq(todos.id, id), eq(todos.userId, userId as string)));

    if (!existingTodo) {
      return res.status(404).json({
        success: false,
        message: NOTIFY_MESSAGES.TODO_NOT_FOUND,
      });
    }

    const [updatedTodo] = await db
      .update(todos)
      .set({
        status: !existingTodo.status,
        updatedBy: userId,
        updatedAt: new Date(),
      })
      .where(and(eq(todos.id, id), eq(todos.userId, userId as string)))
      .returning();

    return res.status(200).json({
      success: true,
      updatedTodo,
      message: NOTIFY_MESSAGES.TODO_STATUS_TOGGLED,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: NOTIFY_MESSAGES.SERVER_ERROR,
    });
  }
};
