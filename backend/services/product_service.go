package services

import (
	"errors"
	"vique/backend/dto"
	"vique/backend/models"
	"vique/backend/repositories"
	"vique/backend/utils"
)

func CreateProduct(sellerID uint, req dto.CreateProductReq) (*models.Product, error) {
	product := models.Product{
		SellerID:       sellerID,
		CategoryID:     req.CategoryID,
		Name:           req.Name,
		Slug:           utils.GenerateSlug(req.Name),
		Description:    req.Description,
		Price:          req.Price,
		StockQuantity:  req.StockQuantity,
		OriginLocation: req.OriginLocation,
		Images:         req.Images,
	}

	if err := repositories.CreateProduct(&product); err != nil {
		return nil, err
	}
	return &product, nil
}

func UpdateProduct(id uint, sellerID uint, role models.Role, req dto.UpdateProductReq) (*models.Product, error) {
	product, err := repositories.GetProductByID(id)
	if err != nil {
		return nil, errors.New("product not found")
	}

	if role != models.RoleAdmin && product.SellerID != sellerID {
		return nil, errors.New("forbidden: not the owner of this product")
	}

	if req.CategoryID != nil {
		product.CategoryID = *req.CategoryID
	}
	if req.Name != nil {
		product.Name = *req.Name
		product.Slug = utils.GenerateSlug(*req.Name)
	}
	if req.Description != nil {
		product.Description = *req.Description
	}
	if req.Price != nil {
		product.Price = *req.Price
	}
	if req.StockQuantity != nil {
		product.StockQuantity = *req.StockQuantity
	}
	if req.OriginLocation != nil {
		product.OriginLocation = *req.OriginLocation
	}
	if req.Images != nil {
		product.Images = *req.Images
	}
	if req.IsFeatured != nil && role == models.RoleAdmin {
		product.IsFeatured = *req.IsFeatured
	}

	if err := repositories.UpdateProduct(product); err != nil {
		return nil, err
	}
	return product, nil
}

func DeleteProduct(id uint, sellerID uint, role models.Role) error {
	isAdmin := role == models.RoleAdmin
	return repositories.DeleteProduct(id, sellerID, isAdmin)
}
