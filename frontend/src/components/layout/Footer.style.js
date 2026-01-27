export const footerStyles = {
  footer: {
    marginTop: "80px",
    borderTop: "1px solid rgba(6,148,148,0.25)",
    background: `
      linear-gradient(
        to top,
        rgba(6,148,148,0.08),
        rgba(15,23,42,0.65)
      )
    `,
    backdropFilter: "blur(10px)",
    transition: "opacity 0.9s ease, transform 0.9s ease",
  },

  inner: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "28px 24px",
    display: "flex",
    flexWrap: "wrap",
    gap: "24px",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#9ca3af",
    fontSize: "14px",
  },

  left: {
    maxWidth: "420px",
  },

  brand: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "800",
    letterSpacing: "-0.015em",
    background: "linear-gradient(90deg, #069494, #5eead4)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  tagline: {
    marginTop: "8px",
    lineHeight: "1.5",
    color: "#e5e7eb",
    fontWeight: "500",
  },

  subtext: {
    marginTop: "6px",
    fontSize: "13.5px",
    lineHeight: "1.6",
    color: "#cbd5f5",
    opacity: 0.85,
  },

  right: {
    fontSize: "13px",
    color: "#9ca3af",
    opacity: 0.85,
    whiteSpace: "nowrap",
  },
};
