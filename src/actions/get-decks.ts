'use server';

import { cache } from 'react';
import { eq } from 'drizzle-orm';

import db from '@/drizzle';
import { decks } from '@/drizzle/schema';

import { getCurrentUser } from '@/lib/currentUser';

export const getDecks = cache(async () => {
  const user = await getCurrentUser();

  if (!user) {
    throw 'User Not Found';
  }

  const userDecks = await db.query.decks.findMany({
    where: eq(decks.userId, user.id),
  });

  return userDecks;
});
