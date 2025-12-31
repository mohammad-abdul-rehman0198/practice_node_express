import OpenAI from "openai";
import { Request, Response } from "express";

import { createSupabaseServer } from "@/db/supabase/server";
import { NOTIFY_MESSAGES } from "@/utils/constants/notifyMessages";
import { RequestWithUserId } from "@/utils/interfaces/requestWithUserId";

interface Todo {
  id: string;
  task_name: string;
  description: string;
  status: boolean;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
  deleted_at: string;
  deleted_by: string;
  similarity: number;
}

export const handleChatbot = async (req: Request, res: Response) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const { message } = req.body;
    const userId = (req as RequestWithUserId).userId;

    if (!message || !userId) {
      return res.status(400).json({
        success: false,
        message: NOTIFY_MESSAGES.ALL_FIELDS_REQUIRED,
      });
    }

    const embeddingResponse = await openai.embeddings.create({
      model: process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small",
      input: message,
    });

    const embedding = embeddingResponse.data[0].embedding;

    if (!embedding || embedding.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate embedding",
      });
    }

    const supabase = createSupabaseServer(req);
    const { data: todos, error } = await supabase.rpc("get_similar_todos", {
      user_id_param: userId,
      query_embedding: embedding,
      match_count: 1000,
    });

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    const context =
      todos?.length > 0
        ? todos
            .map((t: Todo) => {
              return `
                Todo Information:
                - ID: ${t.id}
                - Title: ${t.task_name}
                - Description: ${t.description || "N/A"}
                - Status: ${t.status ? "Completed" : "Pending"}
                - Created By: ${t.created_by}
                - Created At: ${t.created_at}
                - Updated By: ${t.updated_by}
                - Updated At: ${t.updated_at}
                - Deleted At: ${t.deleted_at}
                - Deleted By: ${t.deleted_by}
                - Similarity Score: ${t.similarity}

            `.trim();
            })
            .join("\n\n")
        : "No relevant todos found.";


    const chatResponse = await openai.chat.completions.create({
      model: process.env.OPENAI_CHAT_MODEL || "gpt-4",
      messages: [
        {
          role: "user",
          content: `
                You are a helpful todo assistant.
                User Question:  ${message}   
                Relevant Todos: ${context} 
                instructions:
                - Make sure to respond in the same language as the user's question.
                - If in relevant todos apear irrelevant todos according to user's question appear than ignore them.
                - If the user's question is not related to todos, respond with "I'm sorry, I can only help with Todo Application."
                - If the user's question is not clear, respond with "I'm sorry, I didn't understand your question. Please try again."
                - In response, provide the title, description, status, created at.
                - If user ask question about related delete todo than add in response delete at.
          `,
        },
      ],
    });

    const answer =
      chatResponse.choices?.[0]?.message?.content || "No answer generated.";

    return res.status(200).json({
      success: true,
      answer,
    });
  } catch (err) {
    console.error("Chatbot Error:", err);
    return res.status(500).json({
      success: false,
      message: NOTIFY_MESSAGES.SERVER_ERROR,
    });
  }
};
