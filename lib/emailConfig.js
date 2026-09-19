// Single source of truth for the "from" address on every transactional email
// sent through Resend. The domain must stay verified in Resend
// (joinlistingai.com), otherwise sends will be rejected.
export const EMAIL_FROM = 'ListingAI <noreply@joinlistingai.com>';