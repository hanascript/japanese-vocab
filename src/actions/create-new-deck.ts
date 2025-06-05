'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import db from '@/drizzle';
import { decks, flashcards } from '@/drizzle/schema';

import { getCurrentUser } from '@/lib/currentUser';
import { newDeckSchema } from '@/lib/schemas';

export async function createNewDeck(formData: z.infer<typeof newDeckSchema>) {
  const validatedFields = newDeckSchema.safeParse(formData);

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  const { name, description, flashcards: cards } = validatedFields.data;

  const user = await getCurrentUser();

  if (!user) {
    return { error: 'User not found' };
  }

  try {
    const [newDeck] = await db
      .insert(decks)
      .values({
        userId: user.id,
        name,
        description,
      })
      .returning();

    await db.insert(flashcards).values(
      cards.map(card => ({
        deckId: newDeck.id,
        kana: card.kana,
        meaning: card.meaning,
        kanji: card.kanji,
        pronunciation: card.pronunciation,
        example: card.example,
      }))
    );
  } catch (error) {
    console.error(error);
  }

  revalidatePath('/study');
  redirect('/study');
}
