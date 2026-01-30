import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = path.join(__dirname, "../data/extracted_text");
const OUTPUT_DIR = path.join(__dirname, "../data/chunks");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const CHUNK_SIZE = 800; // characters
const OVERLAP = 150;

const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith(".txt"));

console.log(`📄 Found ${files.length} text files for chunking`);

for (const file of files) {
  const text = fs.readFileSync(path.join(INPUT_DIR, file), "utf-8");

  let chunks = [];
  let start = 0;

  while (start < text.length) {
    const end = start + CHUNK_SIZE;
    chunks.push(text.slice(start, end));
    start = end - OVERLAP;
  }

  const outputPath = path.join(
    OUTPUT_DIR,
    file.replace(".txt", ".chunks.json")
  );

  fs.writeFileSync(outputPath, JSON.stringify(chunks, null, 2));
  console.log(`✅ Chunked: ${file} → ${chunks.length} chunks`);
}

console.log("🎉 Text chunking complete");
