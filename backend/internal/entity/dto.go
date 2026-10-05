package entity

type CreateEntityRequest struct {
	Name        string  `json:"name" validate:"required,max=100"`
	Type        string  `json:"type" validate:"required,oneof=vehicle iot_device facility other"`
	Status      string  `json:"status" validate:"required,oneof=active inactive maintenance unknown"`
	Latitude    float64 `json:"latitude" validate:"required,gte=-90,lte=90"`
	Longitude   float64 `json:"longitude" validate:"required,gte=-180,lte=180"`
	Description string  `json:"description" validate:"max=500"`
}

type UpdateEntityRequest struct {
	Name        string  `json:"name" validate:"required,max=100"`
	Type        string  `json:"type" validate:"required,oneof=vehicle iot_device facility other"`
	Status      string  `json:"status" validate:"required,oneof=active inactive maintenance unknown"`
	Latitude    float64 `json:"latitude" validate:"required,gte=-90,lte=90"`
	Longitude   float64 `json:"longitude" validate:"required,gte=-180,lte=180"`
	Description string  `json:"description" validate:"max=500"`
}

type ListEntitiesQuery struct {
	Type   string `form:"type"`
	Status string `form:"status"`
	Search string `form:"search"`
}
