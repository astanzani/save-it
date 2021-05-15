import { useSelector } from 'react-redux';
import { RootState, User } from 'types';

export const useCurrentUser = (): [
  User | undefined,
  boolean,
  string | undefined
] => {
  const { info, loading, error } = useSelector(
    (state: RootState) => state.user
  );
  return [info, loading, error];
};
