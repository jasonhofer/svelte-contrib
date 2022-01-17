import { writable } from 'svelte/store';

// https://api.emberjs.com/ember/release/functions/@ember%2Fobject%2Fcomputed/reads

export default function reads(store) {
    const alias  = writable();
    const unsub  = store.subscribe(value => alias.set(value));
    const detach = () => {
        unsub();
        handler = alias;
    };
    let handler = {
        set:    val => { detach(); return alias.set(val); },
        update: fn  => { detach(); return alias.update(fn); },
    };

    return {
        set:    val => handler.set(val),
        update: fn  => handler.update(fn),
        detach: ()  => void(handler === alias || detach()),
        subscribe: alias.subscribe,
    };
}
