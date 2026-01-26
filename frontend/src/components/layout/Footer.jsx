import { useEffect, useRef, useState } from "react";

function Footer() {
  const footerRef = useRef(null);
  const [visible, setVisible] = useState(false);

  // 👀 Fade in when footer enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={footerRef}
      style={{
        ...styles.footer,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
      }}
    >
      <div style={styles.inner}>
        {/* Left */}
        <div style={styles.left}>
          <h3 style={styles.brand}>SamajhAI</h3>

          <p style={styles.tagline}>
            Making official documents easy to understand using AI.
          </p>

          <p style={styles.problem}>
            Helping citizens understand complex government documents through AI.
          </p>
        </div>

        {/* Center */}
        <div style={styles.center}>
          <span>
            Built by <strong>Team SamajhAI</strong> with{" "}
            <span style={styles.heart}>❤️</span>
          </span>
        </div>
      </div>
    </footer>
  );
}

const styles = {
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
    maxWidth: "400px",
  },

  brand: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "800",
    letterSpacing: "-0.015em",
    background: "linear-gradient(90deg, #069494, #FF8243)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  tagline: {
    marginTop: "8px",
    lineHeight: "1.5",
    color: "#e5e7eb",
  },

  problem: {
    marginTop: "6px",
    fontSize: "13.5px",
    lineHeight: "1.6",
    color: "#cbd5f5",
    opacity: 0.9,
  },

  center: {
    fontSize: "13px",
    opacity: 0.85,
    color: "#FCE883",
  },

  heart: {
    color: "#FF8243",
  },
};

export default Footer;
