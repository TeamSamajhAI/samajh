import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const INPUT_DIR = path.join(__dirname, "../data/chunks");
const OUTPUT_DIR = path.join(__dirname, "../data/embeddings");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith(".json"));

console.log(`🧠 Found ${files.length} chunk files for embedding`);

for (const file of files) {
  const chunks = JSON.parse(
    fs.readFileSync(path.join(INPUT_DIR, file), "utf-8")
  );

  let embeddings = [];

  for (let i = 0; i < chunks.length; i++) {
    const response = await client.embeddings.create({
      model: "text-embedding-3-small",
      input: chunks[i],
    });

    embeddings.push({
      chunk: chunks[i],
      embedding: response.data[0].embedding,
    });
  }

  const outputPath = path.join(
    OUTPUT_DIR,
    file.replace(".chunks.json", ".embeddings.json")
  );

  fs.writeFileSync(outputPath, JSON.stringify(embeddings, null, 2));
  console.log(`✅ Embedded: ${file}`);
}

console.log("🎉 Embedding generation complete");
