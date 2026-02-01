import {
  createCallSession,
  getCallSession,
  deleteCallSession
} from "../../call/callStore.js";
import { CALL_STATES, updateCallState } from "../../call/callState.js";
import { pushCallState } from "../../ws/wsServer.js";

export function welcomeDone(req, res) {
  const { callId } = req.body;

  if (!callId) {
    return res.status(400).json({ error: "callId required" });
  }

  const session = getCallSession(callId);
  console.log(`[welcomeDone] Looking for callId: ${callId}, Found:`, !!session);

  if (!session) {
    return res.status(404).json({ error: "Call session not found" });
  }

  // WELCOME_PLAYING → LISTENING
  updateCallState(session, CALL_STATES.LISTENING);

  // 🔔 PUSH STATE (MANDATORY)
  pushCallState(callId, {
    callId,
    state: session.state,
    timestamp: Date.now(),
  });

  return res.json({ ok: true });
}