import { answerQuestion } from "../services/answerService.js";

const question = "Who is eligible for PM Awas Yojana?";

const result = await answerQuestion(question);

console.log("\n🧠 ANSWER:\n", result.answer);
console.log("\n📚 SOURCES USED:");
result.sources.forEach((s, i) => console.log(`${i + 1}. ${s}`));
