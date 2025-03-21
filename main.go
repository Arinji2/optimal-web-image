package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/arinji2/img-processor/convert"
	"github.com/arinji2/img-processor/resize"
)

func main() {
	fmt.Println("FINISH RUNNING IMAGE PROCESSOR")

	if len(os.Args) < 2 {
		fmt.Println("Usage: go run . <file-path>")
		os.Exit(1)
	}

	filePath := os.Args[1]
	fmt.Println("File Path Provided:", filePath)

	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		fmt.Println("Error: File does not exist.")
		os.Exit(1)
	}

	extension := filepath.Ext(filePath)
	fileName, found := strings.CutSuffix(filepath.Base(filePath), extension)
	if !found {
		fmt.Println("Error: File has no extension.")
		os.Exit(1)
	}
	extension = strings.ReplaceAll(extension, ".", "")
	fileLoc := filepath.Dir(filePath)
	fileLoc = filepath.Join(fileLoc, fileName)

	err := os.Mkdir(fileLoc, 0755)
	if err != nil {
		fmt.Println("Error: Failed to create directory:", fileLoc)
		os.Exit(1)
	}

	originalFileName := filepath.Join(fileLoc, fileName)
	switch extension {
	case "png":
		convertedPath := originalFileName + ".webp"
		err = convert.ConvertPNGToWebP(filePath, convertedPath)
		if err != nil {
			fmt.Println("Error With WEBP:", err)
			os.Remove(fileLoc)
			os.Exit(1)
		}
		originalPath := originalFileName + ".png"
		err = os.Rename(filePath, originalPath)
		if err != nil {
			fmt.Println("Error:", err)
			os.Exit(1)
		}
	case "webp":
		convertedPath := originalFileName + ".png"
		err = convert.ConvertWebPToPNG(filePath, convertedPath)
		if err != nil {
			fmt.Println("Error With PNG:", err)
			os.Remove(fileLoc)
			os.Exit(1)
		}
		originalPath := originalFileName + ".webp"
		err = os.Rename(filePath, originalPath)
		if err != nil {
			fmt.Println("Error:", err)
			os.Remove(fileLoc)
			os.Exit(1)
		}
	default:
		fmt.Println("Error: Invalid file extension.")
		os.Remove(fileLoc)
		os.Exit(1)
	}

	baseResizeImage := originalFileName + ".webp"

	sizes := map[string]uint{
		"sm": 480,
		"md": 768,
		"lg": 1024,
		"xl": 1280,
	}

	err = resize.ResizeWebP(fileName, baseResizeImage, sizes)
	if err != nil {
		fmt.Println("Error:", err)
		os.Remove(fileLoc)
	}

	fmt.Println("FINISH RUNNING IMAGE PROCESSOR")
	fmt.Printf("Files have been saved to %s \n", fileLoc)
}
