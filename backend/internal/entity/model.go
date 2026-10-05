package entity

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type EntityType string

const (
	TypeVehicle   EntityType = "vehicle"
	TypeIoTDevice EntityType = "iot_device"
	TypeFacility  EntityType = "facility"
	TypeOther     EntityType = "other"
)

type EntityStatus string

const (
	StatusActive      EntityStatus = "active"
	StatusInactive    EntityStatus = "inactive"
	StatusMaintenance EntityStatus = "maintenance"
	StatusUnknown     EntityStatus = "unknown"
)

type Entity struct {
	ID          string       `gorm:"type:uuid;primaryKey" json:"id"`
	Name        string       `gorm:"type:varchar(100);not null" json:"name" validate:"required,max=100"`
	Type        EntityType   `gorm:"type:varchar(30);not null" json:"type" validate:"required,oneof=vehicle iot_device facility other"`
	Status      EntityStatus `gorm:"type:varchar(30);not null" json:"status" validate:"required,oneof=active inactive maintenance unknown"`
	Latitude    float64      `gorm:"not null" json:"latitude" validate:"required,gte=-90,lte=90"`
	Longitude   float64      `gorm:"not null" json:"longitude" validate:"required,gte=-180,lte=180"`
	Description string       `gorm:"type:text" json:"description" validate:"max=500"`
	CreatedAt   time.Time    `json:"created_at"`
	UpdatedAt   time.Time    `json:"updated_at"`
}

func (e *Entity) BeforeCreate(tx *gorm.DB) error {
	if e.ID == "" {
		e.ID = uuid.NewString()
	}
	return nil
}
