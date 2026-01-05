ALTER TABLE "todos" ALTER COLUMN "embedding" SET DATA TYPE vector(768);--> statement-breakpoint
ALTER TABLE "todos" ALTER COLUMN "embedding" DROP NOT NULL;