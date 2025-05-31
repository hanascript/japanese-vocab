import z from 'zod';

export const newDeckSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  flashcards: z.array(
    z.object({
      front: z.string().min(1),
      frontSecondary: z.string().min(1),
      back: z.string().min(1),
      backSecondary: z.string().min(1),
    })
  ),
});