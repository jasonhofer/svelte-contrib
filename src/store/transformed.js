import { writable, derived } from 'svelte/store';

export default function transformed(value, transform) {
    const store         = writable(value);
    const { subscribe } = derived(store, $value => transform($value));

    return {
        ...store,
        subscribe,
    };
}
