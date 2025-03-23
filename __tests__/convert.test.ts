import fs from "fs";
import os from "os";
import path from "path";
import sharp from "sharp";
import { convertPNGToWebP, convertWebPToPNG } from "../src/convert";
import { createTestImage } from "./helpers/create-image";

describe("Conversion Tests", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "conversion-test-"));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  describe("WebP to PNG Conversion", () => {
    it("should convert WebP to PNG successfully", async () => {
      const inputPath = path.join(tempDir, "test.webp");
      const outputPath = path.join(tempDir, "test.png");

      await createTestImage(inputPath, "webp");
      await convertWebPToPNG(inputPath, outputPath);
      expect(fs.existsSync(outputPath)).toBe(true);
    });
  });

  describe("PNG to WebP Conversion", () => {
    const createPNG = async (filePath: string) => {
      await sharp({
        create: {
          width: 100,
          height: 100,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        },
      })
        .png()
        .toFile(filePath);
    };

    it("should convert PNG to WebP successfully", async () => {
      const inputPath = path.join(tempDir, "test.png");
      const outputPath = path.join(tempDir, "test.webp");

      await createPNG(inputPath);
      await convertPNGToWebP(inputPath, outputPath);
      expect(fs.existsSync(outputPath)).toBe(true);
    });
  });
});
