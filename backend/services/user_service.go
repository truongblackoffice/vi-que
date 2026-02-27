package services

import (
	"errors"
	"vique/backend/config"
	"vique/backend/dto"
	"vique/backend/models"

	"golang.org/x/crypto/bcrypt"
)

// GetUserProfile retrieves the full user profile by ID
func GetUserProfile(userID uint) (dto.UserRes, error) {
	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		return dto.UserRes{}, errors.New("user not found")
	}

	return dto.UserRes{
		ID:        user.ID,
		Name:      user.Name,
		Email:     user.Email,
		Role:      string(user.Role),
		Phone:     user.Phone,
		AvatarURL: user.AvatarURL,
	}, nil
}

// UpdateUserProfile updates a user's name and phone
func UpdateUserProfile(userID uint, req dto.UpdateProfileReq) (dto.UserRes, error) {
	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		return dto.UserRes{}, errors.New("user not found")
	}

	user.Name = req.Name
	user.Phone = req.Phone

	if err := config.DB.Save(&user).Error; err != nil {
		return dto.UserRes{}, errors.New("failed to update profile")
	}

	return dto.UserRes{
		ID:        user.ID,
		Name:      user.Name,
		Email:     user.Email,
		Role:      string(user.Role),
		Phone:     user.Phone,
		AvatarURL: user.AvatarURL,
	}, nil
}

// ChangeUserPassword changes a user's password provided the old password matches
func ChangeUserPassword(userID uint, req dto.ChangePasswordReq) error {
	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		return errors.New("user not found")
	}

	// Verify old password
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.OldPassword)); err != nil {
		return errors.New("incorrect old password")
	}

	// Hash new password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return errors.New("failed to hash new password")
	}

	user.PasswordHash = string(hashedPassword)
	if err := config.DB.Save(&user).Error; err != nil {
		return errors.New("failed to change password")
	}

	return nil
}
