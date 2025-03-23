#!/usr/bin/env node
import { Command } from "commander";
import fs from "fs";
import path from "path";
import { convertPNGToWebP, convertWebPToPNG } from "./convert.js";
import { resizeWebP } from "./resize.js";
const program = new Command();
program
    .name("process-web-image")
    .description("An image processor that creates a webp file, a fallback png, and resizes it in tailwind breakpoints")
    .argument("<file-path>", "Path to the image file")
    .option("--dump", "Save files to the current directory instead of creating a new folder")
    .action(async (filePath, options) => {
    console.log("STARTING IMAGE PROCESSOR");
    if (!fs.existsSync(filePath)) {
        console.error("Error: File does not exist.");
        process.exit(1);
    }
    const extension = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath, extension);
    if (!extension) {
        console.error("Error: File has no extension.");
        process.exit(1);
    }
    const fileDir = path.dirname(filePath);
    const outputDir = options.dump ? fileDir : path.join(fileDir, fileName);
    let dirCreated = false;
    if (!options.dump) {
        try {
            fs.mkdirSync(outputDir, { mode: 0o755 });
            dirCreated = true;
        }
        catch (err) {
            console.error("Error: Failed to create directory:", outputDir);
            process.exit(1);
        }
    }
    const originalFileName = path.join(outputDir, fileName);
    const cleanExtension = extension.replace(".", "");
    try {
        switch (cleanExtension) {
            case "png":
                await convertPNGToWebP(filePath, `${originalFileName}.webp`);
                if (!options.dump)
                    fs.copyFileSync(filePath, `${originalFileName}.png`);
                break;
            case "webp":
                await convertWebPToPNG(filePath, `${originalFileName}.png`);
                if (!options.dump)
                    fs.copyFileSync(filePath, `${originalFileName}.webp`);
                break;
            default:
                console.error("Error: Invalid file extension. Only png and webp are supported.");
                if (dirCreated)
                    fs.rmSync(outputDir, { recursive: true, force: true });
                process.exit(1);
        }
        const baseResizeImage = options.dump
            ? filePath
            : `${originalFileName}.webp`;
        const sizes = { sm: 480, md: 768, lg: 1024, xl: 1280 };
        await resizeWebP(fileName, baseResizeImage, sizes, outputDir);
        console.log("FINISHED RUNNING IMAGE PROCESSOR");
        console.log(`Files have been saved to ${outputDir}`);
        // Delete the original file
        fs.rmSync(filePath, { force: true });
    }
    catch (err) {
        console.error("Processing error:", err);
        if (dirCreated) {
            try {
                fs.rmSync(outputDir, { recursive: true, force: true });
            }
            catch (cleanupErr) {
                console.error("Could not remove output directory after error:", cleanupErr);
            }
        }
        process.exit(1);
    }
});
program.parse(process.argv);
