package repositories

import (
	"vique/backend/config"
	"vique/backend/models"
)

func CreateProduct(product *models.Product) error {
	return config.DB.Create(product).Error
}

func UpdateProduct(product *models.Product) error {
	return config.DB.Save(product).Error
}

func DeleteProduct(id uint, sellerID uint, isAdmin bool) error {
	var err error
	if isAdmin {
		err = config.DB.Delete(&models.Product{}, id).Error
	} else {
		err = config.DB.Where("id = ? AND seller_id = ?", id, sellerID).Delete(&models.Product{}).Error
	}
	return err
}

func GetProductByID(id uint) (*models.Product, error) {
	var product models.Product
	err := config.DB.Preload("Seller").Preload("Category").First(&product, id).Error
	return &product, err
}

func GetProductBySlug(slug string) (*models.Product, error) {
	var product models.Product
	err := config.DB.Preload("Seller").Preload("Category").Where("slug = ?", slug).First(&product).Error
	return &product, err
}

func GetAllProducts(categoryID uint, search string, origin string, page int, limit int) ([]models.Product, int64, error) {
	var products []models.Product
	var total int64
	query := config.DB.Model(&models.Product{}).Where("status = ?", models.ProductActive)

	if categoryID != 0 {
		query = query.Where("category_id = ?", categoryID)
	}

	if search != "" {
		query = query.Where("name ILIKE ?", "%"+search+"%") // Postgres specific ILIKE
	}

	if origin != "" {
		query = query.Where("origin_location ILIKE ?", "%"+origin+"%")
	}

	query.Count(&total)

	offset := (page - 1) * limit
	err := query.Preload("Seller").Preload("Category").
		Order("created_at desc").
		Offset(offset).Limit(limit).
		Find(&products).Error

	return products, total, err
}

func GetProductsBySeller(sellerID uint) ([]models.Product, error) {
	var products []models.Product
	err := config.DB.Preload("Category").Where("seller_id = ?", sellerID).Find(&products).Error
	return products, err
}

func GetAllCategories() ([]models.Category, error) {
	var categories []models.Category
	err := config.DB.Find(&categories).Error
	return categories, err
}
