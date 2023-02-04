import { derived } from 'svelte/store';
import toWritable from './utils/toWritable';

export default function transformed(value, transform) {
    if (typeof transform !== 'function') {
        throw new Error('transformed() expects a function for the second argument.');
    }

    const store = toWritable(value);
    const { subscribe } = derived(
        store,
        $value => transform($value)
    );

    return {
        ...store,
        subscribe,
    };
}
