export const responseCardStyles = {
  wrapper: {
    marginTop: "36px",
    display: "flex",
    justifyContent: "center",
  },

  card: {
    width: "100%",
    maxWidth: "920px",
    margin: "0 auto",
    background:
      "linear-gradient(180deg, rgba(31,31,31,0.95), rgba(17,17,17,0.95))",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "24px 26px",
    fontFamily: "'Inter', system-ui, sans-serif",
    boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
  },

  /* ================= HEADER ================= */

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "6px",
  },

  title: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#f1f5f9",
    letterSpacing: "0.2px",
  },

  langBadge: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#cbd5f5",
    background: "rgba(148,163,184,0.12)",
    padding: "4px 10px",
    borderRadius: "999px",
  },

  /* ================= DIVIDER ================= */

  gradientDivider: {
    height: "1px",
    width: "100%",
    margin: "14px 0 18px",
    background:
      "linear-gradient(90deg, transparent, rgba(148,163,184,0.35), transparent)",
  },

  /* ================= TEXT ================= */

  text: {
    fontSize: "15.5px",
    lineHeight: "1.8",
    color: "#e5e7eb",
    whiteSpace: "pre-wrap",
    letterSpacing: "0.1px",
  },

  /* ================= AUDIO BAR ================= */

  audioBar: {
    marginTop: "22px",
    padding: "14px 16px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  playBtn: {
    border: "none",
    background: "rgba(255,255,255,0.08)",
    color: "#f8fafc",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    fontSize: "16px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.15s ease, background 0.15s ease",
  },

  progress: {
    flex: 1,
    cursor: "pointer",
  },

  time: {
    fontSize: "12.5px",
    color: "#9ca3af",
    minWidth: "90px",
    textAlign: "center",
  },

  speedBtn: {
    border: "none",
    background: "rgba(255,255,255,0.08)",
    color: "#e5e7eb",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12.5px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.15s ease, transform 0.15s ease",
  },
};
