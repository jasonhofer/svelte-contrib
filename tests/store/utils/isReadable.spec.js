import { readable, writable, derived } from 'svelte/store';
import isReadable from '@/store/utils/isReadable';

function noop() { return noop; }

it('can detect svelte stores', async () => {
    expect(isReadable(readable())).toBeTruthy();
    expect(isReadable(writable())).toBeTruthy();
    expect(isReadable(derived(writable(), noop))).toBeTruthy();
});

it('can detect ad-hoc stores', async () => {
    expect(isReadable({subscribe: noop})).toBeTruthy();
});

it('can handle non-readable objects', async () => {
    expect(isReadable({})).toBeFalsy();
    expect(isReadable(/bar/)).toBeFalsy();
    expect(isReadable(new Date())).toBeFalsy();
    expect(isReadable(noop)).toBeFalsy();
})

it('can handle empty values.', async () => {
    expect(isReadable()).toBeFalsy();
    expect(isReadable(void 0)).toBeFalsy();
    expect(isReadable(null)).toBeFalsy();
});

it('can handle non-object values.', async () => {
    expect(isReadable(123)).toBeFalsy();
    expect(isReadable('foo')).toBeFalsy();
});
