#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { convertPNGToWebP, convertWebPToPNG } from "./convert.js";
import { resizeWebP } from "./resize.js";

async function main() {
  console.log("STARTING IMAGE PROCESSOR");

  try {
    if (process.argv.length < 3) {
      console.log("Usage: npx process-img <file-path> [--dump]");
      process.exit(1);
    }

    const filePath = process.argv[2];
    console.log("File Path Provided:", filePath);

    const dumpFlag = process.argv.includes("--dump");
    if (dumpFlag) {
      console.log(
        "Dump flag detected: Files will be saved to the current directory",
      );
    }

    if (!fs.existsSync(filePath)) {
      console.log("Error: File does not exist.");
      process.exit(1);
    }

    const extension = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath, extension);

    if (!extension) {
      console.log("Error: File has no extension.");
      process.exit(1);
    }

    const fileDir = path.dirname(filePath);
    let outputDir: string;
    let dirCreated = false;

    if (dumpFlag) {
      outputDir = fileDir;
    } else {
      outputDir = path.join(fileDir, fileName);
      try {
        fs.mkdirSync(outputDir, { mode: 0o755 });
        dirCreated = true;
      } catch (err) {
        console.log("Error: Failed to create directory:", outputDir);
        process.exit(1);
      }
    }

    const originalFileName = path.join(outputDir, fileName);

    const cleanExtension = extension.replace(".", "");

    try {
      switch (cleanExtension) {
        case "png":
          const webpPath = originalFileName + ".webp";
          await convertPNGToWebP(filePath, webpPath);

          if (dumpFlag) {
            console.log("Skipping original file copy in dump mode");
          } else {
            const pngOutput = originalFileName + ".png";
            fs.copyFileSync(filePath, pngOutput);
          }
          break;

        case "webp":
          const pngPath = originalFileName + ".png";
          await convertWebPToPNG(filePath, pngPath);

          if (dumpFlag) {
            console.log("Skipping original file copy in dump mode");
          } else {
            const webpOutput = originalFileName + ".webp";
            fs.copyFileSync(filePath, webpOutput);
          }
          break;

        default:
          console.log(
            "Error: Invalid file extension. Only png and webp are supported.",
          );
          if (dirCreated) {
            fs.rmSync(outputDir, { recursive: true, force: true });
          }
          process.exit(1);
      }

      const baseResizeImage = dumpFlag ? filePath : originalFileName + ".webp";
      const sizes: Record<string, number> = {
        sm: 480,
        md: 768,
        lg: 1024,
        xl: 1280,
      };

      await resizeWebP(fileName, baseResizeImage, sizes, outputDir);

      console.log("FINISHED RUNNING IMAGE PROCESSOR");
      console.log(`Files have been saved to ${outputDir}`);

      // Delete the original file
      fs.rmSync(filePath, { force: true });
    } catch (err) {
      console.error("Processing error:", err);

      if (dirCreated) {
        try {
          fs.rmSync(outputDir, { recursive: true, force: true });
        } catch (cleanupErr) {
          console.error(
            "Could not remove output directory after error:",
            cleanupErr,
          );
        }
      }
      process.exit(1);
    }
  } catch (err) {
    console.error("Fatal error:", err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Unhandled error in main:", err);
  process.exit(1);
});
