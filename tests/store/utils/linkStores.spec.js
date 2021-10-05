import { readable, writable, derived, get } from 'svelte/store';
import linkStores from '@/store/utils/linkStores';

it('sets stores to the value of the first store', async () => {
    const s1 = writable(123);
    const s2 = writable(456);
    const s3 = writable(789);

    linkStores(s1, s2, s3);

    expect(get(s1)).toEqual(123);
    expect(get(s2)).toEqual(123);
    expect(get(s3)).toEqual(123);
});

// @TODO Not sure if this is the bahavior we want.
it('ignores read-only stores', async () => {
    const s1 = readable(12);
    const s2 = writable(34);
    const s3 = readable(56);
    const s4 = writable(78);

    linkStores(s1, s2, s3, s4);

    expect(get(s1)).toEqual(12);
    expect(get(s2)).toEqual(34);
    expect(get(s3)).toEqual(56);
    expect(get(s4)).toEqual(34);
});

it('keeps store values synced', async () => {
    const s1 = writable(12);
    const s2 = writable(34);
    const s3 = writable(56);

    linkStores(s1, s2, s3);

    s1.set(78);

    expect(get(s1)).toEqual(78);
    expect(get(s2)).toEqual(78);
    expect(get(s3)).toEqual(78);

    s1.set(98);

    expect(get(s1)).toEqual(98);
    expect(get(s2)).toEqual(98);
    expect(get(s3)).toEqual(98);
});

it('can take a single argument that is an array of stores', async () => {
    const s1 = writable(12);
    const s2 = writable(34);
    const s3 = writable(56);

    linkStores([ s1, s2, s3 ]);

    s1.set(78);

    expect(get(s1)).toEqual(78);
    expect(get(s2)).toEqual(78);
    expect(get(s3)).toEqual(78);

    s1.set(98);

    expect(get(s1)).toEqual(98);
    expect(get(s2)).toEqual(98);
    expect(get(s3)).toEqual(98);
});

it('returns function to unlink all stores from eachother', async () => {
    const s1 = writable(12);
    const s2 = writable(34);
    const s3 = writable(56);

    const unlink = linkStores(s1, s2, s3);

    expect(unlink).toBeInstanceOf(Function);

    s1.set(78);

    expect(get(s1)).toEqual(78);
    expect(get(s2)).toEqual(78);
    expect(get(s3)).toEqual(78);

    unlink();

    s1.set(98);
    s2.set(76);

    expect(get(s1)).toEqual(98);
    expect(get(s2)).toEqual(76);
    expect(get(s3)).toEqual(78);
});
