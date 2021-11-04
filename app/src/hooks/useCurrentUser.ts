import { useSelector } from 'react-redux';
import { RootState, User } from 'types';

export const useCurrentUser = (): User | null => {
  const user = useSelector((state: RootState) => state.user);
  return user;
};
