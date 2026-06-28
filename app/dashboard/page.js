'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import GenerationDetailPanel from '@/components/GenerationDetailPanel'

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
  listing:      'rgba(196,163,92,0.15)',
  social:       'rgba(139,92,246,0.15)',
  email:        'rgba(16,185,129,0.15)',
  contract:     'rgba(245,158,11,0.15)',
  openhouse:    'rgba(239,68,68,0.15)',
  neighborhood: 'rgba(20,184,166,0.15)',
  pricedrop:    'rgba(249,115,22,0.15)',
  videoscript:  'rgba(99,102,241,0.15)',
  bio:          'rgba(236,72,153,0.15)',
  leadmagnet:   'rgba(34,197,94,0.15)',
}

const TYPE_TEXT_COLORS = {
  listing:      '#C4A35C',
  social:       '#A78BFA',
  email:        '#34D399',
  contract:     '#FCD34D',
  openhouse:    '#F87171',
  neighborhood: '#2DD4BF',
  pricedrop:    '#FB923C',
  videoscript:  '#818CF8',
  bio:          '#F472B6',
  leadmagnet:   '#4ADE80',
}

const PLAN_CONFIG = {
  free:   { color: '#7A90A8', bar: '#5A6E85',  badge: 'rgba(90,110,133,0.20)',  badgeText: '#7A90A8'  },
  pro:    { color: '#C4A35C', bar: '#C4A35C',  badge: 'rgba(196,163,92,0.20)', badgeText: '#C4A35C'  },
  agency: { color: '#A78BFA', bar: '#A78BFA',  badge: 'rgba(167,139,250,0.20)', badgeText: '#A78BFA' },
}

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
            background: d.count > 0 ? '#C4A35C' : 'rgba(196,163,92,0.15)',
            height: `${Math.max(4, (d.count / max) * 52)}px`,
            transition: 'height 0.4s ease',
          }} />
          <span style={{ fontSize: '10px', color: '#4A5E78' }}>{d.day}</span>
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
    sidebar: { display: 'flex', flexDirection: 'column', height: '100%', background: '#071020', borderRight: '1px solid rgba(196,163,92,0.12)' },
    sidebarLogo: { padding: '20px', borderBottom: '1px solid rgba(196,163,92,0.12)' },
    sidebarLogoLink: { display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' },
    sidebarLogoText: { fontSize: '18px', fontWeight: 700, color: '#C4A35C', fontFamily: "'Playfair Display', Georgia, serif" },
    sidebarNav: { flex: 1, padding: '12px' },
    sidebarFooter: { padding: '12px', borderTop: '1px solid rgba(196,163,92,0.12)' },
    card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(196,163,92,0.12)', borderRadius: '16px', padding: '16px' },
  }

  const Sidebar = () => (
    <aside style={S.sidebar}>
      <div style={S.sidebarLogo}>
        <a href="/" style={S.sidebarLogoLink}>
          <span style={{ fontSize: '22px' }}>🏠</span>
          <span style={S.sidebarLogoText}>ListingAI</span>
        </a>
      </div>
      <nav style={S.sidebarNav}>
        {NAV_ITEMS.map(item => (
          <a key={item.label} href={item.href} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', borderRadius: '10px',
            fontSize: '13px', fontWeight: 600, textDecoration: 'none',
            marginBottom: '2px',
            background: item.active ? 'rgba(196,163,92,0.15)' : 'transparent',
            color: item.active ? '#C4A35C' : '#5A6E85',
            border: item.active ? '1px solid rgba(196,163,92,0.30)' : '1px solid transparent',
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
            background: '#C4A35C', color: '#0B1628',
            fontSize: '13px', fontWeight: 700,
            padding: '10px', borderRadius: '50px',
            textDecoration: 'none', marginBottom: '12px',
          }}>Upgrade to Pro</a>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderRadius: '10px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '50%',
            background: 'rgba(196,163,92,0.20)', border: '1px solid rgba(196,163,92,0.40)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#C4A35C', fontSize: '12px', fontWeight: 700, flexShrink: 0,
          }}>{avatarInitials}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#A8B8C8', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userEmail}</p>
            <p style={{ fontSize: '11px', color: pc.color, margin: 0 }}>{planLabel} Plan</p>
          </div>
        </div>
        <button onClick={handleLogout} style={{
          width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px',
          padding: '8px 12px', fontSize: '12px', color: '#4A5E78',
          background: 'none', border: 'none', cursor: 'pointer', borderRadius: '8px',
          marginTop: '4px', fontFamily: 'inherit',
        }}>🚪 Logout</button>
      </div>
    </aside>
  )

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0B1628', overflow: 'hidden', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        .dash-tool-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(196,163,92,0.18); border-radius: 16px; padding: 18px; display: flex; align-items: flex-start; gap: 14px; text-decoration: none; transition: all 0.2s ease; }
        .dash-tool-card:hover { background: rgba(196,163,92,0.08); border-color: rgba(196,163,92,0.40); transform: translateY(-1px); }
        .dash-tool-title { font-size: 13px; font-weight: 700; color: #D8E4F0; margin: 0 0 4px; }
        .dash-tool-desc { font-size: 12px; color: #7A90A8; margin: 0; line-height: 1.5; }
        .dash-history-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; cursor: pointer; border-bottom: 1px solid rgba(196,163,92,0.08); transition: background 0.15s ease; }
        .dash-history-row:hover { background: rgba(196,163,92,0.05); }
        .dash-history-row:last-child { border-bottom: none; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
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
          <div style={{ flex: 1, background: 'rgba(0,0,0,0.60)' }} onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

        {/* Mobile top bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px',
          background: '#071020',
          borderBottom: '1px solid rgba(196,163,92,0.12)',
          position: 'sticky', top: 0, zIndex: 40,
        }} className="mobile-topbar">
          <style>{`@media (min-width: 768px) { .mobile-topbar { display: none !important; } }`}</style>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C4A35C', fontSize: '20px' }}>☰</button>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, color: '#C4A35C', fontSize: '16px' }}>🏠 ListingAI</span>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'rgba(196,163,92,0.20)', border: '1px solid rgba(196,163,92,0.40)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#C4A35C', fontSize: '12px', fontWeight: 700,
          }}>{avatarInitials}</div>
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.25rem 4rem', width: '100%' }}>

          {/* Greeting */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: '#F5EDD8', marginBottom: '4px' }}>
              {getGreeting()}, {firstName.charAt(0).toUpperCase() + firstName.slice(1)} 👋
            </h1>
            <p style={{ fontSize: '13px', color: '#4A5E78' }}>Here is what is happening with your ListingAI account today.</p>
          </div>

          {/* Payment issue banner */}
          {!loading && paymentIssue && plan !== 'free' && (
            <div style={{
              marginBottom: '1.25rem', borderRadius: '14px', padding: '16px 20px',
              background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.30)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap',
            }}>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#FCA5A5', margin: '0 0 2px' }}>⚠️ Payment issue — your {planLabel} access is at risk</p>
                <p style={{ fontSize: '12px', color: '#7A90A8', margin: 0 }}>We could not process your last payment. Update your card to avoid being downgraded.</p>
              </div>
              <button onClick={handleManageBilling} disabled={portalLoading} style={{
                background: '#ef4444', color: '#fff', border: 'none',
                fontSize: '13px', fontWeight: 700, padding: '8px 18px', borderRadius: '50px',
                cursor: 'pointer', flexShrink: 0, fontFamily: 'inherit',
              }}>{portalLoading ? 'Opening...' : 'Update Payment'}</button>
            </div>
          )}

          {/* Free plan upgrade banner */}
          {!loading && plan === 'free' && (
            <div style={{
              marginBottom: '1.25rem', borderRadius: '14px', padding: '16px 20px',
              background: 'rgba(196,163,92,0.08)', border: '1px solid rgba(196,163,92,0.30)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap',
            }}>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#C4A35C', margin: '0 0 2px' }}>You are on the Free plan — {remaining} generations left</p>
                <p style={{ fontSize: '12px', color: '#7A90A8', margin: 0 }}>Upgrade to Pro for 100 generations/month and unlock full access.</p>
              </div>
              <a href="/pricing" style={{
                background: '#C4A35C', color: '#0B1628',
                fontSize: '13px', fontWeight: 700, padding: '8px 18px', borderRadius: '50px',
                textDecoration: 'none', flexShrink: 0,
              }}>Upgrade Now</a>
            </div>
          )}

          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '1.25rem' }}
            className="stat-grid">
            <style>{`@media (max-width: 640px) { .stat-grid { grid-template-columns: repeat(2, 1fr) !important; } }`}</style>
            {loading ? [1,2,3,4].map(i => (
              <div key={i} style={{ ...S.card, animation: 'pulse 1.5s ease infinite' }}>
                <div style={{ height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', width: '60%', marginBottom: '12px' }} />
                <div style={{ height: '28px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', width: '40%' }} />
              </div>
            )) : (<>
              <div style={S.card}>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#4A5E78', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 4px' }}>Total Used</p>
                <p style={{ fontSize: '2rem', fontWeight: 700, color: '#F5EDD8', margin: '0 0 2px' }}>{usage}</p>
                <p style={{ fontSize: '11px', color: '#4A5E78', margin: 0 }}>All time</p>
              </div>
              <div style={S.card}>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#4A5E78', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 4px' }}>Remaining</p>
                <p style={{ fontSize: '2rem', fontWeight: 700, color: pc.color, margin: '0 0 6px' }}>{remaining}</p>
                <div style={{ width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', height: '4px' }}>
                  <div style={{ height: '4px', borderRadius: '4px', background: pc.bar, width: `${100 - usagePercent}%`, transition: 'width 0.5s ease' }} />
                </div>
              </div>
              <div style={S.card}>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#4A5E78', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 4px' }}>Current Plan</p>
                <p style={{ fontSize: '2rem', fontWeight: 700, color: pc.color, margin: '0 0 4px' }}>{planLabel}</p>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '100px', background: pc.badge, color: pc.badgeText }}>
                  {limit === Infinity ? 'Unlimited' : `${limit} gen/mo`}
                </span>
              </div>
              <div style={S.card}>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#4A5E78', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 4px' }}>This Week</p>
                <p style={{ fontSize: '2rem', fontWeight: 700, color: '#F5EDD8', margin: '0 0 2px' }}>{chartData.reduce((s, d) => s + d.count, 0)}</p>
                <p style={{ fontSize: '11px', color: '#4A5E78', margin: 0 }}>generations</p>
              </div>
            </>)}
          </div>

          {/* Activity chart */}
          <div style={{ ...S.card, marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#A8B8C8', margin: 0 }}>Activity — Last 7 Days</h2>
              <span style={{ fontSize: '11px', color: '#4A5E78', background: 'rgba(255,255,255,0.04)', padding: '3px 10px', borderRadius: '100px' }}>Generations per day</span>
            </div>
            {loading ? <div style={{ height: '64px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', animation: 'pulse 1.5s ease infinite' }} />
              : <MiniBarChart data={chartData} />}
          </div>

          {/* AI Tools */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#A8B8C8', margin: 0 }}>AI Tools</h2>
              <span style={{ fontSize: '11px', color: '#4A5E78' }}>Click any tool to start</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }} className="tools-grid">
              <style>{`@media (max-width: 480px) { .tools-grid { grid-template-columns: 1fr !important; } }`}</style>
              {TOOLS.map(tool => (
                <a key={tool.key} href="/generate" className="dash-tool-card">
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '10px', flexShrink: 0,
                    background: 'rgba(196,163,92,0.10)', border: '1px solid rgba(196,163,92,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                  }}>{tool.icon}</div>
                  <div style={{ minWidth: 0 }}>
                    <p className="dash-tool-title">{tool.label}</p>
                    <p className="dash-tool-desc">{tool.desc}</p>
                  </div>
                  <svg style={{ width: '14px', height: '14px', color: '#4A5E78', flexShrink: 0, marginTop: '2px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Generation history */}
          <div id="history" style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid rgba(196,163,92,0.10)' }}>
              <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#A8B8C8', margin: 0 }}>Recent Generations</h2>
              <span style={{ fontSize: '11px', color: '#4A5E78', background: 'rgba(255,255,255,0.04)', padding: '3px 10px', borderRadius: '100px' }}>{generations.length} entries</span>
            </div>
            {loading ? (
              <div style={{ padding: '16px' }}>
                {[1,2,3].map(i => <div key={i} style={{ height: '48px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', marginBottom: '8px', animation: 'pulse 1.5s ease infinite' }} />)}
              </div>
            ) : generations.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 1.5rem', textAlign: 'center' }}>
                <span style={{ fontSize: '2.5rem', marginBottom: '12px' }}>✨</span>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#A8B8C8', marginBottom: '4px' }}>No generations yet</p>
                <p style={{ fontSize: '13px', color: '#4A5E78', marginBottom: '16px' }}>Use any AI tool above to create your first content</p>
                <a href="/generate" style={{ fontSize: '13px', color: '#C4A35C', fontWeight: 700, textDecoration: 'none' }}>Start generating →</a>
              </div>
            ) : (
              <div>
                {generations.map(gen => (
                  <div key={gen.id} className="dash-history-row" onClick={() => setSelectedGeneration(gen)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                      <span style={{ fontSize: '18px', flexShrink: 0 }}>{TOOLS.find(t => t.key === gen.type)?.icon || '📝'}</span>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: '#D8E4F0', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {getTitle(gen.type, gen.input)}
                        </p>
                        <span style={{
                          display: 'inline-block', fontSize: '11px', fontWeight: 700,
                          padding: '2px 9px', borderRadius: '100px',
                          background: TYPE_COLORS[gen.type] || 'rgba(255,255,255,0.06)',
                          color: TYPE_TEXT_COLORS[gen.type] || '#7A90A8',
                        }}>{TYPE_LABELS[gen.type] || gen.type}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '12px', flexShrink: 0 }}>
                      <span style={{ fontSize: '11px', color: '#4A5E78' }}>{formatDate(gen.created_at)}</span>
                      <svg style={{ width: '14px', height: '14px', color: '#4A5E78' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <button onClick={handleManageBilling} disabled={portalLoading} style={{ background: 'none', border: 'none', fontSize: '13px', color: '#A8B8C8', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline' }}>
                  {portalLoading ? 'Opening...' : 'Manage billing'}
                </button>
              )}
              <button onClick={() => setShowCancelModal(true)} style={{ background: 'none', border: 'none', fontSize: '13px', color: '#F87171', cursor: 'pointer', fontFamily: 'inherit' }}>
                Cancel subscription
              </button>
            </div>
          )}

        </div>
      </main>

      {/* Cancel modal */}
      {showCancelModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: '#0D1D35', border: '1px solid rgba(196,163,92,0.20)', borderRadius: '20px', width: '100%', maxWidth: '420px', padding: '2rem' }}>
            {cancelSuccess ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(196,163,92,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '28px' }}>✓</div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#F5EDD8', marginBottom: '8px' }}>
                  {cancelAlreadyCancelled ? 'Already Set to Cancel' : 'Subscription Cancelled'}
                </h3>
                <p style={{ fontSize: '13px', color: '#7A90A8', lineHeight: 1.6 }}>
                  {cancelAlreadyCancelled ? 'Your subscription is already scheduled to end at your current billing period.' : 'You will keep access until the end of your billing period.'}
                </p>
              </div>
            ) : (
              <>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '28px' }}>⚠️</div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#F5EDD8', textAlign: 'center', marginBottom: '8px' }}>Cancel Subscription?</h3>
                <p style={{ fontSize: '13px', color: '#7A90A8', textAlign: 'center', lineHeight: 1.6, marginBottom: '20px' }}>
                  You will keep your <strong style={{ color: '#E8DFC8' }}>{planLabel}</strong> plan access until the end of your billing period. After that, you will be downgraded to Free (5 generations/month).
                </p>
                {cancelError && (
                  <div style={{ marginBottom: '16px', padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', fontSize: '13px', color: '#FCA5A5' }}>
                    {cancelError}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => { setShowCancelModal(false); setCancelError('') }} disabled={cancelling} style={{
                    flex: 1, padding: '11px', fontSize: '13px', fontWeight: 700,
                    border: '1px solid rgba(196,163,92,0.25)', borderRadius: '50px',
                    color: '#A8B8C8', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit',
                  }}>Keep My Plan</button>
                  <button onClick={handleCancelSubscription} disabled={cancelling} style={{
                    flex: 1, padding: '11px', fontSize: '13px', fontWeight: 700,
                    background: '#ef4444', color: '#fff', border: 'none',
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