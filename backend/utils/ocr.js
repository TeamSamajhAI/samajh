import Tesseract from "tesseract.js";

export async function extractTextFromImage(imageBuffer, lang = "eng") {
  const { data } = await Tesseract.recognize(imageBuffer, lang, {
    logger: () => {}, // silence logs
  });

  return data.text || "";
}
