package main

import (
	"fmt"
	"os"
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
}
