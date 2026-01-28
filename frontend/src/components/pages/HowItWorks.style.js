export const howItWorksStyles = {
  wrapper: {
    marginTop: "96px",
    padding: "0 24px",
    textAlign: "center",
    position: "relative",
  },

  heading: {
    fontSize: "30px",
    fontWeight: "900",
    letterSpacing: "-0.015em",
    lineHeight: "1.1",
    color: "#e5e7eb",
  },

  subheading: {
    marginTop: "14px",
    color: "#9ca3af",
    fontSize: "15.5px",
    maxWidth: "680px",
    marginInline: "auto",
    lineHeight: "1.65",
  },

  steps: {
    marginTop: "64px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "44px",
    maxWidth: "1040px",
    marginInline: "auto",
    position: "relative",
  },

  /* 🌟 animated connector line */
  connector: {
    position: "absolute",
    top: "50%",
    left: "8%",
    right: "8%",
    height: "2px",
    background:
      "linear-gradient(90deg, transparent, rgba(34,211,238,0.9), transparent)",
    backgroundSize: "200% 100%",
    animation: "flow 4s linear infinite",
    opacity: 0.45,
    pointerEvents: "none",
  },

  card: {
    background:
      "linear-gradient(180deg, rgba(2,6,23,0.95), rgba(2,6,23,0.75))",
    border: "1px solid rgba(148,163,184,0.15)",
    borderRadius: "20px",
    padding: "34px 26px",
    boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
    transition:
      "transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.45s ease, border-color 0.45s ease",
    animation: "float 5s ease-in-out infinite",
    position: "relative",
    backdropFilter: "blur(8px)",
  },

  cardHover: {
    transform: "translateY(-14px) scale(1.035)",
    boxShadow: "0 50px 110px rgba(34,211,238,0.28)",
    borderColor: "rgba(34,211,238,0.5)",
  },

  icon: {
    fontSize: "42px",
    marginBottom: "18px",
    filter: "drop-shadow(0 6px 12px rgba(34,211,238,0.25))",
  },

  title: {
    fontSize: "17px",
    fontWeight: "800",
    color: "#e5e7eb",
    marginBottom: "10px",
    letterSpacing: "0.2px",
  },

  desc: {
    fontSize: "14.5px",
    lineHeight: "1.7",
    color: "#9ca3af",
  },
};
