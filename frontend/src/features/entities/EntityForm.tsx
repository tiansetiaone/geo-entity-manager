import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "../../components/Modal";
import {
  ENTITY_STATUSES,
  ENTITY_TYPES,
  type Entity,
  type EntityStatus,
  type EntityType,
} from "../../types/entity";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Max 100 chars"),
  type: z.enum(["vehicle", "iot_device", "facility", "other"]),
  status: z.enum(["active", "inactive", "maintenance", "unknown"]),
  latitude: z.coerce
    .number({ message: "Latitude must be a number" })
    .min(-90, "Min -90")
    .max(90, "Max 90"),
  longitude: z.coerce
    .number({ message: "Longitude must be a number" })
    .min(-180, "Min -180")
    .max(180, "Max 180"),
  description: z.string().max(500, "Max 500 chars").optional().default(""),
});

export type EntityFormValues = z.infer<typeof schema>;

interface EntityFormProps {
  open: boolean;
  mode: "create" | "edit";
  initial?: Entity | null;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (values: EntityFormValues) => void;
  defaultCoords?: { lat: number; lng: number } | null;
}

export function EntityForm({
  open,
  mode,
  initial,
  submitting,
  onClose,
  onSubmit,
  defaultCoords,
}: EntityFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EntityFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      type: "vehicle",
      status: "active",
      latitude: 0,
      longitude: 0,
      description: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initial) {
      reset({
        name: initial.name,
        type: initial.type,
        status: initial.status,
        latitude: initial.latitude,
        longitude: initial.longitude,
        description: initial.description ?? "",
      });
    } else {
      reset({
        name: "",
        type: "vehicle",
        status: "active",
        latitude: defaultCoords?.lat ?? -6.2,
        longitude: defaultCoords?.lng ?? 106.816666,
        description: "",
      });
    }
  }, [open, mode, initial, defaultCoords, reset]);

  return (
    <Modal
      open={open}
      title={mode === "create" ? "Add Entity" : "Edit Entity"}
      onClose={onClose}
      size="md"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="entity-form"
            disabled={submitting}
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save"}
          </button>
        </>
      }
    >
      <form
        id="entity-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-3"
      >
        <Field label="Name" error={errors.name?.message}>
          <input
            type="text"
            {...register("name")}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Type" error={errors.type?.message}>
            <select
              {...register("type")}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              {ENTITY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Status" error={errors.status?.message}>
            <select
              {...register("status")}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              {ENTITY_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Latitude" error={errors.latitude?.message}>
            <input
              type="number"
              step="any"
              {...register("latitude")}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </Field>
          <Field label="Longitude" error={errors.longitude?.message}>
            <input
              type="number"
              step="any"
              {...register("longitude")}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </Field>
        </div>

        <Field label="Description" error={errors.description?.message}>
          <textarea
            rows={3}
            {...register("description")}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </Field>
      </form>
    </Modal>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-600">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export type { EntityType, EntityStatus };
