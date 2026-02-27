package dto

type ValidateVoucherReq struct {
	Code        string  `json:"code" binding:"required"`
	OrderAmount float64 `json:"order_amount" binding:"required,gt=0"`
}

type ValidateVoucherRes struct {
	Valid          bool    `json:"valid"`
	Message        string  `json:"message"`
	DiscountAmount float64 `json:"discount_amount"`
}
