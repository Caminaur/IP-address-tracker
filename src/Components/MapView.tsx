import React, { useEffect } from "react";
import "./MapView.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  ZoomControl,
} from "react-leaflet";
import { Map as LeafletMap, type LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { resetIcons } from "../features/map/mapUtils";
import iconLocation from "../assets/images/icon-location.svg";

export interface IpDataInterface {
  ipAddress: string;
  location: string;
  timeZone: string;
  isp: string;
}
const customIcon = new L.Icon({
  iconUrl: iconLocation,
  iconSize: [40, 50],
  iconAnchor: [20, 70],
});

type MapViewProps = {
  position: [number, number];
  ipData: IpDataInterface;
  mapRef: React.RefObject<LeafletMap | null>;
};

export function MapEffect({ position }: { position: LatLngExpression }) {
  const map = useMap();

  resetIcons();

  useEffect(() => {
    map.flyTo(position, 13);
  }, [position]);

  return null;
}

function MapView({ position, ipData }: MapViewProps) {
  return (
    <MapContainer
      center={position}
      zoom={15}
      style={{ height: "100%" }}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Marker position={position} icon={customIcon}>
        <Popup>{ipData.ipAddress}</Popup>
      </Marker>
      <MapEffect position={position} />
      <ZoomControl position="bottomleft" />
    </MapContainer>
  );
}

export default MapView;
