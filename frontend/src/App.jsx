import { useState } from "react";
import Navbar from "./components/layout/Navbar";
import TopStrip from "./components/layout/TopStrip";
import Hero from "./components/pages/Hero";
import HowItWorks from "./components/pages/HowItWorks";
import ResponseCard from "./components/pages/ResponseCard";
import Footer from "./components/layout/Footer";

const BACKEND_URL = "http://172.16.23.210:5001";

function App() {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("");

  const handleExplain = async (file = null) => {
    if (loading) return;

    if (!language) {
      setError("Please select a language");
      return;
    }

    setLoading(true);
    setError("");
    setSummary("");

    try {
      const formData = new FormData();

      if (file) {
        formData.append("document", file);
      }

      formData.append("language", language);
      formData.append("query", input || "");

      const res = await fetch(`${BACKEND_URL}/process-document`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Server error. Please try again.");
      }

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!data || !data.success) {
        throw new Error(data?.error || "Processing failed");
      }

      // ✅ THIS WAS MISSING — TEXT NOW SHOWS
      setSummary(data.data.summary || "");

      // 🔊 Backend audio only
      if (data.data.audioUrl) {
        const audio = new Audio(`${BACKEND_URL}${data.data.audioUrl}`);
        audio.play();
      }

    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.appBg}>
      <TopStrip />
      <Navbar />

      <div style={styles.page}>
        <Hero
          input={input}
          setInput={setInput}
          onSubmit={handleExplain}
          loading={loading}
          language={language}
          setLanguage={setLanguage}
        />

        {loading && (
          <div style={styles.loading}>⏳ Processing your request…</div>
        )}

        {error && (
          <div style={styles.errorCard}>
            <div style={styles.errorIcon}>⚠️</div>
            <div>
              <strong>Action required</strong>
              <p style={styles.errorText}>{error}</p>
            </div>
          </div>
        )}

        {!loading && !summary && !error && (
          <div style={styles.empty}>
            Your explanation will appear here.
          </div>
        )}

        <ResponseCard text={summary} language={language} />

        <HowItWorks />
      </div>

      <Footer />
    </div>
  );
}

const styles = {
  appBg: {
    minHeight: "100vh",
    background: "#0b1020",
  },
  page: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "0 24px 48px",
  },
  loading: {
    marginTop: "16px",
    fontSize: "14px",
    color: "#9ca3af",
  },
  empty: {
    marginTop: "32px",
    fontSize: "14px",
    color: "#6b7280",
    fontStyle: "italic",
  },
  errorCard: {
    marginTop: "24px",
    padding: "16px 18px",
    display: "flex",
    gap: "12px",
    background: "rgba(127,29,29,0.15)",
    border: "1px solid rgba(239,68,68,0.4)",
    borderRadius: "12px",
    color: "#fecaca",
  },
  errorIcon: {
    fontSize: "20px",
  },
  errorText: {
    marginTop: "6px",
    fontSize: "14px",
    color: "#fca5a5",
  },
};

export default App;
