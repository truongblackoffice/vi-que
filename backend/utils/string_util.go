package utils

import (
	"regexp"
	"strings"
)

func GenerateSlug(title string) string {
	lowerTitle := strings.ToLower(title)
	re := regexp.MustCompile(`[^a-z0-9]+`)
	slug := re.ReplaceAllString(lowerTitle, "-")
	return strings.Trim(slug, "-")
}
