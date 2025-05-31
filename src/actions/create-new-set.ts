'use server';

import { z } from 'zod';

import db from '@/drizzle';
import { DecksTable, FlashcardsTable } from '@/drizzle/schema';

import { newDeckSchema } from '@/lib/schemas';

export async function createNewSet(formData: z.infer<typeof newDeckSchema>) {
  const validatedFields = newDeckSchema.safeParse(formData);

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  const { name, description, flashcards } = validatedFields.data;

  const [newDeck] = await db
    .insert(DecksTable)
    .values({
      name,
      description,
    })
    .returning();

  const newFlashcards = await db.insert(FlashcardsTable).values(
    flashcards.map(flashcard => ({
      ...flashcard,
      deckId: newDeck.id,
      frontText: flashcard.front,
      backText: flashcard.back,
    }))
  );
}
