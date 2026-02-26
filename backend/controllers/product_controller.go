package controllers

import (
	"net/http"
	"strconv"

	"vique/backend/dto"
	"vique/backend/models"
	"vique/backend/repositories"
	"vique/backend/services"

	"github.com/gin-gonic/gin"
)

func CreateProduct(c *gin.Context) {
	sellerID := c.MustGet("userID").(uint)

	var req dto.CreateProductReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	product, err := services.CreateProduct(sellerID, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, product)
}

func UpdateProduct(c *gin.Context) {
	sellerID := c.MustGet("userID").(uint)
	role := c.MustGet("role").(models.Role)
	id, _ := strconv.Atoi(c.Param("id"))

	var req dto.UpdateProductReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	product, err := services.UpdateProduct(uint(id), sellerID, role, req)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, product)
}

func DeleteProduct(c *gin.Context) {
	sellerID := c.MustGet("userID").(uint)
	role := c.MustGet("role").(models.Role)
	id, _ := strconv.Atoi(c.Param("id"))

	if err := services.DeleteProduct(uint(id), sellerID, role); err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "product deleted"})
}

func GetProducts(c *gin.Context) {
	categoryID, _ := strconv.Atoi(c.Query("category_id"))
	search := c.Query("search")
	origin := c.Query("origin")

	page, err := strconv.Atoi(c.DefaultQuery("page", "1"))
	if err != nil || page < 1 {
		page = 1
	}

	limit, err := strconv.Atoi(c.DefaultQuery("limit", "12"))
	if err != nil || limit < 1 {
		limit = 12
	}

	products, total, err := repositories.GetAllProducts(uint(categoryID), search, origin, page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list products"})
		return
	}

	totalPages := int(total) / limit
	if int(total)%limit != 0 {
		totalPages++
	}

	res := dto.PaginatedProductResponse{
		Data:       products,
		Total:      total,
		Page:       page,
		Limit:      limit,
		TotalPages: totalPages,
	}

	c.JSON(http.StatusOK, res)
}

func GetProductBySlug(c *gin.Context) {
	slug := c.Param("slug")
	product, err := repositories.GetProductBySlug(slug)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "product not found"})
		return
	}
	c.JSON(http.StatusOK, product)
}

func GetCategories(c *gin.Context) {
	categories, err := repositories.GetAllCategories()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch categories"})
		return
	}
	c.JSON(http.StatusOK, categories)
}
