function Navbar() {
  return (
    <nav style={styles.navbar}>
      {/* Left: Brand */}
      <div style={styles.brand}>
        <h2 style={styles.logo}   >SamajhAI</h2>
        <p style={styles.subtitle}>
          AI Voice Assistant for Understanding Official Documents
        </p>
      </div>

      {/* Center: Navigation */}
      <ul style={styles.navLinks}>
        <li style={styles.navItem} {...navItemHover}>Home</li>
        <li style={styles.navItem} {...navItemHover}>How It Works</li>
        <li style={styles.navItem} {...navItemHover}>Help</li>
      </ul>
    </nav>
  );
}

const styles = {
  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 36px",
    width: "100%",

    /* 🌟 LIGHT FROSTED GLASS */
    background: "rgba(255, 255, 255, 0.84)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    borderBottom: "1px solid rgba(15, 118, 110, 0.15)",

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
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: "-0.01em",
  },

  subtitle: {
    margin: "4px 0 0",
    fontSize: "12px",
    color: "#000000",
    lineHeight: "1.4",
  },

  navLinks: {
    display: "flex",
    listStyle: "none",
    gap: "30px",
    margin: 0,
    padding: 0,
    fontSize: "15px",
  },

  navItem: {
    cursor: "pointer",
    color: "#000000",
    fontWeight: "500",
    transition: "color 0.2s ease",
  },
};

/* Hover effects */
const navItemHover = {
  onMouseEnter: (e) => (e.target.style.color = "#0f766e"),
  onMouseLeave: (e) => (e.target.style.color = "#334155"),
};

export default Navbar;
