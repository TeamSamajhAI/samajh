// backend/api/call/aiDone.js

import { CALL_STATES, updateCallState } from "../../call/callState.js";
import { getCallSession } from "../../call/callStore.js";
import { pushCallState } from "../../ws/wsServer.js";

export function aiDone(req, res) {
  try {
    const { callId } = req.body;

    if (!callId) {
      return res.status(400).json({ error: "callId required" });
    }

    const session = getCallSession(callId);
    if (!session) {
      return res.status(404).json({ error: "Call session not found" });
    }

    // SPEAKING → LISTENING
    updateCallState(session, CALL_STATES.LISTENING);

    // 🔔 PUSH STATE (MANDATORY)
    pushCallState(callId, {
      callId,
      state: session.state,
      timestamp: Date.now(),
    });

    return res.json({ ok: true });

  } catch (err) {
    console.error("❌ ai-done error:", err.message);
    return res.status(500).json({ error: "Failed to process ai-done" });
  }
}
