'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import GenerationDetailPanel from '@/components/GenerationDetailPanel'
import LogoMark from '@/components/LogoMark'

const PLAN_LIMITS = { free: 5, pro: 100, agency: Infinity }

const TYPE_LABELS = {
  listing:      'Listing Writer',
  social:       'Social Media',
  email:        'Buyer Email',
  contract:     'Contract Summary',
  openhouse:    'Open House',
  neighborhood: 'Neighborhood',
  pricedrop:    'Price Reduction',
  videoscript:  'Video Script',
  bio:          'Realtor Bio',
  leadmagnet:   'Lead Magnet / Blog',
}

const TYPE_COLORS = {
  listing:      'rgba(24,95,133,0.12)',
  social:       'rgba(124,92,191,0.12)',
  email:        'rgba(94,155,124,0.12)',
  contract:     'rgba(201,154,62,0.14)',
  openhouse:    'rgba(220,38,38,0.10)',
  neighborhood: 'rgba(15,122,122,0.12)',
  pricedrop:    'rgba(234,131,45,0.12)',
  videoscript:  'rgba(67,56,202,0.12)',
  bio:          'rgba(190,24,93,0.12)',
  leadmagnet:   'rgba(22,121,79,0.12)',
}

const TYPE_TEXT_COLORS = {
  listing:      '#185F85',
  social:       '#7C5CBF',
  email:        '#4C8468',
  contract:     '#A9791F',
  openhouse:    '#B91C1C',
  neighborhood: '#0F7A7A',
  pricedrop:    '#B85A16',
  videoscript:  '#4338CA',
  bio:          '#BE185D',
  leadmagnet:   '#16794F',
}

const PLAN_CONFIG = {
  free:   { color: '#6B7280', bar: '#94A3B8', badge: 'rgba(107,114,128,0.12)', badgeText: '#6B7280' },
  pro:    { color: '#185F85', bar: '#185F85', badge: 'rgba(24,95,133,0.12)',   badgeText: '#185F85' },
  agency: { color: '#7C5CBF', bar: '#7C5CBF', badge: 'rgba(124,92,191,0.12)', badgeText: '#7C5CBF' },
}

const ACCENT_CYCLE = [
  { bg: 'rgba(24,95,133,0.10)',  border: 'rgba(24,95,133,0.18)',  color: '#185F85' }, // blue
  { bg: 'rgba(94,155,124,0.10)', border: 'rgba(94,155,124,0.20)', color: '#4C8468' }, // sage
  { bg: 'rgba(201,154,62,0.12)', border: 'rgba(201,154,62,0.22)', color: '#A9791F' }, // amber
  { bg: 'rgba(124,92,191,0.10)', border: 'rgba(124,92,191,0.20)', color: '#7C5CBF' }, // purple
]

const TOOLS = [
  { key: 'listing',      icon: '🏠', label: 'Listing Writer',    desc: 'Generate professional MLS property descriptions in seconds'           },
  { key: 'social',       icon: '📱', label: 'Social Media',       desc: 'Create engaging Instagram and Facebook captions for listings'         },
  { key: 'email',        icon: '✉️', label: 'Buyer Email',        desc: 'Write personalized emails to buyers about properties'                 },
  { key: 'contract',     icon: '📄', label: 'Contract Summary',   desc: 'Summarize complex real estate contracts into plain English'           },
  { key: 'openhouse',    icon: '🎪', label: 'Open House',         desc: 'Create announcements for WhatsApp, SMS, and social media'            },
  { key: 'neighborhood', icon: '📍', label: 'Neighborhood',       desc: 'Write compelling area descriptions for any city worldwide'           },
  { key: 'pricedrop',    icon: '💰', label: 'Price Reduction',    desc: 'Announce price drops tactfully to attract motivated buyers'          },
  { key: 'videoscript',  icon: '🎥', label: 'Video Script',       desc: 'Write walkthrough scripts for Reels, YouTube and TikTok'            },
  { key: 'bio',          icon: '👤', label: 'Realtor Bio',        desc: 'Generate a polished professional bio for your website or profile'    },
  { key: 'leadmagnet',   icon: '🧲', label: 'Lead Magnet / Blog', desc: 'Create blog posts, buyer guides and checklists to attract new leads' },
]

const NAV_ITEMS = [
  { icon: '⚡', label: 'Dashboard',    href: '/dashboard',         active: true  },
  { icon: '🤖', label: 'AI Generator', href: '/generate',          active: false },
  { icon: '📋', label: 'History',      href: '/dashboard#history', active: false },
  { icon: '💰', label: 'Pricing',      href: '/pricing',           active: false },
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
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '64px' }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1 }}>
          <div style={{
            width: '100%', borderRadius: '3px 3px 0 0',
            background: d.count > 0 ? '#185F85' : 'rgba(24,95,133,0.14)',
            height: `${Math.max(4, (d.count / max) * 52)}px`,
            transition: 'height 0.4s ease',
          }} />
          <span style={{ fontSize: '10px', fontWeight: 600, color: '#5B6B7C' }}>{d.day}</span>
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
  const [cancelAlreadyCancelled, setCancelAlreadyCancelled] = useState(false)
  const [cancelError, setCancelError] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [polarCustomerId, setPolarCustomerId] = useState(null)
  const [paymentIssue, setPaymentIssue] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) { setLoading(false); return }
        setUserEmail(session.user.email || '')
        const [{ data: profile }, usageRes, { data: gens }] = await Promise.all([
          supabase.from('profiles').select('plan, polar_customer_id, payment_issue').eq('id', session.user.id).single(),
          fetch('/api/usage', { headers: { Authorization: `Bearer ${session.access_token}` } }),
          supabase.from('generations').select('id, type, input, output, created_at').eq('user_id', session.user.id).order('created_at', { ascending: false }).limit(20)
        ])
        const usageData = await usageRes.json()
        setPlan(profile?.plan || 'free')
        setPolarCustomerId(profile?.polar_customer_id || null)
        setPaymentIssue(profile?.payment_issue || false)
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
      const d = new Date(); d.setDate(d.getDate() - (6 - i))
      return { day: days[d.getDay()], date: d.toDateString(), count: 0 }
    })
    generations.forEach(g => {
      const slot = last7.find(d => d.date === new Date(g.created_at).toDateString())
      if (slot) slot.count++
    })
    return last7
  })()

  const formatDate = (ts) => new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

  const getTitle = (type, input) => {
    if (type === 'listing')      return `${input?.propertyType || 'Property'} in ${input?.location || 'Unknown'}`
    if (type === 'social')       return `${input?.propertyType || 'Property'} in ${input?.location || 'Unknown'}`
    if (type === 'email')        return `Email to ${input?.buyerName || 'Buyer'}`
    if (type === 'contract')     return 'Contract Summary'
    if (type === 'openhouse')    return `Open House in ${input?.location || 'Unknown'}`
    if (type === 'neighborhood') return `${input?.neighborhood || 'Area'}, ${input?.city || 'Unknown'}`
    if (type === 'pricedrop')    return `Price Drop in ${input?.location || 'Unknown'}`
    if (type === 'videoscript')  return `Video Script in ${input?.location || 'Unknown'}`
    if (type === 'bio')          return `Bio for ${input?.agentName || 'Agent'}`
    if (type === 'leadmagnet')   return `${input?.topic || 'Content'} for ${input?.targetAudience || 'General Audience'}`
    return 'Generation'
  }

  const handleCancelSubscription = async () => {
    setCancelling(true); setCancelError('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not logged in')
      const res = await fetch('/api/polar/cancel', { method: 'POST', headers: { Authorization: `Bearer ${session.access_token}` } })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to cancel')
      setCancelAlreadyCancelled(!!data.alreadyCancelled)
      setCancelSuccess(true)
      setTimeout(() => { setShowCancelModal(false); setCancelSuccess(false); setCancelAlreadyCancelled(false) }, 3000)
    } catch (err) {
      setCancelError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setCancelling(false)
    }
  }

  const handleManageBilling = async () => {
    setPortalLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not logged in')
      const res = await fetch('/api/polar/portal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: session.user.id }) })
      const data = await res.json()
      if (data.redirectToPricing) { window.location.href = '/pricing'; return }
      if (!res.ok) throw new Error(data.error || 'Failed to open billing portal')
      window.location.href = data.url
    } catch (err) {
      alert('Could not open billing portal. Please try again or contact support.')
    } finally {
      setPortalLoading(false)
    }
  }

  const handleLogout = async () => { await supabase.auth.signOut(); window.location.href = '/' }

  const S = {
    sidebar: { display: 'flex', flexDirection: 'column', height: '100%', background: '#ffffff', borderRight: '1px solid rgba(24,95,133,0.12)' },
    sidebarLogo: { padding: '18px 16px', borderBottom: '1px solid rgba(24,95,133,0.12)' },
    sidebarLogoLink: { display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' },
    sidebarLogoText: { fontSize: '18px', fontWeight: 700, color: '#185F85', fontFamily: "var(--font-playfair)" },
    sidebarNav: { flex: 1, padding: '12px' },
    sidebarFooter: { padding: '12px', borderTop: '1px solid rgba(24,95,133,0.12)' },
    card: { background: '#ffffff', border: '1px solid rgba(24,95,133,0.12)', borderRadius: '16px', padding: '16px' },
  }

  const Sidebar = () => (
    <aside style={S.sidebar}>
      <div style={S.sidebarLogo}>
        <a href="/" style={S.sidebarLogoLink}>
          <LogoMark size="md" theme="light" />
        </a>
      </div>
      <nav style={S.sidebarNav}>
        {NAV_ITEMS.map(item => (
          <a key={item.label} href={item.href} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', borderRadius: '10px',
            fontSize: '13px', fontWeight: 600, textDecoration: 'none',
            marginBottom: '2px',
            background: item.active ? 'rgba(24,95,133,0.10)' : 'transparent',
            color: item.active ? '#185F85' : '#6B7280',
            border: item.active ? '1px solid rgba(24,95,133,0.28)' : '1px solid transparent',
            transition: 'all 0.15s ease',
          }}>
            <span style={{ fontSize: '15px' }}>{item.icon}</span>
            {item.label}
          </a>
        ))}
      </nav>
      <div style={S.sidebarFooter}>
        {plan === 'free' && (
          <a href="/pricing" style={{
            display: 'block', width: '100%', textAlign: 'center',
            background: '#185F85', color: '#ffffff',
            fontSize: '13px', fontWeight: 700,
            padding: '10px', borderRadius: '50px',
            textDecoration: 'none', marginBottom: '12px',
          }}>Upgrade to Pro</a>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderRadius: '10px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '50%',
            background: 'rgba(24,95,133,0.12)', border: '1px solid rgba(24,95,133,0.30)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#185F85', fontSize: '12px', fontWeight: 700, flexShrink: 0,
          }}>{avatarInitials}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#374151', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userEmail}</p>
            <p style={{ fontSize: '11px', color: pc.color, margin: 0 }}>{planLabel} Plan</p>
          </div>
        </div>
        <button onClick={handleLogout} style={{
          width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px',
          padding: '8px 12px', fontSize: '12px', color: '#8A97A6',
          background: 'none', border: 'none', cursor: 'pointer', borderRadius: '8px',
          marginTop: '4px', fontFamily: 'inherit',
        }}>🚪 Logout</button>
      </div>
    </aside>
  )

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#FAF8F2', overflow: 'hidden', fontFamily: "var(--font-dm-sans)" }}>
      <style>{`
        .dash-tool-card { background: #ffffff; border: 1px solid rgba(24,95,133,0.14); border-radius: 16px; padding: 18px; display: flex; align-items: flex-start; gap: 14px; text-decoration: none; transition: all 0.2s ease; }
        .dash-tool-card:hover { background: rgba(24,95,133,0.04); border-color: rgba(24,95,133,0.35); transform: translateY(-1px); box-shadow: 0 4px 14px rgba(24,95,133,0.08); }
        .dash-tool-title { font-size: 13px; font-weight: 700; color: #1F2937; margin: 0 0 4px; }
        .dash-tool-desc { font-size: 12px; color: #6B7280; margin: 0; line-height: 1.5; }
        .dash-history-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; cursor: pointer; border-bottom: 1px solid rgba(24,95,133,0.08); transition: background 0.15s ease; }
        .dash-history-row:hover { background: rgba(24,95,133,0.04); }
        .dash-history-row:last-child { border-bottom: none; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>

      {/* Desktop sidebar */}
      <div style={{ display: 'none', width: '220px', flexShrink: 0 }} className="md-sidebar">
        <Sidebar />
      </div>
      <style>{`@media (min-width: 768px) { .md-sidebar { display: flex !important; flex-direction: column; } }`}</style>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex' }}>
          <div style={{ width: '220px', flexShrink: 0 }}><Sidebar /></div>
          <div style={{ flex: 1, background: 'rgba(20,30,40,0.45)' }} onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <main style={{ flex: 1, minWidth: 0, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>

        {/* Mobile top bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px',
          background: '#ffffff',
          borderBottom: '1px solid rgba(24,95,133,0.12)',
          position: 'sticky', top: 0, zIndex: 40,
        }} className="mobile-topbar">
          <style>{`@media (min-width: 768px) { .mobile-topbar { display: none !important; } }`}</style>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#185F85', fontSize: '20px' }}>☰</button>
          <LogoMark size="md" theme="light" />
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'rgba(24,95,133,0.12)', border: '1px solid rgba(24,95,133,0.30)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#185F85', fontSize: '12px', fontWeight: 700,
          }}>{avatarInitials}</div>
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.25rem 4rem', width: '100%', boxSizing: 'border-box' }}>

          {/* Greeting */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: '#1C2B3A', marginBottom: '4px' }}>
              {getGreeting()}, {firstName.charAt(0).toUpperCase() + firstName.slice(1)} 👋
            </h1>
            <p style={{ fontSize: '13px', color: '#8A97A6' }}>Here is what is happening with your ListingAI account today.</p>
          </div>

          {/* Payment issue banner */}
          {!loading && paymentIssue && plan !== 'free' && (
            <div style={{
              marginBottom: '1.25rem', borderRadius: '14px', padding: '16px 20px',
              background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap',
            }}>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#B91C1C', margin: '0 0 2px' }}>⚠️ Payment issue — your {planLabel} access is at risk</p>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>We could not process your last payment. Update your card to avoid being downgraded.</p>
              </div>
              <button onClick={handleManageBilling} disabled={portalLoading} style={{
                background: '#DC2626', color: '#fff', border: 'none',
                fontSize: '13px', fontWeight: 700, padding: '8px 18px', borderRadius: '50px',
                cursor: 'pointer', flexShrink: 0, fontFamily: 'inherit',
              }}>{portalLoading ? 'Opening...' : 'Update Payment'}</button>
            </div>
          )}

          {/* Free plan upgrade banner */}
          {!loading && plan === 'free' && (
            <div style={{
              marginBottom: '1.25rem', borderRadius: '14px', padding: '16px 20px',
              background: 'rgba(201,154,62,0.08)', border: '1px solid rgba(201,154,62,0.28)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap',
            }}>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#A9791F', margin: '0 0 2px' }}>You are on the Free plan — {remaining} generations left</p>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Upgrade to Pro for 100 generations/month and unlock full access.</p>
              </div>
              <a href="/pricing" style={{
                background: '#185F85', color: '#ffffff',
                fontSize: '13px', fontWeight: 700, padding: '8px 18px', borderRadius: '50px',
                textDecoration: 'none', flexShrink: 0,
              }}>Upgrade Now</a>
            </div>
          )}

          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px', marginBottom: '1.25rem' }}
            className="stat-grid">
            <style>{`@media (max-width: 640px) { .stat-grid { grid-template-columns: repeat(2, 1fr) !important; } }`}</style>
            {loading ? [1,2,3,4].map(i => (
              <div key={i} style={{ ...S.card, animation: 'pulse 1.5s ease infinite' }}>
                <div style={{ height: '10px', background: 'rgba(24,95,133,0.08)', borderRadius: '4px', width: '60%', marginBottom: '12px' }} />
                <div style={{ height: '28px', background: 'rgba(24,95,133,0.08)', borderRadius: '4px', width: '40%' }} />
              </div>
            )) : (<>
              <div style={S.card}>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#8A97A6', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 4px' }}>Total Used</p>
                <p style={{ fontSize: '2rem', fontWeight: 700, color: '#1C2B3A', margin: '0 0 2px' }}>{usage}</p>
                <p style={{ fontSize: '11px', color: '#8A97A6', margin: 0 }}>All time</p>
              </div>
              <div style={S.card}>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#8A97A6', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 4px' }}>Remaining</p>
                <p style={{ fontSize: '2rem', fontWeight: 700, color: pc.color, margin: '0 0 6px' }}>{remaining}</p>
                <div style={{ width: '100%', background: 'rgba(24,95,133,0.10)', borderRadius: '4px', height: '4px' }}>
                  <div style={{ height: '4px', borderRadius: '4px', background: pc.bar, width: `${100 - usagePercent}%`, transition: 'width 0.5s ease' }} />
                </div>
              </div>
              <div style={S.card}>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#8A97A6', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 4px' }}>Current Plan</p>
                <p style={{ fontSize: '2rem', fontWeight: 700, color: pc.color, margin: '0 0 4px' }}>{planLabel}</p>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '100px', background: pc.badge, color: pc.badgeText }}>
                  {limit === Infinity ? 'Unlimited' : `${limit} gen/mo`}
                </span>
              </div>
              <div style={S.card}>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#8A97A6', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 4px' }}>This Week</p>
                <p style={{ fontSize: '2rem', fontWeight: 700, color: '#1C2B3A', margin: '0 0 2px' }}>{chartData.reduce((s, d) => s + d.count, 0)}</p>
                <p style={{ fontSize: '11px', color: '#8A97A6', margin: 0 }}>generations</p>
              </div>
            </>)}
          </div>

          {/* Activity chart */}
          <div style={{ ...S.card, marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#374151', margin: 0 }}>Activity — Last 7 Days</h2>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#185F85', background: 'rgba(24,95,133,0.08)', padding: '3px 10px', borderRadius: '100px' }}>Generations per day</span>
            </div>
            {loading ? <div style={{ height: '64px', background: 'rgba(24,95,133,0.06)', borderRadius: '8px', animation: 'pulse 1.5s ease infinite' }} />
              : <MiniBarChart data={chartData} />}
          </div>

          {/* AI Tools */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#374151', margin: 0 }}>AI Tools</h2>
              <span style={{ fontSize: '11px', color: '#8A97A6' }}>Click any tool to start</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px' }} className="tools-grid">
              <style>{`@media (max-width: 480px) { .tools-grid { grid-template-columns: 1fr !important; } }`}</style>
              {TOOLS.map((tool, i) => {
                const accent = ACCENT_CYCLE[i % ACCENT_CYCLE.length]
                return (
                  <a key={tool.key} href="/generate" className="dash-tool-card">
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '10px', flexShrink: 0,
                      background: accent.bg, border: `1px solid ${accent.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                    }}>{tool.icon}</div>
                    <div style={{ minWidth: 0 }}>
                      <p className="dash-tool-title">{tool.label}</p>
                      <p className="dash-tool-desc">{tool.desc}</p>
                    </div>
                    <svg style={{ width: '14px', height: '14px', color: '#9CA6B0', flexShrink: 0, marginTop: '2px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                )
              })}
            </div>
          </div>

          {/* Generation history */}
          <div id="history" style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid rgba(24,95,133,0.10)' }}>
              <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#374151', margin: 0 }}>Recent Generations</h2>
              <span style={{ fontSize: '11px', color: '#8A97A6', background: 'rgba(24,95,133,0.06)', padding: '3px 10px', borderRadius: '100px' }}>{generations.length} entries</span>
            </div>
            {loading ? (
              <div style={{ padding: '16px' }}>
                {[1,2,3].map(i => <div key={i} style={{ height: '48px', background: 'rgba(24,95,133,0.05)', borderRadius: '10px', marginBottom: '8px', animation: 'pulse 1.5s ease infinite' }} />)}
              </div>
            ) : generations.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 1.5rem', textAlign: 'center' }}>
                <span style={{ fontSize: '2.5rem', marginBottom: '12px' }}>✨</span>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>No generations yet</p>
                <p style={{ fontSize: '13px', color: '#8A97A6', marginBottom: '16px' }}>Use any AI tool above to create your first content</p>
                <a href="/generate" style={{ fontSize: '13px', color: '#185F85', fontWeight: 700, textDecoration: 'none' }}>Start generating →</a>
              </div>
            ) : (
              <div>
                {generations.map(gen => (
                  <div key={gen.id} className="dash-history-row" onClick={() => setSelectedGeneration(gen)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                      <span style={{ fontSize: '18px', flexShrink: 0 }}>{TOOLS.find(t => t.key === gen.type)?.icon || '📝'}</span>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: '#1F2937', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {getTitle(gen.type, gen.input)}
                        </p>
                        <span style={{
                          display: 'inline-block', fontSize: '11px', fontWeight: 700,
                          padding: '2px 9px', borderRadius: '100px',
                          background: TYPE_COLORS[gen.type] || 'rgba(24,95,133,0.06)',
                          color: TYPE_TEXT_COLORS[gen.type] || '#6B7280',
                        }}>{TYPE_LABELS[gen.type] || gen.type}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '12px', flexShrink: 0 }}>
                      <span style={{ fontSize: '11px', color: '#8A97A6' }}>{formatDate(gen.created_at)}</span>
                      <svg style={{ width: '14px', height: '14px', color: '#9CA6B0' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Billing actions */}
          {!loading && plan !== 'free' && (
            <div style={{ marginTop: '16px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
              {polarCustomerId && (
                <button onClick={handleManageBilling} disabled={portalLoading} style={{ background: 'none', border: 'none', fontSize: '13px', color: '#374151', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline' }}>
                  {portalLoading ? 'Opening...' : 'Manage billing'}
                </button>
              )}
              <button onClick={() => setShowCancelModal(true)} style={{ background: 'none', border: 'none', fontSize: '13px', color: '#DC2626', cursor: 'pointer', fontFamily: 'inherit' }}>
                Cancel subscription
              </button>
            </div>
          )}

        </div>
      </main>

      {/* Cancel modal */}
      {showCancelModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(20,30,40,0.45)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: '#ffffff', border: '1px solid rgba(24,95,133,0.16)', borderRadius: '20px', width: '100%', maxWidth: '420px', padding: '2rem', boxShadow: '0 20px 50px rgba(20,30,40,0.15)' }}>
            {cancelSuccess ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(24,95,133,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '28px' }}>✓</div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1C2B3A', marginBottom: '8px' }}>
                  {cancelAlreadyCancelled ? 'Already Set to Cancel' : 'Subscription Cancelled'}
                </h3>
                <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.6 }}>
                  {cancelAlreadyCancelled ? 'Your subscription is already scheduled to end at your current billing period.' : 'You will keep access until the end of your billing period.'}
                </p>
              </div>
            ) : (
              <>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '28px' }}>⚠️</div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1C2B3A', textAlign: 'center', marginBottom: '8px' }}>Cancel Subscription?</h3>
                <p style={{ fontSize: '13px', color: '#6B7280', textAlign: 'center', lineHeight: 1.6, marginBottom: '20px' }}>
                  You will keep your <strong style={{ color: '#1F2937' }}>{planLabel}</strong> plan access until the end of your billing period. After that, you will be downgraded to Free (5 generations/month).
                </p>
                {cancelError && (
                  <div style={{ marginBottom: '16px', padding: '10px 14px', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.22)', borderRadius: '10px', fontSize: '13px', color: '#B91C1C' }}>
                    {cancelError}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => { setShowCancelModal(false); setCancelError('') }} disabled={cancelling} style={{
                    flex: 1, padding: '11px', fontSize: '13px', fontWeight: 700,
                    border: '1px solid rgba(24,95,133,0.22)', borderRadius: '50px',
                    color: '#374151', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit',
                  }}>Keep My Plan</button>
                  <button onClick={handleCancelSubscription} disabled={cancelling} style={{
                    flex: 1, padding: '11px', fontSize: '13px', fontWeight: 700,
                    background: '#DC2626', color: '#fff', border: 'none',
                    borderRadius: '50px', cursor: 'pointer', fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  }}>
                    {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <GenerationDetailPanel generation={selectedGeneration} onClose={() => setSelectedGeneration(null)} />
    </div>
  )
}