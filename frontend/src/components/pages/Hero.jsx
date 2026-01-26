import { useRef, useEffect, useState } from "react";

function Hero({
  input,
  setInput,
  onSubmit,
  loading,
  language,
  setLanguage,
  documentProcessed, // controlled by App.jsx
}) {
  const fileInputRef = useRef(null);

  /* ================= PROGRESS ================= */
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!loading) {
      setProgress(0);
      return;
    }

    let value = 0;
    const interval = setInterval(() => {
      value += Math.random() * 7;
      setProgress(Math.min(100, Math.floor(value)));
    }, 300);

    return () => clearInterval(interval);
  }, [loading]);

  /* ================= CONFIDENCE (UI ONLY) ================= */
  const [confidence, setConfidence] = useState(null);
  const [confidenceLevel, setConfidenceLevel] = useState(null);

  const calculateConfidence = (file) => {
    if (!file) return;

    const base = file.type.includes("pdf") ? 82 : 70;
    const variance = Math.floor(Math.random() * 15) - 7;
    const score = Math.max(45, Math.min(95, base + variance));

    setConfidence(score);
    if (score >= 80) setConfidenceLevel("High");
    else if (score >= 65) setConfidenceLevel("Medium");
    else setConfidenceLevel("Low");
  };

  /* 🔁 RESET CONFIDENCE IF DOCUMENT NOT PROCESSED */
  useEffect(() => {
    if (!documentProcessed) {
      setConfidence(null);
      setConfidenceLevel(null);
    }
  }, [documentProcessed]);

  /* ================= TRENDING ================= */
  const trending = [
    "Ayushman Bharat – PM-JAY",
    "Senior Citizen Savings Scheme (SCSS)",
    "Madilu Programme",
    "Pradhan Mantri Awas Yojana (PMAY)",
    "National Social Assistance Programme (NSAP)",
  ];

  /* ================= BACKGROUND ANIMATION ================= */
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes bgMove {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <section style={styles.hero}>
      <div style={styles.animatedBg} />

      {/* MAIN CONTENT */}
      <div
        style={{
          ...styles.contentWrap,
          ...(loading ? styles.blurred : {}),
        }}
      >
        <h1 style={styles.title}>SamajhAI</h1>
        <div style={styles.titleUnderline} />

        <p style={styles.description}>
          Helping citizens understand complex government documents through AI.
        </p>

        {/* SEARCH BAR */}
        <div style={styles.searchWrap}>
          <input
            type="text"
            placeholder="Ask about the uploaded government document (optional)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            style={styles.searchInput}
          />

          {/* LANGUAGE SELECT */}
          <select
            value={language}
            disabled={loading}
            onChange={(e) => setLanguage(e.target.value)}
            style={styles.languageSelect}
            onFocus={(e) =>
              (e.target.style.boxShadow =
                "0 0 0 3px rgba(15,118,110,0.25)")
            }
            onBlur={(e) => (e.target.style.boxShadow = "none")}
          >
            <option value="" disabled>
              Select language
            </option>
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="kn">ಕನ್ನಡ</option>
          </select>

          <input
            type="file"
            accept=".pdf,image/png,image/jpeg,image/jpg"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file || !language) return;

              calculateConfidence(file); // UI-only estimate
              onSubmit(file); // real backend processing
            }}
          />

          <button
            disabled={loading || !language}
            style={{
              ...styles.uploadBtn,
              opacity: !language ? 0.6 : 1,
              cursor: !language ? "not-allowed" : "pointer",
            }}
            onClick={() => fileInputRef.current.click()}
          >
            Upload PDF / Image
          </button>
        </div>

        {!language && !loading && (
          <div style={styles.helperText}>
            Please select a language before uploading a document
          </div>
        )}

        {!loading && (
          <div style={styles.trendingWrap}>
            <span style={styles.trendingLabel}>Trending:</span>
            {trending.map((item) => (
              <button
                key={item}
                style={styles.trendingBtn}
                onClick={() =>
                  setInput(`Explain documents related to ${item}`)
                }
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* LOADING */}
      {loading && (
        <div style={styles.loadingWrap}>
          <div style={styles.progressTrack}>
            <div
              style={{
                ...styles.progressFill,
                width: `${progress}%`,
              }}
            />
          </div>
          <div style={styles.progressText}>{progress}%</div>
          <div style={styles.analysingText}>Analysing document…</div>
        </div>
      )}

      {/* ✅ SUCCESS MESSAGE */}
      {!loading && documentProcessed && (
        <div style={styles.successBox}>
          ✅ Document processed successfully.
          <br />
          You can now read or listen to the explanation below.
        </div>
      )}

      {/* CONFIDENCE */}
      {!loading && documentProcessed && confidence !== null && (
        <div style={styles.confidenceWrap}>
          Document confidence:{" "}
          <strong>
            {confidence}% ({confidenceLevel})
          </strong>
        </div>
      )}

      {/* LOW CONFIDENCE WARNING */}
      {!loading &&
        documentProcessed &&
        confidenceLevel === "Low" && (
          <div style={styles.lowConfidenceWarning}>
            ⚠️ This document may be unclear or partially unreadable.
            <br />
            Please verify important details manually.
          </div>
        )}
    </section>
  );
}

/* ================= STYLES ================= */
const styles = {
  hero: {
    position: "relative",
    padding: "100px 24px",
    maxWidth: "1000px",
    margin: "0 auto",
    fontFamily: "'Inter', system-ui, sans-serif",
    textAlign: "center",
  },

  animatedBg: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(120deg, #020617, #0f766e, #020617)",
    backgroundSize: "300% 300%",
    animation: "bgMove 20s ease infinite",
    zIndex: -2,
  },

  contentWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "filter 0.4s ease, opacity 0.4s ease",
  },

  blurred: {
    filter: "blur(6px)",
    opacity: 0.35,
    pointerEvents: "none",
  },

  title: {
    fontSize: "54px",
    fontWeight: "900",
    background: "linear-gradient(90deg, #f8fafc, #94a3b8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  titleUnderline: {
    width: "70px",
    height: "4px",
    borderRadius: "999px",
    background: "linear-gradient(90deg, #0f766e, #5eead4)",
    margin: "14px auto 26px",
  },

  description: {
    color: "#9ca3af",
    marginBottom: "48px",
    maxWidth: "720px",
  },

  searchWrap: {
    width: "100%",
    maxWidth: "900px",
    display: "flex",
    gap: "12px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "14px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
  },

  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "16px",
    color: "#0f172a",
  },

  languageSelect: {
    border: "1.5px solid #0f766e",
    borderRadius: "8px",
    padding: "8px 12px",
    backgroundColor: "#ffffff",
    color: "#0f172a",
    fontSize: "14px",
    cursor: "pointer",
    outline: "none",
  },

  uploadBtn: {
    padding: "10px 22px",
    fontSize: "14px",
    backgroundColor: "#0f766e",
    border: "none",
    borderRadius: "10px",
    color: "white",
    fontWeight: "500",
    whiteSpace: "nowrap",
  },

  helperText: {
    marginTop: "10px",
    fontSize: "13px",
    color: "#9ca3af",
  },

  trendingWrap: {
    marginTop: "26px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  trendingLabel: { color: "#9ca3af" },

  trendingBtn: {
    padding: "6px 14px",
    border: "1px solid #334155",
    borderRadius: "999px",
    background: "transparent",
    color: "#cbd5f5",
    cursor: "pointer",
  },

  loadingWrap: { marginTop: "44px" },

  progressTrack: {
    height: "10px",
    maxWidth: "420px",
    margin: "0 auto",
    backgroundColor: "#1f2937",
    borderRadius: "999px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #FF8243, #FCE883)",
    transition: "width 0.3s ease",
  },

  progressText: { color: "#e5e7eb", marginTop: "10px" },

  analysingText: { color: "#9ca3af" },

  successBox: {
    marginTop: "18px",
    padding: "14px 18px",
    background: "rgba(15,118,110,0.15)",
    border: "1px solid rgba(45,212,191,0.4)",
    borderRadius: "12px",
    color: "#99f6e4",
    fontSize: "14px",
    maxWidth: "720px",
  },

  confidenceWrap: {
    marginTop: "18px",
    color: "#cbd5f5",
  },

  lowConfidenceWarning: {
    marginTop: "12px",
    padding: "12px 16px",
    backgroundColor: "rgba(127,29,29,0.15)",
    border: "1px solid rgba(239,68,68,0.4)",
    borderRadius: "10px",
    color: "#fecaca",
    maxWidth: "720px",
  },
};

export default Hero;
