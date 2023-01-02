// Streams do not give listeners the current value.
// They only call listeners when the value changes.
// @TODO When testing, make sure it still works after it has gone dormant.
export default function stream(store) {
    return {
        ...store,
        subscribe(listener, ...args) {
            let handler = () => handler = listener;
            return store.subscribe($value => void(handler($value)), ...args);
        },
    };
}
