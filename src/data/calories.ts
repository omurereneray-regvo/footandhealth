import { NutritionProfile } from './profile';

const activityFactors: Record<NutritionProfile['activity'], number> = {
  'Hareketsiz': 1.2,
  'Az aktif': 1.375,
  'Orta aktif': 1.55,
  'Çok aktif': 1.725,
  '': 1.2,
};

export function calorieEstimate(profile: NutritionProfile) {
  const age = Number(profile.age); const height = Number(profile.height); const weight = Number(profile.weight);
  if (!age || !height || !weight || !profile.gender) return null;
  const bmr = (10 * weight) + (6.25 * height) - (5 * age) + (profile.gender === 'Erkek' ? 5 : -161);
  const tdee = bmr * activityFactors[profile.activity];
  const calorieTarget = profile.goal === 'Kilo vermek' ? tdee - 400 : profile.goal === 'Kilo almak' ? tdee + 300 : tdee;
  return { bmr: Math.round(bmr), tdee: Math.round(tdee), target: Math.max(1200, Math.round(calorieTarget)), factor: activityFactors[profile.activity] };
}
