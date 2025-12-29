import express from "express";
const router = express.Router();

import { authMiddleware } from "@/middleware/authMiddleware";
import { handleChatbot } from "@/controllers/chatbot/handleChatbot";

router.post("/", authMiddleware, handleChatbot);

export const chatbotRouter = router;