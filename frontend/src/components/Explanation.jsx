import { useEffect } from "react";

function ExplanationCard({ confidence, confidenceLevel }) {
  /* inject animations once */
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fadeUp {
        from {
          opacity: 0;
          transform: translateY(18px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes pulseDot {
        0% { transform: scale(1); opacity: 0.9; }
        50% { transform: scale(1.5); opacity: 0.4; }
        100% { transform: scale(1); opacity: 0.9; }
      }

      @keyframes thinking {
        0% { opacity: 0.3; }
        50% { opacity: 1; }
        100% { opacity: 0.3; }
      }

      @keyframes glowBar {
        0% { opacity: 0.3; }
        50% { opacity: 0.9; }
        100% { opacity: 0.3; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const dotColor =
    confidenceLevel === "High"
      ? "#22c55e"
      : confidenceLevel === "Medium"
      ? "#facc15"
      : "#ef4444";

  return (
    <section style={styles.wrapper}>
      <div style={styles.card}>
        {/* LEFT GLOW BAR */}
        <div style={styles.glowBar} />

        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <h3 style={styles.title}>📄 Document Explanation</h3>

            {/* AI THINKING */}
            <div style={styles.aiThinking}>
              <span style={{ ...styles.thinkDot, animationDelay: "0s" }} />
              <span style={{ ...styles.thinkDot, animationDelay: "0.2s" }} />
              <span style={{ ...styles.thinkDot, animationDelay: "0.4s" }} />
              <span style={styles.aiText}>SamajhAI is explaining</span>
            </div>
          </div>

          {confidence && (
            <div style={styles.confidenceWrap}>
              <span
                style={{
                  ...styles.dot,
                  backgroundColor: dotColor,
                }}
              />
              <span
                style={{
                  ...styles.badge,
                  ...(confidenceLevel === "High"
                    ? styles.high
                    : confidenceLevel === "Medium"
                    ? styles.medium
                    : styles.low),
                }}
              >
                {confidence}% • {confidenceLevel}
              </span>
            </div>
          )}
        </div>

        {/* SUMMARY */}
        <div style={{ ...styles.section, animationDelay: "0.1s" }}>
          <h4 style={styles.sectionTitle}>✨ Simplified Summary</h4>
          <ul style={styles.list}>
            <li>Issued by a government authority</li>
            <li>Related to a public welfare or service scheme</li>
            <li>May require action or safe record keeping</li>
          </ul>
        </div>

        {/* DETAILS */}
        <div style={{ ...styles.section, animationDelay: "0.25s" }}>
          <h4 style={styles.sectionTitle}>🧠 Detailed Explanation</h4>
          <p style={styles.text}>
            This document contains official information meant for citizens.
            SamajhAI has simplified the language so you can clearly understand
            its purpose, eligibility, and what steps (if any) you should take.
          </p>

          <p style={styles.text}>
            Always double-check important details like names, dates, amounts,
            and deadlines with the original document.
          </p>
        </div>

        {/* ACTIONS */}
        <div style={{ ...styles.actions, animationDelay: "0.4s" }}>
          <button style={styles.actionBtn}>🔊 Listen</button>
          <button style={styles.actionBtn}>📋 Copy</button>
          <button style={styles.verifyBtn}>⚠ Verify Info</button>
        </div>
      </div>
    </section>
  );
}

const styles = {
  wrapper: {
    marginTop: "64px",
    display: "flex",
    justifyContent: "center",
    padding: "0 24px",
  },

  card: {
    position: "relative",
    width: "100%",
    maxWidth: "900px",
    background:
      "linear-gradient(180deg, rgba(15,23,42,0.96), rgba(2,6,23,0.96))",
    border: "1px solid #1f2937",
    borderRadius: "22px",
    padding: "32px 30px",
    color: "#e5e7eb",
    boxShadow: "0 50px 120px rgba(0,0,0,0.55)",
    animation: "fadeUp 0.5s ease both",
    overflow: "hidden",
  },

  glowBar: {
    position: "absolute",
    left: 0,
    top: "20%",
    width: "4px",
    height: "60%",
    background:
      "linear-gradient(180deg, transparent, #0f766e, transparent)",
    animation: "glowBar 2.5s ease-in-out infinite",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "14px",
    marginBottom: "28px",
  },

  title: {
    margin: 0,
    fontSize: "21px",
    fontWeight: "700",
    letterSpacing: "0.4px",
  },

  aiThinking: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginTop: "6px",
  },

  thinkDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#38bdf8",
    animation: "thinking 1.4s infinite",
  },

  aiText: {
    fontSize: "12px",
    color: "#7dd3fc",
    marginLeft: "6px",
  },

  confidenceWrap: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  dot: {
    width: "9px",
    height: "9px",
    borderRadius: "50%",
    animation: "pulseDot 1.6s ease-in-out infinite",
  },

  badge: {
    padding: "6px 14px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "500",
  },

  high: {
    backgroundColor: "rgba(16,185,129,0.15)",
    color: "#6ee7b7",
  },

  medium: {
    backgroundColor: "rgba(245,158,11,0.15)",
    color: "#fde68a",
  },

  low: {
    backgroundColor: "rgba(239,68,68,0.15)",
    color: "#fecaca",
  },

  section: {
    marginBottom: "26px",
    animation: "fadeUp 0.5s ease both",
  },

  sectionTitle: {
    fontSize: "15px",
    fontWeight: "600",
    marginBottom: "10px",
    color: "#cbd5f5",
  },

  list: {
    paddingLeft: "18px",
    lineHeight: "1.8",
    color: "#9ca3af",
    fontSize: "14px",
  },

  text: {
    fontSize: "14.5px",
    lineHeight: "1.8",
    color: "#9ca3af",
    marginBottom: "10px",
  },

  actions: {
    display: "flex",
    gap: "12px",
    marginTop: "22px",
    flexWrap: "wrap",
    animation: "fadeUp 0.5s ease both",
  },

  actionBtn: {
    padding: "11px 18px",
    borderRadius: "12px",
    backgroundColor: "#1f2937",
    border: "1px solid #334155",
    color: "#e5e7eb",
    cursor: "pointer",
    fontSize: "14px",
    transition: "transform 0.15s ease, background 0.15s ease",
  },

  verifyBtn: {
    padding: "11px 18px",
    borderRadius: "12px",
    backgroundColor: "transparent",
    border: "1px dashed #f59e0b",
    color: "#fde68a",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default ExplanationCard;
