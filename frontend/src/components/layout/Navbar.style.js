export const navbarStyles = {
  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 32px",
    width: "100%",

    /* 🌙 Dark frosted glass */
    background: "rgba(2, 6, 23, 0.88)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    borderBottom: "1px solid rgba(15, 118, 110, 0.25)",

    position: "sticky",
    top: 0,
    zIndex: 50,
  },

  brand: {
    maxWidth: "360px",
  },

  logo: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "800",
    letterSpacing: "-0.015em",
    background: "linear-gradient(90deg, #0f766e, #5eead4)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subtitle: {
    margin: "4px 0 0",
    fontSize: "12px",
    color: "#cbd5f5",
    lineHeight: "1.45",
    opacity: 0.85,
  },

  navLinks: {
    display: "flex",
    alignItems: "center",
    listStyle: "none",
    gap: "28px",
    margin: 0,
    padding: 0,
    fontSize: "15px",
  },

  navItem: {
    cursor: "pointer",
    color: "#e5e7eb",
    fontWeight: "500",
    transition: "color 0.2s ease, opacity 0.2s ease",
  },

  /* Optional: active / focus state */
  navItemActive: {
    color: "#5eead4",
  },

  /* Optional: mobile helper (future use) */
  mobileHidden: {
    display: "none",
  },
};
