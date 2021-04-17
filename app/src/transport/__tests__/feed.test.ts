/* eslint-disable import/first */

jest.mock('../fetch');
jest.mock('../backOff');

import { startFeed, maybeRun } from '../feed';
import fetch from '../fetch';
import { mocked } from 'ts-jest/utils';
import { backOff } from '../backOff';

const fetchMock = mocked(fetch, true);

describe('Feed', () => {
  it('makes request to feed endpoint on start', () => {
    startFeed();

    expect(fetchMock).toHaveBeenCalled();
  });

  it('runs if response is ok', async () => {
    await maybeRun(true);

    expect(fetchMock).toHaveBeenCalled();
  });

  it('runs with backOff if response is not ok', async () => {
    await maybeRun(false);

    expect(backOff).toHaveBeenCalled();
  });
});
