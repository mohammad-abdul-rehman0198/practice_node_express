import { and, eq } from "drizzle-orm";
import { Request, Response } from "express";

import { db } from "@/db/index";
import { todos } from "@/db/schemas/todo";
import { NOTIFY_MESSAGES } from "@/utils/constants/notifyMessages";
import { RequestWithUserId } from "@/utils/interfaces/requestWithUserId";

export const handleUpdateTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const userId = (req as RequestWithUserId).userId;
    const { taskName, description } = req.body;
    if (!userId || !id) {
      return res.status(401).json({
        success: false,
        message: NOTIFY_MESSAGES.UNAUTHORIZED,
      });
    }

    const [existingTodo] = await db
      .select()
      .from(todos)
      .where(
        and(eq(todos.id, id as string), eq(todos.userId, userId as string))
      );

    if (!existingTodo) {
      return res.status(404).json({
        success: false,
        message: NOTIFY_MESSAGES.TODO_NOT_FOUND,
      });
    }

    const [updatedTodo] = await db
      .update(todos)
      .set({
        taskName,
        description,
        updatedBy: userId as string,
        updatedAt: new Date(),
      })
      .where(and(eq(todos.id, id as string), eq(todos.userId, userId as string)))
      .returning();

    return res.status(200).json({
      success: true,
      updatedTodo,
      message: NOTIFY_MESSAGES.TODO_UPDATED,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: NOTIFY_MESSAGES.SERVER_ERROR,
    });
  }
};
