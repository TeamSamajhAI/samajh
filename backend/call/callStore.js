// backend/call/callStore.js

const sessions = new Map();

export function createCallSession(session) {
  sessions.set(session.callId, session);
  return session;
}

export function getCallSession(callId) {
  return sessions.get(callId);
}

export function deleteCallSession(callId) {
  sessions.delete(callId);
}

export function updateCallSession(callId, updates) {
  const session = sessions.get(callId);
  if (session) {
    const updated = { ...session, ...updates };
    sessions.set(callId, updated);
    return updated;
  }
  return null;
}

export function getAllSessions() {
  return Array.from(sessions.values());
}
export function debugSessions() {
  console.log("ACTIVE CALLS:", Array.from(sessions.keys()));
}
