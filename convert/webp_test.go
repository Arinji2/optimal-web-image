package convert_test

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/arinji2/img-processor/convert"
)

// Testing converting PNG to WebP
func TestConvertPNGToWebP(t *testing.T) {
	tempDir := t.TempDir()

	width, height := 400, 300

	pngPath := filepath.Join(tempDir, "test.png")
	if err := createTestPNG(pngPath, width, height); err != nil {
		t.Fatalf("Failed to create test PNG: %v", err)
	}

	webpPath := filepath.Join(tempDir, "converted.webp")
	if err := convert.ConvertPNGToWebP(pngPath, webpPath); err != nil {
		t.Fatalf("PNG to WebP conversion failed: %v", err)
	}

	if _, err := os.Stat(webpPath); os.IsNotExist(err) {
		t.Fatalf("Output WebP file not found: %s", webpPath)
	}

	verifyImageDimensions(t, webpPath, width, height)
}
