import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = path.join(__dirname, "../data/raw_pdfs");
const OUTPUT_DIR = path.join(__dirname, "../data/extracted_text");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const pdfs = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith(".pdf"));

console.log(`📄 Found ${pdfs.length} PDFs for extraction`);

if (pdfs.length === 0) {
  console.log("⚠️ No PDFs found in input directory");
  process.exit(0);
}

let successCount = 0;
let failCount = 0;

function extractPdf(pdf) {
  const inputPath = path.join(INPUT_DIR, pdf);
  const outputPath = path.join(OUTPUT_DIR, pdf.replace(".pdf", ".txt"));

  console.log(`\n📖 Processing: ${pdf}`);
  console.log(`   Input: ${inputPath}`);

  // Verify input file exists
  if (!fs.existsSync(inputPath)) {
    console.error(`❌ Input file not found`);
    failCount++;
    return;
  }

  const stats = fs.statSync(inputPath);
  console.log(`   Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

  // Try 1: Standard pdftotext with layout
  try {
    console.log(`   🔄 Attempt 1: pdftotext -layout...`);
    execSync(`pdftotext -layout "${inputPath}" "${outputPath}"`, {
      stdio: "pipe",
      encoding: "utf-8"
    });

    if (fs.existsSync(outputPath)) {
      const outStats = fs.statSync(outputPath);
      if (outStats.size > 0) {
        console.log(`✅ Extracted: ${pdf} (${(outStats.size / 1024).toFixed(2)} KB)`);
        successCount++;
        return;
      } else {
        console.warn(`   ⚠️ Output file is empty`);
      }
    }
  } catch (err) {
    console.warn(`   ⚠️ Attempt 1 failed: ${err.message.split('\n')[0]}`);
  }

  // Try 2: pdftotext with UTF-8 encoding
  try {
    console.log(`   🔄 Attempt 2: pdftotext -enc UTF-8...`);
    execSync(`pdftotext -enc UTF-8 "${inputPath}" "${outputPath}"`, {
      stdio: "pipe",
      encoding: "utf-8"
    });

    if (fs.existsSync(outputPath)) {
      const outStats = fs.statSync(outputPath);
      if (outStats.size > 0) {
        console.log(`✅ Extracted (UTF-8): ${pdf} (${(outStats.size / 1024).toFixed(2)} KB)`);
        successCount++;
        return;
      }
    }
  } catch (err) {
    console.warn(`   ⚠️ Attempt 2 failed: ${err.message.split('\n')[0]}`);
  }

  // Try 3: Check if pdftotext exists
  try {
    console.log(`   🔄 Checking pdftotext availability...`);
    execSync(`which pdftotext`, { stdio: "pipe" });
    console.log(`   ✓ pdftotext found`);
  } catch (err) {
    console.error(`   ❌ pdftotext not installed. Install with:`);
    console.error(`      macOS: brew install poppler-utils`);
    console.error(`      Ubuntu: sudo apt-get install poppler-utils`);
    failCount++;
    return;
  }

  // Try 4: pdftoppm + tesseract (image-based OCR)
  try {
    console.log(`   🔄 Attempt 3: Image-based OCR (pdftoppm + tesseract)...`);
    
    const tempImage = path.join(OUTPUT_DIR, `.temp_${Date.now()}.png`);
    execSync(`pdftoppm "${inputPath}" "${tempImage.replace('.png', '')}" -png -f 1 -l 1`, {
      stdio: "pipe"
    });

    if (fs.existsSync(`${tempImage.replace('.png', '')}-1.png`)) {
      const pngPath = `${tempImage.replace('.png', '')}-1.png`;
      execSync(`tesseract "${pngPath}" stdout > "${outputPath}"`, {
        stdio: "pipe"
      });

      // Cleanup
      fs.unlinkSync(pngPath);

      if (fs.existsSync(outputPath)) {
        const outStats = fs.statSync(outputPath);
        if (outStats.size > 0) {
          console.log(`✅ Extracted (OCR): ${pdf} (${(outStats.size / 1024).toFixed(2)} KB)`);
          successCount++;
          return;
        }
      }
    }
  } catch (err) {
    console.warn(`   ⚠️ Attempt 3 failed: ${err.message.split('\n')[0]}`);
  }

  console.error(`❌ All extraction methods failed for ${pdf}`);
  failCount++;
}

for (const pdf of pdfs) {
  extractPdf(pdf);
}

console.log("\n" + "=".repeat(50));
console.log("🎉 PDF text extraction complete");
console.log(`📊 Summary: ${successCount} succeeded, ${failCount} failed`);
console.log("=".repeat(50));

if (failCount > 0) {
  process.exit(1);
}