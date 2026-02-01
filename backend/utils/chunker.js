export function chunkText(text, size = 2000) {
  if (!text) return [];

  const chunks = [];
  let start = 0;

  while (start < text.length) {
    chunks.push(text.slice(start, start + size));
    start += size;
  }

  return chunks;
}
