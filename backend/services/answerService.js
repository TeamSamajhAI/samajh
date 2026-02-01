import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { fileURLToPath } from "url";
import { semanticSearch } from "../utils/semanticSearch.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const EMBEDDINGS_DIR = path.join(__dirname, "../data/embeddings");

export async function answerQuestion(question) {
  // 1️⃣ Embed the question
  const queryEmbedding = (
    await client.embeddings.create({
      model: "text-embedding-3-small",
      input: question,
    })
  ).data[0].embedding;

  // 2️⃣ Load all document embeddings
  let documents = [];

  const files = fs.readdirSync(EMBEDDINGS_DIR);
  for (const file of files) {
    const data = JSON.parse(
      fs.readFileSync(path.join(EMBEDDINGS_DIR, file), "utf-8")
    );
    documents.push(...data);
  }

  // 3️⃣ Semantic search
  const topChunks = semanticSearch(queryEmbedding, documents, 4);

  const context = topChunks.map(c => c.chunk).join("\n\n");

  // 4️⃣ Generate answer (STRICTLY grounded)
  const completion = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a government scheme assistant. Answer ONLY using the provided context. If the answer is not in the context, say you do not know.",
      },
      {
        role: "user",
        content: `Context:\n${context}\n\nQuestion:\n${question}`,
      },
    ],
  });

  return {
    answer: completion.choices[0].message.content,
    sources: topChunks.map(c => c.chunk.slice(0, 120) + "..."),
  };
}
