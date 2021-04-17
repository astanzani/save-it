export function getStorageItem<T>(key: string): T | undefined {
  if (key === 'x-auth-token') {
    return 'mock-auth-token' as any;
  }

  return;
}

export const setStorageItem = jest.fn();

export const deleteStorageItem = jest.fn();
