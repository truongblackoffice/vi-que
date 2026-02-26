package controllers

import (
	"net/http"
	"strconv"

	"vique/backend/models"
	"vique/backend/repositories"

	"github.com/gin-gonic/gin"
)

type CreateReviewReq struct {
	ProductID uint   `json:"product_id" binding:"required"`
	Rating    int    `json:"rating" binding:"required,min=1,max=5"`
	Comment   string `json:"comment" binding:"required"`
}

func CreateReview(c *gin.Context) {
	userID := c.MustGet("userID").(uint)

	var req CreateReviewReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hasBought, _ := repositories.HasUserPurchasedProduct(userID, req.ProductID)
	if !hasBought {
		c.JSON(http.StatusForbidden, gin.H{"error": "must purchase product before reviewing"})
		return
	}

	review := models.Review{
		ProductID: req.ProductID,
		UserID:    userID,
		Rating:    req.Rating,
		Comment:   req.Comment,
	}

	if err := repositories.CreateReview(&review); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create review"})
		return
	}

	c.JSON(http.StatusCreated, review)
}

func GetProductReviews(c *gin.Context) {
	productID, _ := strconv.Atoi(c.Param("product_id"))

	reviews, err := repositories.GetReviewsByProductID(uint(productID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to retrieve reviews"})
		return
	}

	c.JSON(http.StatusOK, reviews)
}
