'use server';

import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import db from '@/drizzle';
import { users } from '@/drizzle/schema';

import { comparePasswords, generateSalt, hashPassword } from '@/lib/passwordHasher';
import { signInSchema, signUpSchema } from '@/lib/schemas';
import { createUserSession, removeUserFromSession } from '@/lib/session';

export async function signIn(unsafeData: z.infer<typeof signInSchema>) {
  const { success, data } = signInSchema.safeParse(unsafeData);

  if (!success) return 'Unable to log you in';

  const user = await db.query.users.findFirst({
    columns: { password: true, id: true, email: true, role: true },
    where: eq(users.email, data.email),
  });

  if (user == null || user.password == null) {
    return 'Unable to log you in';
  }

  const isCorrectPassword = await comparePasswords({
    hashedPassword: user.password,
    password: data.password,
  });

  if (!isCorrectPassword) return 'Unable to log you in';

  await createUserSession(user);

  redirect('/learn');
}

export async function signUp(unsafeData: z.infer<typeof signUpSchema>) {
  const { success, data } = signUpSchema.safeParse(unsafeData);

  if (!success) return 'Unable to create account';

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, data.email),
  });

  if (existingUser != null) return 'Account already exists for this email';

  try {
    const hashedPassword = await hashPassword(data.password);

    const [user] = await db
      .insert(users)
      .values({
        name: data.name,
        email: data.email,
        password: hashedPassword,
      })
      .returning({ id: users.id, role: users.role });

    if (user == null) return 'Unable to create account';
    await createUserSession(user);
  } catch {
    return 'Unable to create account';
  }

  redirect('/learn');
}

export async function logOut() {
  await removeUserFromSession();
  redirect('/');
}

// export async function oAuthSignIn(provider: OAuthProvider) {
//   const oAuthClient = getOAuthClient(provider)
//   redirect(oAuthClient.createAuthUrl(await cookies()))
// }
