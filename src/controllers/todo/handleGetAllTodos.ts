import { Request, Response } from "express";
import { and, eq, isNull } from "drizzle-orm";

import { db } from "@/db/index";
import { todos } from "@/db/schemas/todo";
import { NOTIFY_MESSAGES } from "@/utils/constants/notifyMessages";
import { RequestWithUserId } from "@/utils/interfaces/requestWithUserId";

export const handleGetAllTodos = async (req: Request, res: Response) => {
  try {
    debugger;
    const userId = (req as RequestWithUserId).userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        todos: [],
        message: NOTIFY_MESSAGES.UNAUTHORIZED,
      });
    }

    const todoList = await db
      .select()
      .from(todos)
      .where(and(eq(todos.userId, userId as string), isNull(todos.deletedAt)));

    const todoss = todoList.map((todo) => ({
      id: todo.id,
      taskName: todo.taskName,
      description: todo.description ?? "",
      status: todo.status,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
      deletedAt: todo.deletedAt,
    }));

    return res.status(200).json({
      success: true,
      todos: todoss,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      todos: [],
      message: NOTIFY_MESSAGES.SERVER_ERROR,
    });
  }
};
