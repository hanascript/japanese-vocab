import z from 'zod';

export const newDeckSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  flashcards: z.array(z.lazy(() => newFlashcardSchema)),
});

export const newFlashcardSchema = z.object({
  kanji: z.string().optional(),
  kana: z.string().min(1),
  meaning: z.string().min(1),
  pronunciation: z.string().optional(),
  example: z.string().optional(),
});
