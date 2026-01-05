import { pgTable, uuid, vector } from "drizzle-orm/pg-core";

import { todos } from "@/db/schemas/todo";

export const embeddings = pgTable("embeddings", {
  id: uuid("id").primaryKey().defaultRandom(),
  embedding: vector("embedding", { dimensions: 1536 }),
  todoId: uuid("todo_id")
    .notNull()
    .references(() => todos.id),
});