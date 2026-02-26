package middleware

import (
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
)

type clientVisitor struct {
	limiter *rate.Limiter
}

var (
	visitors = make(map[string]*clientVisitor)
	mu       sync.Mutex
)

func getVisitor(ip string, limit rate.Limit, burst int) *rate.Limiter {
	mu.Lock()
	defer mu.Unlock()

	v, exists := visitors[ip]
	if !exists {
		limiter := rate.NewLimiter(limit, burst)
		visitors[ip] = &clientVisitor{limiter}
		return limiter
	}

	return v.limiter
}

func RateLimitMiddleware(requestsPerSecond float64, burst int) gin.HandlerFunc {
	limit := rate.Limit(requestsPerSecond)
	return func(c *gin.Context) {
		ip := c.ClientIP()
		limiter := getVisitor(ip, limit, burst)
		if !limiter.Allow() {
			c.JSON(http.StatusTooManyRequests, gin.H{"error": "Too many requests"})
			c.Abort()
			return
		}
		c.Next()
	}
}

// AuthEndpoints: 5 per minute = ~0.08 per second
func AuthRateLimiter() gin.HandlerFunc {
	return RateLimitMiddleware(5.0/60.0, 5)
}

// General API: 100 per minute = ~1.66 per second
func GeneralRateLimiter() gin.HandlerFunc {
	return RateLimitMiddleware(100.0/60.0, 20)
}
