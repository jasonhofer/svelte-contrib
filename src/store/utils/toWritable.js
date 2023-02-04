import { writable, get } from 'svelte/store';
import isWritable from './isWritable';
import isReadable from './isReadable';
import reads from '@/store/reads';

export default function toWritable(value, decorator = null) {
    if (isWritable(value)) {
        return value;
    }

    if (isReadable(value)) {
        return reads(value);
    }

    if (typeof decorator === 'function') {
        value = decorator(value);
    }

    return writable(value);
}
