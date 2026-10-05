import { useMemo, useState } from "react";
import { EntityMap } from "./features/entities/EntityMap";
import { EntityList } from "./features/entities/EntityList";
import { EntityForm, type EntityFormValues } from "./features/entities/EntityForm";
import { EntityDetail } from "./features/entities/EntityDetail";
import { ConfirmDialog } from "./components/ConfirmDialog";
import {
  useCreateEntity,
  useDeleteEntity,
  useEntitiesQuery,
  useUpdateEntity,
} from "./hooks/useEntities";
import type {
  Entity,
  EntityStatus,
  EntityType,
} from "./types/entity";

type ModalState =
  | { type: "none" }
  | { type: "detail"; entity: Entity }
  | { type: "form"; mode: "create"; coords?: { lat: number; lng: number } }
  | { type: "form"; mode: "edit"; entity: Entity }
  | { type: "delete"; entity: Entity };

export default function App() {
  const [filters, setFilters] = useState<{
    type: EntityType | "";
    status: EntityStatus | "";
    search: string;
  }>({ type: "", status: "", search: "" });

  const [modal, setModal] = useState<ModalState>({ type: "none" });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const queryFilters = useMemo(
    () => ({
      type: filters.type || undefined,
      status: filters.status || undefined,
      search: filters.search.trim() || undefined,
    }),
    [filters],
  );

  const entitiesQuery = useEntitiesQuery(queryFilters);
  const createMutation = useCreateEntity();
  const updateMutation = useUpdateEntity();
  const deleteMutation = useDeleteEntity();

  const entities = entitiesQuery.data ?? [];

  const closeModal = () => {
    setModal({ type: "none" });
    setApiError(null);
  };

  const handleSelect = (entity: Entity) => {
    setSelectedId(entity.id);
    setModal({ type: "detail", entity });
  };

  const handleMapClick = (lat: number, lng: number) => {
    setModal({ type: "form", mode: "create", coords: { lat, lng } });
  };

  const handleCreate = () => setModal({ type: "form", mode: "create" });
  const handleEdit = (entity: Entity) =>
    setModal({ type: "form", mode: "edit", entity });
  const handleDelete = (entity: Entity) =>
    setModal({ type: "delete", entity });

  const submitForm = async (values: EntityFormValues) => {
    setApiError(null);
    try {
      if (modal.type === "form" && modal.mode === "edit") {
        await updateMutation.mutateAsync({
          id: modal.entity.id,
          payload: values,
        });
      } else {
        await createMutation.mutateAsync(values);
      }
      closeModal();
    } catch (err) {
      const e = err as { message?: string; details?: { field: string; message: string }[] };
      setApiError(
        e.details?.map((d) => `${d.field}: ${d.message}`).join(", ") ||
          e.message ||
          "Request failed",
      );
    }
  };

  const confirmDelete = async () => {
    if (modal.type !== "delete") return;
    setApiError(null);
    try {
      await deleteMutation.mutateAsync(modal.entity.id);
      if (selectedId === modal.entity.id) setSelectedId(null);
      closeModal();
    } catch (err) {
      const e = err as { message?: string };
      setApiError(e.message ?? "Delete failed");
    }
  };

  return (
    <div className="flex h-full w-full">
      <aside className="w-80 shrink-0 border-r bg-white">
        <div className="border-b px-4 py-3">
          <h1 className="text-base font-semibold text-slate-800">
            Geo Entity Manager
          </h1>
          <p className="text-xs text-slate-500">
            {entities.length} entit{entities.length === 1 ? "y" : "ies"}
          </p>
        </div>
        <div className="h-[calc(100%-57px)]">
          <EntityList
            entities={entities}
            loading={entitiesQuery.isLoading}
            selectedId={selectedId}
            filters={filters}
            onFiltersChange={setFilters}
            onSelect={handleSelect}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreate={handleCreate}
          />
        </div>
      </aside>

      <main className="relative flex-1">
        {entitiesQuery.isError && (
          <div className="absolute left-1/2 top-4 z-[500] -translate-x-1/2 rounded-md bg-red-600 px-3 py-2 text-sm text-white shadow-lg">
            Failed to load entities
          </div>
        )}
        <EntityMap
          entities={entities}
          selectedId={selectedId}
          onSelect={handleSelect}
          onMapClick={handleMapClick}
        />
      </main>

      {modal.type === "detail" && (
        <EntityDetail
          open
          entity={modal.entity}
          onClose={closeModal}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {(modal.type === "form") && (
        <EntityForm
          open
          mode={modal.mode}
          initial={modal.mode === "edit" ? modal.entity : null}
          defaultCoords={modal.mode === "create" ? modal.coords ?? null : null}
          submitting={createMutation.isPending || updateMutation.isPending}
          onClose={closeModal}
          onSubmit={submitForm}
        />
      )}

      <ConfirmDialog
        open={modal.type === "delete"}
        title="Delete Entity"
        message={
          modal.type === "delete"
            ? `Delete "${modal.entity.name}"? This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
        onConfirm={confirmDelete}
        onCancel={closeModal}
      />

      {apiError && (
        <div className="fixed bottom-4 right-4 z-[2000] max-w-sm rounded-md bg-red-600 px-4 py-3 text-sm text-white shadow-lg">
          {apiError}
          <button
            type="button"
            onClick={() => setApiError(null)}
            className="ml-3 text-white/80 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
