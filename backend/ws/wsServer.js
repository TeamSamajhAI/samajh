import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ noServer: true });

// callId → Set<WebSocket>
const callSockets = new Map();

export function attachWSServer(server) {
  server.on("upgrade", (req, socket, head) => {
    if (!req.url.startsWith("/ws")) return;

    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  });
}

wss.on("connection", (ws, req) => {
  const url = new URL(req.url, "http://localhost");
  const callId = url.searchParams.get("callId");

  if (!callId) {
    ws.close();
    return;
  }

  if (!callSockets.has(callId)) {
    callSockets.set(callId, new Set());
  }

  callSockets.get(callId).add(ws);

  ws.on("close", () => {
    callSockets.get(callId)?.delete(ws);
  });
});

export function pushCallState(callId, payload) {
  const sockets = callSockets.get(callId);
  if (!sockets) return;

  const msg = JSON.stringify(payload);

  sockets.forEach((ws) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(msg);
    }
  });
}
