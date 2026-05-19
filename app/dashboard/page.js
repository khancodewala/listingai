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

const TYPE_COLORS = {
  listing: 'bg-blue-100 text-blue-700',
  social: 'bg-purple-100 text-purple-700',
  email: 'bg-green-100 text-green-700',
  contract: 'bg-amber-100 text-amber-700',
}

export default function Dashboard() {
  const [plan, setPlan] = useState('free')
  const [usage, setUsage] = useState(0)
  const [generations, setGenerations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedGeneration, setSelectedGeneration] = useState(null)

  // ✅ Cancel subscription state
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [cancelSuccess, setCancelSuccess] = useState(false)
  const [cancelError, setCancelError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) { setLoading(false); return }

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
  const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1)
  const planColor = plan === 'agency' ? 'text-purple-600' : plan === 'pro' ? 'text-blue-600' : 'text-green-600'

  const formatDate = (ts) => new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  const getTitle = (type, input) => {
    if (type === 'listing') return `${input?.propertyType || 'Property'} in ${input?.location || 'Unknown'}`
    if (type === 'social') return `${input?.propertyType || 'Property'} — ${input?.location || 'Unknown'}`
    if (type === 'email') return `Email to ${input?.buyerName || 'Buyer'}`
    if (type === 'contract') return 'Contract Summary'
    return 'Generation'
  }

  // ✅ Handle cancel subscription
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
      setTimeout(() => {
        setShowCancelModal(false)
        setCancelSuccess(false)
      }, 3000)

    } catch (err) {
      setCancelError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setCancelling(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-12 px-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back!</p>
          </div>
          <a href="/generate" className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700">
            New Generation
          </a>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[1, 2, 3].map(i => (
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
              {/* ✅ Cancel button — only shown for paid plans */}
              {plan !== 'free' && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="mt-3 text-xs text-red-400 hover:text-red-600 underline transition-colors"
                >
                  Cancel subscription
                </button>
              )}
            </div>
          </div>
        )}

        {/* Recent Generations */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Generations</h2>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse h-16 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          ) : generations.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No generations yet.{' '}
              <a href="/generate" className="text-blue-600 hover:underline">
                Create your first one →
              </a>
            </p>
          ) : (
            <div className="space-y-3">
              {generations.map((gen) => (
                <div
                  key={gen.id}
                  onClick={() => setSelectedGeneration(gen)}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-100
                    hover:border-blue-200 hover:bg-blue-50/40 transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${TYPE_COLORS[gen.type] || 'bg-gray-100 text-gray-600'}`}>
                      {TYPE_LABELS[gen.type] || gen.type}
                    </span>
                    <span className="text-sm text-gray-700 font-medium truncate">
                      {getTitle(gen.type, gen.input)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {formatDate(gen.created_at)}
                    </span>
                    <svg
                      className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ✅ Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

            {cancelSuccess ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Subscription Cancelled</h3>
                <p className="text-gray-500 text-sm">
                  Your subscription has been cancelled. You'll keep access to your current plan until the end of your billing period.
                </p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
                  Cancel Subscription?
                </h3>
                <p className="text-gray-500 text-sm text-center mb-6">
                  You'll keep your <span className="font-semibold text-gray-700">{planLabel}</span> plan access until the end of your current billing period. After that, you'll be downgraded to the Free plan (5 generations/month).
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
                    className="flex-1 py-2.5 px-4 border border-gray-200 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Keep My Plan
                  </button>
                  <button
                    onClick={handleCancelSubscription}
                    disabled={cancelling}
                    className="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
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
      )}

      {/* Slide-over panel */}
      <GenerationDetailPanel
        generation={selectedGeneration}
        onClose={() => setSelectedGeneration(null)}
      />
    </main>
  )
}
