import { Modal } from "../../components/Modal";
import type { Entity } from "../../types/entity";
import { STATUS_COLOR } from "../../types/entity";

interface EntityDetailProps {
  open: boolean;
  entity: Entity | null;
  onClose: () => void;
  onEdit: (entity: Entity) => void;
  onDelete: (entity: Entity) => void;
}

export function EntityDetail({
  open,
  entity,
  onClose,
  onEdit,
  onDelete,
}: EntityDetailProps) {
  if (!entity) return null;

  return (
    <Modal open={open} title="Entity Detail" onClose={onClose} size="md">
      <div className="space-y-3 text-sm">
        <Row label="ID" value={entity.id} mono />
        <Row label="Name" value={entity.name} />
        <Row label="Type" value={entity.type} />
        <Row
          label="Status"
          value={
            <span className="inline-flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: STATUS_COLOR[entity.status] ?? "#3b82f6",
                }}
              />
              {entity.status}
            </span>
          }
        />
        <Row
          label="Location"
          value={`${entity.latitude.toFixed(5)}, ${entity.longitude.toFixed(5)}`}
        />
        <Row
          label="Description"
          value={entity.description || <em className="text-slate-400">—</em>}
        />
        <Row
          label="Created"
          value={new Date(entity.created_at).toLocaleString()}
        />
        <Row
          label="Updated"
          value={new Date(entity.updated_at).toLocaleString()}
        />
      </div>

      <div className="mt-4 flex justify-end gap-2 border-t pt-3">
        <button
          type="button"
          onClick={() => onDelete(entity)}
          className="rounded-md border border-red-300 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
        <button
          type="button"
          onClick={() => onEdit(entity)}
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Edit
        </button>
      </div>
    </Modal>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <div className="w-24 shrink-0 text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div
        className={`flex-1 break-all text-slate-800 ${mono ? "font-mono text-xs" : ""}`}
      >
        {value}
      </div>
    </div>
  );
}
