const Tesseract = require("tesseract.js");

async function extractTextFromImage(buffer, lang = "eng") {
  const {
    data: { text },
  } = await Tesseract.recognize(buffer, lang, {
    logger: () => {},
  });

  return text || "";
}

module.exports = { extractTextFromImage };
