export function getStorageItem<T>(key: string): T | undefined {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : undefined;
}

export function setStorageItem<T>(key: string, item: T) {
  const data = JSON.stringify(item);
  localStorage.setItem(key, data);
}

export function deleteStorageItem(key: string) {
  localStorage.removeItem(key);
}
