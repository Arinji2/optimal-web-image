#!/usr/bin/env node

import chalk from "chalk";
import { Command } from "commander";
import fs from "fs";
import path from "path";
import packageJson from "../package.json";
import { convertPNGToWebP, convertWebPToPNG } from "./convert.js";
import { resizeWebP } from "./resize.js";

const program = new Command();

program
  .name(packageJson.name)
  .description(packageJson.description)
  .version(packageJson.version)
  .argument("<file-path>", "Path to the image file")
  .option(
    "--dump",
    "Save files to the current directory instead of creating a new folder",
  )
  .action(async (filePath, options) => {
    console.log(chalk.blue("[ℹ] Starting Image Processor..."));

    if (!fs.existsSync(filePath)) {
      console.error(chalk.red("[✘] File does not exist."));
      process.exit(1);
    }

    const extension = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath, extension);

    if (!extension) {
      console.error(chalk.red("[✘] File has no extension."));
      process.exit(1);
    }

    const fileDir = path.dirname(filePath);
    const outputDir = options.dump ? fileDir : path.join(fileDir, fileName);
    let dirCreated = false;

    if (!options.dump) {
      try {
        fs.mkdirSync(outputDir, { mode: 0o755 });
        dirCreated = true;
      } catch (err) {
        console.error(chalk.red("[✘] Failed to create directory:"), outputDir);
        process.exit(1);
      }
    }

    const originalFileName = path.join(outputDir, fileName);
    const cleanExtension = extension.replace(".", "");
    console.log(chalk.yellow(`[→] Starting Image Conversions...`));
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
          console.error(
            chalk.red(
              "[✘] Invalid file extension. Only PNG and WebP are supported.",
            ),
          );
          if (dirCreated)
            fs.rmSync(outputDir, { recursive: true, force: true });
          process.exit(1);
      }

      console.log(chalk.yellow("[→] Starting Resize Operation..."));
      const baseResizeImage = options.dump
        ? filePath
        : `${originalFileName}.webp`;
      const sizes = { sm: 480, md: 768, lg: 1024, xl: 1280 };
      await resizeWebP(fileName, baseResizeImage, sizes, outputDir);

      console.log(chalk.green("[✔] Finished Image Processing."));
      console.log(chalk.magenta(`[✔✔] Files saved to: ${outputDir}`));
    } catch (err) {
      console.error(chalk.red("[✘] Processing error:"), err);
      if (dirCreated) fs.rmSync(outputDir, { recursive: true, force: true });
      process.exit(1);
    }
  });

program.parse(process.argv);
