import { useEffect, useRef, useState } from "react";
import { footerStyles as styles } from "./Footer.style";

function Footer() {
  const footerRef = useRef(null);
  const [visible, setVisible] = useState(false);

  // Fade in when footer enters viewport
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
            An AI-powered platform for simplifying government documents.
          </p>

          <p style={styles.subtext}>
            Designed to help citizens clearly understand official information,
            schemes, and notices.
          </p>
        </div>

        {/* Right */}
        <div style={styles.right}>
          <span>
            Developed by <strong>Team SamajhAI</strong>
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
