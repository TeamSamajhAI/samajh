// ================= ENV SETUP =================
const { detectIntent } = require("./utils/detectIntent");
const { extractTextFromImage } = require("./utils/ocr");
require("dotenv").config({
  path: require("path").join(__dirname, ".env"),
  override: true,
});

console.log(
  "OPENAI KEY LOADED:",
  process.env.OPENAI_API_KEY?.startsWith("sk-")
);

// ================= IMPORTS =================
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const pdf = require("pdf-parse");
const OpenAI = require("openai");

const { chunkText } = require("./utils/chunker");
const { summarizeChunks } = require("./utils/summarizeChunks");

// ================= APP INIT =================
const app = express();
const PORT = 5001;

// ================= OPENAI CLIENT =================
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= MULTER CONFIG =================
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = [".pdf", ".png", ".jpg", ".jpeg"];
    if (!allowed.includes(ext)) {
      return cb(new Error("Only PDF or image files are allowed"), false);
    }
    cb(null, true);
  },
});

// ================= LANGUAGE HELPERS =================
function getOcrLanguage(language) {
  switch (language?.toLowerCase()) {
    case "hi":
      return "hin";
    case "kn":
      return "kan";
    case "en":
    default:
      return "eng";
  }
}

function getHumanLanguage(language) {
  switch (language?.toLowerCase()) {
    case "hi":
      return "Hindi";
    case "kn":
      return "Kannada";
    case "en":
    default:
      return "English";
  }
}

// ================= ROUTES =================

// Health
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    data: { message: "Backend baseline OK" },
  });
});

// Ping (CRITICAL for fetch debugging)
app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

// ================= TEXT PROCESSING =================
app.post("/process-text", (req, res) => {
  const { query, language = "en" } = req.body;

  if (!query || !query.trim()) {
    return res.status(400).json({
      success: false,
      error: "Query text is required",
    });
  }

  const intent = detectIntent(query);

  return res.status(200).json({
    success: true,
    data: {
      intent,
      response: `You asked: "${query}".`,
    },
  });
});

// ================= DOCUMENT PROCESSING =================

app.post("/process-document", upload.single("document"), async (req, res) => {
  try {
    
    console.log("BODY:", req.body);
    console.log("FILE:", req.file?.originalname);
    console.log("📄 /process-document called");

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No document uploaded",
      });
    }

    const { language = "en", query = "" } = req.body;
    const ext = path.extname(req.file.originalname).toLowerCase();

    let extractedText = "";

    // PDF
    if (ext === ".pdf") {
      const pdfData = await pdf(req.file.buffer);
      extractedText = pdfData.text || "";
    }
    // IMAGE OCR
    else {
      const ocrLang = getOcrLanguage(language);
      extractedText = await extractTextFromImage(
        req.file.buffer,
        ocrLang
      );
    }

    if (!extractedText.trim()) {
      return res.status(400).json({
        success: false,
        error: "No readable text found",
      });
    }

    // Intent + language
    const userIntent = detectIntent(query);
    const humanLanguage = getHumanLanguage(language);

    // Chunk + summarize
    const chunks = chunkText(extractedText, 2000).slice(0, 2);

    const finalSummary = await summarizeChunks(
      openai,
      chunks,
      humanLanguage,
      userIntent
    );

    return res.status(200).json({
      success: true,
      data: {
        type: ext === ".pdf" ? "pdf" : "image",
        intent: userIntent,
        totalChunks: chunks.length,
        summary: finalSummary,
      },
    });
  } catch (err) {
    console.error("❌ OCR/PDF error:", err);
    return res.status(500).json({
      success: false,
      error: "Document processing failed",
    });
  }
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("❌ Middleware error:", err);
  res.status(400).json({
    success: false,
    error: err.message || "Request failed",
  });
});

// ================= START SERVER =================
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Backend running on port ${PORT} (LAN enabled)`);
});

