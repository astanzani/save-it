import { backOff } from '../backOff';

function getCurrentTimeout(depth: number) {
  return 2 ** depth * 1000;
}

describe('Back Off', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('backs off based on passed depth', async () => {
    const fn = jest.fn().mockResolvedValue('data');

    const pr = backOff(fn);
    jest.advanceTimersByTime(getCurrentTimeout(0));

    const data = await pr;
    expect(data).toBe('data');

    const fn2 = jest.fn().mockResolvedValue('data2');

    const pr2 = backOff(fn2, 10);
    jest.advanceTimersByTime(getCurrentTimeout(10));
    const data2 = await pr2;
    expect(data2).toBe('data2');
  });
});
