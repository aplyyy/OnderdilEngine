import puppeteer from "puppeteer-core";
import path from "path";
import fs from "fs";

async function generatePDF() {
  const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const executablePath = fs.existsSync(chromePath) ? chromePath : edgePath;

  console.log("Using browser executable:", executablePath);

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();
  
  // Navigate to local laporan.html
  const htmlPath = path.resolve("laporan.html");
  console.log("Loading HTML from:", htmlPath);
  await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0" });

  const outputPath = path.resolve("TugasProject_CyberSec_ApliyTridiansyahRosdiana_20240810111.pdf");
  console.log("Saving PDF to:", outputPath);

  await page.pdf({
    path: outputPath,
    format: "A4",
    printBackground: true,
    margin: {
      top: "2cm",
      right: "2cm",
      bottom: "2cm",
      left: "2.5cm",
    },
  });

  await browser.close();
  console.log("PDF created successfully at:", outputPath);
}

generatePDF().catch((err) => {
  console.error("Error generating PDF:", err);
  process.exit(1);
});
