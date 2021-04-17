import { useSelector } from 'react-redux';
import { RootState } from 'types';

export const useCurrentUser = () => {
  const { info, loading, error } = useSelector(
    (state: RootState) => state.user
  );
  return [info, loading, error];
};
