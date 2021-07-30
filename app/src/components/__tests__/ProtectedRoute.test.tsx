/* eslint-disable import/first */

jest.mock('hooks/useAuth');

import { BrowserRouter } from 'react-router-dom';
import { getByTestId, render } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { useAuth } from 'hooks';
import { ProtectedRoute } from '../ProtectedRoute';

const mockUseAuth = mocked(useAuth, true);

describe('Protected Route component', () => {
  it('does not render content if not authenticated', () => {
    mockUseAuth.mockReturnValue(false);

    const { queryByTestId } = render(
      <BrowserRouter>
        <ProtectedRoute>
          <div data-testid="PROTECTED_COMPONENT" />
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(queryByTestId('PROTECTED_COMPONENT')).toBeNull();
  });

  it('renders content if authenticated', () => {
    mockUseAuth.mockReturnValue(true);

    const { getByTestId } = render(
      <BrowserRouter>
        <ProtectedRoute>
          <div data-testid="PROTECTED_COMPONENT" />
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(getByTestId('PROTECTED_COMPONENT')).toBeInTheDocument();
  });
});
