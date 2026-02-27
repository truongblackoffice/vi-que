package main

import (
	"flag"
	"log"

	"vique/backend/config"
	"vique/backend/middleware"
	"vique/backend/models"
	"vique/backend/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	config.LoadEnv()
	config.ConnectDB()

	// Auto Migration
	err := config.DB.AutoMigrate(
		&models.User{},
		&models.Category{},
		&models.Product{},
		&models.Order{},
		&models.OrderItem{},
		&models.Review{},
		&models.Voucher{},
	)
	if err != nil {
		log.Fatalf("Migration failed: %v", err)
	}

	seedPtr := flag.Bool("seed", false, "Seed the database")
	flag.Parse()

	if *seedPtr {
		SeedDatabase()
		return
	}

	r := gin.Default()

	// Middleware
	r.Use(middleware.SecurityHeaders())
	r.Use(middleware.GeneralRateLimiter())
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://localhost:3001"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Register Routes
	routes.SetupRoutes(r)

	// Run Server
	log.Println("Server starting on :8080")
	r.Run(":8080")
}
