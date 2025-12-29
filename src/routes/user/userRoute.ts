import express from "express";
const router = express.Router();

import { authMiddleware } from "@/middleware/authMiddleware";
import { handleLogin } from "@/controllers/user/handleLogin";
import { handleSignup } from "@/controllers/user/handleSignUp";
import { handleLogout } from "@/controllers/user/handleLogout";
import { handleGetUser } from "@/controllers/user/handleGetUser";
import { handleUpdateProfile } from "@/controllers/user/handleUpdateProfile";
import { handleResetPassword } from "@/controllers/user/handleResetPassword";
import { handleSendResetPasswordEmail } from "@/controllers/user/handleSendResetPasswordEmail";


router.post("/login", handleLogin);
router.post("/signup", handleSignup);
router.post("/logout", authMiddleware, handleLogout);
router.get("/get-user", authMiddleware, handleGetUser);
router.post("/reset-password",authMiddleware, handleResetPassword);
router.put("/update-profile", authMiddleware, handleUpdateProfile);
router.post("/send-reset-password-email", handleSendResetPasswordEmail);

export const userRouter = router;
