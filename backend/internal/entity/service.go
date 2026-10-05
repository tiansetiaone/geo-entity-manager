package entity

import (
	"context"

	"github.com/go-playground/validator/v10"
)

type Service interface {
	List(ctx context.Context, q ListEntitiesQuery) ([]Entity, error)
	Get(ctx context.Context, id string) (*Entity, error)
	Create(ctx context.Context, req CreateEntityRequest) (*Entity, error)
	Update(ctx context.Context, id string, req UpdateEntityRequest) (*Entity, error)
	Delete(ctx context.Context, id string) error
}

type service struct {
	repo     Repository
	validate *validator.Validate
}

func NewService(repo Repository) Service {
	return &service{
		repo:     repo,
		validate: validator.New(),
	}
}

func (s *service) List(ctx context.Context, q ListEntitiesQuery) ([]Entity, error) {
	return s.repo.FindAll(ctx, q)
}

func (s *service) Get(ctx context.Context, id string) (*Entity, error) {
	return s.repo.FindByID(ctx, id)
}

func (s *service) Create(ctx context.Context, req CreateEntityRequest) (*Entity, error) {
	if err := s.validate.Struct(req); err != nil {
		return nil, err
	}

	e := &Entity{
		Name:        req.Name,
		Type:        EntityType(req.Type),
		Status:      EntityStatus(req.Status),
		Latitude:    req.Latitude,
		Longitude:   req.Longitude,
		Description: req.Description,
	}
	if err := s.repo.Create(ctx, e); err != nil {
		return nil, err
	}
	return e, nil
}

func (s *service) Update(ctx context.Context, id string, req UpdateEntityRequest) (*Entity, error) {
	if err := s.validate.Struct(req); err != nil {
		return nil, err
	}

	existing, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}

	existing.Name = req.Name
	existing.Type = EntityType(req.Type)
	existing.Status = EntityStatus(req.Status)
	existing.Latitude = req.Latitude
	existing.Longitude = req.Longitude
	existing.Description = req.Description

	if err := s.repo.Update(ctx, existing); err != nil {
		return nil, err
	}

	return s.repo.FindByID(ctx, id)
}

func (s *service) Delete(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}
