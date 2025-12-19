import express from "express";
const router = express.Router();

import { authMiddleware } from "@/middleware/authMiddleware";
import { handleLogin } from "@/controllers/user/handleLogin";
import { handleSignup } from "@/controllers/user/handleSignUp";
import { handleLogout } from "@/controllers/user/handleLogout";

router.post("/login", handleLogin);
router.post("/signup", handleSignup);
router.post("/logout", authMiddleware, handleLogout);

export const userRouter = router;
