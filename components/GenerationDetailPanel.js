'use client'
import { useEffect, useState } from 'react'

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
  listing:      { bg: 'rgba(196,163,92,0.15)',  text: '#C4A35C'  },
  social:       { bg: 'rgba(139,92,246,0.15)',  text: '#A78BFA'  },
  email:        { bg: 'rgba(16,185,129,0.15)',   text: '#34D399'  },
  contract:     { bg: 'rgba(245,158,11,0.15)',   text: '#FCD34D'  },
  openhouse:    { bg: 'rgba(239,68,68,0.15)',    text: '#F87171'  },
  neighborhood: { bg: 'rgba(20,184,166,0.15)',   text: '#2DD4BF'  },
  pricedrop:    { bg: 'rgba(249,115,22,0.15)',   text: '#FB923C'  },
  videoscript:  { bg: 'rgba(99,102,241,0.15)',   text: '#818CF8'  },
  bio:          { bg: 'rgba(236,72,153,0.15)',   text: '#F472B6'  },
  leadmagnet:   { bg: 'rgba(34,197,94,0.15)',    text: '#4ADE80'  },
}

export default function GenerationDetailPanel({ generation, onClose }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = generation ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [generation])

  const handleCopy = () => {
    if (!generation?.output) return
    navigator.clipboard.writeText(generation.output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (ts) => new Date(ts).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    year: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  const getTitle = (type, input) => {
    if (type === 'listing')      return `${input?.propertyType || 'Property'} in ${input?.location || 'Unknown'}`
    if (type === 'social')       return `${input?.propertyType || 'Property'} — ${input?.location || 'Unknown'}`
    if (type === 'email')        return `Email to ${input?.buyerName || 'Buyer'}`
    if (type === 'contract')     return 'Contract Summary'
    if (type === 'openhouse')    return `Open House in ${input?.location || 'Unknown'}`
    if (type === 'neighborhood') return `${input?.neighborhood || 'Area'}, ${input?.city || 'Unknown'}`
    if (type === 'pricedrop')    return `Price Drop in ${input?.location || 'Unknown'}`
    if (type === 'videoscript')  return `Video Script in ${input?.location || 'Unknown'}`
    if (type === 'bio')          return `Bio for ${input?.agentName || 'Agent'}`
    if (type === 'leadmagnet')   return `${input?.topic || 'Content'} for ${input?.targetAudience || 'Audience'}`
    return 'Generation'
  }

  const tc = generation ? (TYPE_COLORS[generation.type] || { bg: 'rgba(255,255,255,0.08)', text: '#7A90A8' }) : {}

  return (
    <>
      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .gdp-scrollbar::-webkit-scrollbar { width: 5px; }
        .gdp-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .gdp-scrollbar::-webkit-scrollbar-thumb { background: rgba(196,163,92,0.20); border-radius: 3px; }
      `}</style>

      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.55)',
        zIndex: 40,
        transition: 'opacity 0.3s ease',
        opacity: generation ? 1 : 0,
        pointerEvents: generation ? 'auto' : 'none',
      }} />

      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0,
        height: '100vh', width: '100%', maxWidth: '520px',
        background: '#0D1D35',
        borderLeft: '1px solid rgba(196,163,92,0.18)',
        zIndex: 50,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        transform: generation ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease',
        animation: generation ? 'slideIn 0.25s ease-out' : 'none',
        fontFamily: "'DM Sans', sans-serif",
      }}>

        {/* Header */}
        <div style={{
          flexShrink: 0, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          padding: '18px 20px',
          borderBottom: '1px solid rgba(196,163,92,0.12)',
        }}>
          <div style={{ flex: 1, minWidth: 0, paddingRight: '12px' }}>
            {generation && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{
                    fontSize: '11px', fontWeight: 700,
                    padding: '3px 10px', borderRadius: '100px',
                    background: tc.bg, color: tc.text,
                  }}>
                    {TYPE_LABELS[generation.type] || generation.type}
                  </span>
                </div>
                <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#F5EDD8', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {getTitle(generation.type, generation.input)}
                </h2>
                <p style={{ fontSize: '11px', color: '#4A5E78', margin: 0 }}>
                  {formatDate(generation.created_at)}
                </p>
              </>
            )}
          </div>
          <button onClick={onClose} style={{
            flexShrink: 0, background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(196,163,92,0.15)',
            borderRadius: '8px', padding: '6px 10px',
            cursor: 'pointer', color: '#5A6E85', fontSize: '16px', lineHeight: 1,
          }}>✕</button>
        </div>

        {/* Input details */}
        {generation?.input && (
          <div style={{
            flexShrink: 0, padding: '14px 20px',
            borderBottom: '1px solid rgba(196,163,92,0.10)',
            background: 'rgba(255,255,255,0.02)',
          }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#4A5E78', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>
              Input Details
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {Object.entries(generation.input)
                .filter(([, v]) => v && String(v).trim() !== '')
                .map(([key, value]) => (
                  <div key={key} style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '10px', color: '#4A5E78', margin: '0 0 2px', textTransform: 'capitalize' }}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: '#A8B8C8', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {String(value)}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Output */}
        <div className="gdp-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, color: '#4A5E78', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>
            AI Output
          </p>
          {generation?.output ? (
            <div style={{
              whiteSpace: 'pre-wrap', fontSize: '14px', color: '#E8DFC8',
              lineHeight: 1.75, background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(196,163,92,0.10)',
              borderRadius: '12px', padding: '16px',
            }}>
              {generation.output}
            </div>
          ) : (
            <p style={{ fontSize: '13px', color: '#4A5E78', fontStyle: 'italic' }}>No output available.</p>
          )}
        </div>

        {/* Footer */}
        <div style={{
          flexShrink: 0, padding: '14px 20px',
          borderTop: '1px solid rgba(196,163,92,0.12)',
        }}>
          <button onClick={handleCopy} style={{
            width: '100%', padding: '12px',
            fontSize: '14px', fontWeight: 700,
            borderRadius: '50px', border: 'none', cursor: 'pointer',
            background: copied ? 'rgba(196,163,92,0.15)' : '#C4A35C',
            color: copied ? '#C4A35C' : '#0B1628',
            border: copied ? '1px solid rgba(196,163,92,0.40)' : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'all 0.2s ease', fontFamily: 'inherit',
          }}>
            {copied ? (
              <><svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Copied!</>
            ) : (
              <><svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> Copy Output</>
            )}
          </button>
        </div>
      </div>
    </>
  )
}