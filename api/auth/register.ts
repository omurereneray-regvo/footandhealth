import { randomUUID } from 'node:crypto';
import { cleanEmail, cleanName, findUserByEmail, makePassword, setSession, validPassword } from '../_lib/auth';
import { database, ensureSchema } from '../_lib/db';
import { ApiRequest, ApiResponse, bodyOf } from '../_lib/http';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed.' }); return; }
  try {
    const body = bodyOf<{ email: string; password: string; displayName: string }>(req.body);
    const email = cleanEmail(body.email); const displayName = cleanName(body.displayName) || email.split('@')[0];
    if (!/^\S+@\S+\.\S+$/.test(email) || !validPassword(body.password) || !displayName) { res.status(400).json({ error: 'Geçerli e-posta, ad ve en az 8 karakterli parola girin.' }); return; }
    await ensureSchema();
    if ((await findUserByEmail(email)).rowCount) { res.status(409).json({ error: 'Bu e-posta ile zaten bir hesap var.' }); return; }
    const id = randomUUID();
    await database().query('INSERT INTO app_users (id, email, display_name, password_hash) VALUES ($1, $2, $3, $4)', [id, email, displayName, makePassword(body.password!)]);
    await database().query('INSERT INTO user_profiles (user_id) VALUES ($1)', [id]);
    setSession(res, { userId: id, email, displayName, avatarUrl: null });
    res.status(201).json({ user: { id, email, displayName, avatarUrl: null } });
  } catch (error) { console.error('Registration error', error); res.status(500).json({ error: 'Hesap şu anda oluşturulamadı.' }); }
}
