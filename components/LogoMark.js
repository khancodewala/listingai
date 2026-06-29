export default function LogoMark({ size = 'md', theme = 'dark' }) {
  const sizes = {
    sm: { box: 28 },
    md: { box: 40 },
    lg: { box: 56 },
  };

  const { box } = sizes[size] || sizes.md;

  const navy = theme === 'dark' ? '#0a1628' : '#ffffff';
  const shape = theme === 'dark' ? '#ffffff' : '#0f1c3f';
  const gold = '#C9952A';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <svg
        width={box}
        height={box}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="80" height="80" rx="14" fill={navy} />
        <rect x="14" y="42" width="8" height="24" rx="1.5" fill={shape} />
        <rect x="14" y="58" width="36" height="8" rx="1.5" fill={shape} />
        <rect x="42" y="48" width="8" height="18" rx="1.5" fill={shape} />
        <polygon points="10,46 39,14 68,46" fill={shape} />
        <polygon points="17,43 39,22 61,43" fill={navy} />
        <rect x="52" y="16" width="7" height="16" rx="1.5" fill={shape} />
        <rect x="31" y="22" width="14" height="14" rx="2" fill={gold} transform="rotate(45 38 29)" />
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{
          fontFamily: 'Georgia, serif',
          fontWeight: 700,
          fontSize: box * 0.52 + 'px',
          color: theme === 'dark' ? '#ffffff' : '#0f1c3f',
          letterSpacing: '0.5px',
        }}>
          Listing<span style={{ color: gold }}>AI</span>
        </span>
        {size !== 'sm' && (
          <span style={{
            fontFamily: 'Arial, sans-serif',
            fontSize: '8.5px',
            letterSpacing: '2px',
            color: '#A8B8C8',
            marginTop: '3px',
          }}>
            REAL ESTATE CONTENT
          </span>
        )}
      </div>
    </div>
  );
}