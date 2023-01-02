import { readable, writable, derived, get } from 'svelte/store';
import toWritable from '@/store/utils/toWritable';

function noop() { return noop; }

it('returns original object if already a writable', async () => {
    const r = readable();
    const w = writable();
    const d = derived(w, noop);
    const o = {subscribe: noop};
    const s = {subscribe: noop, set: noop};

    expect(Object.is(toWritable(r), r)).toBeFalsy();
    expect(Object.is(toWritable(w), w)).toBeTruthy();
    expect(Object.is(toWritable(d), d)).toBeFalsy();
    expect(Object.is(toWritable(o), o)).toBeFalsy();
    expect(Object.is(toWritable(s), s)).toBeTruthy();
});

it('returns an object with a subscribe and a set method', async () => {
    const store = toWritable('foo');
    expect(store.subscribe).toBeInstanceOf(Function);
    expect(store.set).toBeInstanceOf(Function);
});

it('subscribe method returns a function', async () => {
    expect(toWritable('foo').subscribe(noop)).toBeInstanceOf(Function);
});

it('can handle empty values', async () => {
    expect(toWritable().set).toBeInstanceOf(Function);
    expect(toWritable(void 0).set).toBeInstanceOf(Function);
    expect(toWritable(null).set).toBeInstanceOf(Function);
});

it('subscribers are given the original value', async () => {
    const expected = 123;
    const store    = toWritable(expected);

    let actual = null;

    store.subscribe(value => {
        actual = value;
    });

    expect(actual).toBe(expected);
    expect(get(store)).toBe(expected);
});

it('allows "decorating" the value before giving it to the store', async () => {
    const store = toWritable(1633384806062, v => new Date(v));

    expect(get(store)).toBeInstanceOf(Date);
});
