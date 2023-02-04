import 'jest-localstorage-mock';
import storage from '@/services/storage';
import { writable } from 'svelte/store';

beforeEach(() => {
  // to fully reset the state between tests, clear the storage
  localStorage.clear();
  // and reset all mocks
  jest.clearAllMocks();

  // clearAllMocks will impact your other mocks too,
  // so you can optionally reset individual mocks instead:
  //localStorage.setItem.mockClear();
});

describe('storage', () => {

  test('update()', () => {
    storage.set('foo', 'bar');
    const ret = storage.update(
      'foo', v => v + '-baz'
    );
    expect(ret).toBe('bar-baz');
    expect(storage.get('foo'))
      .toBe('bar-baz');
  });

  test('persistStore()', () => {
    const store = writable();
    storage
      .persistStore('foo', store);
    expect(storage.get('foo'))
      .toBeNull();
    store.set('bar');
    expect(storage.get('foo'))
      .toBe('bar');
    store.update(v => v + '-baz');
    expect(storage.get('foo'))
      .toBe('bar-baz');
  });

  test('persistStore(): stopPersisting()', () => {
    const store = writable();
    storage
      .persistStore('foo', store);
    expect(storage.get('foo'))
      .toBeNull();
    store.set('bar');
    expect(storage.get('foo'))
      .toBe('bar');
    store.stopPersisting();
    store.set('baz');
    expect(storage.get('foo'))
      .toBe('bar');
  });

  test('writable()', () => {
    storage.set('foo', 'bar');
    const store = storage
      .writable('foo');
    expect(storage.get('foo'))
      .toBe('bar');
    store.set('baz');
    expect(storage.get('foo'))
      .toBe('baz');
    storage.remove('foo');
    expect(storage.get('foo'))
      .toBeNull();
  });

  test('truthy()', () => {
    storage.set('foo', 'bar');
    expect(storage.truthy('foo'))
      .toBe(true);
    storage.set('foo', '');
    expect(storage.truthy('foo'))
      .toBe(false);
  });

  test('falsy()', () => {
    storage.set('foo', 'bar');
    expect(storage.falsy('foo'))
      .toBe(false);
    storage.set('foo', '');
    expect(storage.falsy('foo'))
      .toBe(true);
  });

  test('get() deep', () => {
    storage.set('foo', {
      bar: { baz: { qux: { woz: 'wut' } } }
    });
    expect(storage.get('foo.bar.baz'))
      .toEqual({ qux: { woz: 'wut' } });
  });

});
