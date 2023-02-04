import { writable } from 'svelte/store';
import transformed from '@/store/transformed';

it('returns a writable store that transforms its value', () => {
  const store = transformed(4, $value => $value * 2);
  const listener = jest.fn();
  store.subscribe(listener);
  expect(listener).lastCalledWith(8);
  store.set(16);
  expect(listener).lastCalledWith(32);
});
