export const heroStyles = {
  /* ================= ROOT ================= */

  hero: {
    position: "relative",
    padding: "130px 24px 140px",
    maxWidth: "1100px",
    margin: "0 auto",
    fontFamily: "'Inter', system-ui, sans-serif",
    textAlign: "center",
    overflow: "hidden",
  },

  /* ================= BACKGROUND OVERLAY ================= */

  bgOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(2, 6, 23, 0.65)",
    zIndex: 1,
  },

  /* ================= CONTENT ================= */

  contentWrap: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "filter 0.35s ease, opacity 0.35s ease",
  },

  blurred: {
    filter: "blur(4px)",
    opacity: 0.6,
    pointerEvents: "none",
  },

  /* ================= TITLE ================= */

  titleWrap: {
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "10px",
  },

  title: {
    fontSize: "62px",
    fontWeight: "900",
    lineHeight: "1.05",
    letterSpacing: "-0.03em",
    background: "linear-gradient(120deg, #f8fafc, #94a3b8, #f8fafc)",
    backgroundSize: "200% 200%",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  titleUnderline: {
    width: "100%",
    height: "4px",
    marginTop: "14px",
    borderRadius: "999px",
    background:
      "linear-gradient(90deg, #FF9933, #ffffff, #138808, #FF9933)",
    backgroundSize: "300% 100%",
    animation: "tricolorFlow 6s linear infinite",
  },

  /* ================= TEXT ================= */

  description: {
    color: "#9ca3af",
    marginTop: "22px",
    maxWidth: "760px",
    fontSize: "16.5px",
    lineHeight: "1.7",
  },

  actionHint: {
    marginTop: "30px",
    marginBottom: "18px",
    fontSize: "15px",
    color: "#cbd5f5",
    fontWeight: "500",
    letterSpacing: "0.2px",
  },

  /* ================= SEARCH BAR ================= */

  searchWrap: {
    width: "100%",
    maxWidth: "920px",
    display: "flex",
    gap: "12px",
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "8px",
    marginTop: "10px",
    alignItems: "center",
    boxShadow:
      "0 30px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.6)",
    transition: "box-shadow 0.25s ease, transform 0.25s ease",
  },

  searchWrapFocus: {
    boxShadow:
      "0 0 0 2px rgba(15,118,110,0.35), 0 35px 70px rgba(0,0,0,0.45)",
    transform: "translateY(-2px)",
  },

  /* ================= MIC ================= */

  micBtn: {
    width: "54px",
    height: "54px",
    borderRadius: "14px",
    border: "none",
    backgroundColor: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "transform 0.2s ease",
  },

  micBtnHover: {
    transform: "scale(1.1)",
    boxShadow: "0 0 0 8px rgba(15,118,110,0.12)",
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
    height: "24px",
  },

  languageSelect: {
    border: "1.5px solid #0f766e",
    borderRadius: "10px",
    padding: "9px 14px",
    backgroundColor: "#ffffff",
    color: "#0f172a",
    fontSize: "14px",
    cursor: "pointer",
  },

  uploadBtn: {
    padding: "12px 26px",
    fontSize: "14px",
    backgroundColor: "#0f766e",
    border: "none",
    borderRadius: "14px",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },

  uploadBtnHover: {
    transform: "translateY(-1px)",
    boxShadow: "0 10px 20px rgba(15,118,110,0.35)",
  },

  /* ================= LOADING OVERLAY ================= */

  loadingWrap: {
    position: "absolute",
    inset: 0,
    zIndex: 4,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(2, 6, 23, 0.65)",
    pointerEvents: "none",
  },

  spinnerWrap: {
    marginBottom: "8px",
  },

  spinner: {
    width: "46px",
    height: "46px",
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
};
