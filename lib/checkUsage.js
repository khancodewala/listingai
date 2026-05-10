import { supabaseAdmin } from './supabaseAdmin'

const PLAN_LIMITS = {
  free: 5,
  pro: 100,
  agency: Infinity,
}

export async function checkAndTrackUsage(userId) {
  // 1. Get user's plan
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('plan')
    .eq('id', userId)
    .single()

  const plan = profile?.plan || 'free'
  const limit = PLAN_LIMITS[plan]

  // 2. Agency = unlimited, skip counting
  if (limit === Infinity) {
    await supabaseAdmin.from('usage').insert({ user_id: userId, feature: 'generate' })
    return { allowed: true, plan, used: null, limit: null }
  }

  // 3. Count usage this month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { count } = await supabaseAdmin
    .from('usage')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', startOfMonth.toISOString())

  const used = count || 0

  // 4. Check if over limit
  if (used >= limit) {
    return { allowed: false, plan, used, limit }
  }

  // 5. Track this generation
  await supabaseAdmin.from('usage').insert({ user_id: userId, feature: 'generate' })

  return { allowed: true, plan, used: used + 1, limit }
}