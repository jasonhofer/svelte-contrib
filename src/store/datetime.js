import { derived } from 'svelte/store';
import transformed from './transformed';
import reads from './reads';
import globalTimeZone from './timeZone';
import globalLocale from './locale';
import { DateTime } from 'luxon';

export default function datetime(dt) {
    const store  = transformed(dt, toDateTime);
    const zone   = reads(globalTimeZone);
    const locale = reads(globalLocale);

    const { subscribe } = derived(
        [ store, zone, locale ],
        ([ $dt, $zone, $locale ]) => $dt.setZone($zone).setLocale($locale)
    );

    // Calling these setters will unsubscribe the datetime object from the global stores.
    store.setZone     = value => { zone.set(value); return zone; };
    store.setLocale   = value => { locale.set(value); return locale; };
    store.zoneStore   = () => zone;
    store.localeStore = () => locale;

    return dateTimeMethods({
        ...store,
        subscribe,
    });
}

function dateTimeMethods(store) {
    store.formatted = (...args) => derived(store, $dt => $dt.toLocaleString(...args));
    store.plus      = (...args) => derived(store, $dt => $dt.plus(...args));
    store.minus     = (...args) => derived(store, $dt => $dt.minus(...args));
    
    return store;
}

function toDateTime(dt) {
    if (dt == null)              return DateTime.now();
    if (DateTime.isDateTime(dt)) return dt;
    if (dt instanceof Date)      return DateTime.fromJSDate(dt);
    if (!isNaN(dt))              return DateTime.fromMillis(+dt);

    // @TODO regex detection?
    return DateTime.fromISO(dt);
}
