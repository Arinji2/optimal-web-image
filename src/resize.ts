import chalk from "chalk";
import path from "path";
import sharp from "sharp";

/**
 * Resizes a WebP image to multiple sizes
 * @param {string} fileName - Base name for the output files
 * @param {string} inputPath - Path to the WebP image
 * @param {Record<string, number>} sizes - Object mapping size names to width in pixels
 * @param {string} outputDir - Directory where resized images will be saved
 * @returns {Promise<void>} - A promise that resolves when all resizing operations are complete
 */
export async function resizeWebP(
  fileName: string,
  inputPath: string,
  sizes: Record<string, number>,
  outputDir: string,
): Promise<void> {
  console.log(chalk.yellow(`[→] Starting resizing for: ${inputPath}`));

  const inputImage = sharp(inputPath);
  for (const [sizeName, width] of Object.entries(sizes)) {
    try {
      const outputPath = path.join(outputDir, `${fileName}_${sizeName}.webp`);
      console.log(
        chalk.blue(`[ℹ] Resizing to ${sizeName} (${width}px): ${outputPath}`),
      );

      await inputImage
        .clone()
        .resize({ width, kernel: "lanczos3" })
        .webp({ quality: 95 })
        .toFile(outputPath);

      console.log(chalk.green(`[✔] Successfully resized to ${sizeName}`));
    } catch (error) {
      console.error(chalk.red(`[✘] Failed resizing to ${sizeName}:`), error);
    }
  }
  console.log(chalk.green("[✔] All resize operations completed."));
}
