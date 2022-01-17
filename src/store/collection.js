import { writable, derived, get } from 'svelte/store';
import isWritable from './isWritable';

export default function collection(array) {
    return applyMethods(writable(array || []));
}

function applyMethods(store) {
    store.clone = function () {
        return applyMethods(writable(get(store)));
    };

    Object.defineProperty(store, 'length', {
        value:    derived(store, $array => $array.length),
        writable: false,
    });

    // Safe methods that return a new version of the original array but do not mutate it.
    let wrap = function (method) {
        return (...args) => applyMethods(derived(store, $array => $array[method](...args)));
    };

    //store.concat = wrap('concat'); // use cases?
    store.filter = wrap('filter');
    store.map    = wrap('map');
    //store.slice  = wrap('slice'); // use cases?

    // Safe methods that do not return the array.
    wrap = function (method) {
        return (...args) => derived(store, $array => $array[method](...args));
    };

    store.every       = wrap('every');
    store.some        = wrap('some');
    store.find        = wrap('find');
    store.findIndex   = wrap('findIndex');
    store.indexOf     = wrap('indexOf');
    store.lastIndexOf = wrap('lastIndexOf');
    store.join        = wrap('join');
    store.reduce      = wrap('reduce');
    store.reduceRight = wrap('reduceRight');

    // Un-safe methods that mutate and return the original array.
    wrap = function (method) {
        return (...args) => applyMethods(derived(store, $array => [...$array][method](...args)));
    };

    store.sort    = wrap('sort');
    store.reverse = wrap('reverse');

    store.forEach = fn => {
        const items = get(store);
        let itemHasMutated = false;
        items.forEach(item => {
            if (true === fn(item)) {
                itemHasMutated = true;
            }
        });
        if (itemHasMutated) {
            store.set(items);
        }
    };

    if (!isWritable(store)) {
        return store;
    }

    // Un-safe methods that mutate the array.
    wrap = function (method) {
        return (...args) => {
            let ret;
            store.update($array => {
                ret = $array[method](...args);
                return $array;
            });
            return ret;
        };
    };

    store.push    = wrap('push');
    store.pop     = wrap('pop');
    store.unshift = wrap('unshift');
    store.shift   = wrap('shift');
    store.splice  = wrap('splice');

    return store;
}
