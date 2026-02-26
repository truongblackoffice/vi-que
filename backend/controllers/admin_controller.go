package controllers

import (
	"net/http"

	"vique/backend/config"
	"vique/backend/models"

	"github.com/gin-gonic/gin"
)

// GetAdminMetrics returns aggregated platform metrics
func GetAdminMetrics(c *gin.Context) {
	var totalUsers int64
	var totalProducts int64
	var totalOrders int64
	var totalRevenue float64

	config.DB.Model(&models.User{}).Count(&totalUsers)
	config.DB.Model(&models.Product{}).Count(&totalProducts)
	config.DB.Model(&models.Order{}).Count(&totalOrders)

	// Calculate total revenue from successful or completed orders
	// For simplicity, we sum all completed orders
	config.DB.Model(&models.Order{}).Where("status = ?", models.OrderDelivered).Select("COALESCE(SUM(total_amount), 0)").Row().Scan(&totalRevenue)

	c.JSON(http.StatusOK, gin.H{
		"total_users":    totalUsers,
		"total_products": totalProducts,
		"total_orders":   totalOrders,
		"total_revenue":  totalRevenue,
	})
}

// GetAllUsers returns a list of all users
func GetAllUsers(c *gin.Context) {
	var users []models.User
	if err := config.DB.Select("id, name, email, role, created_at").Order("id asc").Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}
	c.JSON(http.StatusOK, users)
}

// GetAllProductsAdmin returns a list of all products for moderation
func GetAllProductsAdmin(c *gin.Context) {
	var products []models.Product
	// Preload Category and Seller details for context
	if err := config.DB.Preload("Category").Preload("Seller").Order("created_at desc").Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch products"})
		return
	}
	c.JSON(http.StatusOK, products)
}

// AdminDeleteProduct allows the admin to forcefully delete a product
func AdminDeleteProduct(c *gin.Context) {
	id := c.Param("id")

	var product models.Product
	if err := config.DB.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	if err := config.DB.Delete(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete product"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product deleted successfully"})
}

// AdminUpdateUser allows the admin to update user roles
func AdminUpdateUser(c *gin.Context) {
	id := c.Param("id")

	var user models.User
	if err := config.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	var req struct {
		Role models.Role `json:"role"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Basic validation so they don't lock themselves out easily or set invalid roles
	if req.Role != models.RoleAdmin && req.Role != models.RoleSeller && req.Role != models.RoleBuyer {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid role"})
		return
	}

	if err := config.DB.Model(&user).Update("role", req.Role).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user role"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User role updated successfully", "user": user})
}

// AdminCreateCategory allows the admin to create a new category
func AdminCreateCategory(c *gin.Context) {
	var category models.Category
	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := config.DB.Create(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create category"})
		return
	}
	c.JSON(http.StatusCreated, category)
}

// AdminUpdateCategory allows the admin to update a category
func AdminUpdateCategory(c *gin.Context) {
	id := c.Param("id")

	var category models.Category
	if err := config.DB.First(&category, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
		return
	}

	var req struct {
		Name        string `json:"name"`
		Slug        string `json:"slug"`
		Description string `json:"description"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if req.Name != "" {
		category.Name = req.Name
	}
	if req.Slug != "" {
		category.Slug = req.Slug
	}
	if req.Description != "" {
		category.Description = req.Description
	}

	if err := config.DB.Save(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update category"})
		return
	}

	c.JSON(http.StatusOK, category)
}

// AdminDeleteCategory allows the admin to delete a category
func AdminDeleteCategory(c *gin.Context) {
	id := c.Param("id")

	var category models.Category
	if err := config.DB.First(&category, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
		return
	}

	if err := config.DB.Delete(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete category"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Category deleted successfully"})
}
