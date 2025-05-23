import fs from "fs-extra";
import path from "path";
import sharp from "sharp";
import { resizeWebP } from "../src/resize";
import { createTestImage } from "./helpers/create-image";

describe("resizeWebP", () => {
  const tempDir = path.join(__dirname, "temp");
  const inputPath = path.join(tempDir, "test.webp");
  const sizes = {
    sm: 480,
    md: 768,
    lg: 1024,
    xl: 1280,
  };

  beforeAll(async () => {
    await fs.ensureDir(tempDir);
    await createTestImage(path.join(tempDir, "test.png"), "png");
    await sharp(path.join(tempDir, "test.png"))
      .webp({ quality: 95 })
      .toFile(inputPath);
  });

  afterAll(async () => {
    await fs.remove(tempDir);
  });

  it("should resize the image to all specified sizes", async () => {
    await resizeWebP("test", inputPath, sizes, tempDir);

    for (const [sizeName, expectedWidth] of Object.entries(sizes)) {
      const outputPath = path.join(tempDir, `test_${sizeName}.webp`);

      expect(fs.existsSync(outputPath)).toBe(true);

      const image = sharp(outputPath);
      const metadata = await image.metadata();

      expect(metadata.width).toBe(expectedWidth);
      expect(metadata.format).toBe("webp");
    }
  });
});
