package response

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type ErrorDetail struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

type ErrorBody struct {
	Code    string        `json:"code"`
	Message string        `json:"message"`
	Details []ErrorDetail `json:"details,omitempty"`
}

type ErrorResponse struct {
	Error ErrorBody `json:"error"`
}

type SuccessResponse struct {
	Data interface{} `json:"data"`
	Meta interface{} `json:"meta,omitempty"`
}

func OK(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, SuccessResponse{Data: data})
}

func Created(c *gin.Context, data interface{}) {
	c.JSON(http.StatusCreated, SuccessResponse{Data: data})
}

func NoContent(c *gin.Context) {
	c.Status(http.StatusNoContent)
}

func BadRequest(c *gin.Context, code, message string, details []ErrorDetail) {
	c.AbortWithStatusJSON(http.StatusBadRequest, ErrorResponse{
		Error: ErrorBody{Code: code, Message: message, Details: details},
	})
}

func NotFound(c *gin.Context, message string) {
	c.AbortWithStatusJSON(http.StatusNotFound, ErrorResponse{
		Error: ErrorBody{Code: "NOT_FOUND", Message: message},
	})
}

func Internal(c *gin.Context, message string) {
	c.AbortWithStatusJSON(http.StatusInternalServerError, ErrorResponse{
		Error: ErrorBody{Code: "INTERNAL_ERROR", Message: message},
	})
}
