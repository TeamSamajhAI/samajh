import { navbarStyles as styles } from "./Navbar.style";

const navItemHover = {
  onMouseEnter: (e) => (e.target.style.color = "#5eead4"),
  onMouseLeave: (e) => (e.target.style.color = "#e5e7eb"),
};

function Navbar() {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav style={styles.navbar}>
      {/* Left: Brand */}
      <div style={styles.brand}>
        <h2 style={styles.logo}>SamajhAI</h2>
        <p style={styles.subtitle}>
          AI Voice Assistant for Understanding Official Documents
        </p>
      </div>

      {/* Navigation */}
      <ul style={styles.navLinks}>
        <li
          style={styles.navItem}
          {...navItemHover}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Home
        </li>

        <li
          style={styles.navItem}
          {...navItemHover}
          onClick={() => scrollToSection("how-it-works")}
        >
          How It Works
        </li>

       
      </ul>
    </nav>
  );
}

export default Navbar;
