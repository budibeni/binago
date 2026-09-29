package main

import (
	"fmt"
	"io/ioutil"
	"strings"
)

func main() {
	handlersFile := "../backend/services/api-vehicle/internal/api/handlers.go"
	content, _ := ioutil.ReadFile(handlersFile)
	str := string(content)
	
	if !strings.Contains(str, "\"strings\"") {
		str = strings.Replace(str, "import (", "import (\n\t\"strings\"", 1)
		ioutil.WriteFile(handlersFile, []byte(str), 0644)
		fmt.Println("Added strings import")
	} else {
		fmt.Println("strings import already exists")
	}
}
