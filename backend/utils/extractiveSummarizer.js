// utils/extractiveSummarizer.js

export function extractiveSummary(text, maxSentences = 5) {
  if (!text || typeof text !== "string") return "";

  // Clean text
  const cleaned = text
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Split into sentences
  const sentences = cleaned
    .split(/\. |\? |! /)
    .filter(s => s.length > 40);

  // Take first N meaningful sentences
  const summary = sentences.slice(0, maxSentences).join(". ");

  return summary ? summary + "." : cleaned.slice(0, 500);
}

module.exports = { extractiveSummary };
