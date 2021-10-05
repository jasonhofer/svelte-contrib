import { writable } from 'svelte/store';

// This is a writable with a built-in `get()` method.
export default function store(value, ...args) {
    const proxied = writable(value, ...args);
    const set    = newValue => proxied.set(value = newValue);
    const update = fn => proxied.update($value => value = fn($value));
    const get    = () => value;

    return { set, update, get, subscribe: proxied.subscribe };
}
