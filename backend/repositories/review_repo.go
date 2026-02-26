package repositories

import (
	"vique/backend/config"
	"vique/backend/models"
)

func CreateReview(review *models.Review) error {
	return config.DB.Create(review).Error
}

func HasUserPurchasedProduct(userID uint, productID uint) (bool, error) {
	var count int64
	err := config.DB.Table("orders").
		Joins("JOIN order_items ON order_items.order_id = orders.id").
		Where("orders.buyer_id = ? AND order_items.product_id = ? AND orders.status IN (?)", userID, productID, []models.OrderStatus{models.OrderDelivered, models.OrderConfirmed, models.OrderShipping}).
		Count(&count).Error
	return count > 0, err
}

func GetReviewsByProductID(productID uint) ([]models.Review, error) {
	var reviews []models.Review
	err := config.DB.Preload("User").Where("product_id = ?", productID).Order("created_at desc").Find(&reviews).Error
	return reviews, err
}
