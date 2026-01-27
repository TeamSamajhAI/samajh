export const heroStyles = {
  hero: {
    position: "relative",
    padding: "110px 24px 120px",
    maxWidth: "1000px",
    margin: "0 auto",
    fontFamily: "'Inter', system-ui, sans-serif",
    textAlign: "center",
  },

  animatedBg: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(120deg, #020617, #0f766e, #020617)",
    backgroundSize: "300% 300%",
    animation: "bgMove 20s ease infinite",
    zIndex: -2,
  },

  /* ================= CONTENT ================= */

  contentWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "filter 0.4s ease, opacity 0.4s ease",
  },

  blurred: {
    filter: "blur(6px)",
    opacity: 0.35,
    pointerEvents: "none",
  },

  /* ================= TITLE ================= */

  titleWrap: {
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "center",
  },

  title: {
    fontSize: "58px",
    fontWeight: "900",
    lineHeight: "1.1",
    letterSpacing: "-0.02em",
    background: "linear-gradient(90deg, #f8fafc, #94a3b8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  titleUnderline: {
    width: "100%",
    height: "4px",
    marginTop: "10px",
    background: "linear-gradient(90deg, #FF9933, #ffffff, #138808)",
    animation: "glowPulse 3s ease-in-out infinite",
  },

  /* ================= TEXT ================= */

  description: {
    color: "#9ca3af",
    marginTop: "18px",
    maxWidth: "720px",
    fontSize: "16px",
    lineHeight: "1.6",
  },

  trustLine: {
    marginTop: "10px",
    fontSize: "13px",
    color: "#86efac",
    opacity: 0.9,
  },

  actionHint: {
    marginTop: "26px",
    marginBottom: "14px",
    fontSize: "14px",
    color: "#cbd5f5",
    fontWeight: "500",
  },

  /* ================= SEARCH BAR ================= */

  searchWrap: {
    width: "100%",
    maxWidth: "900px",
    display: "flex",
    gap: "12px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "5px",
    marginTop: "6px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
    alignItems: "center",
    transition: "box-shadow 0.25s ease, transform 0.25s ease",
  },

  searchWrapFocus: {
    boxShadow: "0 0 0 2px rgba(15,118,110,0.35)",
    transform: "translateY(-1px)",
  },

  /* ================= MIC ================= */

  micBtn: {
    width: "52px",
    height: "52px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },

  micBtnHover: {
    transform: "scale(1.08)",
    boxShadow: "0 0 0 6px rgba(15,118,110,0.12)",
  },

  micActive: {
    animation: "micPulse 1.4s ease-out infinite",
  },

  micIcon: {
    width: "26px",
    height: "26px",
    fill: "#0f766e",
  },

  /* ================= INPUT ================= */

  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "16px",
    color: "#0f172a",
    height: "18px",
    lineHeight: "18px",
    padding: "0px",
  },

  languageSelect: {
    border: "1.5px solid #0f766e",
    borderRadius: "8px",
    padding: "8px 12px",
    backgroundColor: "#ffffff",
    color: "#0f172a",
    fontSize: "14px",
    cursor: "pointer",
    outline: "none",
  },

  uploadBtn: {
    padding: "10px 22px",
    fontSize: "14px",
    backgroundColor: "#0f766e",
    border: "none",
    borderRadius: "10px",
    color: "white",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },

  helperText: {
    marginTop: "10px",
    fontSize: "13px",
    color: "#9ca3af",
  },

  /* ================= TRENDING ================= */

  trendingWrap: {
    marginTop: "28px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  trendingLabel: {
    color: "#9ca3af",
    fontSize: "13px",
  },

  trendingBtn: {
    padding: "6px 14px",
    border: "1px solid #334155",
    borderRadius: "999px",
    background: "transparent",
    color: "#cbd5f5",
    cursor: "pointer",
    fontSize: "13px",
    transition: "transform 0.15s ease",
  },

  /* ================= LOADING ================= */

  loadingWrap: {
    marginTop: "18px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  spinnerWrap: {
    marginBottom: "6px",
  },

  spinner: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    border: "4px solid rgba(15,118,110,0.25)",
    borderTopColor: "#0f766e",
    animation: "spin 0.9s linear infinite",
  },

  spinnerPercent: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#e5e7eb",
    marginBottom: "6px",
  },

  analysingText: {
    color: "#9ca3af",
    fontSize: "14px",
  },

  /* ================= STATUS ================= */
  /* ================= CONFIDENCE INDICATOR ================= */

confidenceIndicator: {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "15px",
  color: "#cbd5f5",
},

confidenceDot: {
  width: "10px",
  height: "10px",
  borderRadius: "50%",
},




  statusWrap: {
    marginTop: "34px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },

  successBox: {
    padding: "16px 26px",
    background: "rgba(15,118,110,0.18)",
    border: "1px solid rgba(45,212,191,0.5)",
    borderRadius: "12px",
    color: "#99f6e4",
    fontSize: "16px",
    fontWeight: "600",
    maxWidth: "560px",
  },

  confidenceWrap: {
    fontSize: "15px",
    color: "#cbd5f5",
  },

  lowConfidenceWarning: {
    padding: "12px 16px",
    backgroundColor: "rgba(127,29,29,0.15)",
    border: "1px solid rgba(239,68,68,0.4)",
    borderRadius: "10px",
    color: "#fecaca",
    maxWidth: "560px",
    fontSize: "14px",
  },
};
