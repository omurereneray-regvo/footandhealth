import { database, ensureSchema } from './_lib/db';
import { requireSession } from './_lib/auth';
import { ApiRequest, ApiResponse, bodyOf } from './_lib/http';

type ProfileBody = { healthConditions: unknown; age: unknown; gender: unknown; height: unknown; weight: unknown; activity: unknown; goal: unknown; targetWeight: unknown; avatarUrl: unknown };
const text = (value: unknown, size = 32) => String(value ?? '').trim().slice(0, size);
const choices = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string').map((item) => text(item, 80)).filter(Boolean).slice(0, 20) : [];

export default async function handler(req: ApiRequest, res: ApiResponse) {
  try {
    const session = await requireSession(req, res); if (!session) return;
    await ensureSchema();
    if (req.method === 'GET') {
      const profile = (await database().query('SELECT health_conditions, age, gender, height, weight, activity, goal, target_weight, avatar_url FROM user_profiles WHERE user_id = $1', [session.userId])).rows[0];
      res.status(200).json({ profile: profile ? { healthConditions: profile.health_conditions, age: profile.age, gender: profile.gender, height: profile.height, weight: profile.weight, activity: profile.activity, goal: profile.goal, targetWeight: profile.target_weight, avatarUrl: profile.avatar_url } : null }); return;
    }
    if (req.method !== 'PUT') { res.status(405).json({ error: 'Method not allowed.' }); return; }
    const body = bodyOf<ProfileBody>(req.body); const avatarUrl = text(body.avatarUrl, 2048);
    const result = await database().query(`INSERT INTO user_profiles (user_id, health_conditions, age, gender, height, weight, activity, goal, target_weight, avatar_url, updated_at)
      VALUES ($1, $2::jsonb, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      ON CONFLICT (user_id) DO UPDATE SET health_conditions=EXCLUDED.health_conditions, age=EXCLUDED.age, gender=EXCLUDED.gender, height=EXCLUDED.height, weight=EXCLUDED.weight, activity=EXCLUDED.activity, goal=EXCLUDED.goal, target_weight=EXCLUDED.target_weight, avatar_url=EXCLUDED.avatar_url, updated_at=NOW()
      RETURNING health_conditions, age, gender, height, weight, activity, goal, target_weight, avatar_url`, [session.userId, JSON.stringify(choices(body.healthConditions)), text(body.age), text(body.gender), text(body.height), text(body.weight), text(body.activity), text(body.goal), text(body.targetWeight), avatarUrl || null]);
    if (avatarUrl) await database().query('UPDATE app_users SET avatar_url = $1, updated_at = NOW() WHERE id = $2', [avatarUrl, session.userId]);
    const row = result.rows[0]; res.status(200).json({ profile: { healthConditions: row.health_conditions, age: row.age, gender: row.gender, height: row.height, weight: row.weight, activity: row.activity, goal: row.goal, targetWeight: row.target_weight, avatarUrl: row.avatar_url } });
  } catch (error) { console.error('Profile API error', error); res.status(500).json({ error: 'Profil şu anda kaydedilemedi.' }); }
}
