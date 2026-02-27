package controllers

import (
	"net/http"
	"vique/backend/dto"
	"vique/backend/services"

	"github.com/gin-gonic/gin"
)

func ValidateVoucher(c *gin.Context) {
	var req dto.ValidateVoucherReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, discountAmount, err := services.ValidateAndCalculateDiscount(req.Code, req.OrderAmount)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"valid":           false,
			"message":         err.Error(),
			"discount_amount": 0,
		})
		return
	}

	c.JSON(http.StatusOK, dto.ValidateVoucherRes{
		Valid:          true,
		Message:        "Áp dụng mã giảm giá thành công",
		DiscountAmount: discountAmount,
	})
}
