package entity

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"

	"github.com/yourname/geo-entity-manager/internal/response"
)

type Handler struct {
	svc Service
}

func NewHandler(svc Service) *Handler {
	return &Handler{svc: svc}
}

func (h *Handler) RegisterRoutes(rg *gin.RouterGroup) {
	g := rg.Group("/entities")
	g.GET("", h.List)
	g.GET("/:id", h.Get)
	g.POST("", h.Create)
	g.PUT("/:id", h.Update)
	g.DELETE("/:id", h.Delete)
}

func (h *Handler) List(c *gin.Context) {
	var q ListEntitiesQuery
	if err := c.ShouldBindQuery(&q); err != nil {
		response.BadRequest(c, "INVALID_QUERY", "Invalid query parameters", nil)
		return
	}

	items, err := h.svc.List(c.Request.Context(), q)
	if err != nil {
		response.Internal(c, "Failed to fetch entities")
		return
	}
	if items == nil {
		items = []Entity{}
	}
	response.OK(c, items)
}

func (h *Handler) Get(c *gin.Context) {
	id := c.Param("id")
	e, err := h.svc.Get(c.Request.Context(), id)
	if err != nil {
		if errors.Is(err, ErrNotFound) {
			response.NotFound(c, "Entity not found")
			return
		}
		response.Internal(c, "Failed to fetch entity")
		return
	}
	response.OK(c, e)
}

func (h *Handler) Create(c *gin.Context) {
	var req CreateEntityRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "INVALID_BODY", "Invalid request body", nil)
		return
	}

	e, err := h.svc.Create(c.Request.Context(), req)
	if err != nil {
		if details, ok := validationDetails(err); ok {
			response.BadRequest(c, "VALIDATION_ERROR", "Validation failed", details)
			return
		}
		response.Internal(c, "Failed to create entity")
		return
	}
	response.Created(c, e)
}

func (h *Handler) Update(c *gin.Context) {
	id := c.Param("id")
	var req UpdateEntityRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "INVALID_BODY", "Invalid request body", nil)
		return
	}

	e, err := h.svc.Update(c.Request.Context(), id, req)
	if err != nil {
		if errors.Is(err, ErrNotFound) {
			response.NotFound(c, "Entity not found")
			return
		}
		if details, ok := validationDetails(err); ok {
			response.BadRequest(c, "VALIDATION_ERROR", "Validation failed", details)
			return
		}
		response.Internal(c, "Failed to update entity")
		return
	}
	response.OK(c, e)
}

func (h *Handler) Delete(c *gin.Context) {
	id := c.Param("id")
	if err := h.svc.Delete(c.Request.Context(), id); err != nil {
		if errors.Is(err, ErrNotFound) {
			response.NotFound(c, "Entity not found")
			return
		}
		response.Internal(c, "Failed to delete entity")
		return
	}
	c.Status(http.StatusNoContent)
}

func validationDetails(err error) ([]response.ErrorDetail, bool) {
	var ve validator.ValidationErrors
	if !errors.As(err, &ve) {
		return nil, false
	}
	out := make([]response.ErrorDetail, 0, len(ve))
	for _, fe := range ve {
		out = append(out, response.ErrorDetail{
			Field:   fe.Field(),
			Message: fe.Tag(),
		})
	}
	return out, true
}
