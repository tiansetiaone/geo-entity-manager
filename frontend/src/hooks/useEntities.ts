import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { entitiesApi } from "../api/entities";
import type {
  CreateEntityPayload,
  EntityListFilters,
  UpdateEntityPayload,
} from "../types/entity";

export const entityKeys = {
  all: ["entities"] as const,
  list: (filters: EntityListFilters) =>
    [...entityKeys.all, "list", filters] as const,
  detail: (id: string) => [...entityKeys.all, "detail", id] as const,
};

export function useEntitiesQuery(filters: EntityListFilters = {}) {
  return useQuery({
    queryKey: entityKeys.list(filters),
    queryFn: () => entitiesApi.list(filters),
    staleTime: 10_000,
  });
}

export function useEntityQuery(id: string | null) {
  return useQuery({
    queryKey: id ? entityKeys.detail(id) : ["entities", "detail", "none"],
    queryFn: () => entitiesApi.get(id!),
    enabled: !!id,
  });
}

export function useCreateEntity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEntityPayload) => entitiesApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: entityKeys.all });
    },
  });
}

export function useUpdateEntity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateEntityPayload;
    }) => entitiesApi.update(id, payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: entityKeys.all });
      qc.invalidateQueries({ queryKey: entityKeys.detail(vars.id) });
    },
  });
}

export function useDeleteEntity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => entitiesApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: entityKeys.all });
    },
  });
}
