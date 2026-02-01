export async function summarizeChunks(
  openai,
  chunks,
  language = "English",
  intent = "SUMMARY"
) {
  /* ================= SAMAJHAI SYSTEM PROMPT ================= */

  const SAMAJHAI_SYSTEM_PROMPT = `
You are SamajhAI, an intelligent document understanding and explanation assistant designed for Digital India.

Your task is to deeply understand the given government or official document before responding.

CRITICAL BEHAVIOR RULES:
- DO NOT read the document line by line
- DO NOT summarize mechanically
- DO NOT sound like a chatbot
- DO NOT copy phrases directly unless necessary

You must explain the document as if:
- A knowledgeable teacher, OR
- A government officer explaining to a common citizen

Explain in SIMPLE language:
1. What this document is about
2. Why it exists and who it is meant for
3. Important rules, eligibility, or conditions
4. How the process works (step by step if applicable)
5. What the citizen should do next (if relevant)

Use short paragraphs.
Use a calm, confident, human speaking tone.
Avoid legal jargon. Explain terms when needed.

SPEAKING FORMAT RULES:
- Use short paragraphs.
- Use bullet points with "•" symbol for lists.
- Clearly say dates, numbers, and amounts.
- Group content into sections like:
  "Key points", "Important dates", "What you should do".
- The output will be spoken aloud, so write naturally.

`;

  /* ================= LANGUAGE LOCK (CRITICAL) ================= */

  const languageLock = `
LANGUAGE RULES (STRICT):
- Respond ONLY in ${language}
- If Hindi → ONLY Devanagari script
- If Kannada → ONLY Kannada script
- DO NOT mix languages
- DO NOT use English words if language is not English
`;

  const systemMessage = {
    role: "system",
    content: `${SAMAJHAI_SYSTEM_PROMPT}\n\n${languageLock}`,
  };

  /* ================= INTENT INSTRUCTION ================= */

  let intentInstruction = "";

  if (intent === "ACTION") {
    intentInstruction = `
INTENT:
The citizen wants to know what to do next.
Explain clear, step-by-step actions.
Be practical and reassuring.
`;
  } else if (intent === "INFO") {
    intentInstruction = `
INTENT:
The citizen wants to understand the document.
Explain what it is, why it exists, and who issued it.
Do NOT give steps unless necessary.
`;
  } else {
    intentInstruction = `
INTENT:
The citizen wants a simple explanation.
Focus on meaning and purpose, not procedures.
`;
  }

  /* ================= CHUNK‑LEVEL EXPLANATION ================= */

  const chunkSummaries = [];

  for (let i = 0; i < chunks.length; i++) {
    const userPrompt = `
${intentInstruction}

TASK:
- Understand the document content
- Explain it in a human, citizen‑friendly way
- Do NOT repeat text verbatim
- Do NOT add new information
- Respond ONLY in ${language}

DOCUMENT TEXT:
${chunks[i]}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        systemMessage,
        { role: "user", content: userPrompt },
      ],
      temperature: 0.25,
      max_tokens: 220,
    });

    chunkSummaries.push(
      completion.choices[0].message.content.trim()
    );
  }

  /* ================= FINAL MERGE ================= */

  let mergePrompt = `
${intentInstruction}

TASK:
- Combine all explanations into ONE clear explanation
- Ensure smooth flow like spoken language
- Do NOT repeat information
- Do NOT add anything new
- Use ONLY ${language}

PARTIAL EXPLANATIONS:
${chunkSummaries.join("\n\n")}
`;

  const finalCompletion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      systemMessage,
      { role: "user", content: mergePrompt },
    ],
    temperature: 0.2,
    max_tokens: 320,
  });

  const finalText = finalCompletion.choices[0].message.content.trim();

  /* ================= LANGUAGE‑AWARE HEADINGS (TTS SAFE) ================= */

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
    return `......आइए इस दस्तावेज़ को आसान भाषा में समझते हैं......:\n\n${finalText}`;
  }
  if (language === "Kannada") {
    return `......ದಾಖಲೆಯ ಸಾರಾಂಶ......:\n\n${finalText}`;
  }

  return `......Let's Understand the document in simple words......:\n\n${finalText}`;
}

// module.exports = { summarizeChunks };
