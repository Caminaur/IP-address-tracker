import "./App.css";

import patternDesktop from "./assets/images/pattern-bg-desktop.png";
import patternMobile from "./assets/images/pattern-bg-mobile.png";
import { useRef, useState } from "react";

import InputIPSearch from "./Components/InputIPSearch";
import { Map as LeafletMap } from "leaflet";
import MapView from "./Components/MapView";
import InfoCard from "./Components/InfoCard";
import { useIPSearch } from "./hooks/useApiSearch";
import Attribution from "./Components/Attribution";

export interface IpDataInterface {
  ipAddress: string;
  location: string;
  timeZone: string;
  isp: string;
}

function App() {
  const [position, setPosition] = useState<[number, number]>([
    33.44838, -112.07404,
  ]);
  const mapRef = useRef<LeafletMap>(null);

  const [ipData, setIpData] = useState<IpDataInterface>({
    ipAddress: "98.97.116.0",
    location: "Phoenix, Arizona 85001",
    timeZone: "UTC-07:00",
    isp: "SpaceX Starlink",
  });

  const { inputValue, errorValue, handleDataEntry, handleSearchEvent } =
    useIPSearch(setPosition, setIpData, mapRef);

  return (
    <div className="h-screen flex flex-col items-center overflow-hidden justify-center relative">
      <div className="w-full h-screen z-10">
        <picture>
          <source media="(min-width:768px)" srcSet={patternDesktop} />
          <img
            className="w-full h-1/3 object-cover"
            src={patternMobile}
            alt=""
          />
        </picture>

        <div className="h-2/3 ">
          <MapView position={position} ipData={ipData} mapRef={mapRef} />
        </div>
      </div>

      <div className="absolute h-screen w-full flex flex-col items-center z-20 gap-10 p-8 pointer-events-none shadow-2xs">
        <h1 className="text-center font-bold text-2xl text-white ">
          IP Address Tracker
        </h1>
        <InputIPSearch
          inputValue={inputValue}
          errorValue={errorValue}
          handleDataEntry={handleDataEntry}
          handleSearchEvent={handleSearchEvent}
        />
        <InfoCard ipData={ipData} />
      </div>
      <Attribution theme="1" />
    </div>
  );
}

export default App;
