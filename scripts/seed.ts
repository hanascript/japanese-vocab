import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from '../src/drizzle/schema';
import { KanjiEntry, kanjiList } from './kanji';

config({ path: '.env.local' });

const connection = process.env.DATABASE_URL!;
const sql = postgres(connection);
const db = drizzle(sql, { schema });

async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data (optional)
    // console.log('🗑️ Clearing existing data...');
    // await db.delete(schema.decks);
    // await db.delete(schema.flashcards);
    // await db.delete(schema.courses);
    // await db.delete(schema.chapters);
    // await db.delete(schema.lessons);
    // await db.delete(schema.challenges);
    // await db.delete(schema.challengeOptions);

    // Seed decks
    console.log('👥 Seeding decks...');
    const seedDecks = await db
      .insert(schema.decks)
      .values([
        {
          name: 'Japanese N1 Vocabulary',
          description: 'Vocabulary for the Japanese N1 exam',
          type: 'JLPT',
        },
      ])
      .returning();

    console.log(`✅ Created ${seedDecks.length} decks`);

    // Seed flashcards
    console.log('📇 Seeding flashcards...');
    const seedFlashcards = await db
      .insert(schema.flashcards)
      .values([
        ...kanjiList.map((kanji: KanjiEntry) => ({
          deckId: seedDecks[0].id,
          kanji: kanji.kanji,
          kana: kanji.hiragana,
          meaning: kanji.meaning,
          pronunciation: kanji.reading,
        })),
      ])
      .returning();

    console.log(`✅ Created ${seedFlashcards.length} flashcards`);

    // Seed courses
    console.log('📖 Seeding courses...');
    const seedCourses = await db
      .insert(schema.courses)
      .values([
        {
          title: 'Learn the basics of Japanese',
          slug: 'jpn1',
          order: 1,
        },
        {
          title: 'Verbs in Japanese',
          slug: 'jpn2',
          order: 2,
        },
      ])
      .returning();

    console.log(`✅ Created ${seedCourses.length} courses`);

    // Seed chapters
    console.log('🎫 Seeding chapters...');
    const seedChapters = await db
      .insert(schema.chapters)
      .values([
        {
          courseId: seedCourses[0].id,
          title: 'Hiragana',
          description: 'Learn the basics of Hiragana',
          order: 1,
          isPublished: true,
        },
        {
          courseId: seedCourses[0].id,
          title: 'Katakana',
          description: 'Learn the basics of Katakana',
          order: 2,
        },
      ])
      .returning();

    console.log(`✅ Created ${seedChapters.length} chapters`);

    // Seed lessons
    console.log('💡 Seeding lessons...');
    const seedLessons = await db
      .insert(schema.lessons)
      .values([
        {
          chapterId: seedChapters[0].id,
          content: 'Hiragana',
          order: 1,
          isPublished: true,
        },
        {
          chapterId: seedChapters[0].id,
          content: 'Katakana',
          order: 2,
          isPublished: true,
        },
      ])
      .returning();

    console.log(`✅ Created ${seedLessons.length} lessons`);

    // Seed challenges
    console.log('⚔️ Seeding challenges...');

    const seedChallenges = await db
      .insert(schema.challenges)
      .values([
        {
          lessonId: seedLessons[0].id,
          question: 'What is the first letter of the alphabet?',
          type: 'ASSIST',
        },
        {
          lessonId: seedLessons[0].id,
          question: 'What is the second letter of the alphabet?',
          type: 'ASSIST',
        },
      ])
      .returning();

    console.log(`✅ Created ${seedChallenges.length} challenges`);

    // Seed challenge options
    console.log('✔️ Seeding challenge options...');
    const seedChallengeOptions = await db
      .insert(schema.challengeOptions)
      .values([
        {
          challengeId: seedChallenges[0].id,
          option: 'A',
          isCorrect: true,
        },
        {
          challengeId: seedChallenges[0].id,
          option: 'B',
          isCorrect: false,
        },
        {
          challengeId: seedChallenges[0].id,
          option: 'C',
          isCorrect: false,
        },
        {
          challengeId: seedChallenges[0].id,
          option: 'D',
          isCorrect: false,
        },
      ])
      .returning();

    console.log(`✅ Created ${seedChallengeOptions.length} challenge options`);

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    // Close the connection
    await sql.end();
  }
}

// Run the seed function
seed().catch(error => {
  console.error('Seed script failed:', error);
  process.exit(1);
});
