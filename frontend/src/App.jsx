import { useState, useEffect } from "react";
import Navbar from "./components/layout/Navbar";
import Hero from "./components/pages/Hero";
import ResponseCard from "./components/pages/ResponseCard";
import Footer from "./components/layout/Footer";

const BACKEND_URL = "http://172.16.23.210:5001";
// backend
function App() {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");

  // 🌐 Language — NO DEFAULT
  const [language, setLanguage] = useState("");

  // 📄 Document state
  const [uploadedFile, setUploadedFile] = useState(null);
  const [documentProcessed, setDocumentProcessed] = useState(false);

  // 🔊 Ensure voices are loaded
  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }, []);

  // 🔊 Text-to-Speech
  const speakText = (text, lang) => {
    if (!window.speechSynthesis || !text || !lang) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const langMap = {
      hi: "hi-IN",
      en: "en-IN",
      kn: "kn-IN",
    };

    utterance.lang = langMap[lang];
    utterance.rate = 0.95;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  // 🔹 Unified handler: TEXT or FILE
  const handleExplain = async (file = null) => {
    if (!language) {
      setError("Please select a language before proceeding.");
      return;
    }

    if (!file && !input.trim()) {
      setError("Please enter text or upload a document.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSummary("");
      setDocumentProcessed(false);
      setUploadedFile(null);

      let res;

      if (file) {
        setUploadedFile(file); // ✅ store file
        const formData = new FormData();
        formData.append("document", file);
        formData.append("language", language);
        formData.append("query", input || "");

        res = await fetch(`${BACKEND_URL}/process-document`, {
          method: "POST",
          body: formData,
        });
      } else {
        res = await fetch(`${BACKEND_URL}/process-text`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: input, language }),
        });
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      const result =
        data.data?.summary ||
        data.data?.response ||
        "";

      if (!result) {
        throw new Error("Empty response from server");
      }

      // ✅ SUCCESS
      setSummary(result);
      setDocumentProcessed(!!file); // ONLY true for documents
      speakText(result, language);

    } catch (err) {
      console.error("FRONTEND ERROR:", err);
      setDocumentProcessed(false);
      setUploadedFile(null);

      if (err.message.includes("Failed to fetch")) {
        setError(
          "Unable to connect to the server. Please check your internet or try again later."
        );
      } else if (err.message.includes("Empty response")) {
        setError(
          "The document could not be processed. Please upload a clearer file."
        );
      } else {
        setError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.appBg}>
      <Navbar />

      <div style={styles.page}>
        <Hero
          input={input}
          setInput={setInput}
          onSubmit={handleExplain}
          loading={loading}
          language={language}
          setLanguage={setLanguage}
          documentProcessed={documentProcessed}
          uploadedFile={uploadedFile} // ✅ IMPORTANT
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

        <ResponseCard
          text={summary}
          language={language}
          onListen={() => speakText(summary, language)}
        />
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
    alignItems: "flex-start",
    background: "rgba(127,29,29,0.15)",
    border: "1px solid rgba(239,68,68,0.4)",
    borderRadius: "12px",
    color: "#fecaca",
    maxWidth: "720px",
  },

  errorIcon: {
    fontSize: "20px",
    lineHeight: "1",
  },

  errorText: {
    marginTop: "6px",
    fontSize: "14px",
    color: "#fca5a5",
  },
};

export default App;
