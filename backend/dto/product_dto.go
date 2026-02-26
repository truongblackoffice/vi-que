package dto

type CreateProductReq struct {
	CategoryID     uint     `json:"category_id" binding:"required"`
	Name           string   `json:"name" binding:"required,min=2,max=255"`
	Description    string   `json:"description"`
	Price          float64  `json:"price" binding:"required,gt=0"`
	StockQuantity  int      `json:"stock_quantity" binding:"required,min=0"`
	OriginLocation string   `json:"origin_location" binding:"required"`
	Images         []string `json:"images"`
}

type UpdateProductReq struct {
	CategoryID     *uint     `json:"category_id"`
	Name           *string   `json:"name" binding:"omitempty,min=2,max=255"`
	Description    *string   `json:"description"`
	Price          *float64  `json:"price" binding:"omitempty,gt=0"`
	StockQuantity  *int      `json:"stock_quantity" binding:"omitempty,min=0"`
	OriginLocation *string   `json:"origin_location"`
	Images         *[]string `json:"images"`
	IsFeatured     *bool     `json:"is_featured"`
}

type PaginatedProductResponse struct {
	Data       interface{} `json:"data"`
	Total      int64       `json:"total"`
	Page       int         `json:"page"`
	Limit      int         `json:"limit"`
	TotalPages int         `json:"total_pages"`
}
