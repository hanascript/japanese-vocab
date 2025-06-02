CREATE TABLE "card_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"flashcard_id" integer NOT NULL,
	"ease_factor" real DEFAULT 2.5 NOT NULL,
	"interval" integer DEFAULT 1 NOT NULL,
	"repetitions" integer DEFAULT 0 NOT NULL,
	"next_review_date" timestamp DEFAULT now() NOT NULL,
	"last_review_date" timestamp,
	"total_reviews" integer DEFAULT 0 NOT NULL,
	"correct_reviews" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "decks" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "flashcards" (
	"id" serial PRIMARY KEY NOT NULL,
	"deck_id" integer NOT NULL,
	"kanji" text,
	"kana" text NOT NULL,
	"meaning" text NOT NULL,
	"pronunciation" text,
	"example" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"flashcard_id" integer NOT NULL,
	"is_correct" boolean NOT NULL,
	"difficulty" integer,
	"response_time" integer,
	"session_id" text,
	"reviewed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "card_progress" ADD CONSTRAINT "card_progress_flashcard_id_flashcards_id_fk" FOREIGN KEY ("flashcard_id") REFERENCES "public"."flashcards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flashcards" ADD CONSTRAINT "flashcards_deck_id_decks_id_fk" FOREIGN KEY ("deck_id") REFERENCES "public"."decks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_sessions" ADD CONSTRAINT "review_sessions_flashcard_id_flashcards_id_fk" FOREIGN KEY ("flashcard_id") REFERENCES "public"."flashcards"("id") ON DELETE no action ON UPDATE no action;