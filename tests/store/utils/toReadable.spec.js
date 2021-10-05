import { readable, writable, derived, get } from 'svelte/store';
import toReadable from '@/store/utils/toReadable';

function noop() { return noop; }

it('returns original object if already a readable', async () => {
    const r = readable();
    const w = writable();
    const d = derived(w, noop);
    const o = {subscribe: noop};

    expect(Object.is(toReadable(r), r)).toBeTruthy();
    expect(Object.is(toReadable(w), w)).toBeTruthy();
    expect(Object.is(toReadable(d), d)).toBeTruthy();
    expect(Object.is(toReadable(o), o)).toBeTruthy();
});

it('returns an object with a subscribe method', async () => {
    expect(toReadable('foo').subscribe).toBeInstanceOf(Function);
});

it('subscribe method returns a function', async () => {
    expect(toReadable('foo').subscribe(noop)).toBeInstanceOf(Function);
});

it('can handle empty values', async () => {
    expect(toReadable().subscribe).toBeInstanceOf(Function);
    expect(toReadable(void 0).subscribe).toBeInstanceOf(Function);
    expect(toReadable(null).subscribe).toBeInstanceOf(Function);
});

it('subscribers are given the original value', async () => {
    const expected = 123;
    const store    = toReadable(expected);

    let actual = null;

    store.subscribe(value => {
        actual = value;
    });

    expect(actual).toBe(expected);
    expect(get(store)).toBe(expected);
});

it('allows "decorating" the value before giving it to the store', async () => {
    const store = toReadable(1633384806062, v => new Date(v));

    expect(get(store)).toBeInstanceOf(Date);
});
