const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/qr", async (req, res) => {
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.goto("https://web.whatsapp.com", { waitUntil: "networkidle2" });

  await page.waitForSelector("canvas[aria-label='Scan me!']", { timeout: 30000 });
  const qrCanvas = await page.$("canvas[aria-label='Scan me!']");
  const qrData = await page.evaluate((canvas) => canvas.toDataURL(), qrCanvas);

  await browser.close();
  res.send(`<img src="${qrData}" alt="QR Code" />`);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
