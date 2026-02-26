package controllers

import (
	"net/http"

	"vique/backend/dto"
	"vique/backend/services"

	"github.com/gin-gonic/gin"
)

func Register(c *gin.Context) {
	var req dto.RegisterReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	res, err := services.RegisterUser(req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	setTokenCookies(c, res.AccessToken, res.RefreshToken)
	c.JSON(http.StatusCreated, res)
}

func Login(c *gin.Context) {
	var req dto.LoginReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	res, err := services.LoginUser(req)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	setTokenCookies(c, res.AccessToken, res.RefreshToken)
	c.JSON(http.StatusOK, res)
}

func Refresh(c *gin.Context) {
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil {
		var req dto.RefreshReq
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "refresh_token cookie or body string required"})
			return
		}
		refreshToken = req.RefreshToken
	}

	res, err := services.RefreshToken(dto.RefreshReq{RefreshToken: refreshToken})
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	setTokenCookies(c, res.AccessToken, res.RefreshToken)
	c.JSON(http.StatusOK, res)
}

func Logout(c *gin.Context) {
	c.SetCookie("access_token", "", -1, "/", "localhost", false, true)
	c.SetCookie("refresh_token", "", -1, "/", "localhost", false, true)
	c.JSON(http.StatusOK, gin.H{"message": "logged out successfully"})
}

func setTokenCookies(c *gin.Context, accessToken, refreshToken string) {
	// HttpOnly cookies (Secure should be true in production)
	c.SetCookie("access_token", accessToken, 15*60, "/", "localhost", false, true)
	c.SetCookie("refresh_token", refreshToken, 7*24*60*60, "/", "localhost", false, true)
}
