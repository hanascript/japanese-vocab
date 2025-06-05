import 'server-only';

import { cookies } from 'next/headers';
import { redisClient } from '@/redis/redis';
import { z } from 'zod';

import { userRoles } from '@/drizzle/schema';

import { generateSessionToken } from './passwordHasher';

// Seven days in seconds
const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7;
const COOKIE_SESSION_KEY = 'session-id';

const sessionSchema = z.object({
  id: z.string(),
  role: z.enum(userRoles),
});

type UserSession = z.infer<typeof sessionSchema>;

export async function getUserFromSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return null;

  return getUserSessionById(sessionId);
}

export async function updateUserSessionData(user: UserSession) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return null;

  await redisClient.set(`session:${sessionId}`, JSON.stringify(user), {
    EX: SESSION_EXPIRATION_SECONDS,
  });
}

export async function updateUserSessionExpiration() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return null;

  const user = null;
  if (user == null) return;

  await redisClient.set(`session:${sessionId}`, JSON.stringify(user), {
    EX: SESSION_EXPIRATION_SECONDS,
  });

  cookieStore.set(COOKIE_SESSION_KEY, sessionId, {
    secure: true,
    httpOnly: true,
    sameSite: 'lax',
    expires: Date.now() + SESSION_EXPIRATION_SECONDS * 1000,
  });
}

export async function removeUserFromSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return null;

  await redisClient.del(`session:${sessionId}`);

  cookieStore.delete(COOKIE_SESSION_KEY);
}

async function getUserSessionById(sessionId: string) {
  const rawUser = await redisClient.get(`session:${sessionId}`);

  if (!rawUser) return null;

  const { success, data: user } = sessionSchema.safeParse(JSON.parse(rawUser));

  return success ? user : null;
}

async function createUserSession(user: UserSession) {
  const cookieStore = await cookies();
  const sessionId = generateSessionToken();

  await redisClient.set(`session:${sessionId}`, JSON.stringify(user), {
    EX: SESSION_EXPIRATION_SECONDS,
  });

  cookieStore.set(COOKIE_SESSION_KEY, sessionId, {
    secure: true,
    httpOnly: true,
    sameSite: 'lax',
    expires: Date.now() + SESSION_EXPIRATION_SECONDS * 1000,
  });
}
