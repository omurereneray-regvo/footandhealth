import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { database, ensureSchema } from './db';
import { ApiRequest, ApiResponse, cookie, cookieHeader } from './http';

const SESSION_COOKIE = 'footandhealth_session';
const THIRTY_DAYS = 60 * 60 * 24 * 30;

type Session = { userId: string; email: string; displayName: string; avatarUrl: string | null };

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error('AUTH_SECRET must be at least 32 characters.');
  return value;
}
function encode(input: string) { return Buffer.from(input).toString('base64url'); }
function decode(input: string) { return Buffer.from(input, 'base64url').toString('utf8'); }
function signature(value: string) { return createHmac('sha256', secret()).update(value).digest('base64url'); }

export function makeSession(user: Session) {
  const payload = encode(JSON.stringify({ ...user, exp: Date.now() + THIRTY_DAYS * 1000 }));
  return `${payload}.${signature(payload)}`;
}
export function setSession(res: ApiResponse, user: Session) {
  res.setHeader('Set-Cookie', cookieHeader(SESSION_COOKIE, makeSession(user), THIRTY_DAYS));
}
export function clearSession(res: ApiResponse) { res.setHeader('Set-Cookie', cookieHeader(SESSION_COOKIE, '', 0)); }
export function sessionFromRequest(req: ApiRequest): Session | undefined {
  const raw = cookie(req, SESSION_COOKIE);
  if (!raw) return undefined;
  const [payload, received] = raw.split('.');
  if (!payload || !received) return undefined;
  const expected = signature(payload);
  if (received.length !== expected.length || !timingSafeEqual(Buffer.from(received), Buffer.from(expected))) return undefined;
  const parsed = JSON.parse(decode(payload)) as Session & { exp: number };
  return parsed.exp > Date.now() ? { userId: parsed.userId, email: parsed.email, displayName: parsed.displayName, avatarUrl: parsed.avatarUrl ?? null } : undefined;
}
export async function requireSession(req: ApiRequest, res: ApiResponse) {
  const session = sessionFromRequest(req);
  if (!session) { res.status(401).json({ error: 'Oturum gerekli.' }); return undefined; }
  return session;
}

export function makePassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
}
export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64).toString('hex');
  return candidate.length === hash.length && timingSafeEqual(Buffer.from(candidate), Buffer.from(hash));
}
export function cleanEmail(value: unknown) { return String(value ?? '').trim().toLowerCase().slice(0, 254); }
export function validPassword(value: unknown) { return typeof value === 'string' && value.length >= 8 && value.length <= 128; }
export function cleanName(value: unknown) { return String(value ?? '').trim().replace(/\s+/g, ' ').slice(0, 80); }
export async function findUserByEmail(email: string) {
  await ensureSchema();
  return database().query('SELECT id, email, display_name, password_hash, avatar_url FROM app_users WHERE email = $1', [email]);
}
