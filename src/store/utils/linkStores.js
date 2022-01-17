import isWritable from './isWritable';

export default function linkStores(...stores) {
    if (stores.length === 1 && Array.isArray(stores[0])) {
        stores = stores[0];
    }
    const writables = stores.filter(isWritable);
    const mainStore = writables.shift();

    if (!mainStore) {
        return () => {};
    }

    const unsub = [];
    writables.forEach(store => {
        unsub.push(mainStore.subscribe(value => store.set(value)));
        unsub.push(store.subscribe(value => mainStore.set(value)));
    });

    // Call this to "unlink" the stores.
    return () => unsub.forEach(fn => fn());
}
