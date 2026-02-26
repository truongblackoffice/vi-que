package repositories

import (
	"vique/backend/config"
	"vique/backend/models"
)

func CreateOrder(order *models.Order) error {
	return config.DB.Create(order).Error
}

func UpdateOrder(order *models.Order) error {
	return config.DB.Save(order).Error
}

func GetOrderByID(id uint) (*models.Order, error) {
	var order models.Order
	err := config.DB.Preload("Items.Product.Category").Preload("Items.Product.Seller").Preload("Buyer").First(&order, id).Error
	return &order, err
}

func GetOrdersByBuyerID(buyerID uint) ([]models.Order, error) {
	var orders []models.Order
	err := config.DB.Preload("Items.Product").Where("buyer_id = ?", buyerID).Order("created_at desc").Find(&orders).Error
	return orders, err
}

func GetOrdersBySellerID(sellerID uint) ([]models.Order, error) {
	var orders []models.Order

	err := config.DB.
		Joins("JOIN order_items ON order_items.order_id = orders.id").
		Joins("JOIN products ON products.id = order_items.product_id").
		Where("products.seller_id = ?", sellerID).
		Preload("Items", "product_id IN (SELECT id FROM products WHERE seller_id = ?)", sellerID).
		Preload("Items.Product").
		Preload("Buyer").
		Group("orders.id").
		Order("orders.created_at desc").
		Find(&orders).Error
	return orders, err
}

func GetAllOrders() ([]models.Order, error) {
	var orders []models.Order
	err := config.DB.Preload("Items.Product").Preload("Buyer").Order("created_at desc").Find(&orders).Error
	return orders, err
}
