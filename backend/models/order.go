package models

import "time"

type OrderStatus string

const (
	OrderPending   OrderStatus = "pending"
	OrderConfirmed OrderStatus = "confirmed"
	OrderShipping  OrderStatus = "shipping"
	OrderDelivered OrderStatus = "delivered"
	OrderCancelled OrderStatus = "cancelled"
)

type Order struct {
	ID              uint                   `gorm:"primaryKey" json:"id"`
	BuyerID         uint                   `gorm:"not null" json:"buyer_id"`
	Buyer           User                   `gorm:"foreignKey:BuyerID" json:"buyer,omitempty"`
	Status          OrderStatus            `gorm:"type:varchar(20);default:'pending'" json:"status"`
	TotalAmount     float64                `gorm:"type:numeric(10,2);not null" json:"total_amount"`
	ShippingAddress map[string]interface{} `gorm:"type:jsonb;serializer:json" json:"shipping_address"`
	Items           []OrderItem            `gorm:"foreignKey:OrderID" json:"items,omitempty"`
	CreatedAt       time.Time              `json:"created_at"`
	UpdatedAt       time.Time              `json:"updated_at"`
}
