package entity

import (
	"context"
	"errors"

	"gorm.io/gorm"
)

var ErrNotFound = errors.New("entity not found")

type Repository interface {
	Create(ctx context.Context, e *Entity) error
	FindAll(ctx context.Context, q ListEntitiesQuery) ([]Entity, error)
	FindByID(ctx context.Context, id string) (*Entity, error)
	Update(ctx context.Context, e *Entity) error
	Delete(ctx context.Context, id string) error
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) Create(ctx context.Context, e *Entity) error {
	return r.db.WithContext(ctx).Create(e).Error
}

func (r *repository) FindAll(ctx context.Context, q ListEntitiesQuery) ([]Entity, error) {
	var out []Entity
	tx := r.db.WithContext(ctx).Model(&Entity{})

	if q.Type != "" {
		tx = tx.Where("type = ?", q.Type)
	}
	if q.Status != "" {
		tx = tx.Where("status = ?", q.Status)
	}
	if q.Search != "" {
		tx = tx.Where("name ILIKE ?", "%"+q.Search+"%")
	}

	if err := tx.Order("created_at DESC").Find(&out).Error; err != nil {
		return nil, err
	}
	return out, nil
}

func (r *repository) FindByID(ctx context.Context, id string) (*Entity, error) {
	var e Entity
	err := r.db.WithContext(ctx).First(&e, "id = ?", id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, ErrNotFound
	}
	if err != nil {
		return nil, err
	}
	return &e, nil
}

func (r *repository) Update(ctx context.Context, e *Entity) error {
	res := r.db.WithContext(ctx).Model(&Entity{}).Where("id = ?", e.ID).Updates(map[string]interface{}{
		"name":        e.Name,
		"type":        e.Type,
		"status":      e.Status,
		"latitude":    e.Latitude,
		"longitude":   e.Longitude,
		"description": e.Description,
	})
	if res.Error != nil {
		return res.Error
	}
	if res.RowsAffected == 0 {
		return ErrNotFound
	}
	return nil
}

func (r *repository) Delete(ctx context.Context, id string) error {
	res := r.db.WithContext(ctx).Where("id = ?", id).Delete(&Entity{})
	if res.Error != nil {
		return res.Error
	}
	if res.RowsAffected == 0 {
		return ErrNotFound
	}
	return nil
}
