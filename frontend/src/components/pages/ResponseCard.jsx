import { responseCardStyles as styles } from "./ResponseCard.style";

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
        <p style={styles.text}>{text}</p>

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

export default ResponseCard;
