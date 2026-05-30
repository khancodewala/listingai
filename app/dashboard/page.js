'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import GenerationDetailPanel from '@/components/GenerationDetailPanel'

const PLAN_LIMITS = { free: 5, pro: 100, agency: Infinity }

// ─── TYPE LABELS (existing + new) ────────────────────────────────────────────
const TYPE_LABELS = {
  listing:      'Listing Writer',
  social:       'Social Media',
  email:        'Buyer Email',
  contract:     'Contract Summary',
  openhouse:    'Open House',
  neighborhood: 'Neighborhood',
  pricedrop:    'Price Reduction',
  videoscript:  'Video Script',
}

// ─── TYPE COLORS (existing + new) ────────────────────────────────────────────
const TYPE_COLORS = {
  listing:      'bg-blue-50 text-blue-700 border border-blue-100',
  social:       'bg-purple-50 text-purple-700 border border-purple-100',
  email:        'bg-emerald-50 text-emerald-700 border border-emerald-100',
  contract:     'bg-amber-50 text-amber-700 border border-amber-100',
  openhouse:    'bg-rose-50 text-rose-700 border border-rose-100',
  neighborhood: 'bg-teal-50 text-teal-700 border border-teal-100',
  pricedrop:    'bg-orange-50 text-orange-700 border border-orange-100',
  videoscript:  'bg-indigo-50 text-indigo-700 border border-indigo-100',
}

const PLAN_CONFIG = {
  free:   { color: 'text-slate-600',  bar: 'bg-slate-400',  light: 'bg-slate-50',   border: 'border-slate-200', badge: 'bg-slate-100 text-slate-600' },
  pro:    { color: 'text-blue-600',   bar: 'bg-blue-500',   light: 'bg-blue-50',    border: 'border-blue-200',  badge: 'bg-blue-100 text-blue-700' },
  agency: { color: 'text-purple-600', bar: 'bg-purple-500', light: 'bg-purple-50',  border: 'border-purple-200',badge: 'bg-purple-100 text-purple-700' },
}

// ─── TOOLS (existing + new) ───────────────────────────────────────────────────
const TOOLS = [
  {
    key: 'listing',
    icon: '🏠',
    label: 'Listing Writer',
    desc: 'Generate professional MLS property descriptions in seconds',
    color: 'hover:border-blue-300 hover:bg-blue-50/50',
    accent: 'bg-blue-100 text-blue-700',
  },
  {
    key: 'social',
    icon: '📱',
    label: 'Social Media',
    desc: 'Create engaging Instagram & Facebook captions for listings',
    color: 'hover:border-purple-300 hover:bg-purple-50/50',
    accent: 'bg-purple-100 text-purple-700',
  },
  {
    key: 'email',
    icon: '✉️',
    label: 'Buyer Email',
    desc: 'Write personalized emails to buyers about properties',
    color: 'hover:border-emerald-300 hover:bg-emerald-50/50',
    accent: 'bg-emerald-100 text-emerald-700',
  },
  {
    key: 'contract',
    icon: '📄',
    label: 'Contract Summary',
    desc: 'Summarize complex real estate contracts into plain English',
    color: 'hover:border-amber-300 hover:bg-amber-50/50',
    accent: 'bg-amber-100 text-amber-700',
  },
  {
    key: 'openhouse',
    icon: '🎪',
    label: 'Open House',
    desc: 'Create announcements for WhatsApp, SMS, and social media',
    color: 'hover:border-rose-300 hover:bg-rose-50/50',
    accent: 'bg-rose-100 text-rose-700',
  },
  {
    key: 'neighborhood',
    icon: '📍',
    label: 'Neighborhood',
    desc: 'Write compelling area descriptions for any city worldwide',
    color: 'hover:border-teal-300 hover:bg-teal-50/50',
    accent: 'bg-teal-100 text-teal-700',
  },
  {
    key: 'pricedrop',
    icon: '💰',
    label: 'Price Reduction',
    desc: 'Announce price drops tactfully to attract motivated buyers',
    color: 'hover:border-orange-300 hover:bg-orange-50/50',
    accent: 'bg-orange-100 text-orange-700',
  },
  {
    key: 'videoscript',
    icon: '🎥',
    label: 'Video Script',
    desc: 'Write walkthrough scripts for Reels, YouTube & TikTok',
    color: 'hover:border-indigo-300 hover:bg-indigo-50/50',
    accent: 'bg-indigo-100 text-indigo-700',
  },
]

const NAV_ITEMS = [
  { icon: '⚡', label: 'Dashboard', href: '/dashboard', active: true },
  { icon: '🤖', label: 'AI Generator', href: '/generate', active: false },
  { icon: '📋', label: 'History', href: '/dashboard#history', active: false },
  { icon: '💰', label: 'Pricing', href: '/pricing', active: false },
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function MiniBarChart({ data }) {
  const max = Math.max(...data.map(d => d.count), 1)
  return (
    <div className="flex items-end gap-1.5 h-16">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <div
            className="w-full rounded-t-sm bg-blue-500 opacity-80 transition-all duration-500"
            style={{ height: `${Math.max(4, (d.count / max) * 52)}px` }}
          ></div>
          <span className="text-xs text-gray-400">{d.day}</span>
        </div>
      ))}
    </div>
  )
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
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
            .limit(20)
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
  const usagePercent = limit === Infinity ? 10 : Math.min(100, Math.round((usage / limit) * 100))
  const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1)
  const pc = PLAN_CONFIG[plan] || PLAN_CONFIG.free
  const avatarInitials = userEmail ? userEmail.slice(0, 2).toUpperCase() : 'U'
  const firstName = userEmail ? userEmail.split('@')[0].split('.')[0] : 'there'

  const chartData = (() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      return { day: days[d.getDay()], date: d.toDateString(), count: 0 }
    })
    generations.forEach(g => {
      const gDate = new Date(g.created_at).toDateString()
      const slot = last7.find(d => d.date === gDate)
      if (slot) slot.count++
    })
    return last7
  })()

  const formatDate = (ts) => new Date(ts).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  const getTitle = (type, input) => {
    if (type === 'listing')      return `${input?.propertyType || 'Property'} in ${input?.location || 'Unknown'}`
    if (type === 'social')       return `${input?.propertyType || 'Property'} — ${input?.location || 'Unknown'}`
    if (type === 'email')        return `Email to ${input?.buyerName || 'Buyer'}`
    if (type === 'contract')     return 'Contract Summary'
    if (type === 'openhouse')    return `Open House — ${input?.location || 'Unknown'}`
    if (type === 'neighborhood') return `${input?.neighborhood || 'Area'}, ${input?.city || 'Unknown'}`
    if (type === 'pricedrop')    return `Price Drop — ${input?.propertyType || 'Property'} in ${input?.location || 'Unknown'}`
    if (type === 'videoscript')  return `Video Script — ${input?.propertyType || 'Property'} in ${input?.location || 'Unknown'}`
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

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-gray-900 text-white w-64">
      <div className="px-5 py-5 border-b border-gray-800">
        <a href="/" className="flex items-center gap-2">
          <span className="text-2xl">🏠</span>
          <span className="text-lg font-bold text-white">ListingAI</span>
        </a>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(item => (
          <a
            key={item.label}
            href={item.href}
            className={item.active ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all bg-blue-600 text-white' : 'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-gray-400 hover:text-white hover:bg-gray-800'}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-gray-800 space-y-3">
        {plan === 'free' && (
          <a
            href="/pricing"
            className="block w-full text-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-all"
          >
            Upgrade to Pro ⭐
          </a>
        )}
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-800 transition-all cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {avatarInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{userEmail}</p>
            <p className={`text-xs font-medium ${pc.color}`}>{planLabel} Plan</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-all"
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 flex-shrink-0 shadow-lg">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-64 flex flex-col shadow-2xl">
            <Sidebar />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)}></div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">

        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-40">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-bold text-gray-800">🏠 ListingAI</span>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
            {avatarInitials}
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

          {/* Greeting */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {getGreeting()}, {firstName.charAt(0).toUpperCase() + firstName.slice(1)} 👋
            </h1>
            <p className="text-gray-500 text-sm mt-1">Here is what is happening with your ListingAI account today.</p>
          </div>

          {/* Upgrade Banner for Free Users */}
          {!loading && plan === 'free' && (
            <div className="mb-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-white font-semibold text-sm">You are on the Free plan — {remaining} generations left</p>
                <p className="text-blue-100 text-xs mt-0.5">Upgrade to Pro for 100 generations/month and unlock full access.</p>
              </div>
              <a
                href="/pricing"
                className="flex-shrink-0 bg-white text-blue-700 font-bold text-sm px-5 py-2 rounded-xl hover:bg-blue-50 transition-all"
              >
                Upgrade Now →
              </a>
            </div>
          )}

          {/* Stats Row */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse">
                  <div className="h-3 bg-gray-100 rounded w-2/3 mb-3"></div>
                  <div className="h-7 bg-gray-100 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Total Used</p>
                <p className="text-3xl font-bold text-gray-900">{usage}</p>
                <p className="text-xs text-gray-400 mt-1">All time</p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Remaining</p>
                <p className={`text-3xl font-bold ${pc.color}`}>{remaining}</p>
                <div className="mt-2 w-full bg-gray-100 rounded-full h-1">
                  <div className={`h-1 rounded-full ${pc.bar}`} style={{ width: `${100 - usagePercent}%` }}></div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Current Plan</p>
                <p className={`text-3xl font-bold ${pc.color}`}>{planLabel}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${pc.badge}`}>
                  {limit === Infinity ? 'Unlimited' : `${limit} gen/mo`}
                </span>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">This Week</p>
                <p className="text-3xl font-bold text-gray-900">
                  {chartData.reduce((sum, d) => sum + d.count, 0)}
                </p>
                <p className="text-xs text-gray-400 mt-1">generations</p>
              </div>
            </div>
          )}

          {/* Activity Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-800">Activity — Last 7 Days</h2>
              <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">Generations per day</span>
            </div>
            {loading ? (
              <div className="h-16 bg-gray-50 rounded-lg animate-pulse"></div>
            ) : (
              <MiniBarChart data={chartData} />
            )}
          </div>

          {/* AI Tools */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-gray-800">AI Tools</h2>
              <span className="text-xs text-gray-400">Click any tool to start</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TOOLS.map(tool => (
                <a
                  key={tool.key}
                  href="/generate"
                  className={`bg-white border border-gray-100 rounded-2xl p-5 flex items-start gap-4 transition-all hover:shadow-md cursor-pointer group ${tool.color}`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${tool.accent}`}>
                    {tool.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-800 text-sm group-hover:text-gray-900">{tool.label}</p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{tool.desc}</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Recent Generations */}
          <div id="history" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
              <h2 className="text-sm font-bold text-gray-800">Recent Generations</h2>
              <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">{generations.length} entries</span>
            </div>

            {loading ? (
              <div className="p-5 space-y-3">
                {[1,2,3].map(i => (
                  <div key={i} className="animate-pulse h-14 bg-gray-50 rounded-xl"></div>
                ))}
              </div>
            ) : generations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                <span className="text-5xl mb-3">✨</span>
                <p className="text-gray-600 font-semibold mb-1">No generations yet</p>
                <p className="text-gray-400 text-sm mb-4">Use any AI tool above to create your first content</p>
                <a href="/generate" className="text-sm text-blue-600 font-semibold hover:underline">Start generating →</a>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {generations.map(gen => (
                  <div
                    key={gen.id}
                    onClick={() => setSelectedGeneration(gen)}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-lg flex-shrink-0">
                        {TOOLS.find(t => t.key === gen.type)?.icon || '📝'}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{getTitle(gen.type, gen.input)}</p>
                        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-0.5 ${TYPE_COLORS[gen.type] || 'bg-gray-100 text-gray-600'}`}>
                          {TYPE_LABELS[gen.type] || gen.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                      <span className="text-xs text-gray-400 hidden sm:block">{formatDate(gen.created_at)}</span>
                      <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cancel Subscription Link */}
          {!loading && plan !== 'free' && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowCancelModal(true)}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                Cancel subscription
              </button>
            </div>
          )}

        </div>
      </main>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
            {cancelSuccess ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Subscription Cancelled</h3>
                <p className="text-gray-500 text-sm">You will keep access until the end of your billing period.</p>
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
                  You will keep your <span className="font-semibold text-gray-700">{planLabel}</span> plan access until the end of your billing period. After that, you will be downgraded to Free (5 generations/month).
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
      )}

      <GenerationDetailPanel
        generation={selectedGeneration}
        onClose={() => setSelectedGeneration(null)}
      />
    </div>
  )
}