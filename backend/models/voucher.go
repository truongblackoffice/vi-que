package models

import "time"

type Voucher struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	Code          string    `gorm:"uniqueIndex;type:varchar(50);not null" json:"code"`
	DiscountType  string    `gorm:"type:varchar(20);not null" json:"discount_type"` // 'percent' or 'fixed'
	DiscountValue float64   `gorm:"type:numeric(10,2);not null" json:"discount_value"`
	MaxDiscount   float64   `gorm:"type:numeric(10,2)" json:"max_discount"` // used if type is 'percent'
	MinOrderValue float64   `gorm:"type:numeric(10,2)" json:"min_order_value"`
	UsageCount    int       `gorm:"type:int;default:0" json:"usage_count"`
	MaxUsages     int       `gorm:"type:int" json:"max_usages"` // 0 means unlimited
	IsActive      bool      `gorm:"default:true" json:"is_active"`
	ExpiryDate    time.Time `json:"expiry_date"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}
