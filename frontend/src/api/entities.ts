import { apiClient } from "./client";
import type {
  CreateEntityPayload,
  Entity,
  EntityListFilters,
  UpdateEntityPayload,
} from "../types/entity";

interface ApiEnvelope<T> {
  data: T;
}

export const entitiesApi = {
  async list(filters: EntityListFilters = {}): Promise<Entity[]> {
    const params: Record<string, string> = {};
    if (filters.type) params.type = filters.type;
    if (filters.status) params.status = filters.status;
    if (filters.search) params.search = filters.search;

    const { data } = await apiClient.get<ApiEnvelope<Entity[]>>("/entities", {
      params,
    });
    return data.data ?? [];
  },

  async get(id: string): Promise<Entity> {
    const { data } = await apiClient.get<ApiEnvelope<Entity>>(`/entities/${id}`);
    return data.data;
  },

  async create(payload: CreateEntityPayload): Promise<Entity> {
    const { data } = await apiClient.post<ApiEnvelope<Entity>>(
      "/entities",
      payload,
    );
    return data.data;
  },

  async update(id: string, payload: UpdateEntityPayload): Promise<Entity> {
    const { data } = await apiClient.put<ApiEnvelope<Entity>>(
      `/entities/${id}`,
      payload,
    );
    return data.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/entities/${id}`);
  },
};
