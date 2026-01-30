import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { fileURLToPath } from "url";

// ESM-safe __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths (IMPORTANT)
const SOURCES_PATH = path.join(__dirname, "../data_sources/sources.json");
const OUTPUT_DIR = path.join(__dirname, "../data/raw_pdfs");

// Ensure output folder exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Read sources.json
const sources = JSON.parse(fs.readFileSync(SOURCES_PATH, "utf-8"));

// Filter only PDFs
const pdfSources = sources.filter(src => src.type === "pdf");

console.log(`📄 Found ${pdfSources.length} PDF sources`);

async function downloadPDF(source) {
  const fileName =
    source.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "") + ".pdf";

  const filePath = path.join(OUTPUT_DIR, fileName);

  console.log(`⬇️ Downloading: ${source.name}`);

  const response = await fetch(source.url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${source.url}`);
  }

  const buffer = await response.arrayBuffer();
  fs.writeFileSync(filePath, Buffer.from(buffer));

  console.log(`✅ Saved: ${fileName}`);
}

async function run() {
  for (const src of pdfSources) {
    try {
      await downloadPDF(src);
    } catch (err) {
      console.error(`❌ Error downloading ${src.name}:`, err.message);
    }
  }

  console.log("🎉 PDF fetching complete");
}

run();
