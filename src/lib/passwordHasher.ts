import bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePasswords({
  password,
  hashedPassword,
}: {
  password: string;
  hashedPassword: string;
}) {
  return bcrypt.compare(password, hashedPassword);
}

export function generateSalt(): string {
  return bcrypt.genSaltSync(10);
}

export function generateSessionToken(): string {
  return bcrypt.genSaltSync(32);
}
