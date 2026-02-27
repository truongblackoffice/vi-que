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

func CreateOrder(c *gin.Context) {
	var buyerID *uint
	if val, exists := c.Get("userID"); exists {
		id := val.(uint)
		buyerID = &id
	}

	var req dto.CreateOrderReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	order, err := services.CreateOrder(buyerID, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, order)
}

func UpdateOrderStatus(c *gin.Context) {
	userID := c.MustGet("userID").(uint)
	role := c.MustGet("role").(models.Role)
	id, _ := strconv.Atoi(c.Param("id"))

	var req dto.UpdateOrderStatusReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	order, err := services.UpdateOrderStatus(uint(id), userID, role, req)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, order)
}

func GetMyOrders(c *gin.Context) {
	userID := c.MustGet("userID").(uint)
	role := c.MustGet("role").(models.Role)

	var orders []models.Order
	var err error

	if role == models.RoleSeller {
		orders, err = repositories.GetOrdersBySellerID(userID)
	} else {
		orders, err = repositories.GetOrdersByBuyerID(userID)
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to retrieve orders"})
		return
	}

	c.JSON(http.StatusOK, orders)
}

func GetAllOrders(c *gin.Context) {
	orders, err := repositories.GetAllOrders()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to retrieve orders"})
		return
	}

	c.JSON(http.StatusOK, orders)
}

func GetOrderByID(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	order, err := repositories.GetOrderByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "order not found"})
		return
	}

	c.JSON(http.StatusOK, order)
}
