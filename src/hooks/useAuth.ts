import { getStorageItem } from 'utils';

export function useAuth() {
  const authToken = getStorageItem<string>('x-auth-token');
  return !!authToken;
}
