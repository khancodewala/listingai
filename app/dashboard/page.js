'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

const PLAN_LIMITS = { free: 5, pro: 100, agency: Infinity }

export default function Dashboard() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  const [plan, setPlan] = useState('free')
  const [usage, setUsage] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [{ data: profile }, { count }] = await Promise.all([
        supabase.from('profiles').select('plan').eq('id', user.id).single(),
        supabase.from('usage').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
      ])

      setPlan(profile?.plan || 'free')
      setUsage(count || 0)
      setLoading(false)
    }

    fetchData()
  }, [])

  const limit = PLAN_LIMITS[plan] ?? 5
  const remaining = limit === Infinity ? 'Unlimited' : Math.max(0, limit - usage)
  const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1)
  const planColor = plan === 'agency' ? 'text-purple-600' : plan === 'pro' ? 'text-blue-600' : 'text-green-600'

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-12 px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back!</p>
          </div>
          <a href="/generate" className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700">
            New Generation
          </a>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-gray-500 text-sm">Total Generations</p>
              <p className="text-4xl font-bold text-gray-800 mt-1">{usage}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-gray-500 text-sm">Generations Left</p>
              <p className="text-4xl font-bold text-blue-600 mt-1">{remaining}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-gray-500 text-sm">Current Plan</p>
              <p className={`text-4xl font-bold mt-1 ${planColor}`}>{planLabel}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Generations</h2>
          <p className="text-gray-400 text-sm">History coming soon...</p>
        </div>
      </div>
    </main>
  )
}