package resize_test

import (
	"image"
	"image/color"
	"image/png"
	"os"
	"path/filepath"
	"testing"

	"github.com/arinji2/img-processor/convert"
	"github.com/arinji2/img-processor/resize"
	"golang.org/x/image/webp"
)

func createTestImage(path string) error {
	// Create a simple test image
	img := image.NewRGBA(image.Rect(0, 0, 800, 800))
	for x := range make([]struct{}, 800) {
		for y := range make([]struct{}, 600) {
			img.Set(x, y, color.RGBA{uint8(x % 256), uint8(y % 256), 100, 255})
		}
	}

	file, err := os.Create(path)
	if err != nil {
		return err
	}
	defer file.Close()
	return png.Encode(file, img)
}

func TestResizeWebP(t *testing.T) {
	tempDir := t.TempDir()

	// First create a PNG image
	pngPath := filepath.Join(tempDir, "test.png")
	if err := createTestImage(pngPath); err != nil {
		t.Fatalf("Failed to create test image: %v", err)
	}

	// Convert PNG to WebP first
	webpPath := filepath.Join(tempDir, "test.webp")
	if err := convert.ConvertPNGToWebP(pngPath, webpPath); err != nil {
		t.Fatalf("Failed to convert PNG to WebP: %v", err)
	}

	// Now resize the WebP image
	sizes := map[string]uint{
		"sm": 480,
		"md": 768,
		"lg": 1024,
		"xl": 1280,
	}

	if err := resize.ResizeWebP("test", webpPath, sizes); err != nil {
		t.Fatalf("ResizeWebP failed: %v", err)
	}

	// Verify the output files exist and have the correct dimensions
	for sizeName, expectedWidth := range sizes {
		outputPath := filepath.Join(tempDir, "test_"+sizeName+".webp")

		// Check if file exists
		if _, err := os.Stat(outputPath); os.IsNotExist(err) {
			t.Errorf("Expected output file %s not found", outputPath)
			continue
		}

		// Open the file and verify dimensions
		file, err := os.Open(outputPath)
		if err != nil {
			t.Errorf("Failed to open output file %s: %v", outputPath, err)
			continue
		}

		// Decode the WebP image
		img, err := webp.Decode(file)
		file.Close()
		if err != nil {
			t.Errorf("Failed to decode WebP file %s: %v", outputPath, err)
			continue
		}

		// Check dimensions
		bounds := img.Bounds()
		actualWidth := bounds.Max.X - bounds.Min.X

		// Allow for a small margin of error due to rounding
		if uint(actualWidth) != expectedWidth {
			t.Errorf("Image %s has incorrect width: expected %d, got %d",
				outputPath, expectedWidth, actualWidth)
		}
	}
}
