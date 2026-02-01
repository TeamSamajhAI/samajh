import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { fileURLToPath } from "url";

// ESM-safe __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const os = require("os");
// const pdfPoppler = require("pdf-poppler");

export async function convertPdfToImages(pdfBuffer) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "pdf-"));
  const pdfPath = path.join(tempDir, "input.pdf");

  fs.writeFileSync(pdfPath, pdfBuffer);

  const opts = {
    format: "png",
    out_dir: tempDir,
    out_prefix: "page",
    page: null,
  };

  await pdfPoppler.convert(pdfPath, opts);

  const files = fs
    .readdirSync(tempDir)
    .filter(f => f.endsWith(".png"))
    .map(f => path.join(tempDir, f));

  return files;
}

// module.exports = { convertPdfToImages };
