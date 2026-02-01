// ================= ENV SETUP =================
//const pdf = require("pdf-parse");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));


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

  // Handle bullets & newlines → pauses
  const formatted = text
    .replace(/\n\n/g, '<break time="700ms"/>')
    .replace(/\n/g, '<break time="500ms"/>')
    .replace(/•|-/g, '<break time="400ms"/>');

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
// require("dotenv").config({
//   path: require("path").join(__dirname, ".env"),
//   override: true,
// });
console.log("AZURE SPEECH REGION:", process.env.AZURE_SPEECH_REGION);
const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse/lib/pdf-parse");
const OpenAI = require("openai");

const { convertPdfToImages } = require("./utils/pdfToImage");
const { detectIntent } = require("./utils/detectIntent");
const { extractTextFromImage } = require("./utils/ocr");
const { chunkText } = require("./utils/chunker");
const { summarizeChunks } = require("./utils/summarizeChunks");
const { generateSpeech } = require("./utils/azureTTS");

// ================= APP INIT =================
const app = express();
const PORT =process.env.PORT || 5001;

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
const allowedOrigins = [
  "https://samajhai-2aea5.web.app",
  "https://samajhai-2aea5.firebaseapp.com"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow server-to-server & curl
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error("❌ CORS blocked origin:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options("*", cors());
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

// if not already present

async function callLLM(prompt, language = "en") {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant explaining government documents.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error("LLM error: " + err);
  }

  const data = await response.json();
  return data.choices[0].message.content;
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

// ================= FOLLOW-UP (VOICE / TEXT) =================
app.post("/ask-followup", async (req, res) => {
  try {
    const { context, question, language = "en" } = req.body;

    if (!context?.trim() || !question?.trim()) {
      return res.status(400).json({
        success: false,
        error: "Missing context or question",
      });
    }

    const prompt = `
Context:
${context}

User question:
${question}

Answer rules:
- Max 5 bullet points
- Each bullet max 1 line
- No long paragraphs
- Simple, spoken language
- Clean formatting
- Answer clearly in ${getHumanLanguage(language)}
`;


    // 1️⃣ Text answer (OpenAI)
    const answer = await callLLM(prompt, language);
    const ssml = explanationToSSML(answer, language);

    // 2️⃣ Voice answer (Sarvam)
    const audioUrl = await generateSpeech(ssml, language);


    return res.json({
      success: true,
      answer,
      audioUrl,
    });
  } catch (err) {
    console.error("❌ Follow-up error:", err);
    return res.status(500).json({
      success: false,
      error: "Follow-up failed",
    });
  }
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
      const pdfData = await pdfParse(req.file.buffer);
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
    // const audioUrl = await generateSpeech(finalSummary, language);
    const ssml = explanationToSSML(finalSummary, language);
   const audioUrl = await generateSpeech(ssml, language);


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


function cleanupOldAudioFiles() {
  fs.readdir(AUDIO_DIR, (err, files) => {
    if (err) {
      console.error("❌ Cannot read audio directory", err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(AUDIO_DIR, file);

      fs.stat(filePath, (err, stats) => {
        if (err) return;

        const age = Date.now() - stats.mtimeMs;

        if (age > MAX_AGE) {
          fs.unlink(filePath, () => {
            console.log(`🧹 Deleted old audio: ${file}`);
          });
        }
      });
    });
  });
}


// 📁 Folder where TTS audio is stored
const AUDIO_DIR = path.join(__dirname, "public", "tts");

// ⏱️ Auto‑delete after 1 hour
const MAX_AGE = 60 * 60 * 1000; // 1 hour

// ================= START SERVER =================
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Backend running on port ${PORT} (LAN enabled)`);
});
