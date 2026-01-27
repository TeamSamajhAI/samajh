const fs = require("fs");
const path = require("path");
const os = require("os");
const pdfPoppler = require("pdf-poppler");

async function convertPdfToImages(pdfBuffer) {
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

module.exports = { convertPdfToImages };
