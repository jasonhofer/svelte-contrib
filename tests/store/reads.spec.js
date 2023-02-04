import { writable } from 'svelte/store'
import reads from '@/store/reads';

describe('reads()', () => {
it('reads another store\'s value', () => {
  const store = writable(2);
  const reader = reads(store);
  const listener = jest.fn();
  reader.subscribe(listener);
  expect(listener).toBeCalledTimes(1);
  expect(listener).lastCalledWith(2);
  store.set(4);
  expect(listener).toBeCalledTimes(2);
  expect(listener).lastCalledWith(4);
  store.update($val => $val * 2);
  expect(listener).toBeCalledTimes(3);
  expect(listener).lastCalledWith(8);
});

it('detaches from the other store when its own value is set', () => {
  const store = writable(2);
  const reader = reads(store);
  const listener = jest.fn();
  reader.subscribe(listener);
  expect(listener).toBeCalledTimes(1);
  expect(listener).lastCalledWith(2);
  store.set(4);
  expect(listener).toBeCalledTimes(2)
  expect(listener).lastCalledWith(4);
  reader.set(8);
  expect(listener).toBeCalledTimes(3);
  expect(listener).lastCalledWith(8);
  store.set(16);
  expect(listener).toBeCalledTimes(3);
  expect(listener).lastCalledWith(8);
});

it('detaches from the other store when its own value is updated', () => {
  const store = writable(2);
  const reader = reads(store);
  const listener = jest.fn();
  reader.subscribe(listener);
  expect(listener).toBeCalledTimes(1);
  expect(listener).lastCalledWith(2);
  store.set(4);
  expect(listener).toBeCalledTimes(2);
  expect(listener).lastCalledWith(4);
  reader.update($val => $val * 2);
  expect(listener).toBeCalledTimes(3);
  expect(listener).lastCalledWith(8);
  store.set(16);
  expect(listener).toBeCalledTimes(3);
  expect(listener).lastCalledWith(8);
});

it('can call detach() to stop reading the other store', () => {
  const store = writable(2);
  const reader = reads(store);
  const listener = jest.fn();
  reader.subscribe(listener);
  expect(listener).toBeCalledTimes(1);
  expect(listener).lastCalledWith(2);
  store.set(4);
  expect(listener).toBeCalledTimes(2);
  expect(listener).lastCalledWith(4);
  reader.detach();
  store.set(8);
  expect(listener).toBeCalledTimes(2);
  expect(listener).lastCalledWith(4);
});

it('can re-attach to the other store', () => {
  const store = writable(2);
  const reader = reads(store);
  const listener = jest.fn();
  reader.subscribe(listener);
  expect(listener).toBeCalledTimes(1);
  expect(listener).lastCalledWith(2);
  store.set(4);
  expect(listener).toBeCalledTimes(2)
  expect(listener).lastCalledWith(4);
  reader.set(8);
  expect(listener).toBeCalledTimes(3);
  expect(listener).lastCalledWith(8);
  store.set(16);
  expect(listener).toBeCalledTimes(3);
  expect(listener).lastCalledWith(8);
  reader.attach();
  expect(listener).toBeCalledTimes(4);
  expect(listener).lastCalledWith(16);
  store.set(32);
  expect(listener).toBeCalledTimes(5);
  expect(listener).lastCalledWith(32);
});
});
