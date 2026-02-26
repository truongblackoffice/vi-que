package services

import (
	"errors"
	"vique/backend/dto"
	"vique/backend/models"
	"vique/backend/repositories"
	"vique/backend/utils"
)

func RegisterUser(req dto.RegisterReq) (*dto.AuthRes, error) {
	existingUser, _ := repositories.GetUserByEmail(req.Email)
	if existingUser != nil && existingUser.ID != 0 {
		return nil, errors.New("email already in use")
	}

	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return nil, err
	}

	role := models.RoleBuyer
	if req.Role == string(models.RoleSeller) {
		role = models.RoleSeller
	}

	user := models.User{
		Name:         req.Name,
		Email:        req.Email,
		PasswordHash: hashedPassword,
		Role:         role,
	}

	if err := repositories.CreateUser(&user); err != nil {
		return nil, err
	}

	accessToken, refreshToken, err := utils.GenerateTokens(user.ID, user.Role)
	if err != nil {
		return nil, err
	}

	return &dto.AuthRes{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		User: dto.UserRes{
			ID:        user.ID,
			Name:      user.Name,
			Email:     user.Email,
			Role:      string(user.Role),
			AvatarURL: user.AvatarURL,
		},
	}, nil
}

func LoginUser(req dto.LoginReq) (*dto.AuthRes, error) {
	user, err := repositories.GetUserByEmail(req.Email)
	if err != nil {
		return nil, errors.New("invalid email or password")
	}

	if !utils.CheckPasswordHash(req.Password, user.PasswordHash) {
		return nil, errors.New("invalid email or password")
	}

	accessToken, refreshToken, err := utils.GenerateTokens(user.ID, user.Role)
	if err != nil {
		return nil, err
	}

	return &dto.AuthRes{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		User: dto.UserRes{
			ID:        user.ID,
			Name:      user.Name,
			Email:     user.Email,
			Role:      string(user.Role),
			AvatarURL: user.AvatarURL,
		},
	}, nil
}

func RefreshToken(req dto.RefreshReq) (*dto.AuthRes, error) {
	claims, err := utils.VerifyToken(req.RefreshToken)
	if err != nil {
		return nil, errors.New("invalid refresh token")
	}

	user, err := repositories.GetUserByID(claims.UserID)
	if err != nil {
		return nil, errors.New("user not found")
	}

	accessToken, refreshToken, err := utils.GenerateTokens(user.ID, user.Role)
	if err != nil {
		return nil, err
	}

	return &dto.AuthRes{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		User: dto.UserRes{
			ID:        user.ID,
			Name:      user.Name,
			Email:     user.Email,
			Role:      string(user.Role),
			AvatarURL: user.AvatarURL,
		},
	}, nil
}
