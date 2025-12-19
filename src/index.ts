import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";

import { userRouter } from "@/routes/user/userRoute";
import { todoRouter } from "@/routes/todo/todoRoute";

const app = express();

const corsOptions = {
  origin: process.env["CLIENT_URL"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

const PORT = process.env["PORT"];

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));

app.use("/user", userRouter);
app.use("/todo", todoRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
