import { cache } from 'react';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';

import db from '@/drizzle';
import { users } from '@/drizzle/schema';

import { getUserFromSession } from '@/lib/session';

type FullUser = Exclude<Awaited<ReturnType<typeof getUserFromDb>>, undefined | null>;

type User = Exclude<Awaited<ReturnType<typeof getUserFromSession>>, undefined | null>;

function _getCurrentUser(options: {
  withFullUser: true;
  redirectIfNotFound: true;
}): Promise<FullUser>;

function _getCurrentUser(options: {
  withFullUser: true;
  redirectIfNotFound?: false;
}): Promise<FullUser | null>;

function _getCurrentUser(options: {
  withFullUser?: false;
  redirectIfNotFound: true;
}): Promise<User>;

function _getCurrentUser(options?: {
  withFullUser?: false;
  redirectIfNotFound?: false;
}): Promise<User | null>;

async function _getCurrentUser({ withFullUser = false, redirectIfNotFound = false } = {}) {
  const user = await getUserFromSession();

  if (user == null) {
    if (redirectIfNotFound) return redirect('/auth/sign-in');
    return null;
  }

  if (withFullUser) {
    const fullUser = await getUserFromDb(user.id);
    // This should never happen
    if (fullUser == null) throw new Error('User not found in database');
    return fullUser;
  }

  return user;
}

export const getCurrentUser = cache(_getCurrentUser);

export async function getUserFromDb(id: string) {
  return db.query.users.findFirst({
    columns: { id: true, email: true, role: true, name: true },
    where: eq(users.id, id),
  });
}
