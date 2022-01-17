import isReadable from './isReadable';

export default function toReadable(value, decorator = null) {
    if (isReadable(value)) {
        return value;
    }

    if (typeof decorator === 'function') {
        value = decorator(value);
    }

    return {
        subscribe(listener) {
            listener(value);
            return () => {};
        },
    };
}
