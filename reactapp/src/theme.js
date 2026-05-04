// Shared design tokens — import this in every page
export const T = {
  bg:           "#0A0F1E",
  bgCard:       "rgba(255,255,255,0.04)",
  bgCardHover:  "rgba(255,255,255,0.08)",
  border:       "rgba(255,255,255,0.08)",
  borderHover:  "rgba(255,255,255,0.18)",
  primary:      "#2563EB",
  primaryHover: "#1D4ED8",
  accent:       "#F5A623",
  accentSoft:   "rgba(245,166,35,0.15)",
  success:      "#10B981",
  successSoft:  "rgba(16,185,129,0.15)",
  warning:      "#F59E0B",
  warningSoft:  "rgba(245,158,11,0.15)",
  danger:       "#EF4444",
  dangerSoft:   "rgba(239,68,68,0.15)",
  textPrimary:  "#F1F5F9",
  textSecondary:"#94A3B8",
  textMuted:    "#475569",
  shadow:       "0 4px 24px rgba(0,0,0,0.4)",
  shadowHover:  "0 8px 40px rgba(0,0,0,0.6)",
  font:         "'Inter', 'Poppins', sans-serif",
  gradientBlue: "linear-gradient(135deg, #1e3a8a 0%, #2563EB 100%)",
  gradientGold: "linear-gradient(135deg, #92400e 0%, #F5A623 100%)",
  gradientCard: "linear-gradient(135deg, rgba(37,99,235,0.15) 0%, rgba(245,166,35,0.05) 100%)",
};

export const glass = {
  background:   "rgba(255,255,255,0.04)",
  backdropFilter: "blur(20px)",
  border:       "1px solid rgba(255,255,255,0.08)",
  borderRadius: 16,
};

export const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export const cardVariants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  hover:   { y: -4, transition: { duration: 0.2 } },
};

export const listVariants = {
  animate: { transition: { staggerChildren: 0.06 } },
};

export const itemVariants = {
  initial: { opacity: 0, x: -12 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};
