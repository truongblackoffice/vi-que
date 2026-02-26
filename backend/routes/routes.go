package routes

import (
	"vique/backend/controllers"
	"vique/backend/middleware"
	"vique/backend/models"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api")

	api.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	auth := api.Group("/auth")
	auth.Use(middleware.AuthRateLimiter())
	{
		auth.POST("/register", controllers.Register)
		auth.POST("/login", controllers.Login)
		auth.POST("/refresh", controllers.Refresh)
		auth.POST("/logout", controllers.Logout)
	}

	products := api.Group("/products")
	{
		products.GET("", controllers.GetProducts)
		products.GET("/slug/:slug", controllers.GetProductBySlug)
		products.GET("/:product_id/reviews", controllers.GetProductReviews)
	}

	categories := api.Group("/categories")
	{
		categories.GET("", controllers.GetCategories)
	}

	seller := api.Group("/seller")
	seller.Use(middleware.AuthMiddleware())
	seller.Use(middleware.RoleMiddleware(models.RoleSeller, models.RoleAdmin))
	{
		seller.POST("/products", controllers.CreateProduct)
		seller.PUT("/products/:id", controllers.UpdateProduct)
		seller.DELETE("/products/:id", controllers.DeleteProduct)
	}

	orders := api.Group("/orders")
	orders.Use(middleware.AuthMiddleware())
	{
		orders.POST("", middleware.RoleMiddleware(models.RoleBuyer), controllers.CreateOrder)
		orders.GET("", controllers.GetMyOrders)
		orders.GET("/:id", controllers.GetOrderByID)
		orders.PUT("/:id/status", controllers.UpdateOrderStatus)
	}

	reviews := api.Group("/reviews")
	reviews.Use(middleware.AuthMiddleware())
	{
		reviews.POST("", middleware.RoleMiddleware(models.RoleBuyer), controllers.CreateReview)
	}

	admin := api.Group("/admin")
	admin.Use(middleware.AuthMiddleware())
	admin.Use(middleware.RoleMiddleware(models.RoleAdmin))
	{
		admin.GET("/orders", controllers.GetAllOrders)
		admin.GET("/metrics", controllers.GetAdminMetrics)
		admin.GET("/users", controllers.GetAllUsers)
		admin.PUT("/users/:id", controllers.AdminUpdateUser)
		admin.GET("/products", controllers.GetAllProductsAdmin)
		admin.DELETE("/products/:id", controllers.AdminDeleteProduct)
		admin.POST("/categories", controllers.AdminCreateCategory)
		admin.PUT("/categories/:id", controllers.AdminUpdateCategory)
		admin.DELETE("/categories/:id", controllers.AdminDeleteCategory)
	}
}
