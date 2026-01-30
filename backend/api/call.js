// backend/api/call.js

import express from "express";
import {
  CALL_STATES,
} from "../call/callState.js";
import {
  createNewCall,
  getCallSession,
  transitionCall,
  endCall,
} from "../call/callStore.js";

const router = express.Router();

// ================= START CALL =================
// Frontend hits this once when "Connect" is pressed
router.post("/start", (req, res) => {
  try {
    const { callId, language = "en" } = req.body;

    if (!callId) {
      return res.status(400).json({ error: "callId required" });
    }

    const session = createNewCall(callId, language);
    transitionCall(callId, CALL_STATES.CONNECTED);
    transitionCall(callId, CALL_STATES.WELCOME_PLAYING);

    return res.json({ success: true, session });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// ================= ACK WELCOME DONE =================
// Frontend calls this after welcome audio finishes
router.post("/welcome-done", (req, res) => {
  try {
    const { callId } = req.body;

    transitionCall(callId, CALL_STATES.LISTENING);

    return res.json({ success: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// ================= USER SPOKE =================
// Frontend calls this after user finishes speaking
router.post("/user-spoke", (req, res) => {
  try {
    const { callId, text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ error: "empty speech" });
    }

    transitionCall(callId, CALL_STATES.PROCESSING);

    // AI answer comes in later steps
    transitionCall(callId, CALL_STATES.SPEAKING);

    return res.json({
      success: true,
      answer: "Answer placeholder (AI comes later)",
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// ================= AI FINISHED SPEAKING =================
// Frontend calls this when TTS playback ends
router.post("/ai-done", (req, res) => {
  try {
    const { callId } = req.body;

    transitionCall(callId, CALL_STATES.LISTENING);

    return res.json({ success: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// ================= END CALL =================
router.post("/end", (req, res) => {
  try {
    const { callId } = req.body;

    const session = endCall(callId);

    return res.json({
      success: true,
      summary: "Thank you for contacting Samajh AI.",
      session,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// ================= GET CALL STATE =================
// Frontend polls this OR WebSocket will replace later
router.get("/state/:callId", (req, res) => {
  const session = getCallSession(req.params.callId);

  if (!session) {
    return res.status(404).json({ error: "call not found" });
  }

  return res.json({ state: session.state });
});

export default router;
