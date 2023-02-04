import toReadable from './utils/toReadable';

/**
 * Makes any store (or value) a read-only store.
 */
export default function readonly(store) {
  store = toReadable(store);
  return {
    subscribe(listener, ...args) {
      return store.subscribe(listener, ...args);
    },
  };
}
