/* eslint-disable import/first */

jest.mock('react-redux');

import { useCurrentUser } from '../useCurrentUser';
import * as reactRedux from 'react-redux';
import { mocked } from 'ts-jest/utils';

const mockReactRedux = mocked(reactRedux, true);

describe('Use Current User hook', () => {
  it('returns current user data', () => {
    mockReactRedux.useSelector.mockReturnValue({
      loading: false,
      error: undefined,
      info: {
        displayName: 'Display Name',
      },
    });

    const [user, loading, error] = useCurrentUser();

    expect(user).toEqual({ displayName: 'Display Name' });
    expect(loading).toBe(false);
    expect(error).toBe(undefined);
  });
});
