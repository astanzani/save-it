import * as storage from '../storage';

describe('Storage util', () => {
  beforeEach(() => {
    jest.spyOn(window.localStorage.__proto__, 'setItem');
    jest
      .spyOn(window.localStorage.__proto__, 'getItem')
      .mockImplementation((key) => {
        if (key === 'key') {
          return JSON.stringify({
            some: 'data',
          });
        }
      });
    jest.spyOn(window.localStorage.__proto__, 'removeItem');
  });

  it('saves item to localstorage', () => {
    const item = { some: 'data' };
    storage.setStorageItem('key', item);

    expect(window.localStorage.setItem).toBeCalledWith(
      'key',
      JSON.stringify(item)
    );
  });

  it('returns item from localstorage', () => {
    const item = storage.getStorageItem('key');

    expect(item).toEqual({ some: 'data' });
    expect(window.localStorage.getItem).toBeCalledWith('key');
  });

  it('returns undefined if item does not exist', () => {
    const item = storage.getStorageItem('dont-exist');

    expect(item).toBeUndefined();
  });

  it('removes item from localstorage', () => {
    storage.deleteStorageItem('key');

    expect(window.localStorage.removeItem).toBeCalledWith('key');
  });
});
