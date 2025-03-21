package convert_test

import (
	"image"
	"image/color"
	"image/png"
	"os"
	"path/filepath"
	"testing"

	"github.com/arinji2/img-processor/convert"
	"golang.org/x/image/webp"
)

func verifyImageDimensions(t *testing.T, path string, expectedWidth, expectedHeight int) {
	t.Helper()

	file, err := os.Open(path)
	if err != nil {
		t.Fatalf("Failed to open image %s: %v", path, err)
	}
	defer file.Close()

	var img image.Image

	ext := filepath.Ext(path)
	switch ext {
	case ".png":
		img, err = png.Decode(file)
	case ".webp":
		img, err = webp.Decode(file)
	default:
		t.Fatalf("Unsupported file format: %s", ext)
	}

	if err != nil {
		t.Fatalf("Failed to decode image %s: %v", path, err)
	}

	bounds := img.Bounds()
	actualWidth := bounds.Max.X - bounds.Min.X
	actualHeight := bounds.Max.Y - bounds.Min.Y

	if actualWidth != expectedWidth || actualHeight != expectedHeight {
		t.Errorf("Image %s has incorrect dimensions: expected %dx%d, got %dx%d",
			path, expectedWidth, expectedHeight, actualWidth, actualHeight)
	}
}

func createTestPNG(path string, width, height int) error {
	img := image.NewRGBA(image.Rect(0, 0, width, height))

	for x := range make([]struct{}, width) {
		for y := range make([]struct{}, height) {
			img.Set(x, y, color.RGBA{
				R: uint8((x * 255) / width),
				G: uint8((y * 255) / height),
				B: 100,
				A: 255,
			})
		}
	}

	file, err := os.Create(path)
	if err != nil {
		return err
	}
	defer file.Close()

	return png.Encode(file, img)
}

func createTestWebP(pngPath, webpPath string) error {
	return convert.ConvertPNGToWebP(pngPath, webpPath)
}
