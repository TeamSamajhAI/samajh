// ================= ENV SETUP =================
function sendJSON(res, status, payload) {
  return res.status(status).json(payload);
}
require("dotenv").config({
  path: require("path").join(__dirname, ".env"),
  override: true,
});
console.log("AZURE SPEECH REGION:", process.env.AZURE_SPEECH_REGION);
const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdf = require("pdf-parse");
const OpenAI = require("openai");

const { convertPdfToImages } = require("./utils/pdfToImage");
const { detectIntent } = require("./utils/detectIntent");
const { extractTextFromImage } = require("./utils/ocr");
const { chunkText } = require("./utils/chunker");
const { summarizeChunks } = require("./utils/summarizeChunks");
const { generateSpeech } = require("./utils/azureTTS");

// ================= APP INIT =================
const app = express();
const PORT = 5001;

// ================= OPENAI CLIENT =================
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log(
  "OPENAI KEY LOADED:",
  process.env.OPENAI_API_KEY?.startsWith("sk-")
);
app.get("/test", (req, res) => {
  console.log("🔥 TEST ROUTE HIT");
  res.json({ ok: true });
});
// ================= MIDDLEWARE =================
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use("/tts", express.static("public"));

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

// Ping
app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

// ================= DOCUMENT PROCESSING =================
app.post("/process-document", upload.single("document"), async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file?.originalname);
    console.log("📄 /process-document called");

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

    // PDF
    if (ext === ".pdf") {
      const pdfData = await pdf(req.file.buffer);
      extractedText = pdfData.text || "";

      if (!extractedText.trim()) {
        console.log("📄 Scanned PDF detected, converting to images...");
        const ocrLang = getOcrLanguage(language);
        const imagePaths = await convertPdfToImages(req.file.buffer);

        let ocrText = "";
        for (const imgPath of imagePaths) {
          ocrText += await extractTextFromImage(
            fs.readFileSync(imgPath),
            ocrLang
          );
        }
        extractedText = ocrText;
      }
    }
    // IMAGE
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
  data: {
    summary: "",
    audioUrl: null,
  },
  error: "No readable text found",
});

    }

    // Intent + language
    const userIntent = detectIntent(query);
    const humanLanguage = getHumanLanguage(language);

    // Chunk + summarize (OPENAI ONLY)
    const chunks = chunkText(extractedText, 2000).slice(0, 1);

    const finalSummary = await summarizeChunks(
      openai,
      chunks,
      humanLanguage,
      userIntent
    );

    // Azure TTS
    const audioUrl = await generateSpeech(finalSummary, language);

    return res.status(200).json({
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
  console.error("❌ /process-document error:", err);

  return sendJSON(res, 500, {
    success: false,
    error: "Document processing failed",
  });
}

});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("❌ Unhandled middleware error:", err);

  return res.status(500).json({
    success: false,
    error: "Unexpected server error",
  });
});


// ================= START SERVER =================
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Backend running on port ${PORT} (LAN enabled)`);
});
