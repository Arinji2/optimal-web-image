package convert

import (
	"bytes"
	"fmt"
	"image/png"
	"os"
	"path/filepath"

	"github.com/kolesa-team/go-webp/encoder"
	"github.com/kolesa-team/go-webp/webp"
)

func ConvertPNGToWebP(inputPath, outputPath string) error {
	fmt.Println("Starting PNG to WebP conversion")

	f, err := os.Open(inputPath)
	if err != nil {
		return fmt.Errorf("error opening file: %w", err)
	}
	defer f.Close()

	img, err := png.Decode(f)
	if err != nil {
		return fmt.Errorf("error decoding PNG: %w", err)
	}

	if filepath.Ext(outputPath) != ".webp" {
		outputPath += ".webp"
	}

	options, err := encoder.NewLossyEncoderOptions(encoder.PresetDefault, 80)
	if err != nil {
		return fmt.Errorf("error creating encoder options: %w", err)
	}

	var buf bytes.Buffer
	if err := webp.Encode(&buf, img, options); err != nil {
		return fmt.Errorf("error encoding WebP: %w", err)
	}

	if err := os.WriteFile(outputPath, buf.Bytes(), 0666); err != nil {
		return fmt.Errorf("error writing output file: %w", err)
	}

	fmt.Println("Conversion completed successfully. Output Path:", outputPath)
	return nil
}
