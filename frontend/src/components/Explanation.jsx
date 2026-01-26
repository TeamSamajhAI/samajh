function ExplanationCard({ confidence, confidenceLevel }) {
  return (
    <section style={styles.wrapper}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h3 style={styles.title}>📄 Document Explanation</h3>

          {confidence && (
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
              Confidence: {confidence}% ({confidenceLevel})
            </span>
          )}
        </div>

        {/* Summary */}
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Simplified Summary</h4>
          <ul style={styles.list}>
            <li>This document is issued by a government authority.</li>
            <li>It relates to a welfare / service scheme.</li>
            <li>You may need to take action or keep it for records.</li>
          </ul>
        </div>

        {/* Detailed Explanation */}
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Detailed Explanation</h4>
          <p style={styles.text}>
            This document contains official information meant for citizens.
            SamajhAI has simplified the language to help you understand its
            purpose, eligibility, and any required actions.
          </p>

          <p style={styles.text}>
            Please read the explanation carefully and verify important details
            such as names, dates, amounts, and deadlines with the original
            document.
          </p>
        </div>

        {/* Actions */}
        <div style={styles.actions}>
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
    width: "100%",
    maxWidth: "900px",
    backgroundColor: "#0f172a",
    border: "1px solid #1f2937",
    borderRadius: "18px",
    padding: "28px",
    color: "#e5e7eb",
    boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "24px",
  },

  title: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "700",
  },

  badge: {
    padding: "6px 12px",
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
    marginBottom: "22px",
  },

  sectionTitle: {
    fontSize: "15px",
    fontWeight: "600",
    marginBottom: "10px",
    color: "#cbd5f5",
  },

  list: {
    paddingLeft: "18px",
    lineHeight: "1.7",
    color: "#9ca3af",
    fontSize: "14px",
  },

  text: {
    fontSize: "14.5px",
    lineHeight: "1.7",
    color: "#9ca3af",
    marginBottom: "10px",
  },

  actions: {
    display: "flex",
    gap: "12px",
    marginTop: "18px",
    flexWrap: "wrap",
  },

  actionBtn: {
    padding: "10px 16px",
    borderRadius: "8px",
    backgroundColor: "#1f2937",
    border: "1px solid #334155",
    color: "#e5e7eb",
    cursor: "pointer",
    fontSize: "14px",
  },

  verifyBtn: {
    padding: "10px 16px",
    borderRadius: "8px",
    backgroundColor: "transparent",
    border: "1px dashed #f59e0b",
    color: "#fde68a",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default ExplanationCard;
