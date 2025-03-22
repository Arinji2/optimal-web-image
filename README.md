# process-web-image

**`process-web-image`** is a simple command-line tool for processing images. It converts PNG images to WebP, generates a fallback PNG, and resizes images for TailwindCSS breakpoints.

## Features

- Convert PNG images to WebP format
- Generate fallback PNG images
- Resize images to fit common TailwindCSS breakpoints (sm, md, lg, xl)
- Efficient and fast processing
- Optional `--dump` flag to skip folder creation

## Installation & Usage

To use `process-web-image`, install it via `npx` or `pnpx`:

```sh
npx process-web-image
# or
pnpx process-web-image
# or
bunx process-web-image
```

### Processing Images

Provide the path to your PNG image or your WebP image as an argument:

```sh
pnpx process-web-image /path/to/image.png
```

This will generate a WebP version, a fallback PNG, and resized images in a folder named after the original image.

### Using the `--dump` Flag

If you prefer not to create a separate folder and want the processed images to stay in the original location, use the `--dump` flag:

```sh
pnpx process-web-image /path/to/image.png --dump
```

### Output Example

With default settings:

```
/path/to/image/
├── image.webp
├── image.png
├── image-sm.webp
├── image-md.webp
├── image-lg.webp
└── image-xl.webp
```

With `--dump` flag:

```
/path/to/image.webp
/path/to/image.png
/path/to/image-sm.webp
/path/to/image-md.webp
/path/to/image-lg.webp
/path/to/image-xl.webp
```

## Hyperlinks

- **NPM**: [process-web-image](https://www.npmjs.com/package/process-web-image)
- **GitHub**: [Arinji2/process-web-image](https://github.com/Arinji2/process-web-image)

For feedback or issues, please open an issue on GitHub.
