export function Logo({ compact = false, dark = false }: { compact?: boolean; dark?: boolean }) {
  const ink = dark ? "#071226" : "#f7f9fc";
  return (
    <span className="brand-lockup" aria-label="Northstar Systems">
      <svg className="brand-mark" viewBox="0 0 42 42" role="img" aria-hidden="true">
        <path d="M21 2.5 24.4 17.6 39.5 21 24.4 24.4 21 39.5 17.6 24.4 2.5 21 17.6 17.6Z" fill={ink} />
        <circle cx="21" cy="21" r="4.4" fill="#2f7bff" />
        <circle cx="7.2" cy="9.2" r="1.7" fill="#5ddcff" />
        <circle cx="34.8" cy="32.8" r="1.7" fill="#5ddcff" />
        <path d="M8.5 10.5 17.8 18M24.2 24l9.2 7.5" stroke="#5ddcff" strokeWidth="1.2" />
      </svg>
      {!compact && <span className="brand-name">NORTHSTAR <em>SYSTEMS</em></span>}
    </span>
  );
}
