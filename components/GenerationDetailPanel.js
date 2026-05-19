'use client'
import { useEffect, useState } from 'react'

export default function GenerationDetailPanel({ generation, onClose }) {
  const [copied, setCopied] = useState(false)

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Lock body scroll when open
  useEffect(() => {
    if (generation) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [generation])

  const handleCopy = () => {
    if (!generation?.output) return
    navigator.clipboard.writeText(generation.output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (ts) =>
    new Date(ts).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

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

  const getTitle = (type, input) => {
    if (type === 'listing') return `${input?.propertyType || 'Property'} in ${input?.location || 'Unknown'}`
    if (type === 'social') return `${input?.propertyType || 'Property'} — ${input?.location || 'Unknown'}`
    if (type === 'email') return `Email to ${input?.buyerName || 'Buyer'}`
    if (type === 'contract') return 'Contract Summary'
    return 'Generation'
  }

  return (
    <>
      {/* Backdrop — starts below navbar */}
      <div
        onClick={onClose}
        className={`fixed inset-0 top-16 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          generation ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Slide-over panel — starts below navbar */}
      <div
        className={`fixed top-16 right-0 h-[calc(100vh-4rem)] w-full max-w-xl bg-white shadow-2xl z-50
          transform transition-transform duration-300 ease-in-out flex flex-col overflow-hidden
          ${generation ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-start justify-between px-6 py-5 border-b border-gray-100 bg-white">
          <div className="flex-1 min-w-0 pr-4">
            {generation && (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${TYPE_COLORS[generation.type] || 'bg-gray-100 text-gray-600'}`}>
                    {TYPE_LABELS[generation.type] || generation.type}
                  </span>
                </div>
                <h2 className="text-base font-semibold text-gray-900 truncate">
                  {getTitle(generation.type, generation.input)}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatDate(generation.created_at)}
                </p>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
            aria-label="Close panel"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Input Section */}
        {generation?.input && (
          <div className="flex-shrink-0 px-6 py-4 border-b border-gray-100 bg-gray-50">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Input Details</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(generation.input)
                .filter(([, v]) => v && String(v).trim() !== '')
                .map(([key, value]) => (
                  <div key={key} className="min-w-0">
                    <p className="text-xs text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    <p className="text-sm text-gray-700 font-medium truncate">{String(value)}</p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Output body — only scrollable section */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">AI Output</p>
          {generation?.output ? (
            <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100">
              {generation.output}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">No output available.</p>
          )}
        </div>

        {/* Footer — copy button */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 bg-white">
          <button
            onClick={handleCopy}
            className={`w-full py-2.5 px-4 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2
              ${copied
                ? 'bg-green-500 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Output
              </>
            )}
          </button>
        </div>
      </div>
    </>
  )
}