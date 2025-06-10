import "./App.css";

import arrowIcon from "./assets/images/icon-arrow.svg";

import patternDesktop from "./assets/images/pattern-bg-desktop.png";
import patternMobile from "./assets/images/pattern-bg-mobile.png";
import { isValidIP, isPublicIP } from "./utils/ipUtils";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef, useState } from "react";

interface Props {
  position: [number, number];
}

export function MapEffect({ position }: Props) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, 13);
  }, [position]);

  return null;
}

function App() {
  const [inputValue, setInputValue] = useState("");
  const [errorValue, setErrorValue] = useState("");
  const [ipData, setIpData] = useState({
    ipAddress: "192.212.174.101",
    location: "Brooklyn, NY 10001",
    timeZone: "UTC-05:00",
    isp: "SpaceX Starlink",
  });

  const mapRef = useRef<LeafletMap>(null);
  const [position, setPosition] = useState<[number, number]>([
    40.4168, -3.7038,
  ]); // posición inicial

  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });

  const fetchIPData = async (ip: string) => {
    const apiKey = import.meta.env.VITE_IPIFY_API_KEY;

    const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${ip}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Error fetching IP data");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API error:", error);
      return null;
    }
  };

  const handleDataEntry = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => {
    if ("key" in e && e.key === "Enter") {
      handleSearchEvent();
      return;
    }

    const value = e.currentTarget.value;

    if (!/^[0-9.]*$/.test(value)) return;
    if (value.includes("..")) return;

    const parts = value.split(".");
    if (parts.length > 4) return;

    if (parts.length < 4) {
      const last = parts[parts.length - 1];
      if (last.length > 3) {
        const newPart = last.slice(0, 3);
        const remainder = last.slice(3);
        parts[parts.length - 1] = newPart;
        parts.push(remainder);
      }
    }

    if (parts.some((part) => part.length > 3)) return;

    setInputValue(parts.join("."));
  };

  async function handleSearchEvent() {
    const isValid = isValidIP(inputValue);
    const isPublic = isPublicIP(inputValue);

    if (!isValid) {
      setErrorValue("The IP format is invalid. Try something like 8.8.8.8");
      return;
    }

    if (!isPublic) {
      setErrorValue("Private IPs are not allowed. Use a public address.");
      return;
    }

    // Si pasa ambas validaciones
    setErrorValue(""); // Limpiar errores
    const data = await fetchIPData(inputValue);
    if (data) {
      if (data) {
        const { lat, lng } = data.location;
        setPosition([lat, lng]);
        setIpData({
          ipAddress: data.ip,
          location: `${data.location.city}, ${data.location.region} ${data.location.postalCode}`,
          timeZone: `UTC${data.location.timezone}`,
          isp: data.isp,
        });

        // Mover el mapa
        if (mapRef.current) {
          mapRef.current.flyTo([lat, lng], 13);
        }
      }
    }
  }

  return (
    <div className="h-screen flex flex-col items-center overflow-hidden justify-center">
      <div className="w-full h-screen z-10">
        <picture>
          <source media="(min-width:768px)" srcSet={patternDesktop} />
          <img
            className="w-full h-1/2 object-cover"
            src={patternMobile}
            alt=""
          />
        </picture>

        <MapContainer center={position} zoom={13} style={{ height: "60%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <Marker position={position}>
            <Popup>{ipData.ipAddress}</Popup>
          </Marker>
          <MapEffect position={position} />
        </MapContainer>
      </div>

      <div className="absolute h-screen w-full flex flex-col items-center z-20 gap-6 p-6 pointer-events-none">
        <h1 className="text-center font-bold text-2xl text-white">
          IP Address Tracker
        </h1>
        <div className="flex flex-col items-center justify-center w-full  max-w-140">
          <div className="bg-white rounded-lg overflow-hidden w-full flex justify-between">
            <input
              className="w-full pl-4 border-gray-500 focus:border-gray-300 pointer-events-auto font-semibold"
              type="text"
              max={15}
              value={inputValue}
              onKeyDown={(e) => handleDataEntry(e)}
              onChange={handleDataEntry}
              placeholder="Search for any IP address or domain"
            />
            <button
              className="bg-black p-5 cursor-pointer pointer-events-auto"
              type="button"
              onClick={handleSearchEvent}
            >
              <img src={arrowIcon} alt="" />
            </button>
          </div>
          <p className="text-red-500">{errorValue}</p>
        </div>
        <div className="bg-white w-full rounded-2xl py-6 px-4 flex flex-col justify-center items-center gap-6 md:flex-row md:justify-between md:px-8 lg:max-w-280 md:gap-0 md:items-stretch">
          <div className="flex-item">
            <span className="label">IP Adress</span>
            <span className="value">{ipData.ipAddress}</span>
          </div>
          <div className="separator"></div>
          <div className="flex-item">
            <span className="label">Location</span>
            <span className="value">{ipData.location}</span>
          </div>
          <div className="separator"></div>
          <div className="flex-item">
            <span className="label">Timezone</span>
            <span className="value">{ipData.timeZone}</span>
          </div>
          <div className="separator"></div>
          <div className="flex-item">
            <span className="label">ISP</span>
            <span className="value">{ipData.isp}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
