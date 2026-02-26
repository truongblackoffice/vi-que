package dto

type CreateOrderReq struct {
	Items           []OrderItemReq         `json:"items" binding:"required,min=1"`
	ShippingAddress map[string]interface{} `json:"shipping_address" binding:"required"`
}

type OrderItemReq struct {
	ProductID uint `json:"product_id" binding:"required"`
	Quantity  int  `json:"quantity" binding:"required,gt=0"`
}

type UpdateOrderStatusReq struct {
	Status string `json:"status" binding:"required,oneof=pending confirmed shipping delivered cancelled"`
}
