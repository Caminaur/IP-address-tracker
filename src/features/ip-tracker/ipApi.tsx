export const fetchIPData = async (ip: string) => {
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
