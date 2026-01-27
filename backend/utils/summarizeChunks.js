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
  content: `
You are a government document explanation assistant.

CRITICAL LANGUAGE RULES:
- Respond ONLY in ${language}.
- If the language is Hindi, use ONLY Hindi written in Devanagari script.
- If the language is Kannada, use ONLY Kannada script.
- Do NOT use English words, sentences, or headings.
- Do NOT translate to English.
- Do NOT mix languages.

Breaking these rules is NOT allowed.
`,
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
 // ================= FINAL MERGE =================
let mergePrompt = "";

if (intent === "ACTION") {
  mergePrompt = `
${intentInstruction}

TASK:
- Merge the explanations into ONE clear response
- Clearly explain what the citizen should DO next
- Present the answer as numbered steps
- Use short, simple sentences
- Avoid legal or technical language
- Use ONLY ${language}
- Do NOT add new information

PARTIAL EXPLANATIONS:
${chunkSummaries.join("\n\n")}
`;
} else if (intent === "INFO") {
  mergePrompt = `
${intentInstruction}

TASK:
- Explain the document in THREE clear parts:
  1. What this document is
  2. Why the citizen received it
  3. Who issued it
- Use calm, citizen-friendly language
- Do NOT give instructions or steps
- Use ONLY ${language}
- Do NOT add new information

PARTIAL EXPLANATIONS:
${chunkSummaries.join("\n\n")}
`;
} else {
  mergePrompt = `
${intentInstruction}

TASK:
- Merge the partial explanations into ONE simple explanation
- Focus on meaning, not actions
- Keep the explanation short and clear
- Use ONLY ${language}
- Do NOT add new information

PARTIAL EXPLANATIONS:
${chunkSummaries.join("\n\n")}
`;
}


  const finalCompletion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      systemMessage,
      { role: "user", content: mergePrompt },
    ],
    temperature: 0.15,
    max_tokens: 220,
  });

const finalText = finalCompletion.choices[0].message.content.trim();

// ===== Language‑aware headings (CRITICAL for TTS) =====

if (intent === "ACTION") {
  if (language === "Hindi") {
    return `आपको आगे क्या करना चाहिए:\n\n${finalText}`;
  }
  if (language === "Kannada") {
    return `ನೀವು ಮುಂದೇನು ಮಾಡಬೇಕು:\n\n${finalText}`;
  }
  return `What you should do next:\n\n${finalText}`;
}

if (intent === "INFO") {
  if (language === "Hindi") {
    return `इस दस्तावेज़ के बारे में:\n\n${finalText}`;
  }
  if (language === "Kannada") {
    return `ಈ ದಾಖಲೆ ಬಗ್ಗೆ:\n\n${finalText}`;
  }
  return `About this document:\n\n${finalText}`;
}

// SUMMARY
if (language === "Hindi") {
  return `दस्तावेज़ का सारांश:\n\n${finalText}`;
}
if (language === "Kannada") {
  return `ದಾಖಲೆಯ ಸಾರಾಂಶ:\n\n${finalText}`;
}

return `Summary of the document:\n\n${finalText}`;
}

module.exports = { summarizeChunks };
