import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from '../src/drizzle/schema';
import { decks, flashcards } from '../src/drizzle/schema';
import { KanjiEntry, kanjiList } from './kanji';

config({ path: '.env.local' });

const connection = process.env.DATABASE_URL!;
const sql = postgres(connection);
const db = drizzle(sql, { schema });

async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data (optional)
    console.log('🗑️ Clearing existing data...');
    await db.delete(decks);
    await db.delete(flashcards);

    // Seed decks
    console.log('👥 Seeding decks...');
    const seedDecks = await db
      .insert(decks)
      .values([
        {
          name: 'Japanese N1 Vocabulary',
          description: 'Vocabulary for the Japanese N1 exam',
        },
      ])
      .returning();

    console.log(`✅ Created ${seedDecks.length} decks`);

    // Seed flashcards
    console.log('📇 Seeding flashcards...');
    const seedPosts = await db
      .insert(flashcards)
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

    console.log(`✅ Created ${seedPosts.length} posts`);

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
