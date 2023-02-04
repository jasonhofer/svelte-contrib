import { writable } from 'svelte/store';

/**
 * const {
 *   foo,
 *   bar,
 * } = writables({
 *   foo: 123,
 *   bar: 'baz',
 * });
 */
export default function writables(obj) {
  return Object.entries(obj)
    .reduce((o, [k, v]) => (
      o[k] = writable(v), o
    ), {});
}
