package models

import "time"

type ProductStatus string

const (
	ProductActive   ProductStatus = "active"
	ProductInactive ProductStatus = "inactive"
)

type Product struct {
	ID             uint          `gorm:"primaryKey" json:"id"`
	SellerID       uint          `gorm:"not null" json:"seller_id"`
	Seller         User          `gorm:"foreignKey:SellerID" json:"seller,omitempty"`
	CategoryID     uint          `gorm:"not null" json:"category_id"`
	Category       Category      `gorm:"foreignKey:CategoryID" json:"category,omitempty"`
	Name           string        `gorm:"size:255;not null" json:"name"`
	Slug           string        `gorm:"size:255;uniqueIndex;not null" json:"slug"`
	Description    string        `gorm:"type:text" json:"description"`
	Price          float64       `gorm:"type:numeric(10,2);not null" json:"price"`
	StockQuantity  int           `gorm:"not null" json:"stock_quantity"`
	OriginLocation string        `gorm:"size:255" json:"origin_location"`
	Images         []string      `gorm:"type:jsonb;serializer:json" json:"images"`
	IsFeatured     bool          `gorm:"default:false" json:"is_featured"`
	Status         ProductStatus `gorm:"type:varchar(20);default:'active'" json:"status"`
	CreatedAt      time.Time     `json:"created_at"`
	UpdatedAt      time.Time     `json:"updated_at"`
}
