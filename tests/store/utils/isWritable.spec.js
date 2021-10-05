import { readable, writable, derived } from 'svelte/store';
import isWritable from '@/store/utils/isWritable';

function noop() { return noop; }

it('can detect svelte stores', async () => {
    expect(isWritable(readable())).toBeFalsy();
    expect(isWritable(writable())).toBeTruthy();
    expect(isWritable(derived(writable(), noop))).toBeFalsy();
});

it('can detect ad-hoc stores', async () => {
    expect(isWritable({subscribe: noop})).toBeFalsy();
    expect(isWritable({subscribe: noop, set: noop})).toBeTruthy();
});

it('can handle non-readable objects', async () => {
    expect(isWritable({})).toBeFalsy();
    expect(isWritable(/bar/)).toBeFalsy();
    expect(isWritable(new Date())).toBeFalsy();
    expect(isWritable(noop)).toBeFalsy();
})

it('can handle empty values.', async () => {
    expect(isWritable()).toBeFalsy();
    expect(isWritable(void 0)).toBeFalsy();
    expect(isWritable(null)).toBeFalsy();
});

it('can handle non-object values.', async () => {
    expect(isWritable(123)).toBeFalsy();
    expect(isWritable('foo')).toBeFalsy();
});
