export const isValidIP = (ip: string): boolean => {
  const parts = ip.split(".");
  if (parts.length !== 4) return false;

  return parts.every((part) => {
    const num = Number(part);
    return /^\d+$/.test(part) && num >= 0 && num <= 255;
  });
};

export const isPublicIP = (ip: string): boolean => {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4) return false;

  const [a, b] = parts;

  const isPrivate =
    a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168);

  const isReserved =
    a === 127 ||
    (a === 169 && b === 254) ||
    a === 0 ||
    a === 255 ||
    a === 224 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 198 && (b === 18 || b === 19)) ||
    (a === 192 && b === 0);

  return !isPrivate && !isReserved;
};
