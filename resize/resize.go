package resize

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/kolesa-team/go-webp/encoder"
	gowebp "github.com/kolesa-team/go-webp/webp"
	"github.com/nfnt/resize"
	"golang.org/x/image/webp"
)

func ResizeWebP(fileName, inputPath string, sizes map[string]uint) error {
	file, err := os.Open(inputPath)
	locationFolder := filepath.Dir(inputPath)
	if err != nil {
		return err
	}
	defer file.Close()

	img, err := webp.Decode(file)
	if err != nil {
		return err
	}

	for sizeName, size := range sizes {
		resized := resize.Resize(size, 0, img, resize.Lanczos3)
		outputPath := filepath.Join(locationFolder, fmt.Sprintf("%s_%s.webp", fileName, sizeName))

		outputFile, err := os.Create(outputPath)
		if err != nil {
			return err
		}

		options, err := encoder.NewLossyEncoderOptions(encoder.PresetDefault, 95)
		if err != nil {
			outputFile.Close()
			return err
		}

		err = gowebp.Encode(outputFile, resized, options)
		if err != nil {
			outputFile.Close()
			return err
		}

		outputFile.Close()
		fmt.Println("Resized and saved:", outputPath)
	}

	return nil
}
