'use server';

import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import db from '@/drizzle';
import { UserTable } from '@/drizzle/schema';

import { comparePasswords, generateSalt, hashPassword } from '@/lib/passwordHasher';
import { signInSchema, signUpSchema } from '@/lib/schemas';
import { createUserSession, removeUserFromSession } from '@/lib/session';

export async function signIn(unsafeData: z.infer<typeof signInSchema>) {
  const { success, data } = signInSchema.safeParse(unsafeData);

  if (!success) return 'Unable to log you in';

  const user = await db.query.UserTable.findFirst({
    columns: { password: true, salt: true, id: true, email: true, role: true },
    where: eq(UserTable.email, data.email),
  });

  if (user == null || user.password == null || user.salt == null) {
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

  const existingUser = await db.query.UserTable.findFirst({
    where: eq(UserTable.email, data.email),
  });

  if (existingUser != null) return 'Account already exists for this email';

  try {
    const salt = generateSalt();
    const hashedPassword = await hashPassword(data.password, salt);

    const [user] = await db
      .insert(UserTable)
      .values({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        salt,
      })
      .returning({ id: UserTable.id, role: UserTable.role });

    if (user == null) return 'Unable to create account';
    await createUserSession(user);
  } catch {
    return 'Unable to create account';
  }

  redirect('/learn');
}

export async function logOut() {
  await removeUserFromSession()
  redirect("/")
}

// export async function oAuthSignIn(provider: OAuthProvider) {
//   const oAuthClient = getOAuthClient(provider)
//   redirect(oAuthClient.createAuthUrl(await cookies()))
// }
