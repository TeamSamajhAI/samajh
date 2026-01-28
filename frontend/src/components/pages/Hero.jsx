import { useRef, useEffect, useState } from "react";
import { heroStyles as styles } from "./Hero.style";
import logo from "../../assets/logo.jpg"; // or logo.svg


import bg1 from "../../assets/bg1.jpg";
import bg2 from "../../assets/bg2.jpg";
import bg3 from "../../assets/bg3.jpg";

const BACKGROUNDS = [bg1, bg2, bg3];
const BG_INTERVAL = 4500; // 4.5 seconds

function Hero({
  input,
  setInput,
  onSubmit,
  loading,
  language,
  setLanguage,
  onMicClick,
  isListening,
}) {
  const fileInputRef = useRef(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isMicHover, setIsMicHover] = useState(false);
  const [micError, setMicError] = useState("");

  /* ================= PROGRESS ================= */
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!loading) {
      setProgress(0);
      return;
    }

    let value = 0;
    const interval = setInterval(() => {
      value += Math.random() * 6;
      setProgress(Math.min(100, Math.floor(value)));
    }, 300);

    return () => clearInterval(interval);
  }, [loading]);

  /* ================= BACKGROUND SLIDESHOW ================= */
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BACKGROUNDS.length);
    }, BG_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  /* ================= GLOBAL ANIMATIONS ================= */
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      @keyframes wave {
        0% { height: 6px; }
        50% { height: 18px; }
        100% { height: 6px; }
      }
      @keyframes titleReveal {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes titleShimmer {
        0% { background-position: 0% 50%; }
        100% { background-position: 200% 50%; }
      }
      @keyframes tricolorFlow {
        0% { background-position: 0% 50%; }
        100% { background-position: 300% 50%; }
      }
      @keyframes bgFlow {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <>
      {/* ================= FIXED FULLSCREEN BACKGROUND ================= */}
      {/* ===== HERO BACKGROUND (JUST BEHIND TEXT & SEARCH) ===== */}
<div
  style={{
    position: "absolute",
    inset: 0,
    zIndex: 0,
    overflow: "hidden",
  }}
>
  {BACKGROUNDS.map((bg, index) => (
    <div
      key={bg}
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: index === bgIndex ? 1 : 0,
        transition: "opacity 1.5s ease-in-out",
      }}
    />
  ))}

  {/* Dark animated overlay */}
  <div
    style={{
      position: "absolute",
      inset: 0,
      background:
        "linear-gradient(120deg, rgba(2,6,23,0.85), rgba(4,19,45,0.85), rgba(2,6,23,0.85))",
      backgroundSize: "300% 300%",
      animation: "bgFlow 18s ease-in-out infinite",
    }}
  />
</div>


      {/* ================= HERO CONTENT ================= */}
      <section
        style={{
          ...styles.hero,
          position: "relative",
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            ...styles.contentWrap,
            filter: loading ? "blur(4px)" : "none",
            opacity: loading ? 0.6 : 1,
            pointerEvents: loading ? "none" : "auto",
            transition: "all 0.35s ease",
            position: "relative",
            zIndex: 1,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* LOGO */}
<img
  src={logo}
  alt="SamajhAI Logo"
  style={{
    height: "180px",
    width: "auto",
    marginBottom: "0px",
    opacity: 0.90,
    marginTop: "-150px",
    marginLeft: "30px"
  }}
/>

          {/* TITLE */}
          <div style={styles.titleWrap}>
            <h1
              style={{
                ...styles.title,
                animation:
                  "titleReveal 0.9s cubic-bezier(0.22,1,0.36,1) both, titleShimmer 8s linear infinite",
              }}
            >
              SamajhAI
            </h1>
            <div
              style={{
                ...styles.titleUnderline,
                animation: "tricolorFlow 6s linear infinite",
              }}
            />
          </div>

          <p style={styles.description}>
            Helping citizens understand complex government documents through AI.
          </p>

          <p style={styles.actionHint}>
            Upload a government document or ask a question below
          </p>

          {/* ================= SEARCH BAR ================= */}
          <div
            style={{
              ...styles.searchWrap,
              ...(isFocused ? styles.searchWrapFocus : {}),
            }}
          >
            {/* MIC */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <button
                type="button"
                title="Speak your question"
                onMouseEnter={() => setIsMicHover(true)}
                onMouseLeave={() => setIsMicHover(false)}
                onClick={onMicClick}
                style={{
                  ...styles.micBtn,
                  ...(isMicHover ? styles.micBtnHover : {}),
                  ...(isListening ? styles.micActive : {}),
                }}
              >
                <svg viewBox="0 0 24 24" style={styles.micIcon}>
                  <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z" />
                </svg>
              </button>

              {isListening && (
                <div style={{ display: "flex", gap: "3px" }}>
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      style={{
                        width: "3px",
                        height: "12px",
                        background: "#0f766e",
                        borderRadius: "4px",
                        animation: `wave 0.9s ease-in-out ${
                          i * 0.15
                        }s infinite`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <input
              type="text"
              placeholder='Ask a question (e.g. "Who is eligible?")'
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
                onSubmit(file);
              }}
            />

            <button
              disabled={loading || !language}
              style={{
                ...styles.uploadBtn,
                opacity: !language ? 0.6 : 1,
              }}
              onClick={() => fileInputRef.current.click()}
            >
              Upload PDF / Image
            </button>
          </div>

          {micError && (
            <div
              style={{ marginTop: "8px", color: "#ef4444", fontSize: "12px" }}
            >
              {micError}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Hero;
