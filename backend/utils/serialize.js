function toPublicUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    avatarUrl: row.avatar_url || null,
    provider: row.provider,
    role: row.role,
    isPro: !!row.is_pro,
    calorieTarget: row.calorie_target,
    proteinTarget: row.protein_target,
    carbsTarget: row.carbs_target,
    fatTarget: row.fat_target,
    theme: row.theme,
    createdAt: row.created_at
  };
}

module.exports = { toPublicUser };
