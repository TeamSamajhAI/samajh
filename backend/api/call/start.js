import {
  createCallSession,
  getCallSession,
  deleteCallSession
} from "../../call/callStore.js";
import {
  createCallState,
  updateCallState,
  CALL_STATES,
  pushCallState
} from "../../call/callState.js";

export function startCall(req, res) {
  // res.json({ ok: true }); // ❌ Remove this line!
  try {
    const { callId, language } = req.body;

    if (!callId || !language) {
      return res.status(400).json({
        success: false,
        error: "callId and language are required",
      });
    }

    // Create session in callState (manages state machine)
    const sessionState = createCallState(callId, language);
    
    // Store session in callSessionStore (persistent storage)
    createCallSession(sessionState);

    // IDLE → CONNECTING
    updateCallState(sessionState, CALL_STATES.CONNECTING);
    pushCallState(callId, { 
      callId, 
      state: sessionState.state, 
      timestamp: Date.now() 
    });

    // CONNECTING → CONNECTED
    updateCallState(sessionState, CALL_STATES.CONNECTED);
    pushCallState(callId, { 
      callId, 
      state: sessionState.state, 
      timestamp: Date.now() 
    });

    // CONNECTED → WELCOME_PLAYING
    updateCallState(sessionState, CALL_STATES.WELCOME_PLAYING);
    pushCallState(callId, { 
      callId, 
      state: sessionState.state, 
      timestamp: Date.now() 
    });

    res.json({ 
      success: true, 
      data: sessionState 
    });
  } catch (err) {
    console.error("❌ Start call error:", err.message);
    res.status(500).json({
      success: false,
      error: "Failed to start call: " + err.message,
    });
  }
}