import fs from "fs-extra";
import sharp from "sharp";

export async function createTestImage(
  outputPath: string,
  format: "png" | "webp",
): Promise<void> {
  const width = 800;
  const height = 800;
  const image = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 0, g: 128, b: 255, alpha: 1 },
    },
  });
  switch (format) {
    case "png":
      image.png();
      break;
    case "webp":
      image.webp({ quality: 95 });
      break;
    default:
      throw new Error("Invalid format");
  }
  const imageBuffer = await image.toBuffer();
  await fs.writeFile(outputPath, imageBuffer);
}
