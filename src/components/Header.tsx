import React from "react";

const Header: React.FC = () => (
  <header style={styles.header}>
    <div style={styles.logoWrap}>
      <svg viewBox="0 0 26 26" fill="none" width={26} height={26}>
        <path d="M13 3C8 3 4 7 4 12c0 4 2.5 7.5 6 9"  stroke="#7ab648" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M13 3c5 0 9 4 9 9 0 4-2.5 7.5-6 9"   stroke="#4a7c23" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="13" cy="20" r="3" fill="#c8941a" />
        <path d="M13 3v10"   stroke="#7ab648" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
        <path d="M7 10l6 3 6-3" stroke="#4a7c23" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
    <div>
      <h1 style={styles.title}>Krishi-Route</h1>
      <p style={styles.subtitle}>Profit &amp; Logistics Optimizer · किसान का मार्गदर्शक</p>
    </div>
    <div style={styles.badge}>MVP v1.0 · TypeScript</div>
  </header>
);

export default Header;

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "1.25rem 0",
    borderBottom: "1px solid rgba(0,0,0,0.10)",
    marginBottom: "2rem",
  },
  logoWrap: {
    width: 46,
    height: 46,
    background: "#2d5016",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  title: {
    fontFamily: "'Tiro Devanagari Hindi', serif",
    fontSize: 24,
    color: "#2d5016",
    fontWeight: 400,
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: 11,
    color: "#6b6b6b",
    marginTop: 3,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  badge: {
    marginLeft: "auto",
    background: "#edf5e1",
    color: "#4a7c23",
    fontSize: 11,
    fontWeight: 600,
    padding: "4px 10px",
    borderRadius: 20,
    border: "1px solid rgba(74,124,35,0.25)",
    letterSpacing: "0.04em",
    whiteSpace: "nowrap" as const,
  },
};
