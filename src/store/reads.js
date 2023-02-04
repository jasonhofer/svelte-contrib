import { writable } from 'svelte/store';

// https://api.emberjs.com/ember/release/functions/@ember%2Fobject%2Fcomputed/reads

export default function reads(store) {
    const alias  = writable();
    let unsub, handler;
    const detach = () => {
        if (!unsub) return;
        unsub();
        handler = alias;
        unsub = null;
    };
    const attach = () => {
      if (unsub) return;
      unsub = store.subscribe($val => alias.set($val));
      handler = {
        set:    val => { detach(); return alias.set(val); },
        update: fn  => { detach(); return alias.update(fn); },
      };
    };
    attach();

    return {
        set:    val => handler.set(val),
        update: fn  => handler.update(fn),
        detach,
        attach,
        subscribe: alias.subscribe,
    };
}
