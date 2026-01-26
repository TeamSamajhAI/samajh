async function summarizeChunks(
  openai,
  chunks,
  language = "English",
  intent = "SUMMARY"
) {
  // ================= INTENT INSTRUCTION =================
  let intentInstruction = "";

  if (intent === "ACTION") {
    intentInstruction = `
INTENT:
The citizen wants to know what to do next.
Explain clear, step-by-step actions.
Use bullet points if helpful.
Avoid legal or technical jargon.
`;
  } else if (intent === "INFO") {
    intentInstruction = `
INTENT:
The citizen wants to understand the document.
Explain:
- What this document is
- Why they received it
- Who issued it
Keep the tone calm and factual.
`;
  } else {
    intentInstruction = `
INTENT:
The citizen wants a simple explanation.
Focus on meaning, not instructions.
`;
  }

  const chunkSummaries = [];

  // ================= SYSTEM MESSAGE (HARD LANGUAGE LOCK) =================
  const systemMessage = {
    role: "system",
    content: `You are a government document explanation assistant.
You MUST respond ONLY in ${language}.
You are NOT allowed to use any other language.
Do NOT translate or mix languages under any circumstance.`,
  };

  // ================= CHUNK‑LEVEL EXPLANATION =================
  for (let i = 0; i < chunks.length; i++) {
    const userPrompt = `
${intentInstruction}

TASK:
- Explain the following government document text
- Use simple, citizen-friendly language
- Respond ONLY in ${language}
- Do NOT add new information
- Do NOT repeat previous explanations

TEXT:
${chunks[i]}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        systemMessage,
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
      max_tokens: 140,
    });

    chunkSummaries.push(
      completion.choices[0].message.content.trim()
    );
  }

  // ================= FINAL MERGE =================
  const mergePrompt = `
${intentInstruction}

TASK:
- Merge the partial explanations into ONE clear explanation
- Remove repetition
- Use ONLY ${language}
- Keep it simple and factual
- Do NOT explain the process

PARTIAL EXPLANATIONS:
${chunkSummaries.join("\n\n")}
`;

  const finalCompletion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      systemMessage,
      { role: "user", content: mergePrompt },
    ],
    temperature: 0.15,
    max_tokens: 220,
  });

  return finalCompletion.choices[0].message.content.trim();
}

module.exports = { summarizeChunks };
