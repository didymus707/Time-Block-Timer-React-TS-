import { useEffect, useState } from "react";

function getStorageValue<T>(key: string, defaultValue: T): T {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) as T : defaultValue
}

export const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    return getStorageValue<T>(key, initialValue);
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  })
  return [value, setValue] as const;
}