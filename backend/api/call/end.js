// backend/api/call/end.js

import { CALL_STATES, updateCallState } from "../../call/callState.js";
import { getCallSession, deleteCallSession } from "../../call/callStore.js";
import { pushCallState } from "../../ws/wsServer.js";

export function endCall(req, res) {
  try {
    const { callId } = req.body;

    if (!callId) {
      return res.status(400).json({ error: "callId required" });
    }

    const session = getCallSession(callId);
    if (!session) {
      return res.status(404).json({ error: "Call session not found" });
    }

    // LISTENING / SPEAKING → ENDING
    updateCallState(session, CALL_STATES.ENDING);
    pushCallState(callId, {
      callId,
      state: session.state,
      timestamp: Date.now(),
    });

    // ENDING → ENDED
    updateCallState(session, CALL_STATES.ENDED);
    pushCallState(callId, {
      callId,
      state: session.state,
      timestamp: Date.now(),
    });

    // 🧹 Cleanup
    deleteCallSession(callId);

    return res.json({ ok: true });

  } catch (err) {
    console.error("❌ call end error:", err.message);
    return res.status(500).json({ error: "Failed to end call" });
  }
}
