import type { Entity, EntityStatus, EntityType } from "../../types/entity";
import { ENTITY_STATUSES, ENTITY_TYPES, STATUS_COLOR } from "../../types/entity";

interface EntityListProps {
  entities: Entity[];
  loading?: boolean;
  selectedId?: string | null;
  filters: { type: EntityType | ""; status: EntityStatus | ""; search: string };
  onFiltersChange: (filters: {
    type: EntityType | "";
    status: EntityStatus | "";
    search: string;
  }) => void;
  onSelect: (entity: Entity) => void;
  onEdit: (entity: Entity) => void;
  onDelete: (entity: Entity) => void;
  onCreate: () => void;
}

export function EntityList({
  entities,
  loading,
  selectedId,
  filters,
  onFiltersChange,
  onSelect,
  onEdit,
  onDelete,
  onCreate,
}: EntityListProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-3">
        <button
          type="button"
          onClick={onCreate}
          className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Add Entity
        </button>
      </div>

      <div className="space-y-2 border-b p-3">
        <input
          type="text"
          placeholder="Search by name..."
          value={filters.search}
          onChange={(e) =>
            onFiltersChange({ ...filters, search: e.target.value })
          }
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
        <div className="flex gap-2">
          <select
            value={filters.type}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                type: e.target.value as EntityType | "",
              })
            }
            className="flex-1 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
          >
            <option value="">All types</option>
            {ENTITY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                status: e.target.value as EntityStatus | "",
              })
            }
            className="flex-1 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
          >
            <option value="">All status</option>
            {ENTITY_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="p-4 text-center text-sm text-slate-500">Loading...</div>
        )}
        {!loading && entities.length === 0 && (
          <div className="p-4 text-center text-sm text-slate-500">
            No entities yet.
          </div>
        )}
        {entities.map((entity) => {
          const isSelected = selectedId === entity.id;
          return (
            <div
              key={entity.id}
              onClick={() => onSelect(entity)}
              className={`cursor-pointer border-b px-3 py-2.5 hover:bg-slate-50 ${
                isSelected ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor:
                      STATUS_COLOR[entity.status] ?? "#3b82f6",
                  }}
                />
                <span className="flex-1 truncate text-sm font-medium text-slate-800">
                  {entity.name}
                </span>
              </div>
              <div className="mt-1 flex justify-between text-xs text-slate-500">
                <span>{entity.type}</span>
                <span>{entity.status}</span>
              </div>
              <div className="mt-2 flex gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(entity);
                  }}
                  className="rounded border border-slate-300 px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(entity);
                  }}
                  className="rounded border border-red-300 px-2 py-0.5 text-xs text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
