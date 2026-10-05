package main

import (
	"log"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"github.com/yourname/geo-entity-manager/internal/config"
	"github.com/yourname/geo-entity-manager/internal/database"
	"github.com/yourname/geo-entity-manager/internal/entity"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("load config: %v", err)
	}

	db, err := database.NewPostgres(cfg)
	if err != nil {
		log.Fatalf("connect db: %v", err)
	}

	if err := db.AutoMigrate(&entity.Entity{}); err != nil {
		log.Fatalf("auto migrate: %v", err)
	}
	log.Println("auto migrate OK")

	if cfg.AppEnv == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.New()
	r.Use(gin.Logger(), gin.Recovery())

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{cfg.CORSAllowedOrigins},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	repo := entity.NewRepository(db)
	svc := entity.NewService(repo)
	h := entity.NewHandler(svc)

	api := r.Group("/api/v1")
	h.RegisterRoutes(api)

	addr := ":" + cfg.AppPort
	log.Printf("server listening on %s", addr)
	if err := r.Run(addr); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
