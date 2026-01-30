import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateAnswer(context, question, language = "en") {
  try {
    const langMap = {
      hi: "Hindi",
      kn: "Kannada",
      en: "English",
    };

    const humanLanguage = langMap[language] || "English";

    const prompt = `
Context:
${context}

User question:
${question}

STRICT RESPONSE RULES:
- Max 5 bullet points TOTAL
- Use ONLY this structure:

Key points:
• ...
• ...

What it means for you:
• ...

What you should do next:
• ...

- Each bullet: one short sentence
- No paragraphs
- No symbols like *, **, #, -
- Write for SPOKEN explanation
- Respond only in ${humanLanguage}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant explaining government documents in a clear, concise manner for spoken explanation.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    return response.choices[0].message.content;
  } catch (err) {
    console.error("❌ Generate Answer Error:", err.message);
    throw new Error("Failed to generate answer: " + err.message);
  }
}