import chalk from "chalk";
import sharp from "sharp";
/**
 * Converts a WebP image to PNG format
 * @param {string} inputPath - Path to the WebP image
 * @param {string} outputPath - Path where the PNG image will be saved
 * @returns {Promise<void>} - A promise that resolves when conversion is complete
 */
export async function convertWebPToPNG(inputPath, outputPath) {
    try {
        console.log(chalk.blue(`[ℹ] Converting WebP to PNG: ${outputPath}`));
        await sharp(inputPath).png().toFile(outputPath);
        console.log(chalk.green("[✔] Succesfully converted to PNG"));
    }
    catch (error) {
        console.error(chalk.red("[✘] Failed to convert WebP to PNG:"), error);
        throw error;
    }
}
/**
 * Converts a PNG image to WebP format
 * @param {string} inputPath - Path to the PNG image
 * @param {string} outputPath - Path where the WebP image will be saved
 * @returns {Promise<void>} - A promise that resolves when conversion is complete
 */
export async function convertPNGToWebP(inputPath, outputPath) {
    try {
        console.log(chalk.blue(`[ℹ] Converting PNG to WebP: ${outputPath}`));
        await sharp(inputPath).webp({ quality: 95 }).toFile(outputPath);
        console.log(chalk.green("[✔] Succesfully converted to WebP"));
    }
    catch (error) {
        console.error(chalk.red("[✘] Failed to convert PNG to WebP:"), error);
        throw error;
    }
}
