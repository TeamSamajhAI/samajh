function ResponseCard({ text, language, onListen }) {
  if (!text) return null;

  return (
    <section style={styles.wrapper}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h3 style={styles.title}>Explanation</h3>
          <span style={styles.language}>
            Language: {language.toUpperCase()}
          </span>
        </div>

        {/* Divider */}
        <div style={styles.divider} />

        {/* Content */}
        <p style={styles.text}>
          {text}
        </p>

        {/* Actions */}
        <div style={styles.actions}>
          <button style={styles.listenBtn} onClick={onListen}>
            🔊 Listen again
          </button>
        </div>
      </div>
    </section>
  );
}

const styles = {
  wrapper: {
    marginTop: "32px",
  },

  card: {
    maxWidth: "900px",
    margin: "0 auto",
    backgroundColor: "#1f1f1f",
    border: "1px solid #333",
    borderRadius: "12px",
    padding: "20px",
    fontFamily: "'Inter', system-ui, sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: "18px",
    fontWeight: "600",
  },

  language: {
    fontSize: "13px",
    color: "#9ca3af",
  },

  divider: {
    height: "1px",
    backgroundColor: "#333",
    margin: "12px 0 16px",
  },

  text: {
    fontSize: "15.5px",
    lineHeight: "1.7",
    color: "#e5e7eb",
    whiteSpace: "pre-wrap",
  },

  actions: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "flex-end",
  },

  listenBtn: {
    padding: "10px 16px",
    backgroundColor: "#2d2d2d",
    border: "1px solid #444",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
    transition: "border-color 0.2s ease",
  },
};

export default ResponseCard;
