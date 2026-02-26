package main

import (
	"fmt"
	"io"
	"log"
	"math/rand"
	"net/http"
	"os"
	"path/filepath"
	"sync"
	"time"

	"vique/backend/config"
	"vique/backend/models"
	"vique/backend/utils"
)

// downloadImage fetches an image from URL and saves it to filepath
func downloadImage(url, filepath string) error {
	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return fmt.Errorf("bad status: %s", resp.Status)
	}

	out, err := os.Create(filepath)
	if err != nil {
		return err
	}
	defer out.Close()

	_, err = io.Copy(out, resp.Body)
	return err
}

func SeedDatabase() {
	log.Println("Seeding database...")
	rand.Seed(time.Now().UnixNano())

	// Categories
	categories := []models.Category{
		{Name: "Ẩm thực", Slug: utils.GenerateSlug("Ẩm thực"), Description: "Các món ăn đặc sản"},
		{Name: "Trái cây", Slug: utils.GenerateSlug("Trái cây"), Description: "Trái cây tươi ngon"},
		{Name: "Mắm - Khô", Slug: utils.GenerateSlug("Mắm - Khô"), Description: "Các loại mắm và khô đặc sản"},
		{Name: "Bánh - Kẹo", Slug: utils.GenerateSlug("Bánh - Kẹo"), Description: "Bánh kẹo truyền thống"},
		{Name: "Thủ công mỹ nghệ", Slug: utils.GenerateSlug("Thủ công mỹ nghệ"), Description: "Sản phẩm thủ công"},
	}

	for i, category := range categories {
		config.DB.FirstOrCreate(&category, models.Category{Slug: category.Slug})
		// update slice with real ID
		var cat models.Category
		config.DB.Where("slug = ?", category.Slug).First(&cat)
		categories[i] = cat
	}

	// Users
	adminPassword, _ := utils.HashPassword("Admin@123")
	sellerPassword, _ := utils.HashPassword("Seller@123")

	admin := models.User{Name: "Admin User", Email: "admin@vique.local", PasswordHash: adminPassword, Role: models.RoleAdmin, IsVerified: true}
	config.DB.FirstOrCreate(&admin, models.User{Email: admin.Email})

	seller1 := models.User{Name: "Vựa Trái Cây Miền Tây", Email: "seller1@vique.local", PasswordHash: sellerPassword, Role: models.RoleSeller, IsVerified: true}
	config.DB.FirstOrCreate(&seller1, models.User{Email: seller1.Email})

	seller2 := models.User{Name: "Đặc Sản Đồng Tháp Mười", Email: "seller2@vique.local", PasswordHash: sellerPassword, Role: models.RoleSeller, IsVerified: true}
	config.DB.FirstOrCreate(&seller2, models.User{Email: seller2.Email})

	var s1, s2 models.User
	config.DB.Where("email = ?", seller1.Email).First(&s1)
	config.DB.Where("email = ?", seller2.Email).First(&s2)
	sellers := []models.User{s1, s2}

	// Products Setup
	log.Println("Preparing to generate 1000 products and download their images...")

	// Create uploads directory
	uploadsDir := filepath.Join("..", "frontend", "public", "uploads", "products")
	err := os.MkdirAll(uploadsDir, os.ModePerm)
	if err != nil {
		log.Fatalf("Failed to create uploads directory: %v", err)
	}

	// Localized vietnamese product names mapping for randomness
	foodPrefixes := []string{"Hủ tiếu", "Bún", "Phở", "Bánh xèo", "Bánh canh", "Chè", "Mắm", "Khô", "Trà", "Rượu", "Kẹo", "Bánh tráng", "Mứt"}
	foodSuffixes := []string{"Mỹ Tho", "Sa Đéc", "Cà Mau", "Châu Đốc", "Ninh Thuận", "Sóc Trăng", "Bến Tre", "Tây Ninh", "Đà Lạt", "Bảo Lộc", "Lai Vung"}

	const totalProducts = 1000
	const maxConcurrency = 30 // 30 concurrent downloads to avoid rate limits

	var wg sync.WaitGroup
	semaphore := make(chan struct{}, maxConcurrency)
	productsChan := make(chan models.Product, totalProducts)

	// Keep track of progress
	var downloadedCount int
	var mu sync.Mutex

	startTime := time.Now()
	log.Println("Starting concurrent image downloads from internet...")
	for i := 1; i <= totalProducts; i++ {
		wg.Add(1)
		go func(idx int) {
			defer wg.Done()

			// Acquire token
			semaphore <- struct{}{}
			defer func() { <-semaphore }()

			// Generate product details
			cat := categories[rand.Intn(len(categories))]
			seller := sellers[rand.Intn(len(sellers))]

			prefix := foodPrefixes[rand.Intn(len(foodPrefixes))]
			suffix := foodSuffixes[rand.Intn(len(foodSuffixes))]
			name := fmt.Sprintf("%s %s Thượng Hạng (Lô %d)", prefix, suffix, idx)

			slug := utils.GenerateSlug(fmt.Sprintf("%s-%d", name, idx))

			price := float64(rand.Intn(50)*10000 + 50000) // 50k to 550k

			// Download image
			imgFilename := fmt.Sprintf("product_%d.jpg", idx)
			imgPath := filepath.Join(uploadsDir, imgFilename)

			// Add a random tiny delay
			time.Sleep(time.Duration(rand.Intn(150)) * time.Millisecond)

			// Using random seed per image to fetch a unique picture
			imgUrl := fmt.Sprintf("https://picsum.photos/seed/%d/500/500", idx+int(startTime.Unix()))
			err := downloadImage(imgUrl, imgPath)
			if err != nil {
				log.Printf("Failed to download image %d: %v", idx, err)
			}

			// Prepare product
			prod := models.Product{
				SellerID:       seller.ID,
				CategoryID:     cat.ID,
				Name:           name,
				Slug:           slug,
				Description:    fmt.Sprintf("Sản phẩm %s chính gốc, chất lượng tuyệt hảo, hương vị truyền thống.", name),
				Price:          price,
				StockQuantity:  rand.Intn(500) + 10,
				OriginLocation: suffix,
				IsFeatured:     rand.Float32() < 0.05, // 5% chance to be featured
				Images:         []string{fmt.Sprintf("/uploads/products/%s", imgFilename)},
			}

			productsChan <- prod

			mu.Lock()
			downloadedCount++
			if downloadedCount%100 == 0 {
				log.Printf("Downloaded & Prepared %d/%d products...", downloadedCount, totalProducts)
			}
			mu.Unlock()

		}(i)
	}

	wg.Wait()
	close(productsChan)

	log.Println("All images downloaded. Inserting into PostgreSQL...")

	var batch []models.Product
	batchSize := 100

	for prod := range productsChan {
		batch = append(batch, prod)
		if len(batch) >= batchSize {
			config.DB.Create(&batch)
			batch = nil // reset
		}
	}

	// Insert remaining
	if len(batch) > 0 {
		config.DB.Create(&batch)
	}

	log.Printf("Seeding completed successfully in %v!", time.Since(startTime))
}
