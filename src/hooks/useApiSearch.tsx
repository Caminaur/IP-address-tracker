import { useState } from "react";
import type { IpDataInterface } from "../App";
import {
  isPublicIP,
  isValidIP,
  normalizeIP,
} from "../features/ip-tracker/ipUtils";
import { fetchIPData } from "../features/ip-tracker/ipApi";

export function useIPSearch(
  setPosition: React.Dispatch<React.SetStateAction<[number, number]>>,
  setIpData: React.Dispatch<React.SetStateAction<IpDataInterface>>,
  mapRef: React.RefObject<L.Map | null>
) {
  const [inputValue, setInputValue] = useState("");
  const [errorValue, setErrorValue] = useState("");

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
    if (!/^[0-9.]*$/.test(value) || value.includes("..")) return;

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

  const handleSearchEvent = async () => {
    const ip = await normalizeIP(inputValue);

    setInputValue(ip);
    const isValid = isValidIP(ip);
    const isPublic = isPublicIP(ip);

    if (!isValid) {
      setErrorValue("The IP format is invalid. Try something like 8.8.8.8");
      return;
    }
    if (!isPublic) {
      setErrorValue("Private IPs are not allowed. Use a public address.");
      return;
    }

    setErrorValue("");
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
  };

  return {
    inputValue,
    setInputValue,
    errorValue,
    handleDataEntry,
    handleSearchEvent,
  };
}
