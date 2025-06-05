import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  serial,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

// Create enums first
export const deckEnum = pgEnum('deck_enum', ['CORE', 'CUSTOM', 'JLPT']);
export const challengeEnum = pgEnum('challenge_enum', ['READING', 'ASSIST']);

// ********** USER AUTHENTICATION **********

export const userRoles = ['admin', 'user'] as const;
export type UserRole = (typeof userRoles)[number];
export const userRoleEnum = pgEnum('user_roles', userRoles);

export const users = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  email: text().notNull().unique(),
  password: text(),
  role: userRoleEnum().notNull().default('user'),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const userRelations = relations(users, ({ many }) => ({
  oAuthAccounts: many(UserOAuthAccountTable),
}));

export const oAuthProviders = ['discord', 'github'] as const;
export type OAuthProvider = (typeof oAuthProviders)[number];
export const oAuthProviderEnum = pgEnum('oauth_provides', oAuthProviders);

export const UserOAuthAccountTable = pgTable(
  'user_oauth_accounts',
  {
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    provider: oAuthProviderEnum().notNull(),
    providerAccountId: text().notNull().unique(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  t => [primaryKey({ columns: [t.providerAccountId, t.provider] })]
);

export const userOauthAccountRelationships = relations(UserOAuthAccountTable, ({ one }) => ({
  user: one(users, {
    fields: [UserOAuthAccountTable.userId],
    references: [users.id],
  }),
}));

// ********** APPLICATION DATA **********

// Core Decks/Collections of flashcards
export const decks = pgTable('decks', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  type: deckEnum('type').default('CUSTOM').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// User custom decks
export const customDecks = pgTable('custom_decks', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Individual flashcards
export const flashcards = pgTable('flashcards', {
  id: serial('id').primaryKey(),
  deckId: integer('deck_id')
    .references(() => decks.id, {
      onDelete: 'cascade',
    })
    .notNull(),

  // Japanese text components
  kanji: text('kanji'), // Optional kanji representation
  kana: text('kana').notNull(), // Required hiragana/katakana
  meaning: text('meaning').notNull(), // Required meaning
  pronunciation: text('pronunciation'), // Optional romaji/pronunciation
  example: text('example'), // Optional example sentence

  // Metadata
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Individual flashcards
export const customFlashcards = pgTable('custom_flashcards', {
  id: serial('id').primaryKey(),
  customDeckId: integer('custom_deck_id')
    .references(() => customDecks.id, {
      onDelete: 'cascade',
    })
    .notNull(),

  // Japanese text components
  kanji: text('kanji'), // Optional kanji representation
  kana: text('kana').notNull(), // Required hiragana/katakana
  meaning: text('meaning').notNull(), // Required meaning
  pronunciation: text('pronunciation'), // Optional romaji/pronunciation
  example: text('example'), // Optional example sentence

  // Metadata
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Spaced repetition data for each user-card combination
export const cardProgress = pgTable('card_progress', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  flashcardId: integer('flashcard_id')
    .references(() => flashcards.id, {
      onDelete: 'cascade',
    })
    .notNull(),

  // Spaced repetition algorithm fields
  easeFactor: real('ease_factor').default(2.5).notNull(), // SM-2 algorithm ease factor
  interval: integer('interval').default(1).notNull(), // Days until next review

  // Review scheduling
  nextReviewDate: timestamp('next_review_date').defaultNow().notNull(),
  lastReviewDate: timestamp('last_review_date'),

  // Performance tracking
  totalReviews: integer('total_reviews').default(0).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Courses structure
export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(), // Japanese 101
  description: text('description'), // Learn the basics of Japanese
  slug: text('slug').unique().notNull(), //URL-friendly identifier
  order: integer('order').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Chapters within courses
export const chapters = pgTable('chapters', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id')
    .references(() => courses.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  title: text('title').notNull(),
  description: text('description'),
  order: integer('order').notNull(),
  isPublished: boolean('is_published').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const lessons = pgTable('lessons', {
  id: serial('id').primaryKey(),
  chapterId: integer('chapter_id')
    .references(() => chapters.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  content: text('content'),
  order: integer('order').notNull(),
  isPublished: boolean('is_published').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Challenges at the end of each lesson
export const challenges = pgTable('challenges', {
  id: serial('id').primaryKey(),
  lessonId: integer('lesson_id')
    .references(() => lessons.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  question: text('question').notNull(),
  type: challengeEnum('type').default('READING').notNull(),
});

// Options for each challenge
export const challengeOptions = pgTable('challenge_options', {
  id: serial('id').primaryKey(),
  challengeId: integer('challenge_id')
    .references(() => challenges.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  option: text('option').notNull(),
  isCorrect: boolean('is_correct').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// User progress through courses
export const userCourseProgress = pgTable('user_course_progress', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  courseId: integer('course_id')
    .references(() => courses.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  isStarted: boolean('is_started').default(false).notNull(),
  isCompleted: boolean('is_completed').default(false).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const userChapterProgress = pgTable('user_chapter_progress', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  chapterId: integer('chapter_id')
    .references(() => chapters.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  isStarted: boolean('is_started').default(false).notNull(),
  isCompleted: boolean('is_completed').default(false).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// User progress through lessons
export const userLessonProgress = pgTable('user_lesson_progress', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  lessonId: integer('lesson_id')
    .references(() => lessons.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  isStarted: boolean('is_started').default(false).notNull(),
  isCompleted: boolean('is_completed').default(false).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ********** RELATIONS **********

export const usersRelations = relations(users, ({ many }) => ({
  decks: many(decks),
  cardProgress: many(cardProgress),
  userCourseProgress: many(userCourseProgress),
  userChapterProgress: many(userChapterProgress),
  userLessonProgress: many(userLessonProgress),
}));

export const decksRelations = relations(decks, ({ one, many }) => ({
  flashcards: many(flashcards),
}));

export const customDecksRelations = relations(customDecks, ({ one, many }) => ({
  user: one(users, {
    fields: [customDecks.userId],
    references: [users.id],
  }),
  flashcards: many(flashcards),
}));

export const flashcardsRelations = relations(flashcards, ({ one, many }) => ({
  deck: one(decks, {
    fields: [flashcards.deckId],
    references: [decks.id],
  }),
  cardProgress: many(cardProgress),
}));

export const cardProgressRelations = relations(cardProgress, ({ one }) => ({
  user: one(users, {
    fields: [cardProgress.userId],
    references: [users.id],
  }),
  flashcard: one(flashcards, {
    fields: [cardProgress.flashcardId],
    references: [flashcards.id],
  }),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
  chapters: many(chapters),
  userProgress: many(userCourseProgress),
}));

export const chaptersRelations = relations(chapters, ({ one, many }) => ({
  course: one(courses, {
    fields: [chapters.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  chapter: one(chapters, {
    fields: [lessons.chapterId],
    references: [chapters.id],
  }),
  challenges: many(challenges),
  userProgress: many(userLessonProgress),
}));

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [challenges.lessonId],
    references: [lessons.id],
  }),
  options: many(challengeOptions),
}));

export const challengeOptionsRelations = relations(challengeOptions, ({ one }) => ({
  challenge: one(challenges, {
    fields: [challengeOptions.challengeId],
    references: [challenges.id],
  }),
}));

export const userCourseProgressRelations = relations(userCourseProgress, ({ one }) => ({
  user: one(users, {
    fields: [userCourseProgress.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [userCourseProgress.courseId],
    references: [courses.id],
  }),
}));

export const userChapterProgressRelations = relations(userChapterProgress, ({ one }) => ({
  user: one(users, {
    fields: [userChapterProgress.userId],
    references: [users.id],
  }),
  chapter: one(chapters, {
    fields: [userChapterProgress.chapterId],
    references: [chapters.id],
  }),
}));

export const userLessonProgressRelations = relations(userLessonProgress, ({ one }) => ({
  user: one(users, {
    fields: [userLessonProgress.userId],
    references: [users.id],
  }),
  lesson: one(lessons, {
    fields: [userLessonProgress.lessonId],
    references: [lessons.id],
  }),
}));
