package convert

import (
	"fmt"
	"image/png"
	"os"
	"path/filepath"

	"golang.org/x/image/webp"
)

func ConvertWebPToPNG(inputPath, outputPath string) error {
	f, err := os.Open(inputPath)
	if err != nil {
		return fmt.Errorf("error opening file: %w", err)
	}
	defer f.Close()

	img, err := webp.Decode(f)
	if err != nil {
		return fmt.Errorf("error decoding WebP: %w", err)
	}

	if filepath.Ext(outputPath) != ".png" {
		outputPath += ".png"
	}

	pngFile, err := os.Create(outputPath)
	if err != nil {
		return fmt.Errorf("error creating output file: %w", err)
	}
	defer pngFile.Close()

	err = png.Encode(pngFile, img)
	if err != nil {
		return fmt.Errorf("error encoding PNG: %w", err)
	}

	return nil
}
