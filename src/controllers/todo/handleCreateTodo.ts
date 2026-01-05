import { Request, Response } from "express";

import { db } from "@/db/index";
import { todos } from "@/db/schemas/todo";
import { NOTIFY_MESSAGES } from "@/utils/constants/notifyMessages";
import { RequestWithUserId } from "@/utils/interfaces/requestWithUserId";

export const handleCreateTodo = async (req: Request, res: Response) => {
  try {
    const userId = (req as RequestWithUserId).userId;
    const { taskName, description, status } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: NOTIFY_MESSAGES.UNAUTHORIZED,
      });
    }

    const [newTodo] = await db
      .insert(todos)
      .values({
        userId: userId,
        taskName,
        description,
        status: status || false,
        createdBy: userId,
        createdAt: new Date(),
      })
      .returning();

    return res.status(201).json({
      success: true,
      newTodo,
      message: NOTIFY_MESSAGES.TODO_CREATED,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: NOTIFY_MESSAGES.SERVER_ERROR,
    });
  }
};
