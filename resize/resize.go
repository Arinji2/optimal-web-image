package resize

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/chai2010/webp"
	"github.com/nfnt/resize"
)

func ResizeWebP(fileName, inputPath string, sizes map[string]uint) error {
	file, err := os.Open(inputPath)
	if err != nil {
		return err
	}
	defer file.Close()

	img, err := webp.Decode(file)
	if err != nil {
		return err
	}

	locationFolder := filepath.Dir(inputPath)

	for sizeName, size := range sizes {
		resized := resize.Resize(size, 0, img, resize.Lanczos3)
		outputPath := filepath.Join(locationFolder, fmt.Sprintf("%s_%s.webp", fileName, sizeName))

		outputFile, err := os.Create(outputPath)
		if err != nil {
			return err
		}

		if err := webp.Encode(outputFile, resized, &webp.Options{Quality: 95}); err != nil {
			outputFile.Close()
			return err
		}

		outputFile.Close()
	}

	return nil
}
