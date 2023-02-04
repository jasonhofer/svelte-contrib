
// #TODO useful?
export default function combine(readFrom, writeTo) {
  const store = {
    set: (value, ...args) => writeTo.set(value, ...args),
    subscribe: (listener, ...args) => readFrom.subscribe(listener, ...args),
  };
  if (writeTo.update) {
    store.update = (fn, ...args) => writeTo.update(fn, ...args);
  }
  return store;
}
