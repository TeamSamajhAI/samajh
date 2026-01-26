function detectIntent(query = "") {
  const q = query.toLowerCase();

  if (
    q.includes("what should i do") ||
    q.includes("what do i do") ||
    q.includes("next step") ||
    q.includes("how do i respond") ||
    q.includes("what action")
  ) {
    return "ACTION";
  }

  if (
    q.includes("what is this") ||
    q.includes("what does this mean") ||
    q.includes("why did i receive") ||
    q.includes("what is this notice")
  ) {
    return "INFO";
  }

  return "SUMMARY";
}

module.exports = { detectIntent };
