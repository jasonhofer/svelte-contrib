import { writable } from 'svelte/store';
import readonly from './readonly';

// const store = withReadonly(value);
// const { readonly, ...store } = withReadonly(value);
export default function withReadonly(value) {
  const store = writable(value);
  store.readonly = readonly(store);
  return store;
}
