import { useEffect } from "react";
import type { IpDataInterface } from "../App";
import { fetchIPData } from "../features/ip-tracker/ipApi";

export function useInitialIpLoad(
  setPosition: React.Dispatch<React.SetStateAction<[number, number]>>,
  setIpData: React.Dispatch<React.SetStateAction<IpDataInterface>>,
  mapRef: React.RefObject<L.Map | null>
) {
  useEffect(() => {
    const fetchIp = async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const ip = (await res.json()).ip;
        const data = await fetchIPData(ip);
        if (data) {
          const { lat, lng } = data.location;
          setPosition([lat, lng]);
          setIpData({
            ipAddress: data.ip,
            location: `${data.location.city}, ${data.location.region} ${data.location.postalCode}`,
            timeZone: `UTC${data.location.timezone}`,
            isp: data.isp,
          });
          mapRef.current?.flyTo([lat, lng], 13);
        }
      } catch (error) {
        console.error("Failed to get IP:", error);
      }
    };
    fetchIp();
  }, []);
}
