import { useRef, useEffect, useState } from "react";
import { heroStyles as styles } from "./Hero.style";

function Hero({
  input,
  setInput,
  onSubmit,
  loading,
  language,
  setLanguage,
}) {

  const fileInputRef = useRef(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isMicHover, setIsMicHover] = useState(false);

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

  /* ================= CONFIDENCE ================= */
  const [confidence, setConfidence] = useState(null);
  const [confidenceLevel, setConfidenceLevel] = useState(null);

  const calculateConfidence = (file) => {
    if (!file) return;

    setConfidence(null);
    setConfidenceLevel(null);

    const base = file.type.includes("pdf") ? 82 : 70;
    const variance = Math.floor(Math.random() * 15) - 7;
    const score = Math.max(45, Math.min(95, base + variance));

    setConfidence(score);
    if (score >= 80) setConfidenceLevel("High");
    else if (score >= 65) setConfidenceLevel("Medium");
    else setConfidenceLevel("Low");
  };


  /* ================= TRENDING ================= */
  const trending = [
    "Ayushman Bharat – PM-JAY",
    "Senior Citizen Savings Scheme (SCSS)",
    "Madilu Programme",
    "Pradhan Mantri Awas Yojana (PMAY)",
    "National Social Assistance Programme (NSAP)",
  ];

  /* ================= GLOBAL ANIMATIONS ================= */
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes bgMove {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      @keyframes glowPulse {
        0% { box-shadow: 0 0 6px rgba(255,153,51,0.25); }
        50% { box-shadow: 0 0 14px rgba(19,136,8,0.35); }
        100% { box-shadow: 0 0 6px rgba(255,153,51,0.25); }
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      @keyframes micPulse {
        0% { box-shadow: 0 0 0 0 rgba(15,118,110,0.4); }
        70% { box-shadow: 0 0 0 14px rgba(15,118,110,0); }
        100% { box-shadow: 0 0 0 0 rgba(15,118,110,0); }
      }

      @keyframes wave {
        0% { height: 6px; }
        50% { height: 18px; }
        100% { height: 6px; }
      }

      @keyframes titleReveal {
        0% {
          opacity: 0;
          transform: translateY(18px);
          filter: blur(6px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
        }
      }

      @keyframes underlineReveal {
        0% { width: 0%; opacity: 0; }
        100% { width: 100%; opacity: 1; }
      }

      /* 🟢 Confidence Pulse */
      @keyframes confidencePulse {
        0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.6); }
        70% { box-shadow: 0 0 0 8px rgba(34,197,94,0); }
        100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <section style={styles.hero}>
      <div style={styles.animatedBg} />

      <div
        style={{
          ...styles.contentWrap,
          ...(loading ? styles.blurred : {}),
        }}
      >
        {/* TITLE */}
        <div style={styles.titleWrap}>
          <h1
            style={{
              ...styles.title,
              animation: "titleReveal 0.9s cubic-bezier(0.22,1,0.36,1) both",
            }}
          >
            SamajhAI
          </h1>

          <div
            style={{
              ...styles.titleUnderline,
              animation:
                "underlineReveal 0.6s ease-out 0.6s both, glowPulse 3s ease-in-out infinite",
            }}
          />
        </div>

        <p style={styles.description}>
          Helping citizens understand complex government documents through AI.
        </p>

        <p style={styles.trustLine}>
          <span style={{ color: "#ffffff" }}>🔒</span>{" "}
          No data is stored • Documents processed securely
        </p>

        <p style={styles.actionHint}>
          Upload a government document or ask a question below
        </p>

        {/* SEARCH */}
        <div
          style={{
            ...styles.searchWrap,
            ...(isFocused ? styles.searchWrapFocus : {}),
          }}
        >
          {/* MIC + WAVEFORM */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button
              type="button"
              title="Speak your question"
              onMouseEnter={() => setIsMicHover(true)}
              onMouseLeave={() => {
                setIsMicHover(false);
                setIsMicActive(false);
              }}
              onMouseDown={() => setIsMicActive(true)}
              onMouseUp={() => setIsMicActive(false)}
              style={{
                ...styles.micBtn,
                ...(isMicHover ? styles.micBtnHover : {}),
                ...(isMicActive ? styles.micActive : {}),
              }}
            >
              <svg viewBox="0 0 24 24" style={styles.micIcon}>
                <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z" />
              </svg>
            </button>

            {isMicActive && (
              <div style={{ display: "flex", gap: "3px" }}>
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    style={{
                      width: "3px",
                      height: "12px",
                      background: "#0f766e",
                      borderRadius: "4px",
                      animation: `wave 0.9s ease-in-out ${i * 0.15}s infinite`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <input
            type="text"
            placeholder='Ask a question (e.g. "Who is eligible?", "How to apply?")'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={loading}
            style={styles.searchInput}
          />

          <select
            value={language}
            disabled={loading}
            onChange={(e) => setLanguage(e.target.value)}
            style={styles.languageSelect}
          >
            <option value="" disabled>Select language</option>
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
              calculateConfidence(file);
              onSubmit(file);
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
            <span style={styles.trendingLabel}>Try an example:</span>
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
          <div style={styles.spinnerWrap}>
            <div style={styles.spinner} />
          </div>
          <div style={styles.spinnerPercent}>{progress}%</div>
          <div style={styles.analysingText}>Analysing document…</div>
        </div>
      )}


    </section>
  );
}

export default Hero;
