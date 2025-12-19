import express from "express";
const router = express.Router();

import { authMiddleware } from "@/middleware/authMiddleware";
import { handleCreateTodo } from "@/controllers/todo/handleCreateTodo";
import { handleUpdateTodo } from "@/controllers/todo/handleUpdateTodo";
import { handleDeleteTodo } from "@/controllers/todo/handleDeleteTodo";
import { handleGetAllTodos } from "@/controllers/todo/handleGetAllTodos";
import { toggleTodoStatus } from "@/controllers/todo/handleToggleTodoStatus";

router.get("/", authMiddleware, handleGetAllTodos);
router.post("/", authMiddleware, handleCreateTodo);
router.put("/:id", authMiddleware, handleUpdateTodo);
router.delete("/:id", authMiddleware, handleDeleteTodo);
router.put("/:id/toggle-status", authMiddleware, toggleTodoStatus);

export const todoRouter = router;
