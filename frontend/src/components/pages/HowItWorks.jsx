import { useEffect, useState } from "react";
import { howItWorksStyles as styles } from "./HowItWorks.style";

function HowItWorks() {
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes float {
        0% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0); }
      }

      @keyframes flow {
        from { background-position: 0% 50%; }
        to { background-position: 200% 50%; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <section style={styles.wrapper}>
      <h2 style={styles.heading}>How it works</h2>
      <p style={styles.subheading}>
        Understand official government documents in three simple steps
      </p>

      <div style={styles.steps}>
        {/* animated line */}
        <div style={styles.connector} />

        {/* STEP 1 */}
        <div
          style={{
            ...styles.card,
            ...(hovered === 1 ? styles.cardHover : {}),
            animationDelay: "0s",
          }}
          onMouseEnter={() => setHovered(1)}
          onMouseLeave={() => setHovered(null)}
        >
          <div style={styles.icon}>📄</div>
          <h4 style={styles.title}>Upload Document</h4>
          <p style={styles.desc}>
            Upload notices, schemes, PDFs or official government letters.
          </p>
        </div>

        {/* STEP 2 */}
        <div
          style={{
            ...styles.card,
            ...(hovered === 2 ? styles.cardHover : {}),
            animationDelay: "0.3s",
          }}
          onMouseEnter={() => setHovered(2)}
          onMouseLeave={() => setHovered(null)}
        >
          <div style={styles.icon}>🌐</div>
          <h4 style={styles.title}>Choose Language</h4>
          <p style={styles.desc}>
            Select the language you are most comfortable understanding.
          </p>
        </div>

        {/* STEP 3 */}
        <div
          style={{
            ...styles.card,
            ...(hovered === 3 ? styles.cardHover : {}),
            animationDelay: "0.6s",
          }}
          onMouseEnter={() => setHovered(3)}
          onMouseLeave={() => setHovered(null)}
        >
          <div style={styles.icon}>🔊</div>
          <h4 style={styles.title}>Get Explanation</h4>
          <p style={styles.desc}>
            Read or listen to a clear, simplified explanation instantly.
          </p>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
