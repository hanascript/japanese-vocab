'use server';

import db from '@/drizzle';

export async function getDecks() {
  const decks = await db.query.decks.findMany();

  return decks;
}
