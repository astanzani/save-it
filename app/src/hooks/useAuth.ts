import { useCurrentUser } from './useCurrentUser';

export function useAuth() {
  const user = useCurrentUser();

  return !!user;
}
