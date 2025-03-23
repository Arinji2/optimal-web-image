import fs from "fs-extra";
import path from "path";
import sharp from "sharp";
import { resizeWebP } from "../src/resize";

async function createTestImage(outputPath: string): Promise<void> {
  const width = 800;
  const height = 800;
  const imageBuffer = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 0, g: 128, b: 255, alpha: 1 },
    },
  })
    .png()
    .toBuffer();
  await fs.writeFile(outputPath, imageBuffer);
}

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
    await createTestImage(path.join(tempDir, "test.png"));
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

  it("should throw an error if no sizes are provided", async () => {
    await expect(resizeWebP("test", "test.webp", {}, tempDir)).rejects.toThrow(
      /No sizes provided/,
    );
  });
});
