/* eslint-disable import/first */
jest.mock('utils/storage');

import { HTTPMethod } from 'transport/types';
import fetchWrapper from '../fetch';

describe('Fetch', () => {
  const realFetch = window.fetch;
  let mockFetch: typeof window.fetch;

  beforeEach(() => {
    mockFetch = jest.fn();
    window.fetch = mockFetch;
  });

  afterEach(() => {
    window.fetch = realFetch;
  });

  it('fetchs requested url with default values', async () => {
    await fetchWrapper('some-url');

    expect(mockFetch).toHaveBeenCalledWith(
      'some-url',
      expect.objectContaining({
        method: 'GET',
        headers: {
          map: expect.objectContaining({
            'content-type': 'application/json',
          }),
        },
      })
    );
  });

  it('stringifies body', async () => {
    const payload = { some: 'data' };
    await fetchWrapper('some-url', HTTPMethod.POST, payload);

    expect(mockFetch).toHaveBeenCalledWith(
      'some-url',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(payload),
      })
    );
  });
});
