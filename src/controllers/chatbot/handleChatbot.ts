import { Request, Response } from "express";

import gemini from "@/gemini";
import { Todo } from "@/utils/interfaces/Todo";
import { createSupabaseServer } from "@/db/supabase/server";
import { NOTIFY_MESSAGES } from "@/utils/constants/notifyMessages";
import { RequestWithUserId } from "@/utils/interfaces/requestWithUserId";


export const handleChatbot = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const userId = (req as RequestWithUserId).userId;

    if (!message || !userId) {
      return res.status(400).json({
        success: false,
        message: NOTIFY_MESSAGES.ALL_FIELDS_REQUIRED,
      });
    }

    const embedding = await gemini.models.embedContent({
      model: process.env.GEMINI_EMBEDDING_MODEL || "",
      contents: message,
    });

    const supabase = createSupabaseServer(req);
    const { data: todos, error } = await supabase.rpc("get_similar_todos", {
      query_embedding: embedding.embeddings?.[0].values as number[],
      match_count: 5,
      user_id_param: userId,
    });

    

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message || NOTIFY_MESSAGES.SERVER_ERROR,
      });
    }

    const context =
      todos?.map((t: Todo) => `• ${t.taskName}: ${t.description}`).join("\n") ||
      "No relevant todos found.";

    const chatResponse = await gemini.models.generateContent({
      model: process.env.GEMINI_CHATBOT_MODEL || "gemini-2.5-flash",
      contents: `
      You are a smart personal assistant for a todo app. Answer the user's question based ONLY on the todos provided below:

      User Question: ${message}

      Todos:
      ${context}
      `,
    });



    return res.status(200).json({
      success: true,
      answer: chatResponse.candidates?.[0].content?.parts?.[0].text || "No answer generated.",
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: NOTIFY_MESSAGES.SERVER_ERROR,
    });
  }
};
