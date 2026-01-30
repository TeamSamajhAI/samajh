// backend/call/callState.js

// ================= CALL STATES =================
export const CALL_STATES = {
  IDLE: "IDLE",
  CONNECTING: "CONNECTING",
  CONNECTED: "CONNECTED",
  WELCOME_PLAYING: "WELCOME_PLAYING",
  LISTENING: "LISTENING",
  PROCESSING: "PROCESSING",
  SPEAKING: "SPEAKING",
  ENDING: "ENDING",
  ENDED: "ENDED",
};

// ================= VALID TRANSITIONS =================
export const VALID_TRANSITIONS = {
  IDLE: ["CONNECTING"],
  CONNECTING: ["CONNECTED"],
  CONNECTED: ["WELCOME_PLAYING"],
  WELCOME_PLAYING: ["LISTENING"],
  LISTENING: ["PROCESSING", "ENDING"],
  PROCESSING: ["SPEAKING"],
  SPEAKING: ["LISTENING"],
  ENDING: ["ENDED"],
  ENDED: [],
};

// ================= TRANSITION GUARD =================
export function canTransition(from, to) {
  return VALID_TRANSITIONS[from]?.includes(to);
}

// ================= CALL SESSION FACTORY =================
export function createCallState(callId, language = "en") {
  return {
    callId,
    state: CALL_STATES.IDLE,
    language,
    startedAt: Date.now(),
    lastActiveAt: Date.now(),
    active: true,
    messages: []
  };
}

// ================= STATE UPDATE (ONLY WAY) =================
export function updateCallState(session, nextState) {
  if (!canTransition(session.state, nextState)) {
    throw new Error(
      `Invalid state transition: ${session.state} → ${nextState}`
    );
  }

  session.state = nextState;
  session.lastActiveAt = Date.now();

  if (nextState === CALL_STATES.CONNECTED) {
    session.startedAt = Date.now();
    session.active = true;
  }

  if (nextState === CALL_STATES.ENDED) {
    session.active = false;
  }

  return session;
}

// ================= PUSH CALL STATE (for logging/events) =================
export function pushCallState(callId, stateUpdate) {
  // TODO: Implement this based on your needs
  // For now, just log it
  console.log(`📞 Call ${callId}:`, stateUpdate);
}