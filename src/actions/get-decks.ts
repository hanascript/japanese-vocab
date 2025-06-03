'use server';

import { cache } from 'react';

import db from '@/drizzle';

export const getDecks = cache(async () => {
  const decks = await db.query.decks.findMany();

  return decks;
});
