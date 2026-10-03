import { cleanEmail, findUserByEmail, setSession, validPassword, verifyPassword } from '../_lib/auth';
import { ApiRequest, ApiResponse, bodyOf } from '../_lib/http';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed.' }); return; }
  try {
    const body = bodyOf<{ email: string; password: string }>(req.body); const email = cleanEmail(body.email);
    if (!/^\S+@\S+\.\S+$/.test(email) || !validPassword(body.password)) { res.status(401).json({ error: 'E-posta veya parola hatalı.' }); return; }
    const user = (await findUserByEmail(email)).rows[0];
    if (!user?.password_hash || !verifyPassword(body.password!, user.password_hash)) { res.status(401).json({ error: 'E-posta veya parola hatalı.' }); return; }
    setSession(res, { userId: user.id, email: user.email, displayName: user.display_name, avatarUrl: user.avatar_url });
    res.status(200).json({ user: { id: user.id, email: user.email, displayName: user.display_name, avatarUrl: user.avatar_url } });
  } catch (error) { console.error('Login error', error); res.status(500).json({ error: 'Giriş şu anda yapılamadı.' }); }
}
