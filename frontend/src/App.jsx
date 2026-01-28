import { useState } from "react";
import Navbar from "./components/layout/Navbar";
import TopStrip from "./components/layout/TopStrip";
import Hero from "./components/pages/Hero";
import HowItWorks from "./components/pages/HowItWorks";
import ResponseCard from "./components/pages/ResponseCard";
import Footer from "./components/layout/Footer";

const BACKEND_URL = "http://172.16.23.210:5001";

function App() {
  const [isListening, setIsListening] = useState(false);
  const [conversationContext, setConversationContext] = useState("");
  const [followUpAnswer, setFollowUpAnswer] = useState("");
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [followUpTranscript, setFollowUpTranscript] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("");

  /* ================= DOCUMENT EXPLAIN ================= */
  const handleExplain = async (file = null) => {
    if (loading) return;
    if (!language) {
      setError("Please select a language");
      return;
    }

    setLoading(true);
    setError("");
    setSummary("");
    setAudioUrl("");

    try {
      const formData = new FormData();
      if (file) formData.append("document", file);

      formData.append("language", language);
      formData.append("query", input || "");

      const res = await fetch(`${BACKEND_URL}/process-document`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      if (!data.success) throw new Error("Processing failed");

      setSummary(data.data.summary || "");
      setConversationContext(`Explanation:\n${data.data.summary}\n`);

      setAudioUrl(
        data.data.audioUrl ? `${BACKEND_URL}${data.data.audioUrl}` : ""
      );
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VOICE INPUT (🎯 NOW TRIGGERS EXPLAIN) ================= */
  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return alert("Voice not supported");
    if (!language) return alert("Please select a language");

    const recognition = new SpeechRecognition();
    recognition.lang =
      language === "hi" ? "hi-IN" : language === "kn" ? "kn-IN" : "en-IN";

    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;

      // 🔹 FIRST TIME → AUTO EXPLAIN
      if (!summary) {
        setInput(spokenText);

        // ⬇️ KEY LINE: mic = explain
        setTimeout(() => {
          handleExplain();
        }, 0);
      }
      // 🔹 FOLLOW‑UP QUESTIONS
      else {
        setFollowUpTranscript(spokenText);
        sendFollowUpToBackend(spokenText);
      }
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  /* ================= FOLLOW‑UP ================= */
  const sendFollowUpToBackend = async (spokenText) => {
  // ✅ FRONTEND SAFETY GUARD
  if (!spokenText?.trim()) return;

  if (!conversationContext || conversationContext.trim().length === 0) {
    console.warn("Follow-up blocked: empty conversation context");
    return;
  }

  setFollowUpLoading(true);
  setFollowUpAnswer("");

  try {
    const res = await fetch(`${BACKEND_URL}/ask-followup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        context: conversationContext,
        question: spokenText,
        language,
      }),
    });

    const data = await res.json();
    if (!data.success) throw new Error();

    setConversationContext(
      (prev) => prev + `\nUser: ${spokenText}\nAssistant: ${data.answer}\n`
    );

    setFollowUpAnswer(data.answer);

    if (data.audioUrl) {
      new Audio(`${BACKEND_URL}${data.audioUrl}`).play();
    } 


  } catch (err) {
    setFollowUpAnswer("Something went wrong.");
  } finally {
    setFollowUpLoading(false);
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
          onMicClick={startVoiceInput}   // 🎙 mic = explain
          isListening={isListening}
        />

        <ResponseCard
          text={summary}
          language={language}
          audioUrl={audioUrl}
        />

        {summary && (
          <div style={{ marginTop: 28, textAlign: "center" }}>
            <p style={{ color: "#9ca3af" }}>
              Speak again to ask a follow‑up question
            </p>

            {followUpTranscript && (
              <p style={{ marginTop: 10, color: "#cbd5f5" }}>
                You asked: “{followUpTranscript}”
              </p>
            )}
          </div>
        )}

        {followUpLoading && <p style={{ color: "#9ca3af" }}>Thinking…</p>}

        {followUpAnswer && (
          <div style={{ marginTop: 16, color: "#99f6e4" }}>
            {followUpAnswer}
          </div>
        )}

        <HowItWorks />
      </div>

      <Footer />
    </div>
  );
}

const styles = {
  appBg: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #020617, #0b1020)",
  },
  page: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "0 24px 48px",
  },
};

export default App;
