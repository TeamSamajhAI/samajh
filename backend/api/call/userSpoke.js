import {
  createCallSession,
  getCallSession,
  deleteCallSession
} from "../../call/callStore.js";
import { debugSessions } from "../../call/callStore.js";
import { updateCallState, CALL_STATES } from "../../call/callState.js";
import { pushCallState } from "../../ws/wsServer.js";

async function generateAnswer(text, language = "en") {
  // Placeholder - replace with real AI later
  return `You asked: "${text}". Placeholder response.`;
}

export async function userSpoke(req, res) {
  const { callId, text } = req.body;

  debugSessions();
  
  if (!callId || !text) {
    return res.status(400).json({ error: "callId and text are required" });
  }

  const session = getCallSession(callId);
  if (!session) {
    return res.status(404).json({ error: "Call session not found" });
  }

  // LISTENING → PROCESSING
  updateCallState(session, CALL_STATES.PROCESSING);
  pushCallState(callId, {
    callId,
    state: session.state,
    timestamp: Date.now(),
  });

  // Generate AI response
  const answer = await generateAnswer(text, session.language);

  // PROCESSING → SPEAKING
  updateCallState(session, CALL_STATES.SPEAKING);
  pushCallState(callId, {
    callId,
    state: session.state,
    answer,
    timestamp: Date.now(),
  });

  return res.json({ ok: true });
}