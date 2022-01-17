import { writable, get } from 'svelte/store';
import isWritable from './isWritable';
import isReadable from './isReadable';

export default function toWritable(value, decorator = null) {
    if (isWritable(value)) {
        return value;
    }

    if (isReadable(value)) {
        value = get(value);
    } else if (typeof decorator === 'function') {
        value = decorator(value);
    }

    return writable(value);
}
