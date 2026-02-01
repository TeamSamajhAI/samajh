// ================= IMPORTS =================
import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import OpenAI from "openai";
import http from "http";
import callRouter from "./api/call/index.js";

import askRoute from "./api/ask.js";
import { convertPdfToImages } from "./utils/pdfToImage.js";
import { detectIntent } from "./utils/detectIntent.js";
import { extractTextFromImage } from "./utils/ocr.js";
import { chunkText } from "./utils/chunker.js";
import { summarizeChunks } from "./utils/summarizeChunks.js";
import { generateSpeech } from "./utils/azureTTS.js";
import { attachWSServer } from "./ws/wsServer.js";
import pdfParse from "pdf-parse";

// ================= ENV SETUP =================
dotenv.config({ override: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validate required env variables
const requiredEnvVars = ["OPENAI_API_KEY", "AZURE_SPEECH_REGION", "AZURE_SPEECH_KEY"];
const missingVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingVars.length > 0) {
  console.error("❌ Missing required environment variables:", missingVars.join(", "));
  process.exit(1);
}

console.log("✅ AZURE_SPEECH_REGION:", process.env.AZURE_SPEECH_REGION);
console.log("✅ OPENAI_API_KEY loaded");

// ================= APP INIT =================
const app = express();
const PORT = process.env.PORT || 5001;

// Create HTTP server for WebSocket support
const server = http.createServer(app);

// ================= OPENAI CLIENT =================
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ================= MULTER CONFIG =================
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = [".pdf", ".png", ".jpg", ".jpeg"];
    if (!allowed.includes(ext)) {
      return cb(new Error("Only PDF or image files are allowed"), false);
    }
    cb(null, true);
  },
});


// ================= MIDDLEWARE =================
// ================= MIDDLEWARE =================
const allowedOrigins = [
  "https://samajhai-2aea5.web.app",
  "https://samajhai-2aea5.firebaseapp.com"
];

app.use(cors({
  origin: function (origin, callback) {
    console.log(`🔌 Request from origin: ${origin}`);

    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn(`⚠️ CORS blocked origin: ${origin}`);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// ✅ REQUIRED
// app.options("/*", cors());


app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use("/tts", express.static(path.join(__dirname, "public")));
app.use("/api/ask", askRoute);
app.use("/api/call", callRouter);

// ================= WEBSOCKET SETUP =================
attachWSServer(server);

// ================= LANGUAGE HELPERS =================
function getOcrLanguage(language) {
  const langMap = {
    hi: "hin",
    kn: "kan",
    en: "eng",
  };
  return langMap[language?.toLowerCase()] || "eng";
}

function getHumanLanguage(language) {
  const langMap = {
    hi: "Hindi",
    kn: "Kannada",
    en: "English",
  };
  return langMap[language?.toLowerCase()] || "English";
}

// ================= FORMATTING HELPERS =================
function enforceSpokenFormat(text) {
  if (!text) return "";

  text = text.replace(/[*#_`>-]/g, "");
  text = text.replace(/^\s*[-•]\s*/gm, "• ");

  const lines = text
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  let output = [];
  let bulletCount = 0;

  for (const line of lines) {
    if (
      line.startsWith("Key points") ||
      line.startsWith("What it means") ||
      line.startsWith("What you should do") ||
      line.startsWith("Summary")
    ) {
      output.push(line);
      continue;
    }

    if (line.startsWith("•") && bulletCount < 5) {
      output.push(line);
      bulletCount++;
    }
  }

  return output.join("\n");
}

function explanationToSSML(text, language) {
  const langMap = {
    en: "en-IN",
    hi: "hi-IN",
    kn: "kn-IN",
  };

  const voiceMap = {
    en: "en-IN-NeerjaNeural",
    hi: "hi-IN-SwaraNeural",
    kn: "kn-IN-GaganNeural",
  };

  const langCode = langMap[language] || "en-IN";
  const voice = voiceMap[language] || voiceMap.en;
  console.log("ENV CHECK", {
  OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
  AZURE_SPEECH_KEY: !!process.env.AZURE_SPEECH_KEY,
  AZURE_SPEECH_REGION: process.env.AZURE_SPEECH_REGION,
});

  const formatted = text
    .replace(/Key points:/g, '<break time="500ms"/>Key points.<break time="400ms"/>')
    .replace(/What it means for you:/g, '<break time="600ms"/>What it means for you.<break time="400ms"/>')
    .replace(/What you should do next:/g, '<break time="600ms"/>What you should do next.<break time="400ms"/>')
    .replace(/•/g, '<break time="300ms"/>');

  return `
<speak version="1.0" xml:lang="${langCode}">
  <voice name="${voice}">
    <prosody rate="0.95" pitch="+0%">
      ${formatted}
    </prosody>
  </voice>
</speak>`;
}

function sendJSON(res, status, payload) {
  return res.status(status).json(payload);
}


// ================= LLM CALL =================
async function callLLM(prompt, language = "en") {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant explaining government documents in a clear, concise manner for spoken explanation.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    return response.choices[0].message.content;
  } catch (err) {
    console.error("❌ LLM Error:", err.message);
    throw new Error("LLM call failed: " + err.message);
  }
}




// ================= ROUTES =================

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    data: { message: "Backend baseline OK" },
  });
});

// Ping
app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

// Test
app.get("/test", (req, res) => {
  console.log("🔥 TEST ROUTE HIT");
  res.json({ ok: true });
});

// ================= DOCUMENT PROCESSING =================
app.post("/process-document", upload.single("document"), async (req, res) => {
  try {
    console.log("📄 /process-document called");
    console.log("FILE:", req.file?.originalname);

    if (!req.file) {
      return sendJSON(res, 400, {
        success: false,
        data: {
          summary: "",
          audioUrl: null,
        },
        error: "No document uploaded",
      });
    }

    const { language = "en", query = "" } = req.body;
    const ext = path.extname(req.file.originalname).toLowerCase();
    let extractedText = "";

    // PDF Processing
    if (ext === ".pdf") {
      try {
        const pdfData = await pdfParse(req.file.buffer);
        extractedText = pdfData.text || "";
      } catch (pdfErr) {
        console.warn("⚠️ PDF text extraction failed, trying OCR...");
      }

      // Fallback to OCR for scanned PDFs
      if (!extractedText.trim()) {
        console.log("📄 Scanned PDF detected, converting to images...");
        const ocrLang = getOcrLanguage(language);
        
        try {
          const imagePaths = await convertPdfToImages(req.file.buffer);
          let ocrText = "";
          
          for (const imgPath of imagePaths) {
            const imgBuffer = fs.readFileSync(imgPath);
            ocrText += await extractTextFromImage(imgBuffer, ocrLang);
          }
          
          extractedText = ocrText;
        } catch (ocrErr) {
          console.error("❌ OCR failed:", ocrErr.message);
          throw new Error("Failed to extract text from PDF");
        }
      }
    }
    // IMAGE Processing
    else {
      const ocrLang = getOcrLanguage(language);
      extractedText = await extractTextFromImage(req.file.buffer, ocrLang);
    }

    if (!extractedText.trim()) {
      return sendJSON(res, 400, {
        success: false,
        data: {
          summary: "",
          audioUrl: null,
        },
        error: "No readable text found in document",
      });
    }

    // Process extracted text
    const userIntent = detectIntent(query);
    const humanLanguage = getHumanLanguage(language);
    const chunks = chunkText(extractedText, 2000).slice(0, 1);

    // Summarize using OpenAI
    let finalSummary = await summarizeChunks(
      openai,
      chunks,
      humanLanguage,
      userIntent
    );

    finalSummary = enforceSpokenFormat(finalSummary);
    const ssml = explanationToSSML(finalSummary, language);

    // Generate speech
    const audioUrl = await generateSpeech(ssml, language);

    return sendJSON(res, 200, {
      success: true,
      data: {
        type: ext === ".pdf" ? "pdf" : "image",
        intent: userIntent,
        totalChunks: chunks.length,
        summary: finalSummary,
        audioUrl,
      },
    });

  } catch (err) {
    console.error("❌ /process-document error:", err.message);
    return sendJSON(res, 500, {
      success: false,
      error: "Document processing failed: " + err.message,
    });
  }
});

// ================= FOLLOW-UP QUESTIONS =================
app.post("/ask-followup", async (req, res) => {
  try {
    const { context, question, language = "en" } = req.body;

    if (!context?.trim() || !question?.trim()) {
      return sendJSON(res, 400, {
        success: false,
        error: "Missing context or question",
      });
    }

    const prompt = `
Context:
${context}

User question:
${question}

STRICT RESPONSE RULES:
- Max 5 bullet points TOTAL
- Use ONLY this structure:

Key points:
• ...
• ...

What it means for you:
• ...

What you should do next:
• ...

- Each bullet: one short sentence
- No paragraphs
- No symbols like *, **, #, -
- Write for SPOKEN explanation
- Respond only in ${getHumanLanguage(language)}
`;

    let answer = await callLLM(prompt, language);
    answer = enforceSpokenFormat(answer);

    const ssml = explanationToSSML(answer, language);
    const audioUrl = await generateSpeech(ssml, language);



    return res.json({
      success: true,
      answer,
      audioUrl,
    });

  } catch (err) {
    console.error("❌ Follow-up error:", err.message);
    return sendJSON(res, 500, {
      success: false,
      error: "Follow-up failed: " + err.message,
    });
  }
});

// ================= AUDIO CLEANUP =================
const AUDIO_DIR = path.join(__dirname, "public", "tts");
const MAX_AGE = 60 * 60 * 1000; // 1 hour

function cleanupOldAudioFiles() {
  if (!fs.existsSync(AUDIO_DIR)) {
    fs.mkdirSync(AUDIO_DIR, { recursive: true });
    return;
  }

  fs.readdir(AUDIO_DIR, (err, files) => {
    if (err) {
      console.error("❌ Cannot read audio directory:", err.message);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(AUDIO_DIR, file);
      fs.stat(filePath, (err, stats) => {
        if (err) return;

        const age = Date.now() - stats.mtimeMs;
        if (age > MAX_AGE) {
          fs.unlink(filePath, (err) => {
            if (!err) console.log(`🧹 Deleted old audio: ${file}`);
          });
        }
      });
    });
  });
}

// Run cleanup every 30 minutes
setInterval(cleanupOldAudioFiles, 30 * 60 * 1000);
cleanupOldAudioFiles(); // Initial cleanup

// ================= ERROR HANDLER =================
// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  const errorMessage = err.message || "Unknown error";
  const statusCode = err.status || 500;
  
  console.error("❌ Error:", {
    message: errorMessage,
    path: req.path,
    method: req.method,
    origin: req.get("origin"),
    stack: err.stack,
  });

  return res.status(statusCode).json({
    success: false,
    error: errorMessage,
    timestamp: new Date().toISOString(),
    path: req.path,
  });
});

// 404 Handler
app.use((req, res) => {
  console.warn(`⚠️ 404 - Not found: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    error: "Route not found",
    path: req.path,
  });
});

// ================= START SERVER =================
server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Backend running on port ${PORT} (LAN enabled)`);
  console.log(`✅ WebSocket server ready at ws://localhost:${PORT}/ws`);
});