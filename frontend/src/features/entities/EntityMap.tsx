import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Entity } from "../../types/entity";
import { STATUS_COLOR } from "../../types/entity";

// Fix default icon path issue with bundlers
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function colorIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width: 18px; height: 18px; border-radius: 50%;
      background:${color}; border:2px solid white;
      box-shadow: 0 0 0 2px ${color}55;
    "></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -9],
  });
}

function ClickCatcher({ onClick }: { onClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      if (onClick) onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface EntityMapProps {
  entities: Entity[];
  selectedId?: string | null;
  onSelect?: (entity: Entity) => void;
  onMapClick?: (lat: number, lng: number) => void;
}

export function EntityMap({
  entities,
  selectedId,
  onSelect,
  onMapClick,
}: EntityMapProps) {
  const center: [number, number] =
    entities.length > 0
      ? [entities[0].latitude, entities[0].longitude]
      : [-6.2, 106.816666];

  return (
    <MapContainer
      center={center}
      zoom={entities.length > 0 ? 6 : 5}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickCatcher onClick={onMapClick} />
      {entities.map((entity) => {
        const isSelected = selectedId === entity.id;
        return (
          <Marker
            key={entity.id}
            position={[entity.latitude, entity.longitude]}
            icon={colorIcon(STATUS_COLOR[entity.status] ?? "#3b82f6")}
            eventHandlers={{
              click: () => onSelect?.(entity),
            }}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{entity.name}</div>
                <div className="text-slate-600">{entity.type}</div>
                <div className="text-slate-600">Status: {entity.status}</div>
                {isSelected && (
                  <div className="mt-1 text-xs text-blue-600">Selected</div>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
