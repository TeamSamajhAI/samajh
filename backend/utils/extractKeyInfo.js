// utils/extractKeyInfo.js
const { KEY_INFO_SYSTEM_PROMPT } = require("./KeyInfoPrompt");

export async function extractKeyInfo(openai, text, language) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: KEY_INFO_SYSTEM_PROMPT.replace("${language}", language),
      },
      {
        role: "user",
        content: text,
      },
    ],
    temperature: 0.1,
    max_tokens: 300,
  });

  try {
    return JSON.parse(completion.choices[0].message.content);
  } catch {
    return { key_facts: [] };
  }
}

module.exports = { extractKeyInfo };
