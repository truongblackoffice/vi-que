package services

import (
	"errors"
	"vique/backend/dto"
	"vique/backend/models"
	"vique/backend/repositories"
)

func CreateOrder(buyerID uint, req dto.CreateOrderReq) (*models.Order, error) {
	var totalAmount float64
	var orderItems []models.OrderItem

	for _, itemReq := range req.Items {
		product, err := repositories.GetProductByID(itemReq.ProductID)
		if err != nil || product.Status != models.ProductActive || product.StockQuantity < itemReq.Quantity {
			return nil, errors.New("product unavailable or insufficient stock")
		}

		// reduce stock
		product.StockQuantity -= itemReq.Quantity
		repositories.UpdateProduct(product)

		unitPrice := product.Price
		totalAmount += unitPrice * float64(itemReq.Quantity)

		orderItems = append(orderItems, models.OrderItem{
			ProductID: product.ID,
			Quantity:  itemReq.Quantity,
			UnitPrice: unitPrice,
		})
	}

	order := models.Order{
		BuyerID:         buyerID,
		Status:          models.OrderPending,
		TotalAmount:     totalAmount,
		ShippingAddress: req.ShippingAddress,
		Items:           orderItems,
	}

	if err := repositories.CreateOrder(&order); err != nil {
		return nil, err
	}

	return &order, nil
}

func UpdateOrderStatus(id uint, userID uint, role models.Role, req dto.UpdateOrderStatusReq) (*models.Order, error) {
	order, err := repositories.GetOrderByID(id)
	if err != nil {
		return nil, errors.New("order not found")
	}

	if role == models.RoleSeller {
		ownsItem := false
		for _, item := range order.Items {
			if item.Product.SellerID == userID {
				ownsItem = true
				break
			}
		}
		if !ownsItem {
			return nil, errors.New("forbidden")
		}
	} else if role == models.RoleBuyer {
		if req.Status == string(models.OrderCancelled) && order.Status == models.OrderPending {
			if order.BuyerID != userID {
				return nil, errors.New("forbidden")
			}
		} else {
			return nil, errors.New("forbidden operation for buyer")
		}
	} else if role != models.RoleAdmin {
		return nil, errors.New("forbidden")
	}

	order.Status = models.OrderStatus(req.Status)
	if err := repositories.UpdateOrder(order); err != nil {
		return nil, err
	}

	return order, nil
}
