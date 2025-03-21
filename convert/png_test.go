package convert_test

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/arinji2/img-processor/convert"
)

// Test converting WebP to PNG
func TestConvertWebPToPNG(t *testing.T) {
	tempDir := t.TempDir()

	width, height := 400, 300

	originalPngPath := filepath.Join(tempDir, "original.png")
	if err := createTestPNG(originalPngPath, width, height); err != nil {
		t.Fatalf("Failed to create test PNG: %v", err)
	}

	webpPath := filepath.Join(tempDir, "test.webp")
	if err := createTestWebP(originalPngPath, webpPath); err != nil {
		t.Fatalf("Failed to create test WebP: %v", err)
	}

	pngPath := filepath.Join(tempDir, "converted.png")
	if err := convert.ConvertWebPToPNG(webpPath, pngPath); err != nil {
		t.Fatalf("WebP to PNG conversion failed: %v", err)
	}

	if _, err := os.Stat(pngPath); os.IsNotExist(err) {
		t.Fatalf("Output PNG file not found: %s", pngPath)
	}

	verifyImageDimensions(t, pngPath, width, height)
}

// Test error handling for non-existent files
func TestConvertErrorHandling(t *testing.T) {
	tempDir := t.TempDir()

	// Test with non-existent input file
	nonExistentPath := filepath.Join(tempDir, "does_not_exist.png")
	outputPath := filepath.Join(tempDir, "output.webp")

	err := convert.ConvertPNGToWebP(nonExistentPath, outputPath)
	if err == nil {
		t.Error("Expected error when converting non-existent PNG file, but got nil")
	}

	err = convert.ConvertWebPToPNG(nonExistentPath, outputPath)
	if err == nil {
		t.Error("Expected error when converting non-existent WebP file, but got nil")
	}

	// Test with invalid input file (not a PNG/WebP)
	invalidPath := filepath.Join(tempDir, "invalid.txt")
	err = os.WriteFile(invalidPath, []byte("This is not an image"), 0666)
	if err != nil {
		t.Fatalf("Failed to create invalid test file: %v", err)
	}

	err = convert.ConvertPNGToWebP(invalidPath, outputPath)
	if err == nil {
		t.Error("Expected error when converting invalid PNG file, but got nil")
	}

	err = convert.ConvertWebPToPNG(invalidPath, outputPath)
	if err == nil {
		t.Error("Expected error when converting invalid WebP file, but got nil")
	}
}
