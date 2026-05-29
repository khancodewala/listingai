'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import GenerationDetailPanel from '@/components/GenerationDetailPanel'

const PLAN_LIMITS = { free: 5, pro: 100, agency: Infinity }

const TYPE_LABELS = {
  listing: 'Listing Writer',
  social: 'Social Media',
  email: 'Buyer Email',
  contract: 'Contract Summary',
}

const TYPE_ICONS = {
  listing: '🏠',
  social: '📱',
  email: '✉️',
  contract: '📄',
}

const TYPE_COLORS = {
  listing: 'bg-blue-50 text-blue-700 border border-blue-100',
  social: 'bg-purple-50 text-purple-700 border border-purple-100',
  email: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  contract: 'bg-amber-50 text-amber-700 border border-amber-100',
}

const PLAN_CONFIG = {
  free: { color: 'text-slate-600', bg: 'bg-slate-100', bar: 'bg-slate-400', badge: 'bg-slate-100 text-slate-600 border-slate-200' },
  pro: { color: 'text-blue-600', bg: 'bg-blue-50', bar: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  agency: { color: 'text-purple-600', bg: 'bg-purple-50', bar: 'bg-purple-500', badge: 'bg-purple-50 text-purple-700 border-purple-200' },
}

export default function Dashboard() {
  const [plan, setPlan] = useState('free')
  const [usage, setUsage] = useState(0)
  const [generations, setGenerations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedGeneration, setSelectedGeneration] = useState(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [cancelSuccess, setCancelSuccess] = useState(false)
  const [cancelError, setCancelError] = useState('')
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) { setLoading(false); return }

        setUserEmail(session.user.email || '')

        const [{ data: profile }, usageRes, { data: gens }] = await Promise.all([
          supabase.from('profiles').select('plan').eq('id', session.user.id).single(),
          fetch('/api/usage', { headers: { Authorization: `Bearer ${session.access_token}` } }),
          supabase
            .from('generations')
            .select('id, type, input, output, created_at')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false })
            .limit(10)
        ])

        const usageData = await usageRes.json()
        setPlan(profile?.plan || 'free')
        setUsage(usageData.used || 0)
        setGenerations(gens || [])
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const limit = PLAN_LIMITS[plan] ?? 5
  const remaining = limit === Infinity ? 'Unlimited' : Math.max(0, limit - usage)
  const usagePercent = limit === Infinity ? 15 : Math.min(100, Math.round((usage / limit) * 100))
  const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1)
  const pc = PLAN_CONFIG[plan] || PLAN_CONFIG.free

  const formatDate = (ts) => new Date(ts).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  const getTitle = (type, input) => {
    if (type === 'listing') return `${input?.propertyType || 'Property'} in ${input?.location || 'Unknown'}`
    if (type === 'social') return `${input?.propertyType || 'Property'} — ${input?.location || 'Unknown'}`
    if (type === 'email') return `Email to ${input?.buyerName || 'Buyer'}`
    if (type === 'contract') return 'Contract Summary'
    return 'Generation'
  }

  const handleCancelSubscription = async () => {
    setCancelling(true)
    setCancelError('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not logged in')
      const res = await fetch('/api/polar/cancel', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to cancel')
      setCancelSuccess(true)
      setTimeout(() => { setShowCancelModal(false); setCancelSuccess(false) }, 3000)
    } catch (err) {
      setCancelError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setCancelling(false)
    }
  }

  const avatarInitials = userEmail ? userEmail.slice(0, 2).toUpperCase() : 'U'

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {avatarInitials}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">Dashboard</h1>
              <p className="text-sm text-gray-400">{userEmail}</p>
            </div>
          </div>

          href="/generate"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all text-sm"
          >
          <span className="text-lg leading-none">+</span> New Generation
        </a>
      </div>

      {/* ── Stat Cards ── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
              <div className="h-3 bg-gray-100 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-100 rounded w-1/3 mb-3"></div>
              <div className="h-2 bg-gray-100 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

          {/* Total Generations */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Generations</p>
              <span className="text-xl">⚡</span>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-1">{usage}</p>
            <p className="text-xs text-gray-400">All time</p>
          </div>

          {/* Generations Left */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Generations Left</p>
              <span className="text-xl">🎯</span>
            </div>
            <p className={`text-4xl font-bold mb-1 ${pc.color}`}>{remaining}</p>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
              <div
                className={`h-1.5 rounded-full transition-all duration-700 ${pc.bar}`}
                style={{ width: `${100 - usagePercent}%` }}
              ></div>
            </div>
            {limit !== Infinity && (
              <p className="text-xs text-gray-400 mt-1.5">{usagePercent}% used this period</p>
            )}
          </div>

          {/* Current Plan */}
          <div className={`rounded-2xl p-5 shadow-sm border hover:shadow-md transition-shadow ${pc.bg} border-${plan === 'pro' ? 'blue' : plan === 'agency' ? 'purple' : 'slate'}-100`}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Current Plan</p>
              <span className="text-xl">{plan === 'agency' ? '👑' : plan === 'pro' ? '⭐' : '🆓'}</span>
            </div>
            <p className={`text-4xl font-bold mb-1 ${pc.color}`}>{planLabel}</p>
            <div className="flex items-center justify-between mt-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${pc.badge}`}>
                {limit === Infinity ? 'Unlimited' : `${limit} gen/mo`}
              </span>
              {plan === 'free' && (
                <a href="/pricing" className="text-xs text-blue-600 font-semibold hover:underline">
                  Upgrade →
                </a>
              )}
              {plan !== 'free' && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

        </div>
      )}

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { icon: '🏠', label: 'Listing Writer', href: '/generate?tab=listing', color: 'hover:bg-blue-50 hover:border-blue-200' },
          { icon: '📱', label: 'Social Media', href: '/generate?tab=social', color: 'hover:bg-purple-50 hover:border-purple-200' },
          { icon: '✉️', label: 'Buyer Email', href: '/generate?tab=email', color: 'hover:bg-emerald-50 hover:border-emerald-200' },
          { icon: '📄', label: 'Contract Summary', href: '/generate?tab=contract', color: 'hover:bg-amber-50 hover:border-amber-200' },
        ].map((action) => (

          key = { action.label }
              href = { action.href }
              className = {`bg-white border border-gray-100 rounded-xl p-4 flex flex-col items-center gap-2 text-center transition-all hover:shadow-sm ${action.color}`}
            >
        <span className="text-2xl">{action.icon}</span>
        <span className="text-xs font-semibold text-gray-600 leading-tight">{action.label}</span>
      </a>
          ))}
    </div>

        {/* ── Recent Generations ── */ }
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
      <h2 className="text-base font-bold text-gray-800">Recent Generations</h2>
      <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
        {generations.length} entries
      </span>
    </div>

    {loading ? (
      <div className="p-6 space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse h-14 bg-gray-50 rounded-xl"></div>
        ))}
      </div>
    ) : generations.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-16 text-center px-6">
        <span className="text-5xl mb-4">✨</span>
        <p className="text-gray-500 font-medium mb-1">No generations yet</p>
        <p className="text-gray-400 text-sm mb-4">Create your first AI-powered listing or email</p>
        <a href="/generate" className="text-sm text-blue-600 font-semibold hover:underline">
          Start generating →
        </a>
      </div>
    ) : (
      <div className="divide-y divide-gray-50">
        {generations.map((gen) => (
          <div
            key={gen.id}
            onClick={() => setSelectedGeneration(gen)}
            className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/70 transition cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xl flex-shrink-0">{TYPE_ICONS[gen.type] || '📝'}</span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {getTitle(gen.type, gen.input)}
                </p>
                <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-0.5 ${TYPE_COLORS[gen.type] || 'bg-gray-100 text-gray-600'}`}>
                  {TYPE_LABELS[gen.type] || gen.type}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 ml-4 flex-shrink-0">
              <span className="text-xs text-gray-400 whitespace-nowrap hidden sm:block">
                {formatDate(gen.created_at)}
              </span>
              <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>

      </div >

    {/* ── Cancel Modal ── */ }
  {
    showCancelModal && (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in">
          {cancelSuccess ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Subscription Cancelled</h3>
              <p className="text-gray-500 text-sm">You'll keep access until the end of your billing period.</p>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 text-center mb-2">Cancel Subscription?</h3>
              <p className="text-gray-500 text-sm text-center mb-6">
                You'll keep your <span className="font-semibold text-gray-700">{planLabel}</span> plan access until the end of your billing period. After that, you'll be downgraded to Free (5 generations/month).
              </p>
              {cancelError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
                  {cancelError}
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowCancelModal(false); setCancelError('') }}
                  disabled={cancelling}
                  className="flex-1 py-2.5 px-4 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Keep My Plan
                </button>
                <button
                  onClick={handleCancelSubscription}
                  disabled={cancelling}
                  className="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {cancelling ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Cancelling...
                    </>
                  ) : 'Yes, Cancel'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  <GenerationDetailPanel
    generation={selectedGeneration}
    onClose={() => setSelectedGeneration(null)}
  />
    </main>
  )
}