package repositories

import (
	"vique/backend/config"
	"vique/backend/models"
)

func GetVoucherByCode(code string) (*models.Voucher, error) {
	var voucher models.Voucher
	err := config.DB.Where("code = ?", code).First(&voucher).Error
	return &voucher, err
}

func UpdateVoucher(voucher *models.Voucher) error {
	return config.DB.Save(voucher).Error
}
