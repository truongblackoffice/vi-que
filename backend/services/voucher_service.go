package services

import (
	"errors"
	"time"
	"vique/backend/models"
	"vique/backend/repositories"
)

func ValidateAndCalculateDiscount(code string, orderAmount float64) (*models.Voucher, float64, error) {
	voucher, err := repositories.GetVoucherByCode(code)
	if err != nil {
		return nil, 0, errors.New("mã giảm giá không hợp lệ hoặc không tồn tại")
	}

	if !voucher.IsActive {
		return nil, 0, errors.New("mã giảm giá đã bị vô hiệu hóa")
	}

	if !voucher.ExpiryDate.IsZero() && voucher.ExpiryDate.Before(time.Now()) {
		return nil, 0, errors.New("mã giảm giá đã hết hạn")
	}

	if voucher.MaxUsages > 0 && voucher.UsageCount >= voucher.MaxUsages {
		return nil, 0, errors.New("mã giảm giá đã hết lượt sử dụng")
	}

	if voucher.MinOrderValue > 0 && orderAmount < voucher.MinOrderValue {
		return nil, 0, errors.New("đơn hàng chưa đạt giá trị tối thiểu để sử dụng mã")
	}

	var discountAmount float64
	if voucher.DiscountType == "percent" {
		discountAmount = orderAmount * (voucher.DiscountValue / 100.0)
		if voucher.MaxDiscount > 0 && discountAmount > voucher.MaxDiscount {
			discountAmount = voucher.MaxDiscount
		}
	} else if voucher.DiscountType == "fixed" {
		discountAmount = voucher.DiscountValue
	}

	// Double check so discount doesn't exceed order amount
	if discountAmount >= orderAmount {
		discountAmount = orderAmount - 1000 // Ensure at least 1000VND
	}
	if discountAmount < 0 {
		discountAmount = 0
	}

	return voucher, discountAmount, nil
}
