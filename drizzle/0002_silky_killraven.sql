CREATE TABLE "embeddings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"embedding" vector(768),
	"todo_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "embeddings" ADD CONSTRAINT "embeddings_todo_id_todos_id_fk" FOREIGN KEY ("todo_id") REFERENCES "public"."todos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "todos" DROP COLUMN "embedding";