import express from "express";

import { startCall } from "./start.js";
import { welcomeDone } from "./welcomeDone.js";
import { userSpoke } from "./userSpoke.js";
import { aiDone } from "./aiDone.js";   // ✅ MUST EXIST
import { endCall } from "./end.js";



const router = express.Router();

router.post("/start", startCall);
router.post("/welcome-done", welcomeDone);
router.post("/user-spoke", userSpoke);
router.post("/ai-done", aiDone);        // ✅ MUST EXIST
router.post("/end", endCall);

export default router;
