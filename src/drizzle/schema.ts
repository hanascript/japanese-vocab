import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

// Users table
// export const users = pgTable('users', {
//   id: serial('id').primaryKey(),
//   email: text('email').unique().notNull(),
//   name: text('name').notNull(),
//   createdAt: timestamp('created_at').defaultNow().notNull(),
//   updatedAt: timestamp('updated_at').defaultNow().notNull(),
// });

// Decks/Collections of flashcards
export const DecksTable = pgTable('decks', {
  id: serial('id').primaryKey(),
  // userId: integer('user_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Individual flashcards
export const FlashcardsTable = pgTable('flashcards', {
  id: serial('id').primaryKey(),
  deckId: integer('deck_id')
    .references(() => DecksTable.id)
    .notNull(),

  // Front side content
  frontText: text('front_text').notNull(),
  frontSecondary: text('front_secondary'), // Additional info for front

  // Back side content
  backText: text('back_text').notNull(),
  backSecondary: text('back_secondary'), // Additional info for back

  // Metadata
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Spaced repetition data for each user-card combination
export const CardProgressTable = pgTable('card_progress', {
  id: serial('id').primaryKey(),
  // userId: integer('user_id').references(() => users.id).notNull(),
  flashcardId: integer('flashcard_id')
    .references(() => FlashcardsTable.id)
    .notNull(),

  // Spaced repetition algorithm fields
  easeFactor: real('ease_factor').default(2.5).notNull(), // SM-2 algorithm ease factor
  interval: integer('interval').default(1).notNull(), // Days until next review
  repetitions: integer('repetitions').default(0).notNull(), // Consecutive correct answers

  // Review scheduling
  nextReviewDate: timestamp('next_review_date').defaultNow().notNull(),
  lastReviewDate: timestamp('last_review_date'),

  // Performance tracking
  totalReviews: integer('total_reviews').default(0).notNull(),
  correctReviews: integer('correct_reviews').default(0).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Individual review sessions/attempts
export const ReviewSessionsTable = pgTable('review_sessions', {
  id: serial('id').primaryKey(),
  // userId: integer('user_id').references(() => users.id).notNull(),
  flashcardId: integer('flashcard_id')
    .references(() => FlashcardsTable.id)
    .notNull(),

  // Review outcome
  isCorrect: boolean('is_correct').notNull(),
  difficulty: integer('difficulty'), // 1-5 scale for user-reported difficulty
  responseTime: integer('response_time'), // Time in seconds

  // Context
  sessionId: text('session_id'), // Group related reviews together
  reviewedAt: timestamp('reviewed_at').defaultNow().notNull(),
});

// Define relationships
// export const usersRelations = relations(users, ({ many }) => ({
//   decks: many(decks),
//   cardProgress: many(cardProgress),
//   reviewSessions: many(reviewSessions),
// }));

export const DecksRelations = relations(DecksTable, ({ one, many }) => ({
  // user: one(users, {
  //   fields: [decks.userId],
  //   references: [users.id],
  // }),
  flashcards: many(FlashcardsTable),
}));

export const FlashcardsRelations = relations(FlashcardsTable, ({ one, many }) => ({
  deck: one(DecksTable, {
    fields: [FlashcardsTable.deckId],
    references: [DecksTable.id],
  }),
  cardProgress: many(CardProgressTable),
  reviewSessions: many(ReviewSessionsTable),
}));

export const CardProgressRelations = relations(CardProgressTable, ({ one }) => ({
  // user: one(users, {
  //   fields: [cardProgress.userId],
  //   references: [users.id],
  // }),
  flashcard: one(FlashcardsTable, {
    fields: [CardProgressTable.flashcardId],
    references: [FlashcardsTable.id],
  }),
}));

export const ReviewSessionsRelations = relations(ReviewSessionsTable, ({ one }) => ({
  // user: one(users, {
  //   fields: [reviewSessions.userId],
  //   references: [users.id],
  // }),
  flashcard: one(FlashcardsTable, {
    fields: [ReviewSessionsTable.flashcardId],
    references: [FlashcardsTable.id],
  }),
}));
