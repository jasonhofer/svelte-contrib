import { writable } from 'svelte/store';

// This is a writable with a built-in `get()` method.
export default function store(value, ...args) {
  const proxied = writable(value, ...args);

  return {
    set(newValue) { return proxied.set(value = newValue); },
    update(fn) { return proxied.update($value => value = fn($value)); },
    get() { return value; },
    subscribe: proxied.subscribe,
  };
}
