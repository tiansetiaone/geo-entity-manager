export type EntityType = "vehicle" | "iot_device" | "facility" | "other";
export type EntityStatus = "active" | "inactive" | "maintenance" | "unknown";

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  status: EntityStatus;
  latitude: number;
  longitude: number;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEntityPayload {
  name: string;
  type: EntityType;
  status: EntityStatus;
  latitude: number;
  longitude: number;
  description: string;
}

export type UpdateEntityPayload = CreateEntityPayload;

export interface EntityListFilters {
  type?: EntityType | "";
  status?: EntityStatus | "";
  search?: string;
}

export const ENTITY_TYPES: { value: EntityType; label: string }[] = [
  { value: "vehicle", label: "Vehicle" },
  { value: "iot_device", label: "IoT Device" },
  { value: "facility", label: "Facility" },
  { value: "other", label: "Other" },
];

export const ENTITY_STATUSES: { value: EntityStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "maintenance", label: "Maintenance" },
  { value: "unknown", label: "Unknown" },
];

export const STATUS_COLOR: Record<EntityStatus, string> = {
  active: "#16a34a",
  inactive: "#6b7280",
  maintenance: "#f59e0b",
  unknown: "#3b82f6",
};
