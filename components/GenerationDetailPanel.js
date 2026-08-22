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

// Light-theme badge colors — tinted backgrounds, saturated text for contrast on white
const TYPE_COLORS = {
  listing:      { bg: '#EAF2F6', text: '#185F85' }, // blue
  social:       { bg: '#F3EEFA', text: '#7A5CB8' }, // purple
  email:        { bg: '#EDF5EF', text: '#3F7A5C' }, // sage
  contract:     { bg: '#FBF3E6', text: '#B8791F' }, // amber
  openhouse:    { bg: '#FBEAEA', text: '#B84B4B' }, // warm red
  neighborhood: { bg: '#EAF6F4', text: '#2E8A7D' }, // teal
  pricedrop:    { bg: '#FCEFE4', text: '#C1671F' }, // orange
  videoscript:  { bg: '#EEF0FB', text: '#5A5FC7' }, // indigo
  bio:          { bg: '#FBEAF2', text: '#B8477F' }, // rose
  leadmagnet:   { bg: '#EBF6EC', text: '#3F8A4C' }, // green
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

  const tc = generation ? (TYPE_COLORS[generation.type] || { bg: '#F0F0EE', text: '#55606A' }) : {}

  return (
    <>
      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .gdp-scrollbar::-webkit-scrollbar { width: 5px; }
        .gdp-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .gdp-scrollbar::-webkit-scrollbar-thumb { background: rgba(24,95,133,0.20); border-radius: 3px; }
      `}</style>

      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0,
        background: 'rgba(20,25,35,0.45)',
        zIndex: 40,
        transition: 'opacity 0.3s ease',
        opacity: generation ? 1 : 0,
        pointerEvents: generation ? 'auto' : 'none',
      }} />

      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0,
        height: '100vh', width: '100%', maxWidth: '520px',
        background: '#FFFFFF',
        borderLeft: '1px solid rgba(24,95,133,0.14)',
        boxShadow: '-8px 0 24px rgba(20,30,40,0.08)',
        zIndex: 50,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        transform: generation ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease',
        animation: generation ? 'slideIn 0.25s ease-out' : 'none',
        fontFamily: "var(--font-dm-sans)",
      }}>

        {/* Header */}
        <div style={{
          flexShrink: 0, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          padding: '18px 20px',
          borderBottom: '1px solid rgba(24,95,133,0.10)',
          background: '#FAF8F2',
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
                <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1A2B3C', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {getTitle(generation.type, generation.input)}
                </h2>
                <p style={{ fontSize: '11px', color: '#55606A', margin: 0 }}>
                  {formatDate(generation.created_at)}
                </p>
              </>
            )}
          </div>
          <button onClick={onClose} style={{
            flexShrink: 0, background: '#FFFFFF',
            border: '1px solid rgba(24,95,133,0.18)',
            borderRadius: '8px', padding: '6px 10px',
            cursor: 'pointer', color: '#55606A', fontSize: '16px', lineHeight: 1,
          }}>✕</button>
        </div>

        {/* Input details */}
        {generation?.input && (
          <div style={{
            flexShrink: 0, padding: '14px 20px',
            borderBottom: '1px solid rgba(24,95,133,0.08)',
            background: '#f7f6f3',
          }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#55606A', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>
              Input Details
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {Object.entries(generation.input)
                .filter(([, v]) => v && String(v).trim() !== '')
                .map(([key, value]) => (
                  <div key={key} style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '10px', color: '#55606A', margin: '0 0 2px', textTransform: 'capitalize' }}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: '#1A2B3C', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {String(value)}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Output */}
        <div className="gdp-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', background: '#FFFFFF' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, color: '#55606A', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>
            AI Output
          </p>
          {generation?.output ? (
            <div style={{
              whiteSpace: 'pre-wrap', fontSize: '14px', color: '#2A3B4C',
              lineHeight: 1.75, background: '#f7f6f3',
              border: '1px solid rgba(24,95,133,0.10)',
              borderRadius: '12px', padding: '16px',
            }}>
              {generation.output}
            </div>
          ) : (
            <p style={{ fontSize: '13px', color: '#55606A', fontStyle: 'italic' }}>No output available.</p>
          )}
        </div>

        {/* Footer */}
        <div style={{
          flexShrink: 0, padding: '14px 20px',
          borderTop: '1px solid rgba(24,95,133,0.10)',
          background: '#FAF8F2',
        }}>
          <button onClick={handleCopy} style={{
            width: '100%', padding: '12px',
            fontSize: '14px', fontWeight: 700,
            borderRadius: '50px', cursor: 'pointer',
            background: copied ? '#EAF2F6' : '#185F85',
            color: copied ? '#185F85' : '#FFFFFF',
            border: copied ? '1px solid rgba(24,95,133,0.35)' : 'none',
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