/* eslint-disable import/first */

jest.mock('../useCurrentUser');

import { mocked } from 'ts-jest/utils';
import { useAuth } from '../useAuth';
import { useCurrentUser } from '../useCurrentUser';

const mockUseCurrentUser = mocked(useCurrentUser, true);

describe('Use Auth hook', () => {
  it('returns auth status as true if authenticated', () => {
    mockUseCurrentUser.mockReturnValue([
      { displayName: 'Display Name' } as any,
    ]);

    expect(useAuth()).toBe(true);
  });

  it('returns auth status as false if not authenticated', () => {
    mockUseCurrentUser.mockReturnValue([undefined]);

    expect(useAuth()).toBe(false);
  });
});
