package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

func main() {
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
	fmt.Println("Extension:", extension)
	fmt.Println("File Name:", fileName)
	fmt.Println("File Location:", fileLoc)
	fileLoc = filepath.Join(fileLoc, fileName)

	err := os.Mkdir(fileLoc, 0755)
	if err != nil {
		fmt.Println("Error: Failed to create directory:", fileLoc)
		os.Exit(1)
	}
	defer func() {
		fmt.Println("Removing Created Folder")
		os.Remove(fileLoc)
	}()
}
